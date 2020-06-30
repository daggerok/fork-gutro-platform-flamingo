package com.gearsofleo.platform.flamingo.infrastructure.rest.authentication

import com.gearsofleo.platform.integration.bo.api.PlatformIntegrationBoApiProtos.BoSessionContextDTO
import com.gearsofleo.platform.integration.bo.api.PlatformIntegrationBoUserApiProtos.BoUserDTO
import com.gearsofleo.platform.integration.bo.api.PlatformIntegrationBoUserCommandApiProtos.StartBoSessionDocument
import com.gearsofleo.platform.integration.bo.api.PlatformIntegrationBoUserCommandApiProtos.EndBoSessionCommand
import com.gearsofleo.platform.integration.bo.api.PlatformIntegrationBoUserCommandApiProtos.StartBoSessionCommand

fun BoUserDTO.toJson() = UserJson(
    email, firstname, lastname, rolesList, userUid, username
)

fun UserLoginJson.toBoStartSessionCommand(): StartBoSessionCommand = StartBoSessionCommand.newBuilder()
    .setUsername(username)
    .setPassword(password)
    .build()

fun StartBoSessionDocument.toUserSessionJson() = UserSessionJson(
    session.sessionUid,
    user.toJson()
)

fun UserSessionJson.toBoEndSessionCommand(): EndBoSessionCommand = EndBoSessionCommand.newBuilder()
    .setSessionContext(
        BoSessionContextDTO.newBuilder()
            .setSessionUid(sessionUid)
            .build()
    )
    .build()
