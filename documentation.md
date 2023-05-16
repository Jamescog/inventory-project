## Table of Contents
- [Introduction](#introduction)
- [Endpoints](#endpoints)
  - [`/api/users`](#apiusers)
  - [`/api/orders`](#apiorders)
- [Authentication](#authentication)
- [Error Handling](#error-handling)

## Introduction

This section provides an overview of the API and its purpose.

## Endpoints

This section describes the available endpoints and their parameters.

### `/api/users`

This endpoint allows you to create a new user account.

#### Request
   - Method: POST
   - Headers:
       -Content-Type: application/json
    
    ```
    {
        "name": string,
        "email": string,
        "password": string
    }

    ```
- `name`: The name of the user. Required.
- `email`: The Email of the user. Required.
- `password`: The password for the user's account. Required >=8 chars.


### `/api/orders`

This endpoint allows you to retrieve a list of orders.

## Authentication

This section explains how to authenticate with the API and obtain an access token.

## Error Handling

This section describes the error responses returned by the API.



