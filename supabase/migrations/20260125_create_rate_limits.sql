-- Rate Limits Table Migration
-- Stores rate limit counters for API endpoints
-- 
-- Table: rate_limits
-- Purpose: Track request counts per user/IP per endpoint with sliding windows
-- 
-- SECURITY NOTES:
-- - identifier column stores hashed IPs for anonymous users (never raw IPs)
-- - RLS not required as this table is only accessed via service role
-- - Automatic cleanup of old records via scheduled job or TTL policy

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    identifier VARCHAR(100) NOT NULL,  -- user:xxx or ip:xxx (hashed)
    endpoint VARCHAR(100) NOT NULL,     -- /api/chat, /api/export-data, etc.
    count INTEGER NOT NULL DEFAULT 0,   -- Request count in current window
    window_start BIGINT NOT NULL,       -- Unix timestamp when window started
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint on identifier + endpoint
CREATE UNIQUE INDEX IF NOT EXISTS rate_limits_identifier_endpoint_idx 
    ON rate_limits(identifier, endpoint);

-- Index for cleanup queries (find old records)
CREATE INDEX IF NOT EXISTS rate_limits_window_start_idx 
    ON rate_limits(window_start);

-- RPC function to atomically increment rate limit
-- This prevents race conditions when multiple requests come in simultaneously
CREATE OR REPLACE FUNCTION increment_rate_limit(
    p_identifier VARCHAR(100),
    p_endpoint VARCHAR(100),
    p_now BIGINT
)
RETURNS VOID AS $$
DECLARE
    v_record RECORD;
    v_window_seconds BIGINT := 86400; -- Default 24 hours, will be determined by tier
BEGIN
    -- Determine window based on identifier type
    -- user: prefixed identifiers get pro/sanctuary windows (1 hour)
    -- ip: prefixed identifiers get anonymous windows (24 hours)
    IF p_identifier LIKE 'user:%' THEN
        v_window_seconds := 3600; -- 1 hour for authenticated users
    ELSE
        v_window_seconds := 86400; -- 24 hours for anonymous
    END IF;

    -- Try to get existing record
    SELECT id, count, window_start INTO v_record
    FROM rate_limits
    WHERE identifier = p_identifier AND endpoint = p_endpoint
    FOR UPDATE;

    IF FOUND THEN
        -- Check if window has expired
        IF v_record.window_start > (p_now - v_window_seconds) THEN
            -- Window still valid, increment count
            UPDATE rate_limits
            SET count = count + 1,
                updated_at = NOW()
            WHERE id = v_record.id;
        ELSE
            -- Window expired, reset count to 1
            UPDATE rate_limits
            SET count = 1,
                window_start = p_now,
                updated_at = NOW()
            WHERE id = v_record.id;
        END IF;
    ELSE
        -- No record exists, create new one
        INSERT INTO rate_limits (identifier, endpoint, count, window_start)
        VALUES (p_identifier, p_endpoint, 1, p_now);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Cleanup function to remove old rate limit records
-- Run this periodically (e.g., daily) to prevent table bloat
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
    v_cutoff BIGINT;
BEGIN
    -- Delete records older than 48 hours (2x max window)
    v_cutoff := EXTRACT(EPOCH FROM NOW())::BIGINT - 172800;
    
    DELETE FROM rate_limits
    WHERE window_start < v_cutoff;
    
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (if using service role, this is typically not needed)
-- The service role key has full access

-- Comment for documentation
COMMENT ON TABLE rate_limits IS 'Rate limiting counters for API endpoints. Identifiers are hashed for privacy.';
COMMENT ON COLUMN rate_limits.identifier IS 'User ID (user:xxx) or hashed IP (ip:xxx)';
COMMENT ON COLUMN rate_limits.window_start IS 'Unix timestamp when the current rate limit window started';
COMMENT ON FUNCTION increment_rate_limit IS 'Atomically increment rate limit counter with window reset logic';
COMMENT ON FUNCTION cleanup_old_rate_limits IS 'Remove stale rate limit records older than 48 hours';
