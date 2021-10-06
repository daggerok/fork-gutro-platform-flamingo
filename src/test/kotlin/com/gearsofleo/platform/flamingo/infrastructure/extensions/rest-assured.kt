package com.gearsofleo.platform.flamingo.infrastructure.extensions

import com.fasterxml.jackson.databind.ObjectMapper
import io.restassured.specification.RequestSpecification
import org.springframework.http.MediaType

fun <T> RequestSpecification.jsonBody(objetMapper: ObjectMapper, block: () -> T): RequestSpecification = run {
    contentType(MediaType.APPLICATION_JSON_VALUE)
    body(
        objetMapper.json {
            block.invoke()
        }
    )
}
