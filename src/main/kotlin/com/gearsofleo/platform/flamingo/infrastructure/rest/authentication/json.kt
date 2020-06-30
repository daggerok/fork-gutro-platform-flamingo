package com.gearsofleo.platform.flamingo.infrastructure.rest.authentication

data class AuthenticationStatusJson(val authenticated: Boolean, val user: UserJson?, val error: String?)
data class UserJson(
    val email: String,
    val firstname: String,
    val lastname: String,
    val roles: List<String>,
    val userUid: String,
    val username: String
)

data class UserSessionJson(val sessionUid: String, val user: UserJson)

data class UserLoginJson(val username: String? = null, val password: String? = null)
