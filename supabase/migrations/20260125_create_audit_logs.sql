-- ============================================================================
-- AUDIT LOGS TABLE - Compliance and Security Event Tracking
-- ============================================================================
-- Migration: 20260125_create_audit_logs
-- Purpose: Store audit trail for GDPR/CCPA compliance and security monitoring
-- 
-- PRIVACY NOTES:
-- - IP addresses are hashed, not stored in plain text
-- - User agents are truncated to 200 chars
-- - Metadata is sanitized of PII before insertion
-- - Consider retention policy (90-365 days recommended)
-- ============================================================================

-- Create the audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  user_id TEXT,  -- Clerk user ID (TEXT to match Clerk's format)
  ip_hash VARCHAR(64),  -- Hashed IP for privacy
  user_agent TEXT,  -- Truncated user agent string
  metadata JSONB DEFAULT '{}' NOT NULL,
  success BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES for query performance
-- ============================================================================

-- Index for querying by user
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id 
  ON audit_logs(user_id);

-- Index for time-based queries (most common pattern)
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp 
  ON audit_logs(timestamp DESC);

-- Index for filtering by event type
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type 
  ON audit_logs(event_type);

-- Composite index for common admin query patterns
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_timestamp 
  ON audit_logs(user_id, timestamp DESC);

-- Index for success/failure filtering
CREATE INDEX IF NOT EXISTS idx_audit_logs_success 
  ON audit_logs(success) WHERE success = false;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Service role can insert (for server-side logging)
-- This allows the application to write logs using the service role key
CREATE POLICY "Service role can insert audit logs"
  ON audit_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Service role can read all audit logs (for admin API)
CREATE POLICY "Service role can read audit logs"
  ON audit_logs FOR SELECT
  TO service_role
  USING (true);

-- Authenticated users cannot directly access audit logs
-- (They go through admin API with additional authorization checks)
CREATE POLICY "Block direct user access to audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (false);

-- ============================================================================
-- RETENTION POLICY (Optional - uncomment to enable auto-cleanup)
-- ============================================================================

-- Function to clean up old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(retention_days INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM audit_logs
  WHERE timestamp < NOW() - (retention_days || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- To set up automatic cleanup, create a cron job using pg_cron:
-- SELECT cron.schedule('cleanup-audit-logs', '0 3 * * *', 
--   $$SELECT cleanup_old_audit_logs(365)$$);

-- ============================================================================
-- USEFUL VIEWS (Optional)
-- ============================================================================

-- View for security events (high-priority monitoring)
CREATE OR REPLACE VIEW security_audit_events AS
SELECT 
  id,
  timestamp,
  event_type,
  user_id,
  ip_hash,
  metadata,
  success
FROM audit_logs
WHERE event_type LIKE 'security.%'
ORDER BY timestamp DESC;

-- View for authentication activity
CREATE OR REPLACE VIEW auth_audit_events AS
SELECT 
  id,
  timestamp,
  event_type,
  user_id,
  ip_hash,
  success,
  metadata
FROM audit_logs
WHERE event_type LIKE 'auth.%'
ORDER BY timestamp DESC;

-- View for data access events (GDPR compliance)
CREATE OR REPLACE VIEW data_audit_events AS
SELECT 
  id,
  timestamp,
  event_type,
  user_id,
  success,
  metadata
FROM audit_logs
WHERE event_type LIKE 'data.%'
ORDER BY timestamp DESC;

-- ============================================================================
-- COMMENTS for documentation
-- ============================================================================

COMMENT ON TABLE audit_logs IS 'Compliance audit log for security events, data access, and user actions';
COMMENT ON COLUMN audit_logs.ip_hash IS 'SHA-256 hash of IP address (first 16 chars) for privacy';
COMMENT ON COLUMN audit_logs.metadata IS 'Sanitized additional context - never contains PII';
COMMENT ON COLUMN audit_logs.event_type IS 'Event category and action (e.g., auth.login, data.export_requested)';
