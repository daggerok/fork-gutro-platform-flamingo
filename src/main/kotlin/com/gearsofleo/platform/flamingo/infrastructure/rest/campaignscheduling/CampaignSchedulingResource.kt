package com.gearsofleo.platform.flamingo.infrastructure.rest.campaignscheduling

import com.gearsofleo.platform.flamingo.external.OptimoveIntClient
import com.gearsofleo.platform.flamingo.infrastructure.rest.authentication.UserSessionJson
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.servlet.http.HttpSession


@RestController
@RequestMapping("/api/campaign-scheduling")
class CampaignSchedulingResource(val optimoveIntClient: OptimoveIntClient) {

    private final val userSessionKey = "USER_SESSION"

    @PostMapping("/")
    fun createSchedulingCampaign(@RequestBody cmd: CampaignSchedulingCommandJson, session: HttpSession): CampaignSchedulingResponseJson {
        return try {
            session.getAttribute(userSessionKey) as UserSessionJson?
                ?: return CampaignSchedulingResponseJson("Not authenticated")

            optimoveIntClient.createSchedulingCampaignWithPromotions(cmd.toCommand())

            CampaignSchedulingResponseJson(null)
        } catch (e: Exception) {
            CampaignSchedulingResponseJson(e.message)
        }
    }
}
