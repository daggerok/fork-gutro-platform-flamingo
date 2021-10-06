package com.gearsofleo.platform.flamingo.affiliate

import com.fasterxml.jackson.databind.ObjectMapper
import com.gearsofleo.platform.aux.affiliate.api.client.AffiliateClient
import com.gearsofleo.platform.aux.affiliate.api.exceptions.AffiliateNotFoundException
import com.gearsofleo.platform.aux.affiliate.api.exceptions.AffiliateRequirePostbackException
import com.gearsofleo.platform.aux.affiliate.api.exceptions.AffiliateWithoutDepositThresholdTypeContainsThresholdsException
import com.gearsofleo.platform.flamingo.infrastructure.RestApiDocsTest
import com.gearsofleo.platform.flamingo.infrastructure.extensions.jsonBody
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.UpdateAffiliateRequest
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.withPostback
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.withThreshold
import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.willThrow
import io.restassured.module.kotlin.extensions.Given
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.containsString
import org.hamcrest.Matchers.endsWith
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.core.env.Environment
import org.springframework.http.HttpStatus.BAD_REQUEST
import org.springframework.http.HttpStatus.NOT_FOUND

/**
 * See: com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.AffiliateResource#errorHandler
 */
@Suppress("SpringJavaInjectionPointsAutowiringInspection")
@DisplayName("Flamingo REST API negative tests of update affiliate operation")
class UpdateAffiliateNegativeTests @Autowired constructor(
    @LocalServerPort port: Int,
    val mapper: ObjectMapper,
    environment: Environment
) : RestApiDocsTest(environment, port) {

    @MockBean
    lateinit var affiliateClient: AffiliateClient

    @Test
    fun `should not update affiliate which is not in db`() {
        // @formatter:off

        // setup
        given(affiliateClient.updateAffiliate(any())) willThrow {
            AffiliateNotFoundException("with-not-found-id")
        }

        Given {
            spec(of("update-affiliate-negative-not-found"))

            jsonBody(mapper) {
                UpdateAffiliateRequest {
                    affiliateId = "with-not-found-id"
                    affiliateName = "Affiliate id is not in db"
                    enabled = true
                    operatorUIDs = listOf("111", "222")
                    withPostback {
                        id = 123
                        name = "Deposit threshold postback"
                        countries = listOf("IT", "SE")
                        marketingSourceIDs = listOf("333", "444")
                        url = "https://host-1.com/signup"
                        type = "depositThreshold"
                        withThreshold {
                            amount = 33.33
                            url = "https://host-39.com/depositThreshold"
                        }
                    }
                }
            }
        }.

        When {
            put(url("/api/v1/affiliate/update-affiliate"))
        }.

        Then {
            statusCode(NOT_FOUND.value())
            body("code", equalTo(NOT_FOUND.value()))
            body("status", equalTo(NOT_FOUND.reasonPhrase))
            body("message", endsWith("Affiliate(with-not-found-id) not found"))
        }

        // @formatter:on
    }

    @Test
    fun `should not update affiliate without postback`() {
        // @formatter:off

        // setup
        given(affiliateClient.updateAffiliate(any())) willThrow {
            AffiliateRequirePostbackException("without-postback")
        }

        Given {
            spec(of("update-affiliate-negative-require-postback"))

            jsonBody(mapper) {
                UpdateAffiliateRequest {
                    affiliateId = "without-postback"
                    affiliateName = "Affiliate without postback"
                    operatorUIDs = listOf("111", "222")
                    enabled = true
                }
            }
        }.

        When {
            put(url("/api/v1/affiliate/update-affiliate"))
        }.

        Then {
            statusCode(BAD_REQUEST.value())
            body("code", equalTo(BAD_REQUEST.value()))
            body("status", equalTo(BAD_REQUEST.reasonPhrase))
            body("message", containsString(
                "Affiliate(without-postback) require at least one postback"
            ))
        }

        // @formatter:on
    }

    @Test
    fun `should not update affiliate with not depositThreshold postback containing threshold(s)`() {
        // @formatter:off

        // setup
        given(affiliateClient.updateAffiliate(any())) willThrow {
            AffiliateWithoutDepositThresholdTypeContainsThresholdsException("with-threshold-postback")
        }

        Given {
            spec(of("update-affiliate-negative-not-depositThreshold-postback-containing-thresholds"))

            jsonBody(mapper) {
                UpdateAffiliateRequest {
                    affiliateId = "with-threshold-postback"
                    affiliateName = "Not depositThreshold postback containing thresholds"
                    enabled = true
                    operatorUIDs = listOf("111", "222")
                    withPostback {
                        id = 123
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
            put(url("/api/v1/affiliate/update-affiliate"))
        }.

        Then {
            statusCode(BAD_REQUEST.value())
            body("code", equalTo(BAD_REQUEST.value()))
            body("status", equalTo(BAD_REQUEST.reasonPhrase))
            body("message", containsString(
                "Affiliate(with-threshold-postback) contains thresholds, but postback type is not depositThreshold"
            ))
        }

        // @formatter:on
    }
}
