# NetSapiens Portal API Architecture & Integration Technical Specification

**Version:** 1.0  
**Date:** 2025-06-25  
**Purpose:** Comprehensive technical specification for building a modern frontend that interfaces with the NetSapiens PBX API

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [API Architecture Overview](#api-architecture-overview)
3. [Authentication & Security](#authentication--security)
4. [Core Data Models](#core-data-models)
5. [API Integration Patterns](#api-integration-patterns)
6. [Business Logic & Rules](#business-logic--rules)
7. [Core Functionality Mapping](#core-functionality-mapping)
8. [Migration Strategy](#migration-strategy)
9. [Implementation Guidelines](#implementation-guidelines)

---

## Executive Summary

The NetSapiens Portal is built on CakePHP 1.3.x and communicates with the NetSapiens PBX through two API versions:
- **v1 API**: Legacy form-based API (currently used by the portal)
- **v2 API**: Modern RESTful JSON API (recommended for new implementations)

The portal uses a custom data source abstraction layer that wraps all API calls through a central `sbus` (Service Bus) vendor library. This architecture allows for clean separation between the portal UI and the PBX backend.

---

## API Architecture Overview

### System Architecture

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   Portal Frontend   │────▶│  CakePHP Framework   │────▶│  NetSapiens PBX │
│  (Views/Controllers)│     │  (Models/DataSources)│     │   (API Server)  │
└─────────────────────┘     └──────────────────────┘     └─────────────────┘
                                        │
                                        ▼
                            ┌──────────────────────┐
                            │    SBus Library      │
                            │  (API Communication) │
                            └──────────────────────┘
```

### API Versions

#### v1 API (Legacy)
- **Base URL**: `https://[server]/ns-api/`
- **Format**: Form-encoded (`application/x-www-form-urlencoded`)
- **Structure**: Query parameters with `object` and `action`
- **Authentication**: OAuth 2.0 in request body
- **Response**: XML or JSON (specified by `format` parameter)

#### v2 API (Modern)
- **Base URL**: `https://[server]/ns-api/v2/`
- **Format**: JSON (`application/json`)
- **Structure**: RESTful endpoints
- **Authentication**: Bearer token in header
- **Response**: JSON with 202 Accepted pattern for writes

### Data Source Architecture

Each NetSapiens entity has:
1. **Model** (`models/*.php`) - Business logic and validation
2. **Data Source** (`models/datasources/*_source.php`) - API mapping layer
3. **Schema Map** - Field mapping between portal and API

---

## Authentication & Security

### OAuth 2.0 Implementation

The portal uses OAuth 2.0 with the following flow:

1. **Initial Authentication**
   ```php
   // Configuration
   Configure::write('NsOauthClientId', 'omp');
   Configure::write('NsOauthClientSecret', '9cfaa53f2bf4810f66fd36f857286cb5');
   
   // Authentication endpoint
   POST /oauth2/token
   {
     "grant_type": "password",
     "username": "user@domain",
     "password": "password",
     "client_id": "omp",
     "client_secret": "9cfaa53f2bf4810f66fd36f857286cb5"
   }
   ```

2. **Token Management**
   - Access Token: Short-lived (configurable, typically 1 hour)
   - Refresh Token: Long-lived (used to obtain new access tokens)
   - Storage: PHP session (`$_SESSION['access_token']`, `$_SESSION['refresh_token']`)

3. **Token Refresh**
   ```php
   POST /oauth2/token
   {
     "grant_type": "refresh_token",
     "refresh_token": "[REFRESH_TOKEN]",
     "client_id": "omp",
     "client_secret": "9cfaa53f2bf4810f66fd36f857286cb5"
   }
   ```

4. **API Request Authentication**
   - v1: Token in request parameters
   - v2: `Authorization: Bearer [ACCESS_TOKEN]` header

### Session Management

- **Session Storage**: Replicated sessions across cluster
- **Session Keys**:
  - `access_token`: Current OAuth access token
  - `refresh_token`: OAuth refresh token
  - `uid`: User identifier (extension@domain)
  - `scope`: User permission level
  - `domain`: Current domain context
  - `sub_user`: User extension
  - `sub_domain`: User domain

### Permission Scopes

```
- "Basic User": Standard user access
- "Office Manager": Domain management access
- "Call Center Agent": Agent-specific features
- "Call Center Supervisor": Queue management
- "Reseller": Multi-domain management
- "Site Manager": Site-level management
- "Route Manager": Routing configuration
```

---

## Core Data Models

### User Model

**Primary Entity**: Subscriber  
**Identifier**: `extension@domain`

```php
// Key fields
[
    'user' => 'extension',           // User's extension number
    'domain' => 'domain',            // Domain name
    'first_name' => 'first_name',   // First name
    'last_name' => 'last_name',     // Last name
    'email' => 'email_address',     // Email address(es)
    'scope' => 'scope',             // Permission level
    'pwd_hash' => 'pwd_hash',       // Portal password
    'subscriber_pin' => 'subscriber_pin', // Voicemail PIN
    'site' => 'site',               // Site assignment
    'department' => 'group',        // Department/group
]

// v1 API calls
GET /?object=subscriber&action=read&user=1001&domain=example.com
POST /?object=subscriber&action=create
POST /?object=subscriber&action=update
POST /?object=subscriber&action=delete

// v2 API equivalents
GET /domains/{domain}/users/{user}
POST /domains/{domain}/users
PUT /domains/{domain}/users/{user}
DELETE /domains/{domain}/users/{user}
```

### Domain Model

**Primary Entity**: Domain  
**Identifier**: Domain name

```php
// Key fields
[
    'domain' => 'domain',           // Domain name
    'territory' => 'territory',     // Reseller/territory
    'description' => 'description', // Domain description
    'time_zone' => 'time_zone',    // Default timezone
    'area_code' => 'area_code',    // Default area code
    'callid_name' => 'callid_name', // Default caller ID name
    'callid_nmbr' => 'callid_nmbr', // Default caller ID number
]

// API Integration
GET /?object=domain&action=read&domain=example.com
POST /?object=domain&action=create
```

### Call Queue Model

**Primary Entity**: Call Queue  
**Identifier**: Queue extension

```php
// Key fields
[
    'queue' => 'callqueue',         // Queue extension
    'domain' => 'domain',           // Domain
    'name' => 'name',              // Queue name
    'moh' => 'moh',                // Music on hold
    'max_time' => 'max_time',      // Max wait time
    'dispatch' => 'dispatch',       // Hunt strategy
]

// Agent management
POST /?object=agent&action=create&queue=400&agent=1001@domain.com
```

### Device Model

**Primary Entity**: Device (SIP endpoint)  
**Identifier**: `device@domain`

```php
// Key fields
[
    'device' => 'device',           // Device identifier
    'user' => 'user',              // Owner extension
    'domain' => 'domain',          // Domain
    'srv_code' => 'srv_code',      // Service code
]
```

### Phone (MAC) Model

**Primary Entity**: Physical phone provisioning  
**Identifier**: MAC address

```php
// Key fields
[
    'mac' => 'mac',                // MAC address
    'brand' => 'brand',            // Phone model
    'server' => 'server',          // Provisioning server
    'domain' => 'domain',          // Domain
    'line1_ext' => 'line1-ext',    // Line 1 extension
]
```

---

## API Integration Patterns

### SBus Library Methods

The core API communication happens through the SBus vendor library:

```php
// GET request pattern
$sbus = new SBus();
$payload = [
    'object' => 'subscriber',
    'action' => 'read',
    'user' => '1001',
    'domain' => 'example.com'
];
$result = $sbus->get('subscriber', $payload);

// POST request pattern
$payload = [
    'object' => 'subscriber',
    'action' => 'create',
    'user' => '1002',
    'domain' => 'example.com',
    'first_name' => 'John',
    'last_name' => 'Doe'
];
$result = $sbus->post('subscriber', $payload);

// v2 API methods (newer implementations)
$endpoint = "/domains/example.com/users/1001";
$result = $sbus->getV2($endpoint);

$endpoint = "/domains/example.com/users";
$data = ['user' => '1002', 'name-first-name' => 'John'];
$result = $sbus->postV2($endpoint, $data);
```

### Data Source Pattern

Each model's data source follows this pattern:

```php
class UserSource extends NsDataSource {
    // Schema mapping
    private $__schema_map = [
        'user' => 'extension',
        'domain' => 'domain',
        'first_name' => 'first_name',
        'last_name' => 'last_name',
        // ... field mappings
    ];
    
    // CRUD operations
    public function create(&$model, $fields = NULL, $values = NULL) {
        $payload = [
            'object' => 'subscriber',
            'action' => 'create'
        ];
        // Map fields and make API call
        return $this->__sbus->post('subscriber', $payload);
    }
    
    public function read(&$model, $query = array()) {
        // Build query, make API call, map results
    }
    
    public function update(&$model, $fields = NULL, $values = NULL) {
        // Similar pattern for updates
    }
    
    public function delete(&$model, $id = NULL) {
        // Delete pattern
    }
}
```

### Caching Strategy

The portal implements multi-level caching:

```php
// Resource cache (individual records)
$this->setResourceCache('subscriber', 'user@domain', $data);
$cached = $this->getResourceCache('subscriber', 'user@domain');

// List cache (query results)
$this->setListCache($queryOptions, $results);
$cached = $this->getListCache($queryOptions);

// Count cache (totals)
$this->setCountCache($queryOptions, $count);
$cached = $this->getCountCache($queryOptions);

// UI Config cache
$this->setUiCache($configKey, $value);
$cached = $this->getUiCache($configKey);
```

---

## Business Logic & Rules

### User Management

1. **User Creation Requirements**:
   - Unique extension within domain
   - Valid email address (if required by UI config)
   - Password complexity rules (configurable)
   - Department/Site assignment (optional)

2. **Password Management**:
   - Portal password vs. Voicemail PIN (separate)
   - Legacy password migration flow
   - Secure password requirements (configurable)

3. **Voicemail Configuration**:
   - Enabled/disabled per user
   - Email notification options
   - Greeting management
   - Storage quotas

### Call Queue Management

1. **Queue Creation**:
   - Unique extension within domain
   - Agent assignment
   - Hunt strategies: RingAll, Linear, RoundRobin, LongestIdle
   - Music on hold configuration

2. **Agent Management**:
   - Login/logout status
   - Availability types: automatic, manual
   - Wrap-up time configuration
   - Skills-based routing (if enabled)

### Phone Number Management

1. **DID Assignment**:
   - Route to user, queue, auto-attendant
   - Time-based routing
   - Call recording options

2. **Dial Rules**:
   - Pattern matching (regex, wildcard, exact)
   - Application types (to-user, to-queue, to-voicemail, etc.)
   - Priority and timeframe support

### Device Provisioning

1. **Logical Devices**:
   - SIP credentials generation
   - Multiple devices per user
   - Device-specific settings

2. **Physical Phones**:
   - MAC address registration
   - Model-specific provisioning
   - Auto-provisioning support

---

## Core Functionality Mapping

### User Portal Features

| Feature | v1 API Endpoint | v2 API Endpoint | Business Logic |
|---------|----------------|-----------------|----------------|
| User List | `GET /?object=subscriber&action=read&domain={domain}` | `GET /domains/{domain}/users` | Paginated, filterable by site/department |
| User Create | `POST /?object=subscriber&action=create` | `POST /domains/{domain}/users` | Validates extension uniqueness |
| User Profile | `GET /?object=subscriber&action=read&user={user}&domain={domain}` | `GET /domains/{domain}/users/{user}` | Includes voicemail stats |
| Password Change | `POST /?object=subscriber&action=update` | `PUT /domains/{domain}/users/{user}` | Requires current password |
| Voicemail Settings | Included in user object | Included in user object | Email notification options |

### Call Center Features

| Feature | v1 API Endpoint | v2 API Endpoint | Business Logic |
|---------|----------------|-----------------|----------------|
| Queue List | `GET /?object=callqueue&action=read&domain={domain}` | `GET /domains/{domain}/callqueues` | Shows agent counts |
| Queue Create | `POST /?object=callqueue&action=create` | `POST /domains/{domain}/callqueues` | Auto-creates system user |
| Agent Add | `POST /?object=agent&action=create` | `POST /domains/{domain}/callqueues/{queue}/agents` | Links user to queue |
| Agent Login | `POST /?object=agent&action=update&login=1` | `PATCH /domains/{domain}/callqueues/{queue}/agents/{agent}/login` | Updates availability |
| Queue Stats | `GET /?object=callqueue&action=stats` | `GET /domains/{domain}/callqueues/{queue}/statistics` | Real-time metrics |

### Phone Management Features

| Feature | v1 API Endpoint | v2 API Endpoint | Business Logic |
|---------|----------------|-----------------|----------------|
| Phone List | `GET /?object=phone&action=list&domain={domain}` | `GET /domains/{domain}/phones` | MAC-based listing |
| Phone Add | `POST /?object=phone&action=create` | `POST /domains/{domain}/phones` | Links MAC to device |
| Phone Update | `POST /?object=phone&action=update` | `PUT /domains/{domain}/phones` | Reprovisioning trigger |
| Device Create | `POST /?object=device&action=create` | `POST /domains/{domain}/users/{user}/devices` | Generates SIP creds |

### Configuration Features

| Feature | v1 API Endpoint | v2 API Endpoint | Business Logic |
|---------|----------------|-----------------|----------------|
| UI Config | `GET /?object=uiconfig&action=read` | Not available in v2 | Portal-specific settings |
| Answer Rules | `GET /?object=answerrule&action=read` | `GET /domains/{domain}/users/{user}/answerrules` | Time-based routing |
| Dial Plans | `GET /?object=dialplan&action=read` | `GET /domains/{domain}/dialplans` | Call routing rules |
| Time Frames | `GET /?object=timeframe&action=read` | `GET /domains/{domain}/timeframes` | Schedule definitions |

---

## Migration Strategy

### Moving from v1 to v2 API

1. **Authentication Migration**:
   ```php
   // v1 Pattern
   $payload = [
       'object' => 'token',
       'action' => 'create',
       'username' => $username,
       'password' => $password
   ];
   
   // v2 Pattern
   POST /oauth2/token
   Authorization: Basic [base64(client_id:client_secret)]
   {
       "grant_type": "password",
       "username": "user@domain",
       "password": "password"
   }
   ```

2. **Request Pattern Migration**:
   ```php
   // v1 Pattern
   GET /?object=subscriber&action=read&user=1001&domain=example.com
   
   // v2 Pattern
   GET /domains/example.com/users/1001
   Authorization: Bearer [token]
   ```

3. **Response Handling**:
   ```php
   // v1 Response (XML/JSON)
   $result = $sbus->get('subscriber', $payload);
   if (isset($result['subscriber'])) {
       $user = $result['subscriber'];
   }
   
   // v2 Response (JSON + 202 pattern)
   $response = $sbus->postV2($endpoint, $data);
   if ($response['status'] == 202) {
       $taskId = $response['task_id'];
       // Poll for completion
       $result = $this->pollTask($taskId);
   }
   ```

### Asynchronous Operations (v2)

The v2 API uses 202 Accepted pattern for write operations:

```php
// 1. Initial request
POST /domains/example.com/users
{
    "user": "1003",
    "name-first-name": "Jane",
    "name-last-name": "Smith"
}

// 2. Response
HTTP/1.1 202 Accepted
{
    "task_id": "abc123"
}

// 3. Poll for completion
GET /tasks/abc123

// 4. Final result
{
    "status": "complete",
    "resource": "user",
    "resource_id": "1003@example.com",
    "data": {
        // Complete user object
    }
}
```

---

## Implementation Guidelines

### Best Practices

1. **Error Handling**:
   ```php
   try {
       $result = $api->call($endpoint, $data);
       if ($result === null || $result === false) {
           // Handle API failure
           throw new ApiException("API call failed");
       }
   } catch (Exception $e) {
       // Log error
       $this->nslog('error', 'API Error: ' . $e->getMessage());
       // Handle gracefully
   }
   ```

2. **Pagination**:
   ```php
   $page = 1;
   $limit = 100;
   $allResults = [];
   
   do {
       $payload = [
           'start' => ($page - 1) * $limit,
           'limit' => $limit
       ];
       $results = $api->get($endpoint, $payload);
       $allResults = array_merge($allResults, $results);
       $page++;
   } while (count($results) == $limit);
   ```

3. **Caching**:
   ```php
   // Check cache first
   $cacheKey = 'user_' . $userId;
   $cached = Cache::read($cacheKey);
   if ($cached) {
       return $cached;
   }
   
   // Fetch from API
   $result = $api->getUser($userId);
   
   // Cache result
   Cache::write($cacheKey, $result, 300); // 5 minutes
   return $result;
   ```

4. **Field Validation**:
   ```php
   // Use model validation rules
   $validator = [
       'extension' => '/^[0-9]{3,6}$/',
       'email' => FILTER_VALIDATE_EMAIL,
       'phone_number' => '/^[0-9]{10,14}$/'
   ];
   ```

### Security Considerations

1. **Token Storage**: 
   - Never store tokens in cookies or local storage
   - Use secure session storage
   - Implement token rotation

2. **API Key Management**:
   - Store credentials in environment variables
   - Never commit credentials to version control
   - Use different credentials for dev/staging/production

3. **Input Validation**:
   - Validate all user input before API calls
   - Sanitize data to prevent injection attacks
   - Use parameterized queries

4. **Rate Limiting**:
   - Implement client-side rate limiting
   - Handle 429 responses gracefully
   - Use exponential backoff for retries

### Performance Optimization

1. **Batch Operations**:
   - Use bulk endpoints when available
   - Minimize API calls through intelligent caching
   - Aggregate related requests

2. **Lazy Loading**:
   - Load data on demand
   - Use pagination for large datasets
   - Implement virtual scrolling for UI

3. **Connection Pooling**:
   - Reuse HTTP connections
   - Implement connection timeouts
   - Handle connection failures gracefully

---

## Appendix: Common API Patterns

### User Authentication Flow
```php
// 1. Login
$credentials = [
    'username' => 'user@domain.com',
    'password' => 'password'
];
$token = $auth->login($credentials);

// 2. Store tokens
$_SESSION['access_token'] = $token['access_token'];
$_SESSION['refresh_token'] = $token['refresh_token'];
$_SESSION['expires_at'] = time() + $token['expires_in'];

// 3. Check token expiry
if ($_SESSION['expires_at'] < time() + 600) {
    // Refresh if less than 10 minutes remaining
    $newToken = $auth->refresh($_SESSION['refresh_token']);
    // Update session
}

// 4. Make API calls
$api->setToken($_SESSION['access_token']);
$users = $api->getUsers($domain);
```

### Queue Agent Management Flow
```php
// 1. Add agent to queue
$agent = [
    'callqueue-agent-id' => '1001@example.com',
    'callqueue-agent-availability-type' => 'automatic'
];
$api->addAgent($queueId, $agent);

// 2. Agent login
$api->agentLogin($queueId, $agentId);

// 3. Monitor agent status
$status = $api->getAgentStatus($queueId, $agentId);

// 4. Agent logout
$api->agentLogout($queueId, $agentId);
```

### Phone Provisioning Flow
```php
// 1. Create device for user
$device = [
    'device' => '1001-desk',
    'device-sip-registration-password' => $this->generatePassword()
];
$api->createDevice($userId, $device);

// 2. Register MAC address
$phone = [
    'mac' => '001122334455',
    'model' => 'Yealink T54W',
    'device1' => 'sip:1001-desk@example.com'
];
$api->registerPhone($phone);

// 3. Trigger provisioning
$api->provisionPhone($mac);
```

---

This specification provides the foundation for building a modern frontend that properly interfaces with the NetSapiens PBX API. The key is understanding the data source abstraction pattern, OAuth authentication flow, and the mapping between portal models and API entities.