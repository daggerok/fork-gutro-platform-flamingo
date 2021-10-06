package com.gearsofleo.platform.flamingo.infrastructure.rest.authentication

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConstructorBinding
@ConfigurationProperties("auth")
data class AuthProps(

    @Value("roles-to-check")
    val rolesToCheck: List<String> = listOf()
)
