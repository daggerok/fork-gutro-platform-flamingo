package com.gearsofleo.platform.flamingo.affiliate

import com.fasterxml.jackson.databind.ObjectMapper
import com.gearsofleo.platform.aux.affiliate.api.client.AffiliateClient
import com.gearsofleo.platform.aux.affiliate.api.exceptions.AffiliateAlreadyExistException
import com.gearsofleo.platform.aux.affiliate.api.exceptions.AffiliateRequirePostbackException
import com.gearsofleo.platform.aux.affiliate.api.exceptions.AffiliateWithoutDepositThresholdTypeContainsThresholdsException
import com.gearsofleo.platform.flamingo.infrastructure.RestApiDocsTest
import com.gearsofleo.platform.flamingo.infrastructure.extensions.jsonBody
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.CreateAffiliateRequest
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.withPostback
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.withThreshold
import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.willThrow
import io.restassured.module.kotlin.extensions.Given
import io.restassured.module.kotlin.extensions.Then
import io.restassured.module.kotlin.extensions.When
import org.hamcrest.Matchers.containsString
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Tag
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.core.env.Environment
import org.springframework.http.HttpStatus.BAD_REQUEST
import org.springframework.http.HttpStatus.CONFLICT

/**
 * See: com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.AffiliateResource#errorHandler
 */
@Suppress("SpringJavaInjectionPointsAutowiringInspection")
@DisplayName("Flamingo REST API negative tests of create affiliate operation")
class CreateAffiliateNegativeTests @Autowired constructor(
    @LocalServerPort port: Int,
    val mapper: ObjectMapper,
    environment: Environment
) : RestApiDocsTest(environment, port) {

    @MockBean
    lateinit var affiliateClient: AffiliateClient

    @Test
    fun `should not create affiliate without postback`() {
        // @formatter:off

        // setup
        given(affiliateClient.createAffiliate(any())) willThrow {
            AffiliateRequirePostbackException("without-postback")
        }

        Given {
            spec(of("create-affiliate-negative-require-postback"))

            jsonBody(mapper) {
                CreateAffiliateRequest {
                    affiliateId = "without-postback"
                    affiliateName = "Affiliate without postback"
                    operatorUIDs = listOf("111", "222")
                    enabled = true
                }
            }
        }.

        When {
            post(url("/api/v1/affiliate/create-affiliate"))
        }.

        Then {
            val httpStatus = BAD_REQUEST

            statusCode(httpStatus.value())
            body("code", equalTo(httpStatus.value()))
            body("status", equalTo(httpStatus.reasonPhrase))
            body("message", containsString(
                "Affiliate(without-postback) require at least one postback"
            ))
        }

        // @formatter:on
    }

    @Test
    @Tag("RET-14230")
    fun `should not create an affiliate with affiliate ID that already exists in the affiliate database`() {
        // @formatter:off

        // setup
        given(affiliateClient.createAffiliate(any())) willThrow {
            AffiliateAlreadyExistException("with-already-exist-id")
        }

        Given {
            spec(of("create-affiliate-negative-non-unique-postback"))

            jsonBody(mapper) {
                CreateAffiliateRequest {
                    affiliateId = "with-already-exist-id"
                    affiliateName = "Affiliate with non unique postback"
                    enabled = true
                    operatorUIDs = listOf("111", "222")
                    withPostback {
                        name = "Deposit threshold postback"
                        countries = listOf("IT", "SE")
                        marketingSourceIDs = listOf("333", "444")
                        url = "https://"
                        type = "depositThreshold"
                        withThreshold {
                            amount = 33.33
                            url = "https://host-39.com/depositThreshold"
                        }
                    }
                    withPostback {
                        name = "Other deposit threshold postback"
                        countries = listOf("IT", "SE")
                        marketingSourceIDs = listOf("333", "444")
                        url = "https://"
                        type = "depositThreshold"
                        withThreshold {
                            amount = 33.33
                            url = "https://host-39.com/otherDepositThreshold"
                        }
                    }
                }
            }
        }.

        When {
            post(url("/api/v1/affiliate/create-affiliate"))
        }.

        Then {
            statusCode(CONFLICT.value())
            body("code", equalTo(CONFLICT.value()))
            body("status", equalTo(CONFLICT.reasonPhrase))
            body("message", containsString("Affiliate(with-already-exist-id) already exist"))
        }

        // @formatter:on
    }

    @Test
    fun `should not create affiliate with not depositThreshold postback containing threshold(s)`() {
        // @formatter:off

        // setup
        given(affiliateClient.createAffiliate(any())) willThrow {
            AffiliateWithoutDepositThresholdTypeContainsThresholdsException("with-threshold-postback")
        }

        Given {
            spec(of("create-affiliate-negative-not-depositThreshold-postback-containing-thresholds"))

            jsonBody(mapper) {
                CreateAffiliateRequest {
                    affiliateId = "with-threshold-postback"
                    affiliateName = "Not depositThreshold postback containing thresholds"
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
            val httpStatus = BAD_REQUEST
            statusCode(httpStatus.value())
            body("code", equalTo(httpStatus.value()))
            body("status", equalTo(httpStatus.reasonPhrase))
            body("message", containsString(
                "Affiliate(with-threshold-postback) contains thresholds, but postback type is not depositThreshold"
            ))
        }

        // @formatter:on
    }
}
