package com.gearsofleo.platform.flamingo.infrastructure.rest.campaignschedulinghistory

import com.gearsofleo.rhino.core.api.RhinoCoreApiProtos

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
