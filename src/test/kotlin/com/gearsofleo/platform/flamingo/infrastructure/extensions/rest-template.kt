package com.gearsofleo.platform.flamingo.infrastructure.extensions

import org.springframework.core.ParameterizedTypeReference

inline fun <reified T> respTypeRef() = object : ParameterizedTypeReference<T>() {}
