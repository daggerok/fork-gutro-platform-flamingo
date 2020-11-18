package com.gearsofleo.platform.flamingo.infrastructure.rest.campaignschedulinghistory

import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationApiProtos.ScheduledCampaignInfoDTO
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
