package com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions

import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.CreateAffiliateRequest
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.Error
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.Postback
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.Threshold
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.UpdateAffiliateRequest

// CreateAffiliateRequest

data class CreateAffiliateRequestBuilder(
    var affiliateId: String = "",
    var affiliateName: String = "",
    var enabled: Boolean = false,
    var operatorUIDs: List<String> = listOf(),
    var postbacks: List<Postback> = listOf(),
)

fun CreateAffiliateRequestBuilder.build(): CreateAffiliateRequest =
    CreateAffiliateRequest(affiliateId, affiliateName, enabled, operatorUIDs, postbacks)

/**
 * Usage:
 *
 *     <pre>
 *
 *         val request = CreateAffiliateRequest {
 *             affiliateId = "667788"
 *             affiliateName = "Some new affiliate"
 *             enabled = true
 *             operatorUIDs = listOf("111", "222")
 *             withPostback {
 *                 name = "Signup postback"
 *                 countries = listOf("IT", "SE")
 *                 marketingSourceIDs = listOf("333", "444")
 *                 url = "https://host-1.com/signup"
 *                 type = "signup"
 *                 withThreshold {
 *                     amount = 33.33
 *                     url = "https://host-39.com/depositThreshold"
 *                 }
 *             }
 *         }
 *
 *     </pre>
 */
fun CreateAffiliateRequest(block: CreateAffiliateRequestBuilder.() -> Unit): CreateAffiliateRequest =
    CreateAffiliateRequestBuilder().run {
        block(this)
        build()
    }

// UpdateAffiliateRequest

data class UpdateAffiliateRequestBuilder(
    var affiliateId: String = "",
    var affiliateName: String = "",
    var enabled: Boolean = false,
    var operatorUIDs: List<String> = listOf(),
    var postbacks: List<Postback> = listOf(),
)

fun UpdateAffiliateRequestBuilder.build(): UpdateAffiliateRequest =
    UpdateAffiliateRequest(affiliateId, affiliateName, enabled, operatorUIDs, postbacks)

/**
 * Usage:
 *
 *     <pre>
 *
 *         val request = UpdateAffiliateRequest {
 *             affiliateId = "..."
 *             affiliateName = "..."
 *             operatorUIDs = listOf("UID1", "UID2")
 *             // ...
 *         }
 *
 *     </pre>
 */
fun UpdateAffiliateRequest(block: UpdateAffiliateRequestBuilder.() -> Unit): UpdateAffiliateRequest =
    UpdateAffiliateRequestBuilder().run {
        block(this)
        build()
    }

// Postback

data class PostbackBuilder(
    var id: Long = -1,
    var name: String = "",
    var countries: List<String> = listOf(),
    var marketingSourceIDs: List<String> = listOf(),
    var type: String = "",
    var url: String = "",
    var thresholds: List<Threshold> = listOf(),
)

fun PostbackBuilder.build() =
    Postback(id, name, countries, marketingSourceIDs, type, url, thresholds)

/**
 * Usage:
 *
 *     <pre>
 *
 *         val postback = Postback {
 *             name = "..."
 *             countries = listOf("IT", "SE")
 *             // ...;
 *         }
 *
 *     </pre>
 */
fun Postback(block: PostbackBuilder.() -> Unit): Postback =
    PostbackBuilder().run {
        block(this)
        build()
    }

// Threshold

data class ThresholdBuilder(
    var url: String = "",
    var amount: Double = 0.0,
)

fun ThresholdBuilder.build() =
    Threshold(url, amount)

/**
 * Usage:
 *
 *     <pre>
 *
 *         val threshold = Threshold {
 *             amount = 0.50
 *             url = "..."
 *             // ...;
 *         }
 *
 *     </pre>
 */
fun Threshold(block: ThresholdBuilder.() -> Unit): Threshold =
    ThresholdBuilder().run {
        block(this)
        build()
    }

// Errors

data class ErrorBuilder(var code: Int = 0, var status: String = "", var message: String = "")

fun ErrorBuilder.build(): Error =
    Error(code, status, message)

/**
 * Usage:
 *
 *     <pre>
 *
 *         val error = Error {
 *             code = 400
 *             status = "Bad Request"
 *             messages = "..."
 *         }
 *
 *     </pre>
 */
fun Error(block: ErrorBuilder.() -> Unit = {}): Error =
    ErrorBuilder().run {
        block(this)
        build()
    }

// Adders

/**
 * Usage:
 *
 *     <pre>
 *
 *         withPostback {
 *             name = "Deposit threshold postback"
 *             // other postback properties
 *         }
 *
 *     </pre>
 */
fun CreateAffiliateRequestBuilder.withPostback(block: PostbackBuilder.() -> Unit = {}) = apply {
    postbacks += Postback { block(this) }
}

fun UpdateAffiliateRequestBuilder.withPostback(block: PostbackBuilder.() -> Unit = {}) = apply {
    postbacks += Postback { block(this) }
}

/**
 * Usage:
 *
 *     <pre>
 *
 *         withThreshold {
 *             amount = 33.33
 *             url = "https://host-39.com/depositThreshold"
 *         }
 *
 *     </pre>
 */
fun PostbackBuilder.withThreshold(block: ThresholdBuilder.() -> Unit = {}) = apply {
    thresholds += Threshold { block(this) }
}
