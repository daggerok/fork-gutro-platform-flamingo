package com.gearsofleo.platform.flamingo.infrastructure.rest.campaignscheduling

import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationCommandApiProtos
import com.gearsofleo.platform.aux.optimove.integration.feign.client.OptimoveIntegrationCommandClient
import com.gearsofleo.platform.flamingo.infrastructure.rest.authentication.UserSessionJson
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.servlet.http.HttpSession


@RestController
@RequestMapping("/api/campaign-scheduling")
class CampaignSchedulingResource(val optimoveIntClient: OptimoveIntegrationCommandClient) {

    private final val userSessionKey = "USER_SESSION"

    @PostMapping("/")
    fun createSchedulingCampaign(@RequestBody cmd: CampaignSchedulingCommandJson, session: HttpSession): CampaignSchedulingResponseJson {
        return try {
            session.getAttribute(userSessionKey) as UserSessionJson?
                ?: return CampaignSchedulingResponseJson("Not authenticated")

            optimoveIntClient.createSchedulingCampaignWithPromotions(cmd.toCommand())

            CampaignSchedulingResponseJson(null)
        } catch (e: Exception) {
            if (e.message?.contains("Campaign with that externalId already exists") == true) {
                return CampaignSchedulingResponseJson("That exact combination of players and promotions have already been scheduled previously.\nPlease make sure your actions are intended.\n\nTo find out when it was scheduled last time please contact the Retention team in #plat-retention-public.")
            }
            CampaignSchedulingResponseJson(e.message)
        }
    }

    @PostMapping("/abort-campaign")
    fun abortCampaign(@RequestBody body: AbortCampaignJson, session: HttpSession): AbortResponse {
        return try {
            session.getAttribute(userSessionKey) as UserSessionJson?
                ?: return AbortResponse("Not authenticated")

            optimoveIntClient.abortCampaign(
                PlatformAuxOptimoveIntegrationCommandApiProtos.AbortCampaignCommand.newBuilder()
                    .setCampaignId(body.campaignId)
                    .build()
            )

            AbortResponse(null)
        } catch (e: Exception) {
            AbortResponse(e.message ?: e.toString())
        }
    }

    @PostMapping("/abort-customer-promotion")
    fun abortCustomerPromotion(@RequestBody body: AbortCustomerPromotionJson, session: HttpSession): AbortResponse {
        return try {
            session.getAttribute(userSessionKey) as UserSessionJson?
                ?: return AbortResponse("Not authenticated")

            optimoveIntClient.abortCustomerPromotion(
                PlatformAuxOptimoveIntegrationCommandApiProtos.AbortCustomerPromotionCommand.newBuilder()
                    .setCustomerPromotionId(body.customerPromotionId)
                    .build()
            )

            AbortResponse(null)
        } catch (e: Exception) {
            AbortResponse(e.message ?: e.toString())
        }
    }
}
