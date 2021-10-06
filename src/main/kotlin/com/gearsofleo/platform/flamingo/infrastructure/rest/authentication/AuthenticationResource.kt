package com.gearsofleo.platform.flamingo.infrastructure.rest.authentication

import com.gearsofleo.platform.integration.bo.api.PlatformIntegrationBoApiProtos.BoSessionContextDTO
import com.gearsofleo.platform.integration.bo.api.PlatformIntegrationBoUserCommandApiProtos.UpdateBoSessionCommand
import com.gearsofleo.platform.integration.bo.client.feign.BoUserCommandClient
import javax.servlet.http.HttpSession
import org.apache.logging.log4j.kotlin.logger
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/authentication")
class AuthenticationResource(
    private val authProps: AuthProps,
    private val boIntClient: BoUserCommandClient,
) {

    /* // TODO: FIXME: More appropriate way to handle authentication, but may require fronted
            updates of handling http response statuses codes for some cases: 200 OK -> 401 Unauthorized
    @ExceptionHandler(Throwable::class)
    fun handleError(e: Throwable): ResponseEntity<AuthenticationStatusJson> =
        ResponseEntity.status(UNAUTHORIZED)
            .body(AuthenticationStatusJson(false, error = e.message ?: "Unknown reason"))
            .apply { log.warn { e } }
    */

    @GetMapping("/")
    fun getAuthenticationStatus(session: HttpSession): AuthenticationStatusJson =
        runCatching {

            val userSession =
                session.getAttribute(userSessionKey) as UserSessionJson?
                    ?: return AuthenticationStatusJson(false)
                        .apply { log.warn { "use session is null $this" } }

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

            AuthenticationStatusJson(true, userSession.user)

        }.getOrElse {
            AuthenticationStatusJson(false, error = it.message)
                .apply { log.warn { "get auth status: $it" } }
        }

    @PostMapping("/")
    fun startSession(@RequestBody login: UserLoginJson, session: HttpSession): AuthenticationStatusJson =
        runCatching {

            val newSession = boIntClient.startSession(login.toBoStartSessionCommand())

            if (newSession.hasUser()) {

                val userMissingRequiredRole = newSession.user.rolesList.none { authProps.rolesToCheck.contains(it) }
                if (userMissingRequiredRole) {
                    val error = "User needs role ${authProps.rolesToCheck.joinToString { " or " }} to login"
                    return AuthenticationStatusJson(false, error = error)
                        .apply { log.warn { error } }
                }

                session.setAttribute(userSessionKey, newSession.toUserSessionJson())
                return AuthenticationStatusJson(true, newSession.user.toJson())
            }

            AuthenticationStatusJson(false, error = "Could not create user session")
                .apply { log.warn { error } }

        }.getOrElse {
            AuthenticationStatusJson(false, error = it.message)
                .apply { log.warn { "start session: $it" } }
        }

    @DeleteMapping("/")
    fun endSession(session: HttpSession): AuthenticationStatusJson =
        runCatching {

            val userSession = session.getAttribute(userSessionKey) as UserSessionJson?

            if (userSession != null) boIntClient.endSession(userSession.toBoEndSessionCommand())
            session.setAttribute(userSessionKey, null)

            AuthenticationStatusJson(false)

        }.getOrElse {
            AuthenticationStatusJson(false, error = it.message)
                .apply { log.warn { "end session: $it" } }
        }

    companion object {
        private const val userSessionKey = "USER_SESSION"
        private val log = logger()
    }
}
