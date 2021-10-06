package com.gearsofleo.platform.flamingo.affiliate

import com.gearsofleo.platform.aux.affiliate.api.extensions.AffiliatesDocument
import com.gearsofleo.platform.aux.affiliate.api.extensions.SearchAffiliatesQuery
import com.gearsofleo.platform.aux.affiliate.api.extensions.page
import com.gearsofleo.platform.aux.affiliate.api.extensions.toCountries
import com.gearsofleo.platform.aux.affiliate.api.extensions.toMarketingSourceIDs
import com.gearsofleo.platform.aux.affiliate.api.extensions.toOperatorUIDs
import com.gearsofleo.platform.aux.affiliate.api.extensions.withAffiliate
import com.gearsofleo.platform.aux.affiliate.api.extensions.withPostback
import com.gearsofleo.platform.aux.affiliate.api.extensions.withThreshold
import com.gearsofleo.platform.flamingo.infrastructure.RestApiDocsTest
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.toTimestamp
import com.github.tomakehurst.wiremock.client.WireMock
import com.github.tomakehurst.wiremock.client.WireMock.aResponse
import com.github.tomakehurst.wiremock.client.WireMock.stubFor
import io.restassured.module.kotlin.extensions.Extract
import io.restassured.module.kotlin.extensions.Given
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.assertj.core.api.Assertions.assertThat
import org.hamcrest.Matchers.contains
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.core.env.Environment
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType

@Suppress("SpringJavaInjectionPointsAutowiringInspection")
@DisplayName("Flamingo REST API test of search affiliates operation")
class SearchAffiliatesTest(@LocalServerPort port: Int, @Autowired environment: Environment) :
    RestApiDocsTest(environment, port) {

    val protobufRequest = SearchAffiliatesQuery {
        text = "affiliate"
        status = "enabled"
        page {
            number = 2
            size = 2
        }
    }

    val protobufResponse = AffiliatesDocument {
        withAffiliate {
            affiliateId = "303030"
            affiliateName = "An affiliate 31"
            createdTimestamp = "2021-07-23T00:32:00".toTimestamp()
            updatedTimestamp = "2021-07-23T00:33:00".toTimestamp()
            enabled = true
            operatorUIDs = "operatorUid34,operatorUid37".toOperatorUIDs()
            withPostback {
                id = 0
                name = "Deposit postback"
                countries = "IT,SE".toCountries()
                marketingSourceIDs = "marketingSourceId35".toMarketingSourceIDs()
                url = "https://host-36.com/deposit"
                type = "deposit"
            }
            withPostback {
                id = 1
                marketingSourceIDs = "marketingSourceId38".toMarketingSourceIDs()
                countries = "SE".toCountries()
                url = "https://"
                type = "depositThreshold"
                withThreshold {
                    amount = 33.33
                    url = "https://host-39.com/depositThreshold"
                }
            }
        }
    }

    @Test
    fun `should search affiliates`() {
        // @formatter:off

        Given {
            spec(of("search-affiliates"))

            stubFor(
                WireMock.post("/affiliate/api/v1/affiliate/search-affiliates")
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
            get(url("/api/v1/affiliate?text=affiliate&status=enabled&page=2&size=2"))
        }.

        Then {
            statusCode(HttpStatus.OK.value())

            body("affiliateId", contains("303030"))
            body("affiliateName", contains("An affiliate 31"))
            body("enabled", contains(true))
            body("operatorUIDs", contains(
                listOf("operatorUid34", "operatorUid37"),
            ))

            body("postbacks.id", contains(
                listOf(0, 1),
            ))
            body("postbacks.name", contains(
                listOf("Deposit postback", null),
            ))
            body("postbacks.countries", contains(
                listOf(
                    listOf("IT", "SE"),
                    listOf("SE"),
                )
            ))
            body("postbacks.type", contains(
                listOf("deposit", "depositThreshold"),
            ))
            body("postbacks.url", contains(
                listOf("https://host-36.com/deposit", "https://"),
            ))
        }.

        // and
        Extract {
            path<List<List<String>>>("postbacks.thresholds.url").let {
                assertThat(it).isEqualTo(
                    listOf(
                        listOf(
                            listOf("https://host-39.com/depositThreshold")
                        ),
                    )
                )
            }
        }

        // @formatter:on
    }
}
