package com.gearsofleo.platform.flamingo.external

import com.gearsofleo.platform.flamingo.config.FeignConfiguration
import com.gearsofleo.platform.integration.bo.api.PlatformIntegrationBoUserCommandApiProtos.StartBoSessionDocument
import com.gearsofleo.platform.integration.bo.api.PlatformIntegrationBoUserCommandApiProtos.StartBoSessionCommand
import com.gearsofleo.platform.integration.bo.api.PlatformIntegrationBoUserCommandApiProtos.EndBoSessionCommand
import com.gearsofleo.platform.integration.bo.api.PlatformIntegrationBoUserCommandApiProtos.EndBoSessionDocument
import com.gearsofleo.platform.integration.bo.api.PlatformIntegrationBoUserCommandApiProtos.UpdateBoSessionCommand
import com.gearsofleo.platform.integration.bo.api.PlatformIntegrationBoUserCommandApiProtos.UpdateBoSessionDocument
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod

@FeignClient("bo-integration", path = "/bo-integration/api/", configuration = [(FeignConfiguration::class)])
interface BoIntClient {
    @RequestMapping(
        path = ["users/session/start"],
        method = [(RequestMethod.POST)],
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun startSession(cmd: StartBoSessionCommand): StartBoSessionDocument

    @RequestMapping(
        path = ["users/session/end"],
        method = [(RequestMethod.POST)],
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun endSession(cmd: EndBoSessionCommand): EndBoSessionDocument

    @RequestMapping(
        path = ["users/session/update"],
        method = [(RequestMethod.POST)],
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun updateSession(cmd: UpdateBoSessionCommand): UpdateBoSessionDocument

}
