package com.gearsofleo.platform.flamingo.external

import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationCommandApiProtos.AbortCampaignDocument
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationCommandApiProtos.AbortCampaignCommand
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationCommandApiProtos.AbortCustomerPromotionDocument
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationCommandApiProtos.AbortCustomerPromotionCommand
import com.gearsofleo.platform.flamingo.config.FeignConfiguration
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationCommandApiProtos.SchedulingCampaignWithPromotionsDocument
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationCommandApiProtos.SchedulingCampaignWithPromotionsCommand
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationQueryApiProtos.GetScheduledCampaignDetailsDocument
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationQueryApiProtos.GetScheduledCampaignDetailsQuery
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationQueryApiProtos.GetScheduledCampaingsQuery
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationQueryApiProtos.GetScheduledCampaingsDocument
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod

@FeignClient("optimove-integration", path = "/optimove-integration/api/", configuration = [(FeignConfiguration::class)])
interface OptimoveIntClient {
    @RequestMapping(
        path = ["promotion/scheduling"],
        method = [(RequestMethod.POST)],
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun createSchedulingCampaignWithPromotions(cmd: SchedulingCampaignWithPromotionsCommand): SchedulingCampaignWithPromotionsDocument

    @RequestMapping(
        path = ["promotion/scheduling/history"],
        method = [(RequestMethod.POST)],
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun getScheduledCampaigns(cmd: GetScheduledCampaingsQuery): GetScheduledCampaingsDocument

    @RequestMapping(
        path = ["promotion/scheduling/campaign-details"],
        method = [(RequestMethod.POST)],
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun getCampaignDetails(query: GetScheduledCampaignDetailsQuery): GetScheduledCampaignDetailsDocument

    @RequestMapping(
        path = ["promotion/scheduling/abort-customer-promotion"],
        method = [(RequestMethod.POST)],
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun abortCustomerPromotion(cmd: AbortCustomerPromotionCommand): AbortCustomerPromotionDocument

    @RequestMapping(
        path = ["promotion/scheduling/abort-campaign"],
        method = [(RequestMethod.POST)],
        consumes = ["application/x-protobuf"],
        produces = ["application/x-protobuf"]
    )
    fun abortCampaign(cmd: AbortCampaignCommand): AbortCampaignDocument

}
