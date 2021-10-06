package com.gearsofleo.platform.flamingo.infrastructure

import com.gearsofleo.platform.flamingo.infrastructure.feign.AffiliateClientWireMockConfig
import com.github.tomakehurst.wiremock.client.WireMock
import com.github.tomakehurst.wiremock.matching.BinaryEqualToPattern
import com.google.protobuf.MessageLite
import org.junit.jupiter.api.DisplayName
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock
import org.springframework.context.annotation.Import

@DisplayName("WireMock test")
@Import(AffiliateClientWireMockConfig::class)
@AutoConfigureWireMock(port = AffiliateClientWireMockConfig.PORT)
abstract class WireMockTest : IntegrationTest() {

    protected fun MessageLite.toWireMockRequestBody(): BinaryEqualToPattern =
        WireMock.binaryEqualTo(this.toByteArray())

    protected fun MessageLite.toWireMockResponseBody(): ByteArray =
        this.toByteArray()
}
