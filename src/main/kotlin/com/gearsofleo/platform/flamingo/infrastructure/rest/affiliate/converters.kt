package com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate

import com.gearsofleo.platform.aux.affiliate.api.AffiliateApiProtos.AffiliateDTO
import com.gearsofleo.platform.aux.affiliate.api.AffiliateApiProtos.AffiliateDocument
import com.gearsofleo.platform.aux.affiliate.api.AffiliateApiProtos.AffiliatesDocument
import com.gearsofleo.platform.aux.affiliate.api.AffiliateApiProtos.PostbackDTO
import com.gearsofleo.platform.aux.affiliate.api.AffiliateApiProtos.ThresholdDTO
import com.gearsofleo.platform.aux.affiliate.api.AffiliateCommandApiProtos.CreateAffiliateCommand
import com.gearsofleo.platform.aux.affiliate.api.AffiliateCommandApiProtos.UpdateAffiliateCommand
import com.gearsofleo.platform.aux.affiliate.api.extensions.CreateAffiliateCommand
import com.gearsofleo.platform.aux.affiliate.api.extensions.PostbackDTO
import com.gearsofleo.platform.aux.affiliate.api.extensions.ThresholdDTO
import com.gearsofleo.platform.aux.affiliate.api.extensions.UpdateAffiliateCommand
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.Threshold
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset

fun CreateAffiliateRequest.toDTO(): CreateAffiliateCommand = let {
    CreateAffiliateCommand {
        affiliateId = it.affiliateId
        affiliateName = it.affiliateName
        enabled = it.enabled
        operatorUIDsBuilder.addAllOperatorUIDs(it.operatorUIDs)
        postbacksBuilder.addAllPostbackDTOs(it.postbacks.map { it.toDTO() })
    }
}

fun UpdateAffiliateRequest.toDTO(): UpdateAffiliateCommand = let {
    UpdateAffiliateCommand {
        affiliateId = it.affiliateId
        affiliateName = it.affiliateName
        enabled = it.enabled
        operatorUIDsBuilder.addAllOperatorUIDs(it.operatorUIDs)
        postbacksBuilder.addAllPostbackDTOs(it.postbacks.map { it.toDTO() })
    }
}

fun AffiliatesDocument.toJson(): List<Affiliate> =
    affiliateDTOsList.map { it.toJson() }

fun AffiliateDocument.toJson(): Affiliate =
    affiliateDTO.toJson()

fun AffiliateDTO.toJson(): Affiliate =
    Affiliate(
        affiliateId = affiliateId,
        affiliateName = affiliateName,
        createdTimestamp = createdTimestamp.toLocalDateTime(),
        updatedTimestamp = updatedTimestamp.toLocalDateTime(),
        enabled = enabled,
        operatorUIDs = operatorUIDs.operatorUIDsList.filter { it.isNotBlank() },
        postbacks = postbacks.postbackDTOsList.map { it.toJson() },
    )

fun PostbackDTO.toJson(): Postback =
    Postback(
        id = id,
        name = name,
        countries = countries.countriesList.filter { it.isNotBlank() },
        marketingSourceIDs = marketingSourceIDs.marketingSourceIDsList.filter { it.isNotBlank() },
        type = type,
        url = url,
        thresholds = thresholds.thresholdDTOsList.map { it.toJson() },
    )

fun Postback.toDTO(): PostbackDTO = let {
    PostbackDTO {
        id = it.id
        name = it.name
        countriesBuilder.addAllCountries(it.countries)
        marketingSourceIDsBuilder.addAllMarketingSourceIDs(it.marketingSourceIDs)
        type = it.type
        url = it.url
        thresholdsBuilder.addAllThresholdDTOs(it.thresholds.map { it.toDTO() })
    }
}

fun ThresholdDTO.toJson(): Threshold = let {
    Threshold {
        url = it.url
        amount = it.amount
    }
}

fun Threshold.toDTO(): ThresholdDTO = let {
    ThresholdDTO {
        url = it.url
        amount = it.amount
    }
}

fun Long.toLocalDateTime(): LocalDateTime =
    Instant.ofEpochSecond(this).atZone(ZoneOffset.UTC).toLocalDateTime()

fun String.toLocalDateTime(): LocalDateTime =
    LocalDateTime.parse(this)

fun LocalDateTime.toTimestamp(): Long =
    toEpochSecond(ZoneOffset.UTC)

fun String.toTimestamp(): Long =
    toLocalDateTime().toTimestamp()
