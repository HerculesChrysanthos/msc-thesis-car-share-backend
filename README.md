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

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/users/me

#### GET

##### Summary:

Get me

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

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| noauthAuth      |        |

### /api/users/register

#### POST

##### Summary:

Create user

### /api/users/verify

#### GET

##### Summary:

Verify user

##### Parameters

| Name  | Located in | Description | Required | Schema |
| ----- | ---------- | ----------- | -------- | ------ |
| token | query      |             | No       | string |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| noauthAuth      |        |

### /api/users/re-send-verify-token

#### POST

##### Summary:

Re send verify token

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/users/login

#### POST

##### Summary:

Login

### /api/users/google

#### POST

##### Summary:

Google auth

### /api/users/{userId}/profile-image

#### POST

##### Summary:

Create image

##### Parameters

| Name   | Located in | Description | Required | Schema |
| ------ | ---------- | ----------- | -------- | ------ |
| userId | path       |             | Yes      | string |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/cars/66ae4c0dc6e794e099b9dffc/availabilities

#### POST

##### Summary:

Create availability

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/cars/66ae4c0dc6e794e099b9dffc/availabilities

#### PUT

##### Summary:

Update availabilities

##### Parameters

| Name  | Located in | Description | Required | Schema |
| ----- | ---------- | ----------- | -------- | ------ |
| carId | path       |             | Yes      | string |

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

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/cars

#### POST

##### Summary:

Create car

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/cars/66892ffc0dae3b5bdfbb8eec

#### PATCH

##### Summary:

Update car

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

#### GET

##### Summary:

Get car by id

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/cars/66d399bfd513db0cd7273277

#### DELETE

##### Summary:

Delete car

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/cars/

#### GET

##### Summary:

Search cars by filters

##### Parameters

| Name        | Located in | Description | Required | Schema  |
| ----------- | ---------- | ----------- | -------- | ------- |
| startDate   | query      |             | No       | string  |
| endDate     | query      |             | No       | string  |
| lat         | query      |             | No       | number  |
| long        | query      |             | No       | number  |
| limit       | query      |             | No       | integer |
| maxPrice    | query      |             | No       | integer |
| minPrice    | query      |             | No       | integer |
| make        | query      |             | No       | string  |
| model       | query      |             | No       | string  |
| gearboxType | query      |             | No       | string  |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| noauthAuth      |        |

### /api/cars/my-cars

#### GET

##### Summary:

Get my cars

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

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| noauthAuth      |        |

### /api/cars/66ae4c0dc6e794e099b9dffc/images

#### POST

##### Summary:

Create image

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/cars/66892ffc0dae3b5bdfbb8eec/images/668f06e6500585143b7ffa2d

#### DELETE

##### Summary:

Delete image

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/models

#### GET

##### Summary:

Get models

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| make | query      |             | No       | string |

### /api/makes/

#### GET

##### Summary:

Get makes

### /api/bookings/66d2f98965b2b1aa5df2349e/reviews

#### POST

##### Summary:

Add review

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/bookings

#### POST

##### Summary:

Create booking

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/bookings/{bookingId}/accept

#### PUT

##### Summary:

Accept booking

##### Parameters

| Name      | Located in | Description | Required | Schema |
| --------- | ---------- | ----------- | -------- | ------ |
| bookingId | path       |             | Yes      | string |

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/bookings/{bookingId}/reject

#### PUT

##### Summary:

Reject booking

##### Parameters

| Name      | Located in | Description | Required | Schema |
| --------- | ---------- | ----------- | -------- | ------ |
| bookingId | path       |             | Yes      | string |

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

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |

### /api/cars/66ae4c0dc6e794e099b9dffc/bookings

#### GET

##### Summary:

Get car bookings

##### Parameters

| Name   | Located in | Description | Required | Schema  |
| ------ | ---------- | ----------- | -------- | ------- |
| page   | query      |             | No       | integer |
| status | query      |             | No       | string  |

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

##### Security

| Security Schema | Scopes |
| --------------- | ------ |
| bearerAuth      |        |
