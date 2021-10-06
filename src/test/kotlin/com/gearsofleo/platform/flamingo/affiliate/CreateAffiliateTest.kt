package com.gearsofleo.platform.flamingo.affiliate

import com.fasterxml.jackson.databind.ObjectMapper
import com.gearsofleo.platform.aux.affiliate.api.extensions.AffiliateDocument
import com.gearsofleo.platform.aux.affiliate.api.extensions.CreateAffiliateCommand
import com.gearsofleo.platform.aux.affiliate.api.extensions.toCountries
import com.gearsofleo.platform.aux.affiliate.api.extensions.toMarketingSourceIDs
import com.gearsofleo.platform.aux.affiliate.api.extensions.toOperatorUIDs
import com.gearsofleo.platform.aux.affiliate.api.extensions.withAffiliate
import com.gearsofleo.platform.aux.affiliate.api.extensions.withPostback
import com.gearsofleo.platform.aux.affiliate.api.extensions.withThreshold
import com.gearsofleo.platform.flamingo.infrastructure.RestApiDocsTest
import com.gearsofleo.platform.flamingo.infrastructure.extensions.jsonBody
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.CreateAffiliateRequest
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.withPostback
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.withThreshold
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.toTimestamp
import com.github.tomakehurst.wiremock.client.WireMock.aResponse
import com.github.tomakehurst.wiremock.client.WireMock.post
import com.github.tomakehurst.wiremock.client.WireMock.stubFor
import io.restassured.module.kotlin.extensions.Given
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.assertj.core.api.Assertions.assertThat
import org.hamcrest.Matchers.contains
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.core.env.Environment
import org.springframework.http.HttpStatus

@Suppress("SpringJavaInjectionPointsAutowiringInspection")
@DisplayName("Flamingo REST API test of create affiliate operation")
class CreateAffiliateTest @Autowired constructor(
    @LocalServerPort port: Int,
    val mapper: ObjectMapper,
    environment: Environment
) : RestApiDocsTest(environment, port) {

    val protobufRequest = CreateAffiliateCommand {
        affiliateId = "667788"
        affiliateName = "Some new affiliate"
        enabled = true
        operatorUIDs = "111,222".toOperatorUIDs()
        withPostback {
            name = "Signup postback"
            countries = "IT,SE".toCountries()
            marketingSourceIDs = "333,444".toMarketingSourceIDs()
            url = "https://host-1.com/signup"
            type = "signup"
            withThreshold {
                amount = 33.33
                url = "https://host-39.com/depositThreshold"
            }
        }
    }

    val protobufResponse = AffiliateDocument {
        withAffiliate {
            affiliateId = "667788"
            affiliateName = "Some new affiliate"
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
                withThreshold {
                    amount = 33.33
                    url = "https://host-39.com/depositThreshold"
                }
            }
        }
    }

    @Test
    fun `should create affiliate`() {
        // @formatter:off

        // setup
        stubFor(
            post("/affiliate/api/v1/affiliate/create-affiliate")
                .withRequestBody(protobufRequest.toWireMockRequestBody())
                .willReturn(
                    aResponse()
                        .withStatus(HttpStatus.CREATED.value())
                        .withBody(protobufResponse.toByteArray())
                        .withHeader("Content-Type", "application/x-protobuf")
                )
        )

        Given {
            spec(of("create-affiliate"))
            jsonBody(mapper) {
                CreateAffiliateRequest {
                    affiliateId = "667788"
                    affiliateName = "Some new affiliate"
                    enabled = true
                    operatorUIDs = listOf("111", "222")
                    withPostback {
                        name = "Signup postback"
                        countries = listOf("IT", "SE")
                        marketingSourceIDs = listOf("333", "444")
                        url = "https://host-1.com/signup"
                        type = "signup"
                        withThreshold {
                            amount = 33.33
                            url = "https://host-39.com/depositThreshold"
                        }
                    }
                }
            }
        }.

        When {
            post(url("/api/v1/affiliate/create-affiliate"))
        }.

        Then {
            statusCode(HttpStatus.CREATED.value())

            body("affiliateId", equalTo("667788"))
            body("affiliateName", equalTo("Some new affiliate"))
            body("createdTimestamp", equalTo("2021-07-14T16:20:15"))
            body("updatedTimestamp", equalTo("2021-07-14T16:20:15"))
            body("enabled", equalTo(true))
            body("operatorUIDs", contains("111", "222"))

            body("postbacks.id", equalTo(listOf(123)))
            body("postbacks.name", contains("Signup postback"))
            body("postbacks.countries", contains(listOf("IT", "SE")))
            body("postbacks.marketingSourceIDs", contains(listOf("333", "444")))
            body("postbacks.type", contains("signup"))
            body("postbacks.url", contains("https://host-1.com/signup"))

            // and
            extract().path<List<List<String>>>("postbacks.thresholds.url").let {
                assertThat(it).isEqualTo(
                    listOf(
                        listOf("https://host-39.com/depositThreshold"),
                    ),
                )
            }
        }

        // @formatter:on
    }
}
