package com.gearsofleo.platform.flamingo.affiliate

import com.gearsofleo.platform.aux.affiliate.api.client.AffiliateClient
import com.gearsofleo.platform.aux.affiliate.api.exceptions.AffiliateNotFoundException
import com.gearsofleo.platform.flamingo.infrastructure.RestApiDocsTest
import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.willThrow
import io.restassured.module.kotlin.extensions.Given
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.core.env.Environment
import org.springframework.http.HttpStatus.NOT_FOUND
import org.springframework.http.MediaType

/**
 * See: com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.AffiliateResource#errorHandler
 */
@Suppress("SpringJavaInjectionPointsAutowiringInspection")
@DisplayName("Flamingo REST API negative test of delete affiliate by id operation")
class DeleteAffiliateByIdNegativeTest @Autowired constructor(
    environment: Environment,
    @LocalServerPort port: Int,
) : RestApiDocsTest(environment, port) {

    @MockBean
    lateinit var affiliateClient: AffiliateClient

    @Test
    fun `should not delete affiliate by id which is not in db`() {
        // @formatter:off

        // setup
        given(affiliateClient.deleteAffiliateById(any())) willThrow {
            AffiliateNotFoundException("with-not-found-id")
        }

        Given {
            spec(of("delete-affiliate-by-id-negative-not-found"))

            contentType(MediaType.APPLICATION_JSON_VALUE)
        }.

        When {
            delete(url("/api/v1/affiliate/with-not-found-id"))
        }.

        Then {
            statusCode(NOT_FOUND.value())
            body("code", Matchers.equalTo(NOT_FOUND.value()))
            body("status", Matchers.equalTo(NOT_FOUND.reasonPhrase))
            body("message", Matchers.endsWith("Affiliate(with-not-found-id) not found"))
        }

        // @formatter:on
    }
}
