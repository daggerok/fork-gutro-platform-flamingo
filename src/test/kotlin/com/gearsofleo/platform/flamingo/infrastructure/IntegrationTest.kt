package com.gearsofleo.platform.flamingo.infrastructure

import com.gearsofleo.platform.flamingo.Application
import org.junit.jupiter.api.DisplayName
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration

@DisplayName("An integration test")
@ContextConfiguration(classes = [Application::class])
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
abstract class IntegrationTest : UnitTest()
