# API Documentation

### Entrypoint
`api.mywebsite.com`

## Response format
```
{
    "status": "Message",
    "code": [Status code]
    "data": {}
}
```

## Authentication

**Some** endpoints require authentication. These endpoints will be market with a `A` symbol.

Authentication is done with headers.
The header key is `Authorization` and the value is the access token.

## User Endpoints

### `GET /users/me`
`A`
Gets the authenticated user.

### `GET /users/:userId`
Fetches user by id. This endpoint does not require authentication, but can be used to fetch following data.
### `POST /users/`
This endpoint creates a new user. The JSON POST body looks like this:
```json
{
    "email": "email",
    "username" "hello",
    "displayName": "Hello World,
    "bioDescription": "Hello my name is Hello",
    "password": "12345678"
}
```
### `PATCH /users/`
Updates user information.
### `GET /users/:userId/followers`
Fetches followers of the user.

### `PUT /users/:userId/followers`
`A`
Creates a new follow. The authenticated user follows the user with the referenced id.

### `DELETE /users/:userId/followers`
`A`
Deletes a follow. The authenticated users follow to the user with the referenced id is removed.
### `GET /users/:userId/following`
Gets the users the referenced user is following.
### `GET /users/:userId/posts`
Gets all posts for a user.
### `GET /users/search?query=`
Searches for users with the username matching to the query.
## Post Endpoints
### `GET /posts/:postId`
Get post by ID.
### `POST /posts/`
`A`
Creates a new post.
```
{
    "image": {
        "data": "base64 encoded image data",
        "type": "image mime type",
        "name": "name of the image"
    },
    "textContent": "Check out this sweet picture"
}
```
### `GET /posts/:postId/likes`
Gets all likes for a post.

### `DELETE /posts/:postId/likes`
Removes the authenticated users like for the referenced post.
### `GET /posts/:postId/comments`
Gets all comments for a post
### `PUT /posts/:postId/likes`
`A`
Creates a like for the post with the authenticated user.
### `PUT /posts/:postId/comments`
`A`
```
{
    "content": "Nice picture!"
]
```
### `DELETE /posts/:postId/comments/:id`
`A`
Removes a comment by post id and id.

### `GET /posts/feed`
`A`
Gets the post feed for the user.

