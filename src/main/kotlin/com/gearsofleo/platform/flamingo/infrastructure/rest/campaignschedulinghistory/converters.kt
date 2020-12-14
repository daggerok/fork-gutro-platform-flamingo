package com.gearsofleo.platform.flamingo.infrastructure.rest.campaignschedulinghistory

import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationApiProtos.ScheduledCustomerPromotionDTO
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationApiProtos.ScheduledCampaignDetailsDTO
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationApiProtos.ScheduledCampaignInfoDTO
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationQueryApiProtos.GetScheduledCampaignDetailsDocument
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationQueryApiProtos.GetScheduledCampaingsDocument

fun GetScheduledCampaingsDocument.toJson(): ScheduledCampaignsResponseJson =
    ScheduledCampaignsResponseJson(
        error = null,
        scheduledCampaigns = scheduledCampaignsList.map { it.toJson() }
    )

fun ScheduledCampaignInfoDTO.toJson(): ScheduledCampaignJson =
    ScheduledCampaignJson(
        if (hasCampaignId()) campaignId else null,
        if (hasCreateDate()) createDate else null,
        if (hasCampaignStatus()) campaignStatus else null,
        if (hasCustomerStatusCount()) customerStatusCount.entrySetList.map { entrySet -> entrySet.key to entrySet.value }.toMap() else null,
        scheduleDatesList,
        promotionIdsList
    )

fun GetScheduledCampaignDetailsDocument.toJson(): ScheduledCampaignDetailsResponseJson =
    ScheduledCampaignDetailsResponseJson(
        null,
        if(hasCampaign()) campaign.toJson() else null
    )


fun ScheduledCampaignDetailsDTO.toJson(): ScheduledCampaignDetailsJson =
    ScheduledCampaignDetailsJson(
        if(hasCampaignId()) campaignId else null,
        if(hasCreateDate()) createDate else null,
        if (hasState()) state else null,
        customerPromotionsList.map { it.toJson() }
    )

fun ScheduledCustomerPromotionDTO.toJson(): ScheduledCustomerPromotionDetailsJson =
    ScheduledCustomerPromotionDetailsJson(
        if (hasCustomerPromotionId()) customerPromotionId else null,
        if (hasCampaignId()) campaignId else null,
        if (hasPromotionId()) promotionId else null,
        if (hasPlayerId()) playerId else null,
        if (hasState()) state else null,
        if (hasCreateDate()) createDate else null,
        if (hasUpdateDate()) updateDate else null,
        if (hasScheduleDate()) scheduleDate else null,
        if (hasBrand()) brand else null,
        if (hasCurrency()) currency else null,
        if (hasAmount()) amount else null
    )