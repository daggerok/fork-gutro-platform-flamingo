package com.gearsofleo.platform.flamingo.infrastructure.rest.campaignschedulinghistory

import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationQueryApiProtos.GetScheduledCampaignDetailsQuery
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationQueryApiProtos.GetScheduledCampaingsQuery
import com.gearsofleo.platform.aux.optimove.integration.feign.client.OptimoveIntegrationCommandClient
import com.gearsofleo.platform.flamingo.infrastructure.rest.authentication.UserSessionJson
import javax.servlet.http.HttpSession
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/campaign-scheduling-history")
class CampaignSchedulingHistoryResource(val optimoveIntClient: OptimoveIntegrationCommandClient) {

    private final val userSessionKey = "USER_SESSION"

    @GetMapping("/")
    fun getScheduledCampaigns(@RequestParam startDate: Long, @RequestParam endDate: Long, session: HttpSession): ScheduledCampaignsResponseJson? {
        return try {
            session.getAttribute(userSessionKey) as UserSessionJson?
                    ?: return ScheduledCampaignsResponseJson("Not authenticated")

            val response = optimoveIntClient.getScheduledCampaigns(
                GetScheduledCampaingsQuery.newBuilder()
                    .setStartDate(startDate)
                    .setEndDate(endDate)
                    .build()
            )

            response?.toJson()
        } catch (e: Exception) {
            ScheduledCampaignsResponseJson(e.message ?: e.toString())
        }
    }

    @GetMapping("/details")
    fun getScheduledCampaignDetails(@RequestParam campaignId: String, session: HttpSession): ScheduledCampaignDetailsResponseJson? {
        return try {
            session.getAttribute(userSessionKey) as UserSessionJson?
                ?: return ScheduledCampaignDetailsResponseJson("Not authenticated")

            val response = optimoveIntClient.getCampaignDetails(
                GetScheduledCampaignDetailsQuery.newBuilder()
                    .setCampaignId(campaignId)
                    .build()
            )

            response?.toJson()
        } catch (e: Exception) {
            ScheduledCampaignDetailsResponseJson(e.message ?: e.toString())
        }
    }
}
