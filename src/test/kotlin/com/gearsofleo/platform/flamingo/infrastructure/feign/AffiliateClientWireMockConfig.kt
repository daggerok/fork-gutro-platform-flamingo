package com.gearsofleo.platform.flamingo.infrastructure.feign

import org.springframework.boot.test.context.TestConfiguration
import org.springframework.cloud.client.DefaultServiceInstance
import org.springframework.cloud.client.ServiceInstance
import org.springframework.cloud.loadbalancer.core.ServiceInstanceListSupplier
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Lazy
import reactor.core.publisher.Flux

@TestConfiguration
@Suppress("SpringJavaInjectionPointsAutowiringInspection")
class AffiliateClientWireMockConfig {

    companion object {
        const val SERVICE_ID = "affiliate"
        const val PORT = 8081
    }

    @Bean
    @Lazy
    fun testServices() = object : ServiceInstanceListSupplier {
        override fun getServiceId(): String {
            return SERVICE_ID
        }

        override fun get(): Flux<List<ServiceInstance>> {
            return Flux.just(
                listOf<ServiceInstance>(
                    DefaultServiceInstance(
                        "affiliate-1",
                        SERVICE_ID,
                        "localhost",
                        PORT,
                        false
                    )
                )
            )
        }
    }
}
