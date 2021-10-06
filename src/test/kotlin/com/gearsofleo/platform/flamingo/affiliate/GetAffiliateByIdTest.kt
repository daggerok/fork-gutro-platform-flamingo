package com.gearsofleo.platform.flamingo.affiliate

import com.gearsofleo.platform.aux.affiliate.api.extensions.AffiliateDocument
import com.gearsofleo.platform.aux.affiliate.api.extensions.GetAffiliateQuery
import com.gearsofleo.platform.aux.affiliate.api.extensions.toCountries
import com.gearsofleo.platform.aux.affiliate.api.extensions.toMarketingSourceIDs
import com.gearsofleo.platform.aux.affiliate.api.extensions.toOperatorUIDs
import com.gearsofleo.platform.aux.affiliate.api.extensions.withAffiliate
import com.gearsofleo.platform.aux.affiliate.api.extensions.withPostback
import com.gearsofleo.platform.flamingo.infrastructure.RestApiDocsTest
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.toTimestamp
import com.github.tomakehurst.wiremock.client.WireMock
import com.github.tomakehurst.wiremock.client.WireMock.aResponse
import com.github.tomakehurst.wiremock.client.WireMock.stubFor
import io.restassured.module.kotlin.extensions.Given
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.contains
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.core.env.Environment
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType

@Suppress("SpringJavaInjectionPointsAutowiringInspection")
@DisplayName("Flamingo REST API test of get affiliate by id operation")
class GetAffiliateByIdTest(@LocalServerPort port: Int, @Autowired environment: Environment) :
    RestApiDocsTest(environment, port) {

    val protobufRequest = GetAffiliateQuery { affiliateId = "123" }

    val protobufResponse = AffiliateDocument {
        withAffiliate {
            affiliateId = "123"
            affiliateName = "Gutro"
            createdTimestamp = "2021-07-14T16:20:15".toTimestamp()
            updatedTimestamp = "2021-07-14T16:20:15".toTimestamp()
            enabled = true
            operatorUIDs = "111,222".toOperatorUIDs()
            withPostback {
                id = 123
                name = "Signup postback"
                countries = "IT,SE".toCountries()
                marketingSourceIDs = "333,444".toMarketingSourceIDs()
                url = "https://host-1.com/signup"
                type = "signup"
            }
        }
    }

    @Test
    fun `should get affiliate by id`() {
        // @formatter:off

        Given {
            spec(of("get-affiliate-by-id"))

            stubFor(
                WireMock.post("/affiliate/api/v1/affiliate/get-affiliate-by-id")
                    .withRequestBody(protobufRequest.toWireMockRequestBody())
                    .willReturn(
                        aResponse()
                            .withStatus(HttpStatus.OK.value())
                            .withBody(protobufResponse.toByteArray())
                            .withHeader("Content-Type", "application/x-protobuf")
                    )
            )

            contentType(MediaType.APPLICATION_JSON_VALUE)
        }.

        When {
            get(url("/api/v1/affiliate/123"))
        }.

        Then {
            statusCode(HttpStatus.OK.value())

            body("affiliateId", equalTo("123"))
            body("affiliateName", equalTo("Gutro"))
            body("createdTimestamp", equalTo("2021-07-14T16:20:15"))
            body("updatedTimestamp", equalTo("2021-07-14T16:20:15"))
            body("enabled", equalTo(true))
            body("operatorUIDs", equalTo(listOf("111", "222")))

            body("postbacks.id", contains(123))
            body("postbacks.name", contains("Signup postback"))
            body("postbacks.countries", contains(listOf("IT", "SE")))
            body("postbacks.marketingSourceIDs", contains(listOf("333", "444")))
            body("postbacks.type", contains("signup"))
            body("postbacks.url", contains("https://host-1.com/signup"))
        }

        // @formatter:on
    }
}
