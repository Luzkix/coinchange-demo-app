# CoinChange REST API Reference

Base URL: `http://localhost:2000/`  
Content-Type: `application/json`  
Authentication: Bearer JWT in `Authorization` header

---

## 1. Authentication

### 1.1 POST `/user/login`
Authenticate a user.

**Request**  
{
"usernameOrEmail":user@example.com",
"password": "password12"
}

**Response** `201 Created`  
{
"id": 1,
"username": "testuser",
"email": "user@example.com",
"createdAt": "2025-06-30T12:00:00Z",
"updatedAt": "2025-06-30T12:00:00Z",
"validTo": "2100-01-01T00:00:00Z",
"roles": ["USER"],
"feeCategory": {
"feeCategory": "F",
"feeRate": 0.0050
},
"jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"
}


### 1.2 POST `/user/register`
Register a new user. Returns same response shape as `/user/login`.

**Request**  
{
"username": "newuser",
"email": "newuser@example.com",
"password": "password123"
}

### 1.3 POST `/user/refresh-token`
Refresh JWT for the authenticated user.

**Response** `201 Created`  
{
"jwtToken": "newlyGeneratedJwtToken…"
}

---

## 2. User Management

### PUT `/user/update`
Update the authenticated user’s profile.  
Any subset of the following fields may be provided:

**Request**  
{
"username": "updatedName",
"email": "updated@example.com",
"password": "newPassword123"
}

**Response** `201 Created` — same as `/user/login`.

---

## 3. Supported Currencies & Conversion

### GET `/currency`
List all active currencies (FIAT and CRYPTO).

**Response** `201 Created`  
[
{ "id": 1, "code": "EUR", "name": "Euro", "color": "#1f4e79", "isActive": true, "type": "F" },
{ "id": 2, "code": "BTC", "name": "Bitcoin", "color": "#f7931a", "isActive": true, "type": "C" },
…
]

### GET `/currency/type/{type}`
List active currencies filtered by type:
- `F` = FIAT
- `C` = CRYPTO

### GET `/currency/conversion-rate`
Fetch current market conversion rate and fee for a currency pair.

**Query parameters:**
- `soldCurrencyCode` (e.g. `EUR`)
- `boughtCurrencyCode` (e.g. `BTC`)

**Response** `201 Created`  
{
"soldCurrencyId": 1,
"soldCurrencyCode": "EUR",
"boughtCurrencyId": 2,
"boughtCurrencyCode": "BTC",
"feeRate": 0.0050,
"marketConversionRate": 0.00001723,
"validTo": "2025-06-30T12:00:10Z",
"verificationToken": "eyJhbGci…"
}

---

## 4. Trading

### POST `/currency/convert/simple`
Execute an immediate market order using a previously issued `verificationToken`.

**Request**  
{
"verificationToken": "eyJhbGci…",
"soldCurrencyAmount": 1500.00
}

**Response** `201 Created`  
{
"userName": "testuser",
"currenciesBalances": [ /* BalancesResponseDto */ ]
}

### POST `/currency/convert/advanced`
Place a pending limit order at a custom rate.

**Request**  
{
"soldCurrencyCode": "EUR",
"boughtCurrencyCode": "BTC",
"userSelectedConversionRate": 0.00001800,
"soldCurrencyAmount": 1500.00
}

**Response** `201 Created` — same as `/convert/simple`.

---

## 5. Portfolio & Balances

### GET `/balance?type={AVAILABLE|TOTAL}`
Get wallet balances for the current user.
- `AVAILABLE` = only processed (unblocked) balances
- `TOTAL` = includes pending+processed balances

**Response** `201 Created`  
{
"userName": "testuser",
"currenciesBalances": [
{
"currency": {
"id": 1,
"code": "EUR",
"name": "Euro",
"color": "#1f4e79",
"isActive": true,
"type": "F"
},
"balance": 99000.00,
"calculatedAt": "2025-06-30T12:00:00Z"
}
]
}

### GET `/balance/all-users?type={AVAILABLE|TOTAL}`
(ADMIN only) Balances for all active users. Returns array of `BalancesResponseDto`.

---

## 6. Transactions

### GET `/transaction/all`
List all transactions for the current user.

### GET `/transaction/pending`
List pending (unprocessed and not cancelled) transactions.

### DELETE `/transaction/{id}/cancel`
Cancel a pending transaction.  
**Response** `201 Created` — remaining pending transactions array.

---

## 7. Fees

### GET `/fee/total-fees/{currencyCode}`
(ADMIN only) Total fees collected across all users, converted to `{currencyCode}`.

**Response** `201 Created`  
{ "currencyCode": "EUR", "totalFees": 1234.56 }

### GET `/fee/total-fees-for-user/{currencyCode}`
Total fees paid by the current user, converted to `{currencyCode}`. Same response shape.

---

## 8. Error Handling

All errors return appropriate HTTP status and body:

{
"errorStatusValue": 400,
"errorStatus": "BAD_REQUEST",
"errorTime": "2025-06-30T12:05:00Z",
"errorMessage": "Validation failed: amount must be > 0",
"errorBusinessCode": "INVALID_INPUT",
"errors": [ /* field errors for 400 only */ ]
}

**Common Business Codes:**
- `NULL_OR_EMPTY`
- `INVALID_EMAIL_FORMAT`
- `USER_ALREADY_EXISTS`
- `INVALID_JWT_TOKEN`
- `INSUFFICIENT_BALANCE`
- `CONVERSION_RATE_EXPIRED`
- `CONVERSION_SAME_CURRENCIES`
- `ENTITY_NOT_FOUND`
- `TRANSACTION_NOT_FOUND`
- `CANCELLATION_TRANSACTION_FAILURE`
- `EXTERNAL_API_ERROR`

---

## 9. Rate Limits

No custom rate-limiting endpoints; default unlimited.
