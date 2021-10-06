package com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonInclude.Include.NON_EMPTY
import java.time.LocalDateTime

// Requests

@JsonInclude(NON_EMPTY)
data class CreateAffiliateRequest @JsonCreator constructor(
    val affiliateId: String = "",
    val affiliateName: String = "",
    val enabled: Boolean = false,
    val operatorUIDs: List<String> = listOf(),
    val postbacks: List<Postback> = listOf(),
)

@JsonInclude(NON_EMPTY)
data class UpdateAffiliateRequest @JsonCreator constructor(
    val affiliateId: String = "",
    val affiliateName: String = "",
    val enabled: Boolean = false,
    val operatorUIDs: List<String> = listOf(),
    val postbacks: List<Postback> = listOf(),
)

// Pagination

@JsonInclude(NON_EMPTY)
data class Pageable @JsonCreator constructor(
    val page: Int = 1,
    val size: Int = 25,
    val sortBy: String = "createdTimestamp",
    val sortOrder: SortOrder = SortOrder.DESC,
)

enum class SortOrder {
    ASC,
    DESC,
}

// DTOs

@JsonInclude(NON_EMPTY)
data class Affiliate @JsonCreator constructor(
    val affiliateId: String = "",
    val affiliateName: String = "",
    val createdTimestamp: LocalDateTime? = null,
    val updatedTimestamp: LocalDateTime? = null,
    val enabled: Boolean = false,
    val operatorUIDs: List<String> = listOf(),
    val postbacks: List<Postback> = listOf(),
)

@JsonInclude(NON_EMPTY)
data class Postback @JsonCreator constructor(
    val id: Long = -1,
    val name: String = "",
    val countries: List<String> = listOf(),
    val marketingSourceIDs: List<String> = listOf(),
    val type: String = "",
    val url: String = "",
    val thresholds: List<Threshold> = listOf(),
)

@JsonInclude(NON_EMPTY)
data class Threshold @JsonCreator constructor(
    val url: String = "",
    val amount: Double = 0.0,
)

// Error

@JsonInclude(NON_EMPTY)
data class Error @JsonCreator constructor(
    val code: Int = -1,
    val status: String = "",
    val message: String = "",
)
