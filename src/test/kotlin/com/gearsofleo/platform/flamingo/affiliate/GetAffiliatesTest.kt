package com.gearsofleo.platform.flamingo.affiliate

import com.gearsofleo.platform.aux.affiliate.api.AffiliatePaginationApiProtos.SortOrder.DESC
import com.gearsofleo.platform.aux.affiliate.api.extensions.AffiliatesDocument
import com.gearsofleo.platform.aux.affiliate.api.extensions.GetAffiliatesQuery
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
@DisplayName("Flamingo REST API test of get affiliates operation")
class GetAffiliatesTest(@LocalServerPort port: Int, @Autowired environment: Environment) :
    RestApiDocsTest(environment, port) {

    val protobufRequest = GetAffiliatesQuery {
        page {
            number = 2
            size = 2
            sortBy = "createdTimestamp"
            sortOrder = DESC
        }
    }

    val protobufResponse = AffiliatesDocument {
        withAffiliate {
            affiliateId = "404040"
            affiliateName = "An affiliate 41"
            createdTimestamp = "2021-07-23T00:42:00".toTimestamp()
            updatedTimestamp = "2021-07-23T00:43:00".toTimestamp()
            enabled = false
            operatorUIDs = "operatorUid44".toOperatorUIDs()
            withPostback {
                id = 123
                name = "Deposit postback"
                countries = "IT,SE".toCountries()
                marketingSourceIDs = "marketingSourceId45".toMarketingSourceIDs()
                url = "https://host-46.com/deposit"
                type = "deposit"
            }
        }
        withAffiliate {
            affiliateId = "303030"
            affiliateName = "An affiliate 31"
            createdTimestamp = "2021-07-23T00:32:00".toTimestamp()
            updatedTimestamp = "2021-07-23T00:33:00".toTimestamp()
            enabled = true
            operatorUIDs = "operatorUid34,operatorUid37".toOperatorUIDs()
            withPostback {
                id = 456
                name = "Deposit postback"
                countries = "SE".toCountries()
                marketingSourceIDs = "marketingSourceId35".toMarketingSourceIDs()
                url = "https://host-36.com/deposit"
                type = "deposit"
            }
            withPostback {
                id = 789
                countries = "SE".toCountries()
                marketingSourceIDs = "marketingSourceId38".toMarketingSourceIDs()
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
    fun `should get affiliates`() {
        // @formatter:off

        Given {
            spec(of("get-affiliates"))

            stubFor(
                WireMock.post("/affiliate/api/v1/affiliate/get-affiliates")
                    .withRequestBody(protobufRequest.toWireMockRequestBody())
                    .willReturn(
                        aResponse()
                            .withStatus(HttpStatus.OK.value())
                            .withHeader("Content-Type", "application/x-protobuf")
                            .withBody(protobufResponse.toByteArray())
                    )
            )

            contentType(MediaType.APPLICATION_JSON_VALUE)
        }.

        When {
            get(url("/api/v1/affiliate?page=2&size=2&sortBy=createdTimestamp&sortOrder=DESC"))
        }.

        Then {
            statusCode(HttpStatus.OK.value())

            body("affiliateId", contains("404040", "303030"))
            body("affiliateName", contains("An affiliate 41", "An affiliate 31"))
            body("enabled", contains(false, true))
            body("operatorUIDs", contains(
                listOf("operatorUid44"),
                listOf("operatorUid34", "operatorUid37"),
            ))

            body("postbacks.id", contains(
                listOf(123),
                listOf(456, 789),
            ))
            body("postbacks.name", contains(
                listOf("Deposit postback"),
                listOf("Deposit postback", null),
            ))
            body("postbacks.type", contains(
                listOf("deposit"),
                listOf("deposit", "depositThreshold"),
            ))
            body("postbacks.url", contains(
                listOf("https://host-46.com/deposit"),
                listOf("https://host-36.com/deposit", "https://"),
            ))
        }.

        // and
        Extract {
            path<List<List<String>>>("postbacks.thresholds.url").let {
                assertThat(it).isEqualTo(
                    listOf(
                        listOf(),
                        listOf(
                            listOf("https://host-39.com/depositThreshold"),
                        ),
                    )
                )
            }
        }

        // @formatter:on
    }
}
