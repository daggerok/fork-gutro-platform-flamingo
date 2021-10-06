package com.gearsofleo.platform.flamingo.affiliate

import com.gearsofleo.platform.aux.affiliate.api.extensions.DeleteAffiliateCommand
import com.gearsofleo.platform.flamingo.infrastructure.RestApiDocsTest
import com.github.tomakehurst.wiremock.client.WireMock
import com.github.tomakehurst.wiremock.client.WireMock.aResponse
import com.github.tomakehurst.wiremock.client.WireMock.stubFor
import io.restassured.module.kotlin.extensions.Given
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.blankString
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.core.env.Environment
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType

@Suppress("SpringJavaInjectionPointsAutowiringInspection")
@DisplayName("Flamingo REST API test of delete affiliate by id operation")
class DeleteAffiliateByIdTest(@LocalServerPort port: Int, @Autowired environment: Environment) :
    RestApiDocsTest(environment, port) {

    val protobufRequest = DeleteAffiliateCommand { affiliateId = "77708" }

    @Test
    fun `should delete affiliate by id`() {
        // @formatter:off

        Given {
            spec(of("delete-affiliate-by-id"))

            stubFor(
                WireMock.post("/affiliate/api/v1/affiliate/delete-affiliate-by-id")
                    .withRequestBody(protobufRequest.toWireMockRequestBody())
                    .willReturn(
                        aResponse()
                            .withStatus(HttpStatus.NO_CONTENT.value())
                            .withHeader("Content-Type", "application/x-protobuf")
                    )
            )

            contentType(MediaType.APPLICATION_JSON_VALUE)
        }.

        When {
            delete(url("/api/v1/affiliate/77708"))
        }.

        Then {
            statusCode(HttpStatus.NO_CONTENT.value())
            body(blankString())
        }

        // @formatter:on
    }
}
