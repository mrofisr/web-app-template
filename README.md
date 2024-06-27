# Feature-Sliced Design (FSD) for front-end applications

https://feature-sliced.design/docs/get-started/overview

In FSD, a project consists of _layers_, _slices_ and _segments_.

![FSD diagram](./fsd.png)

## Layers

_Layers_ are vertically arranged. ❗️Code on one _layer_ can only interact with code from the _layers_ below.

### 1. `shared/`

Reusable functionality, detached from the business (e.g. UIKit, libs, API). ❗️No business logic here.

### 2. `entities/`

Elements which have a business value (e.g. BlogPost, User, Order, Product). Can be a components with slots for content/interactive elements.

Should contain the logic to describe how _entity_ looks and behaves (e.g. static UI elements, data stores, CRUD operations, reducers, selectors, mappers).

### 3. `features/`

_Entity_ can act differently depending on _features_ we apply on top of it (e.g. the User _entity_ with different _features_ can show a contact card or get a personal ad or be granted access etc...).

_Feature_ is an action on _entity_ to achieve a valuable outcome (e.g. create-blog-post, login-by-auth, edit-account, publish-video).

Can contain interactive UI elements, internal state and API calls that enable value-producing actions.

### 4. `widgets/`

Compositional _layer_ to combine lower-level units from _entities_ + _features_ into meaningful assembled blocks with content and interactive buttons wired to the api calls (e.g. PostCard, IssuesList, UserProfile).

In this _layer_ we fill slots left in the UI of _Entities_ with other _Entities_ and interactive elements from _Features_.

Usually non-business logic come here (e.g. gestures, keyboard interaction, etc). For reach widgets business logic is permitted.

❗️It might be hard to decide what goes into _Entities_ and _Features_. Do not worry. Just put all logic into _Widgets_ layer. You will feel later if it should be split into _Entities_ and _Features_.

### 5. `pages/`

Compositional layer to construct full pages or views from _entities_, _features_ and _widgets_ (e.g. route components for each page/slot). ❗️No business and minimum other logic here.

### 6. `app/`

App-wide settings, (e.g. styles, providers, router, store).

https://feature-sliced.design/docs/reference/layers

## Slices

A _layer_ can be divided into business oriented _slices_ to keep related code together (e.g. post, add-user-to-friends, news-feed...)

1. `Shared` and `App` _layers_ never have _slices_ (they do not have business logic inside).
2. ❗️*Slices* cannot use other _slices_ on the same _layer_.
3. Closely related slices can be grouped in a directory, but they still should follow rule above.
4. ❗️*Slices* (and _segments_ without _slices_) must contain the `index.ts` entry points (public API) with module re-exports. Code outside should not reference internal _slice_ file structure, but public API only.

## Segments

A _slice_ consists of _segments_ to separate code by its technical nature, common _segments_, ❗️but not necessarily are:

1. `ui/` ui-logic, components
2. `model/` business logic, store, actions, selectors
3. `lib/` utils, helpers, hooks
4. `api/` communication with external APIs, backend API methods

# Auth

Authorization - checking for password correctness
Authentication - checking if a user is the same as authorized initially

(A) At registration we store at db email + hashed salted password +
`refresh` jwt token with 30d validity which contains email & role payload

(B) Client is authorized by comparing email & password's hash
against stored email and hashed password at the login stage.

(C) On successful authorization the server issues 15 min `access` jwt token and
issues new `refresh` jwt token if pervious one is expired.

(D) `refresh` jwt token is needed for future user authentication to avoid
asking for credentials on every login and protected http request.

(E) `refresh` token is saved by server in db + in secured cookies on login.
On every protected api request we verify `refresh` token and check if it is the same as in db.

(F) If we want to forbid user's access we may simply delete or modify `refresh` token from db.

(G) `access` token is stored locally in memory on client side and is
attached to request to http headers `access-jwt-token` for protected api requests.

(H) `access` token is attached by 'request' interceptor at `axiosWithAuth`.
If we do a request to a protected endpoint we just use `axiosWithAuth`
instance to avoid attaching token manually.

(I) At protected routes the `verifyTokenMiddleware` is used to check the `access` token.
Verification is fast and does not require database. If the token is ok
then the request goes forward, otherwise en error response of status `401` with
message "Not logged in" is returned.

(J) `access` token expires in 15 min.
'Response' interceptor in `axiosWithAuth` checks for `401` status and
if it is the `401` status, it makes additional request to get new `access` token by
checking already attached a `refresh` token to cookies, which has 30d expiry time.

(K) `axiosWithAuth` remembers initial request with all parameters when it
got first `401` error and after getting successfully refreshed `access` a token it
repeats initial http request.

(L) If `refresh` token is invalid or old, then `access` token is not
issued, client is considered to be unauthorized and new login action
is required.

(M) If a user is deleted from the database, the user is still authorized
for short time until `access` token is expired (15 min).
We should consider the duration of access token depending on
sensitivity of our data.

(N) Apart from protected routes tokens are also checked and refreshed at
the initial app load in `<AccessToken />` to avoid prompting a user
for credentials on every page refresh.

(O) We use JWT token which contains encrypted not hashed
payload with user email & role data, validation time
and a hash based on a secret keys, which are kept on a server in env variable.
Server can validate the token only if it knows the secrete key.

# Email

(A) For emails sending Sendgrid is used.
