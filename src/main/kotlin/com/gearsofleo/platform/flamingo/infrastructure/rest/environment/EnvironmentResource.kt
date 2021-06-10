package com.gearsofleo.platform.flamingo.infrastructure.rest.environment

import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(path = ["/environment"])
class EnvironmentResource {

  @Value("\${platform.bo.environment:dev}")
  lateinit var environment: String


  @GetMapping(produces = [(MediaType.APPLICATION_JSON_VALUE)])
  fun get(): EnvironmentJson {
    return EnvironmentJson(environment)
  }
}

data class EnvironmentJson(val environment: String?)
