package com.gearsofleo.platform.flamingo.infrastructure.rest.campaignscheduling

data class CampaignSchedulingCommandJson(
    val schedulingPromotions: List<CampaignSchedulingRowJson> = emptyList()
)

data class CampaignSchedulingRowJson(
    val playerUid: String? = null,
    val promotionUid: String? = null,
    val scheduled: String? = null,
    val amount: String? = null
)

data class CampaignSchedulingResponseJson(val error: String?)
