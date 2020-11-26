package com.gearsofleo.platform.flamingo.infrastructure.rest.campaignscheduling

import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationApiProtos.SchedulingPromotionDTO
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationCommandApiProtos.SchedulingCampaignWithPromotionsCommand
import kotlin.math.abs

fun CampaignSchedulingCommandJson.toCommand(): SchedulingCampaignWithPromotionsCommand =
    SchedulingCampaignWithPromotionsCommand.newBuilder()
        .addAllSchedulingPromotions(schedulingPromotions.map { it.toDTO() })
        .setExternalId(getExternalIdFromScheduleListHash(schedulingPromotions))
        .build()

fun CampaignSchedulingRowJson.toDTO(): SchedulingPromotionDTO {
    val builder = SchedulingPromotionDTO.newBuilder()

    playerUid?.let { builder.setPlayerUid(it) }
    promotionUid?.let { builder.setPromotionUid(it) }
    scheduled?.let { builder.setScheduled(it) }
    amount?.let { builder.setAmount(it) }

    return builder.build()
}

fun getExternalIdFromScheduleListHash (list: List<CampaignSchedulingRowJson>) : Long {
    return abs(
        list.map { Pair(it.playerUid, it.promotionUid) }.toString().hashCode()
    ).toLong()
}