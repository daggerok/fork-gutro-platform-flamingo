package com.gearsofleo.platform.flamingo.infrastructure.rest.environment

import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class EnvironmentResource {

    @Value("\${platform.bo.environment:dev}")
    lateinit var environment: String

    @GetMapping(path = ["/environment", "/api/environment"])
    fun get(): EnvironmentJson =
        EnvironmentJson(environment)
}
