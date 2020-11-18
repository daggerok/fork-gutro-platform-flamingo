package com.gearsofleo.platform.flamingo.external

import com.gearsofleo.platform.flamingo.config.FeignConfiguration
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationCommandApiProtos.SchedulingCampaignWithPromotionsDocument
import com.gearsofleo.platform.aux.optimove.integration.api.PlatformAuxOptimoveIntegrationCommandApiProtos.SchedulingCampaignWithPromotionsCommand
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

}
