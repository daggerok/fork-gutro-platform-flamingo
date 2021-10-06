package com.gearsofleo.platform.flamingo.infrastructure.rest.authentication

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(AuthProps::class)
class AuthConfig
