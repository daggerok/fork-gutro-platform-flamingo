package com.gearsofleo.platform.flamingo.infrastructure.extensions

import com.fasterxml.jackson.databind.ObjectMapper

fun <T> ObjectMapper.json(function: () -> T): String =
    writeValueAsString(function.invoke())
