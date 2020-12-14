package com.gearsofleo.platform.flamingo.infrastructure.rest.campaignschedulinghistory

data class ScheduledCampaignsResponseJson(
    val error: String? = null,
    val scheduledCampaigns: List<ScheduledCampaignJson> = emptyList()
)

data class ScheduledCampaignJson(
    val campaignId: String? = null,
    val createDate: Long? = null,
    val campaignStatus: String? = null,
    val customerStatusCount: Map<String, String>? = null,
    val scheduleDates: List<Long> = emptyList(),
    val promotionIds: List<String> = emptyList()
)

data class ScheduledCampaignDetailsResponseJson(
    val error: String? = null,
    val campaign: ScheduledCampaignDetailsJson? = null
)

data class ScheduledCampaignDetailsJson(
    val campaignId: String? = null,
    val createDate: Long? = null,
    val state: String? = null,
    val customerPromotions: List<ScheduledCustomerPromotionDetailsJson> = emptyList()
)

data class ScheduledCustomerPromotionDetailsJson(
    val customerPromotionId: String? = null,
    val campaignId: String? = null,
    val promotionId: String? = null,
    val playerId: String? = null,
    val state: String? = null,
    val createDate: Long? = null,
    val updateDate: Long? = null,
    val scheduleDate: Long? = null,
    val brand: String? = null,
    val currency: String? = null,
    val amount: String? = null
)
