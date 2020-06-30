package com.gearsofleo.platform.flamingo.infrastructure.rest.campaignscheduling

import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationApiProtos.SchedulingPromotionDTO
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationCommandApiProtos.SchedulingCampaignWithPromotionsCommand

fun CampaignSchedulingCommandJson.toCommand(): SchedulingCampaignWithPromotionsCommand =
    SchedulingCampaignWithPromotionsCommand.newBuilder()
        .addAllSchedulingPromotions(schedulingPromotions.map { it.toDTO() })
        .setExternalId((Math.random() * 10000000).toLong())
        .build()

fun CampaignSchedulingRowJson.toDTO(): SchedulingPromotionDTO {
    val builder = SchedulingPromotionDTO.newBuilder()

    playerUid?.let { builder.setPlayerUid(it) }
    promotionUid?.let { builder.setPromotionUid(it) }
    scheduled?.let { builder.setScheduled(it) }

    return builder.build()
}
