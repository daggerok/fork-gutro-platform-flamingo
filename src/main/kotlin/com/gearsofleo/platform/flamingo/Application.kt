package com.gearsofleo.platform.flamingo

import com.gearsofleo.platform.integration.bo.client.config.boot.BoIntegrationFeignClientAutoConfig
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients
import org.springframework.context.annotation.Import

@EnableFeignClients
@SpringBootApplication
@Import(BoIntegrationFeignClientAutoConfig::class) // TODO: FIXME: Need responsible team JIRA to add autoconfiguration
class Application

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
