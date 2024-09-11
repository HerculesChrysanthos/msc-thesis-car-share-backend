# Car Share

## Version: 1.0.0

### /api/users/{userId}

#### GET

##### Summary:

Get user by id

##### Parameters

| Name   | Located in | Description | Required | Schema |
| ------ | ---------- | ----------- | -------- | ------ |
| userId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| noauthAuth      |        |

#### PATCH

##### Summary:

Update my users fields

##### Parameters

| Name   | Located in | Description | Required | Schema |
| ------ | ---------- | ----------- | -------- | ------ |
| userId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/users/me

#### GET

##### Summary:

Get me

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/users/{userId}/reviews

#### GET

##### Summary:

Get user reviews

##### Parameters

| Name   | Located in | Description                | Required | Schema  |
| ------ | ---------- | -------------------------- | -------- | ------- |
| page   | query      |                            | No       | integer |
| limit  | query      |                            | No       | integer |
| role   | query      | REQUIRED , OWNER OR RENTER | No       | string  |
| userId | path       |                            | Yes      | string  |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| noauthAuth      |        |

### /api/users/register

#### POST

##### Summary:

Create user

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

### /api/users/verify

#### POST

##### Summary:

Verify user

##### Parameters

| Name  | Located in | Description | Required | Schema |
| ----- | ---------- | ----------- | -------- | ------ |
| token | query      |             | No       | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| noauthAuth      |        |

### /api/users/re-send-verify-token

#### POST

##### Summary:

Re send verify token

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/users/login

#### POST

##### Summary:

Login

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

### /api/users/google

#### POST

##### Summary:

Google auth

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

### /api/users/{userId}/profile-image

#### POST

##### Summary:

Create image

##### Parameters

| Name   | Located in | Description | Required | Schema |
| ------ | ---------- | ----------- | -------- | ------ |
| userId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/cars/{carId}/availabilities

#### PUT

##### Summary:

Update availabilities

##### Parameters

| Name  | Located in | Description | Required | Schema |
| ----- | ---------- | ----------- | -------- | ------ |
| carId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

#### GET

##### Summary:

Get car availabilities

##### Parameters

| Name   | Located in | Description | Required | Schema |
| ------ | ---------- | ----------- | -------- | ------ |
| status | query      |             | No       | string |
| carId  | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/cars

#### POST

##### Summary:

Create car

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/cars/{carId}

#### PATCH

##### Summary:

Update car

##### Parameters

| Name  | Located in | Description | Required | Schema |
| ----- | ---------- | ----------- | -------- | ------ |
| carId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

#### DELETE

##### Summary:

Delete car

##### Parameters

| Name  | Located in | Description | Required | Schema |
| ----- | ---------- | ----------- | -------- | ------ |
| carId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

#### GET

##### Summary:

Get car by id

##### Parameters

| Name  | Located in | Description | Required | Schema |
| ----- | ---------- | ----------- | -------- | ------ |
| carId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/cars/{carId}/status

#### PUT

##### Summary:

Change car status

##### Parameters

| Name  | Located in | Description | Required | Schema |
| ----- | ---------- | ----------- | -------- | ------ |
| carId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/cars/

#### GET

##### Summary:

Search cars by filters

##### Parameters

| Name      | Located in | Description | Required | Schema  |
| --------- | ---------- | ----------- | -------- | ------- |
| startDate | query      |             | No       | string  |
| endDate   | query      |             | No       | string  |
| lat       | query      |             | No       | number  |
| long      | query      |             | No       | number  |
| maxPrice  | query      |             | No       | integer |
| minPrice  | query      |             | No       | integer |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| noauthAuth      |        |

### /api/cars/my-cars

#### GET

##### Summary:

Get my cars

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/users/{userId}/cars

#### GET

##### Summary:

Get user cars (for profile)

##### Parameters

| Name   | Located in | Description | Required | Schema |
| ------ | ---------- | ----------- | -------- | ------ |
| userId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| noauthAuth      |        |

### /api/cars/{carId}/reviews

#### GET

##### Summary:

Get car reviews

##### Parameters

| Name  | Located in | Description | Required | Schema  |
| ----- | ---------- | ----------- | -------- | ------- |
| page  | query      |             | No       | integer |
| limit | query      |             | No       | integer |
| carId | path       |             | Yes      | string  |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| noauthAuth      |        |

### /api/cars/{carId}/images

#### POST

##### Summary:

Create image

##### Parameters

| Name  | Located in | Description | Required | Schema |
| ----- | ---------- | ----------- | -------- | ------ |
| carId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/cars/{carId}/images/{imageId}

#### DELETE

##### Summary:

Delete image

##### Parameters

| Name    | Located in | Description | Required | Schema |
| ------- | ---------- | ----------- | -------- | ------ |
| carId   | path       |             | Yes      | string |
| imageId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/models

#### GET

##### Summary:

Get models by make Id

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| make | query      |             | No       | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

### /api/makes/

#### GET

##### Summary:

Get makes

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

### /api/bookings/{bookingId}/reviews

#### POST

##### Summary:

Add review

##### Parameters

| Name      | Located in | Description | Required | Schema |
| --------- | ---------- | ----------- | -------- | ------ |
| bookingId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/bookings

#### POST

##### Summary:

Create booking

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /080/api/bookings/{bookingId}/accept

#### PUT

##### Summary:

Accept booking

##### Parameters

| Name      | Located in | Description | Required | Schema |
| --------- | ---------- | ----------- | -------- | ------ |
| bookingId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /080/api/bookings/{bookingId}/reject

#### PUT

##### Summary:

Reject booking

##### Parameters

| Name      | Located in | Description | Required | Schema |
| --------- | ---------- | ----------- | -------- | ------ |
| bookingId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/bookings/{bookingId}/cancel

#### PUT

##### Summary:

Cancel booking

##### Parameters

| Name      | Located in | Description | Required | Schema |
| --------- | ---------- | ----------- | -------- | ------ |
| bookingId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/cars/{carId}/bookings

#### GET

##### Summary:

Get car bookings

##### Parameters

| Name   | Located in | Description | Required | Schema  |
| ------ | ---------- | ----------- | -------- | ------- |
| page   | query      |             | No       | integer |
| status | query      |             | No       | string  |
| carId  | path       |             | Yes      | string  |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/users/{userId}/bookings

#### GET

##### Summary:

Get user renter bookings

##### Parameters

| Name   | Located in | Description | Required | Schema |
| ------ | ---------- | ----------- | -------- | ------ |
| status | query      |             | No       | string |
| userId | path       |             | Yes      | string |

##### Responses

| Code | Description         |
| ---- | ------------------- |
| 200  | Successful response |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |
