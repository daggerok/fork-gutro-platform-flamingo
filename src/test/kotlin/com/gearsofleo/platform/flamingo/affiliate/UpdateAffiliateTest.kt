package com.gearsofleo.platform.flamingo.affiliate

import com.fasterxml.jackson.databind.ObjectMapper
import com.gearsofleo.platform.aux.affiliate.api.extensions.AffiliateDocument
import com.gearsofleo.platform.aux.affiliate.api.extensions.toCountries
import com.gearsofleo.platform.aux.affiliate.api.extensions.toMarketingSourceIDs
import com.gearsofleo.platform.aux.affiliate.api.extensions.toOperatorUIDs
import com.gearsofleo.platform.aux.affiliate.api.extensions.withAffiliate
import com.gearsofleo.platform.aux.affiliate.api.extensions.withPostback
import com.gearsofleo.platform.aux.affiliate.api.extensions.withThreshold
import com.gearsofleo.platform.flamingo.infrastructure.RestApiDocsTest
import com.gearsofleo.platform.flamingo.infrastructure.extensions.jsonBody
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.UpdateAffiliateRequest
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.withPostback
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.withThreshold
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.toDTO
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.toTimestamp
import com.github.tomakehurst.wiremock.client.WireMock.aResponse
import com.github.tomakehurst.wiremock.client.WireMock.post
import com.github.tomakehurst.wiremock.client.WireMock.stubFor
import com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo
import io.restassured.module.kotlin.extensions.Extract
import io.restassured.module.kotlin.extensions.Given
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.assertj.core.api.Assertions.assertThat
import org.hamcrest.Matchers.contains
import org.hamcrest.Matchers.containsInAnyOrder
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.core.env.Environment
import org.springframework.http.HttpStatus

@Suppress("SpringJavaInjectionPointsAutowiringInspection")
@DisplayName("Flamingo REST API test of update affiliate operation")
class UpdateAffiliateTest @Autowired constructor(
    @LocalServerPort port: Int,
    val mapper: ObjectMapper,
    environment: Environment
) : RestApiDocsTest(environment, port) {

    val flamingoRequest = UpdateAffiliateRequest {
        affiliateId = "667788"
        affiliateName = "Updated affiliate"
        enabled = true
        operatorUIDs = listOf("111", "222", "555", "777")
        withPostback {
            id = 123
            name = "Signup postback"
            countries = listOf("IT", "SE")
            marketingSourceIDs = listOf("333", "444")
            url = "https://host-updated.com/signup"
            type = "signup"
        }
        withPostback {
            url = "https://"
            countries = listOf("SE")
            marketingSourceIDs = listOf("888", "999")
            type = "depositThreshold"
            withThreshold {
                url = "https://host-30.com/depositThreshold"
                amount = 30.30
            }
            withThreshold {
                url = "https://host-39.com/depositThreshold"
                amount = 33.33
            }
        }
    }

    val affiliateResponse = AffiliateDocument {
        withAffiliate {
            affiliateId = "667788"
            affiliateName = "Updated affiliate"
            createdTimestamp = "2021-07-14T16:20:15".toTimestamp()
            updatedTimestamp = "2021-07-14T16:20:15".toTimestamp()
            enabled = true
            operatorUIDs = "111,222,555,777".toOperatorUIDs()
            withPostback {
                id = 123
                name = "Signup postback"
                countries = "IT,SE".toCountries()
                marketingSourceIDs = "333,444".toMarketingSourceIDs()
                url = "https://host-updated.com/signup"
                type = "signup"
            }
            withPostback {
                id = 456
                countries = "SE".toCountries()
                marketingSourceIDs = "888,999".toMarketingSourceIDs()
                url = "https://"
                type = "depositThreshold"
                withThreshold {
                    amount = 30.30
                    url = "https://host-30.com/depositThreshold"
                }
                withThreshold {
                    amount = 33.33
                    url = "https://host-39.com/depositThreshold"
                }
            }
        }
    }

    @Test
    fun `should update affiliate`() {
        // @formatter:off

        // setup
        stubFor(
            post(urlPathEqualTo("/affiliate/api/v1/affiliate/update-affiliate"))
                .withRequestBody(flamingoRequest.toDTO().toWireMockRequestBody())
                .willReturn(
                    aResponse()
                        .withStatus(HttpStatus.ACCEPTED.value())
                        .withBody(affiliateResponse.toWireMockResponseBody())
                        .withHeader("Content-Type", "application/x-protobuf")
                )
        )

        Given {
            spec(of("update-affiliate"))

            jsonBody(mapper) { flamingoRequest }
        }.

        When {
            put(url("/api/v1/affiliate/update-affiliate"))
        }.

        Then {
            statusCode(HttpStatus.ACCEPTED.value())

            body("affiliateId", equalTo("667788"))
            body("affiliateName", equalTo("Updated affiliate"))
            body("createdTimestamp", equalTo("2021-07-14T16:20:15"))
            body("updatedTimestamp", equalTo("2021-07-14T16:20:15"))
            body("enabled", equalTo(true))
            body("operatorUIDs", containsInAnyOrder("111", "777", "555", "222"))

            body("postbacks.id", contains(123, 456))
            body("postbacks.name", containsInAnyOrder("Signup postback", null))
            body("postbacks.countries", containsInAnyOrder(
                listOf("IT", "SE"),
                listOf("SE"),
            ))
            body("postbacks.marketingSourceIDs", containsInAnyOrder(
                listOf("888", "999"),
                listOf("333", "444"),
            ))
            body("postbacks.type", containsInAnyOrder("signup", "depositThreshold"))
            body("postbacks.url", containsInAnyOrder(
                "https://host-updated.com/signup",
                "https://",
            ))
        }.

        // end
        Extract {
            path<List<List<String>>>("postbacks.thresholds.url").let {
                assertThat(it).isEqualTo(
                    listOf(
                        listOf(
                            "https://host-30.com/depositThreshold",
                            "https://host-39.com/depositThreshold"
                        ),
                    ),
                )
            }
        }

        // @formatter:on
    }
}
