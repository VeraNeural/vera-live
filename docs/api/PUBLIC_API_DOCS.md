# VERA API Documentation

> **Version:** 1.0.0-beta  
> **Last Updated:** January 25, 2026  
> **Status:** Private Beta  

---

## Overview

The VERA API allows authorized applications to integrate with VERA's trauma-informed mental health support capabilities. Build applications that provide compassionate AI-powered emotional support to your users.

### Base URL

```
https://api.vera.ai/v1
```

### API Status

| Environment | URL | Status |
|-------------|-----|--------|
| Production | `https://api.vera.ai/v1` | 🟢 Operational |
| Sandbox | `https://sandbox.api.vera.ai/v1` | 🟢 Operational |

**Status Page:** https://status.vera.ai

### Current Limitations (Beta)

> ⚠️ **This API is currently in private beta.** Features and endpoints may change. Contact api@vera.ai for access.

- API access requires approval
- Rate limits are conservative during beta
- Some features are not yet available via API

---

## Quick Start

### 1. Get API Access

1. Sign up for a VERA account at https://vera.ai
2. Request API access at https://vera.ai/developer
3. Once approved, navigate to **Settings > Developer**
4. Generate your API key

### 2. Make Your First Request

```bash
curl -X POST https://api.vera.ai/v1/chat \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, I could use some support today"
  }'
```

### 3. Receive a Response

```json
{
  "response": "Hello, I'm here for you. I'm glad you reached out. What's on your mind today?",
  "conversation_id": "conv_abc123def456",
  "message_id": "msg_xyz789"
}
```

---

## Authentication

### API Keys

All API requests require authentication via API key. Include your key in the `Authorization` header:

```http
Authorization: Bearer YOUR_API_KEY
```

### Key Types

| Type | Prefix | Use Case | Permissions |
|------|--------|----------|-------------|
| Live | `vk_live_` | Production use | Full access |
| Test | `vk_test_` | Development/testing | Sandbox only |

### Obtaining Keys

1. Log in to your VERA account
2. Navigate to **Settings > Developer > API Keys**
3. Click **Generate New Key**
4. Select key type (Live or Test)
5. Copy and securely store your key

> ⚠️ **Your API key will only be shown once.** Store it securely immediately.

### Key Security Best Practices

| Do | Don't |
|----|-------|
| ✅ Store keys in environment variables | ❌ Hardcode keys in source code |
| ✅ Use secrets management (Vault, AWS Secrets) | ❌ Commit keys to version control |
| ✅ Rotate keys periodically (every 90 days) | ❌ Share keys between environments |
| ✅ Use test keys for development | ❌ Expose keys in client-side code |
| ✅ Restrict key access by IP (if available) | ❌ Log keys in application logs |

### Revoking Keys

To revoke a compromised key:
1. Go to **Settings > Developer > API Keys**
2. Find the key and click **Revoke**
3. Generate a new key
4. Update your applications

---

## Rate Limits

Rate limits protect API stability and ensure fair usage.

### Limits by Plan

| Plan | Requests/Minute | Requests/Day | Concurrent Requests |
|------|-----------------|--------------|---------------------|
| Free (Beta) | 10 | 100 | 2 |
| Pro | 60 | 5,000 | 10 |
| Business | 300 | 50,000 | 50 |
| Enterprise | Custom | Custom | Custom |

### Rate Limit Headers

Every response includes rate limit information:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1706200000
X-RateLimit-Reset-After: 30
```

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests per window |
| `X-RateLimit-Remaining` | Remaining requests in current window |
| `X-RateLimit-Reset` | Unix timestamp when window resets |
| `X-RateLimit-Reset-After` | Seconds until window resets |

### Handling Rate Limits

When rate limited, you'll receive a `429` response:

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded. Please retry after 30 seconds.",
    "retry_after": 30
  }
}
```

**Best practices:**
- Implement exponential backoff
- Cache responses when possible
- Use webhooks instead of polling
- Batch operations where supported

---

## Endpoints

### Chat

#### POST /chat

Send a message and receive an AI response.

**Request:**

```bash
curl -X POST https://api.vera.ai/v1/chat \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have been feeling overwhelmed lately",
    "conversation_id": "conv_abc123def456"
  }'
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | User's message (1-10,000 characters) |
| `conversation_id` | string | No | Continue existing conversation |
| `context` | object | No | Additional context (see below) |

**Context Object:**

```json
{
  "context": {
    "user_name": "Alex",
    "preferred_tone": "warm",
    "session_type": "check_in"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `user_name` | string | Name to address user (optional) |
| `preferred_tone` | string | `warm`, `professional`, `casual` |
| `session_type` | string | `check_in`, `support`, `exploration` |

**Response:**

```json
{
  "response": "I hear you—feeling overwhelmed can be really exhausting. What's been weighing on you the most?",
  "conversation_id": "conv_abc123def456",
  "message_id": "msg_xyz789ghi012",
  "created_at": "2026-01-25T10:30:00Z",
  "usage": {
    "input_tokens": 15,
    "output_tokens": 28
  },
  "safety": {
    "crisis_detected": false,
    "resources_provided": false
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | string | VERA's response message |
| `conversation_id` | string | Conversation identifier (save for continuity) |
| `message_id` | string | Unique message identifier |
| `created_at` | string | ISO 8601 timestamp |
| `usage.input_tokens` | integer | Tokens in user message |
| `usage.output_tokens` | integer | Tokens in response |
| `safety.crisis_detected` | boolean | Whether crisis signals detected |
| `safety.resources_provided` | boolean | Whether crisis resources included |

---

### Conversations

#### GET /conversations

List all conversations for the authenticated user.

**Request:**

```bash
curl -X GET "https://api.vera.ai/v1/conversations?page=1&per_page=20" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `per_page` | integer | 20 | Items per page (max 100) |
| `sort` | string | `updated_at` | Sort field: `created_at`, `updated_at` |
| `order` | string | `desc` | Sort order: `asc`, `desc` |

**Response:**

```json
{
  "conversations": [
    {
      "id": "conv_abc123def456",
      "created_at": "2026-01-20T08:00:00Z",
      "updated_at": "2026-01-25T10:30:00Z",
      "message_count": 24,
      "preview": "We talked about managing work stress..."
    },
    {
      "id": "conv_def789ghi012",
      "created_at": "2026-01-15T14:00:00Z",
      "updated_at": "2026-01-15T14:45:00Z",
      "message_count": 8,
      "preview": "Discussion about sleep habits..."
    }
  ],
  "pagination": {
    "total": 47,
    "page": 1,
    "per_page": 20,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

---

#### GET /conversations/{id}

Get a specific conversation with all messages.

**Request:**

```bash
curl -X GET https://api.vera.ai/v1/conversations/conv_abc123def456 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**

```json
{
  "id": "conv_abc123def456",
  "created_at": "2026-01-20T08:00:00Z",
  "updated_at": "2026-01-25T10:30:00Z",
  "messages": [
    {
      "id": "msg_001",
      "role": "user",
      "content": "Hi, I've been feeling anxious about work",
      "timestamp": "2026-01-20T08:00:00Z"
    },
    {
      "id": "msg_002",
      "role": "assistant",
      "content": "I'm sorry to hear you've been feeling anxious about work. That can be really challenging...",
      "timestamp": "2026-01-20T08:00:02Z"
    }
  ],
  "message_count": 24
}
```

**Message Object:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique message identifier |
| `role` | string | `user` or `assistant` |
| `content` | string | Message content |
| `timestamp` | string | ISO 8601 timestamp |

---

#### DELETE /conversations/{id}

Delete a conversation and all its messages.

**Request:**

```bash
curl -X DELETE https://api.vera.ai/v1/conversations/conv_abc123def456 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**

```json
{
  "deleted": true,
  "id": "conv_abc123def456"
}
```

---

### User

#### GET /user

Get current user information.

**Request:**

```bash
curl -X GET https://api.vera.ai/v1/user \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**

```json
{
  "id": "user_abc123",
  "email": "user@example.com",
  "tier": "pro",
  "created_at": "2025-06-15T00:00:00Z",
  "usage": {
    "messages_today": 45,
    "messages_limit": 5000,
    "conversations": 47
  },
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

---

#### GET /user/export

Export all user data (GDPR compliance).

**Request:**

```bash
curl -X GET https://api.vera.ai/v1/user/export \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**

```json
{
  "export_id": "export_abc123",
  "status": "processing",
  "created_at": "2026-01-25T10:30:00Z",
  "estimated_completion": "2026-01-25T10:35:00Z",
  "download_url": null
}
```

When complete, poll or receive webhook:

```json
{
  "export_id": "export_abc123",
  "status": "complete",
  "download_url": "https://api.vera.ai/v1/exports/export_abc123/download",
  "expires_at": "2026-01-26T10:30:00Z"
}
```

---

### Health

#### GET /health

Check API health status.

**Request:**

```bash
curl -X GET https://api.vera.ai/v1/health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2026-01-25T10:30:00Z",
  "version": "1.0.0"
}
```

---

## Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Error Codes

| Code | HTTP Status | Description | Resolution |
|------|-------------|-------------|------------|
| `VALIDATION_ERROR` | 400 | Invalid request data | Check request format and required fields |
| `INVALID_JSON` | 400 | Malformed JSON body | Validate JSON syntax |
| `MESSAGE_TOO_LONG` | 400 | Message exceeds 10,000 characters | Shorten message |
| `UNAUTHORIZED` | 401 | Invalid or missing API key | Check Authorization header |
| `KEY_EXPIRED` | 401 | API key has expired | Generate new key |
| `FORBIDDEN` | 403 | Action not permitted for your plan | Upgrade plan or contact support |
| `NOT_FOUND` | 404 | Resource not found | Check resource ID |
| `CONVERSATION_NOT_FOUND` | 404 | Conversation doesn't exist | Verify conversation_id |
| `METHOD_NOT_ALLOWED` | 405 | HTTP method not supported | Check endpoint documentation |
| `RATE_LIMITED` | 429 | Too many requests | Wait and retry with backoff |
| `INTERNAL_ERROR` | 500 | Server error | Retry later; contact support if persistent |
| `SERVICE_UNAVAILABLE` | 503 | Temporarily unavailable | Retry later |

### Example Error Responses

**Validation Error:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "message": "Message is required and cannot be empty"
    }
  }
}
```

**Rate Limited:**

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded",
    "details": {
      "retry_after": 30,
      "limit": 60,
      "window": "1 minute"
    }
  }
}
```

### Retry Strategy

For transient errors (429, 500, 503), implement exponential backoff:

```javascript
async function requestWithRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 || error.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Webhooks (Coming Soon)

> 🚧 **Webhooks are coming in a future release.** Join the waitlist at https://vera.ai/developer/webhooks

### Planned Events

| Event | Description |
|-------|-------------|
| `conversation.created` | New conversation started |
| `conversation.updated` | Conversation received new message |
| `message.received` | New user message received |
| `message.sent` | VERA response sent |
| `crisis.detected` | Crisis signals detected in message |
| `export.complete` | Data export ready for download |

### Webhook Security

Webhooks will include a signature header for verification:

```http
X-Vera-Signature: sha256=abc123...
```

---

## SDKs

### JavaScript / TypeScript

```bash
npm install @vera/sdk
# or
yarn add @vera/sdk
```

```typescript
import { VeraClient } from '@vera/sdk';

const vera = new VeraClient({
  apiKey: process.env.VERA_API_KEY
});

const response = await vera.chat({
  message: 'Hello, I need some support'
});

console.log(response.response);
```

### Python

```bash
pip install vera-sdk
```

```python
from vera import VeraClient

client = VeraClient(api_key="YOUR_API_KEY")

response = client.chat(
    message="Hello, I need some support"
)

print(response.response)
```

### SDK Features

- Automatic retry with exponential backoff
- Rate limit handling
- Type definitions (TypeScript)
- Async/await support
- Conversation management helpers

---

## Best Practices

### Building Integrations

| Practice | Description |
|----------|-------------|
| **Handle all errors** | Gracefully handle API errors with user-friendly messages |
| **Respect rate limits** | Implement backoff; don't retry aggressively |
| **Secure API keys** | Never expose keys; use server-side calls only |
| **Validate input** | Check message length before sending |
| **Store conversation IDs** | Save IDs to continue conversations |
| **Monitor usage** | Track your API usage to stay within limits |

### Mental Health Considerations

When building applications with VERA's API:

| Requirement | Description |
|-------------|-------------|
| **Display disclaimers** | Clearly state VERA is AI, not a therapist |
| **Show crisis resources** | Always display crisis hotlines (988, etc.) |
| **Don't replace professionals** | Encourage users to seek human help when needed |
| **Handle crisis responses** | If `crisis_detected` is true, prominently show resources |
| **Allow data deletion** | Provide easy access to delete conversations |
| **Respect privacy** | Don't log or store conversation content unnecessarily |

### Example Disclaimer

Include messaging similar to:

> VERA is an AI assistant designed to provide supportive conversation. It is not a replacement for professional mental health care. If you're in crisis, please contact the 988 Suicide & Crisis Lifeline or your local emergency services.

---

## Changelog

### v1.0.0-beta (January 2026)

- Initial private beta release
- POST /chat endpoint
- GET/DELETE /conversations endpoints
- Rate limiting
- Basic authentication

### Planned

- Webhooks for real-time events
- Streaming responses
- Batch message processing
- Team/organization accounts
- Custom model fine-tuning

---

## Support

### Getting Help

| Resource | Link |
|----------|------|
| Documentation | https://docs.vera.ai |
| API Reference | https://api.vera.ai/docs |
| Status Page | https://status.vera.ai |
| Email Support | api@vera.ai |
| Developer Discord | https://discord.gg/vera-dev |

### Reporting Issues

For bugs or issues:
1. Check the status page for outages
2. Search existing issues
3. Email api@vera.ai with:
   - Request ID (from response headers)
   - Timestamp
   - Endpoint and method
   - Request body (redact sensitive data)
   - Error response

### Terms & Policies

- [API Terms of Service](https://vera.ai/legal/api-terms)
- [Privacy Policy](https://vera.ai/legal/privacy)
- [Acceptable Use Policy](https://vera.ai/legal/acceptable-use)

---

## Appendix

### Response Headers

Every API response includes these headers:

| Header | Description |
|--------|-------------|
| `X-Request-Id` | Unique request identifier (for support) |
| `X-RateLimit-*` | Rate limit information |
| `Content-Type` | `application/json` |

### ISO 8601 Timestamps

All timestamps use ISO 8601 format with UTC timezone:

```
2026-01-25T10:30:00Z
```

### UUID Format

All IDs use prefixed UUID format:

| Resource | Prefix | Example |
|----------|--------|---------|
| Conversation | `conv_` | `conv_abc123def456` |
| Message | `msg_` | `msg_xyz789ghi012` |
| User | `user_` | `user_abc123` |
| Export | `export_` | `export_def456` |

---

*Last updated: January 25, 2026*
