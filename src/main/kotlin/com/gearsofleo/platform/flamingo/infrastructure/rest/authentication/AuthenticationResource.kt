package com.gearsofleo.platform.flamingo.infrastructure.rest.authentication

import com.gearsofleo.platform.flamingo.external.BoIntClient
import com.gearsofleo.platform.integration.bo.api.PlatformIntegrationBoApiProtos.BoSessionContextDTO
import com.gearsofleo.platform.integration.bo.api.PlatformIntegrationBoUserCommandApiProtos.UpdateBoSessionCommand
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.DeleteMapping
import javax.servlet.http.HttpSession

@RestController
@RequestMapping("/api/authentication")
class AuthenticationResource(val boIntClient: BoIntClient) {

    private final val userSessionKey = "USER_SESSION"

    @GetMapping("/")
    fun getAuthenticationStatus(session: HttpSession): AuthenticationStatusJson {
        return try {
            val userSession = session.getAttribute(userSessionKey) as UserSessionJson? ?: return AuthenticationStatusJson(
                false,
                null,
                null
            )

            boIntClient.updateSession(
                UpdateBoSessionCommand
                    .newBuilder()
                    .setSessionContext(
                        BoSessionContextDTO
                            .newBuilder()
                            .setSessionUid(userSession.sessionUid)
                            .build()
                    )
                    .build()
            )

            AuthenticationStatusJson(true, userSession.user, null)
        } catch (e: Exception) {
            AuthenticationStatusJson(false, null, e.message)
        }
    }

    @PostMapping("/")
    fun startSession(@RequestBody login: UserLoginJson, session: HttpSession): AuthenticationStatusJson {
        return try {

            val newSession = boIntClient.startSession(login.toBoStartSessionCommand())

            if (newSession.hasUser()) {
                if (!newSession.user.rolesList.contains("BONUS_WRITE")) {
                    return AuthenticationStatusJson(false, null, "User needs role BONUS_WRITE to login")
                }

                session.setAttribute(userSessionKey, newSession.toUserSessionJson())

                return AuthenticationStatusJson(true, newSession.user.toJson(), null)
            }

            AuthenticationStatusJson(false, null, "Could not create user session")
        } catch (e: Exception) {
            AuthenticationStatusJson(false, null, e.message)
        }
    }

    @DeleteMapping("/")
    fun endSession(session: HttpSession): AuthenticationStatusJson {
        return try {

            val userSession = session.getAttribute(userSessionKey) as UserSessionJson?

            if (userSession != null) {
                boIntClient.endSession(userSession.toBoEndSessionCommand())
            }
            session.setAttribute(userSessionKey, null)

            AuthenticationStatusJson(false, null, null)
        } catch (e: Exception) {
            AuthenticationStatusJson(false, null, e.message)
        }
    }
}
