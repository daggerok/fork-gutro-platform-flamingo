package com.gearsofleo.platform.flamingo.affiliate

import com.gearsofleo.platform.aux.affiliate.api.extensions.AffiliateDocument
import com.gearsofleo.platform.aux.affiliate.api.extensions.toCountries
import com.gearsofleo.platform.aux.affiliate.api.extensions.toMarketingSourceIDs
import com.gearsofleo.platform.aux.affiliate.api.extensions.toOperatorUIDs
import com.gearsofleo.platform.aux.affiliate.api.extensions.withAffiliate
import com.gearsofleo.platform.aux.affiliate.api.extensions.withPostback
import com.gearsofleo.platform.flamingo.infrastructure.UnitTest
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.CreateAffiliateRequest
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.Postback
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.UpdateAffiliateRequest
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.withPostback
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.withThreshold
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.toDTO
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.toJson
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.toLocalDateTime
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.toTimestamp
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test

@DisplayName("Converter extension functions tests")
class ExtensionFunctionsTests : UnitTest() {

    @Test
    fun `should convert json CreateAffiliateCommand to protobuf`() {
        // given
        val flamingoRequest = CreateAffiliateRequest(
            affiliateId = "667788",
            affiliateName = "Some new affiliate",
            enabled = true,
            operatorUIDs = listOf("uid1", "uid2", "uid3", "uid4"),
            postbacks = listOf(
                Postback(
                    name = "Signup postback",
                    countries = listOf("IT", "SE"),
                    marketingSourceIDs = listOf("id3", "id4"),
                    url = "https://host-1.com/signup",
                    type = "signup",
                ),
                Postback(
                    name = "Deposit postback",
                    countries = listOf("SE"),
                    url = "https://host-2.com/deposit",
                    type = "deposit",
                    marketingSourceIDs = listOf("id7", "id8")
                )
            )
        )

        // when
        val createAffiliateCommand = flamingoRequest.toDTO()

        // then
        assertThat(createAffiliateCommand.affiliateId).isEqualTo("667788")
        assertThat(createAffiliateCommand.affiliateName).isEqualTo("Some new affiliate")
        assertThat(createAffiliateCommand.enabled).isEqualTo(true)
        assertThat(createAffiliateCommand.operatorUIDs.operatorUIDsList)
            .contains("uid1", "uid2", "uid3", "uid4")

        // and
        val postbackDTOsList = createAffiliateCommand.postbacks.postbackDTOsList
        assertThat(postbackDTOsList).hasSize(2)

        // and
        val firstPostback = postbackDTOsList.first()
        assertThat(firstPostback.name).isEqualTo("Signup postback")
        assertThat(firstPostback.countries.countriesList).containsExactly("IT", "SE")
        assertThat(firstPostback.marketingSourceIDs.marketingSourceIDsList).contains("id3", "id4")
        assertThat(firstPostback.url).isEqualTo("https://host-1.com/signup")
        assertThat(firstPostback.type).isEqualTo("signup")

        // and
        val secondPostback = postbackDTOsList.last()
        assertThat(secondPostback.name).isEqualTo("Deposit postback")
        assertThat(secondPostback.countries.countriesList).containsExactly("SE")
        assertThat(secondPostback.marketingSourceIDs.marketingSourceIDsList).contains("id7", "id8")
        assertThat(secondPostback.url).isEqualTo("https://host-2.com/deposit")
        assertThat(secondPostback.type).isEqualTo("deposit")
    }

    @Test
    fun `should convert protobuf AffiliateDTO to Json`() {
        // given
        val affiliateDocument = AffiliateDocument {
            withAffiliate {
                affiliateId = "66253"
                affiliateName = "Gutro"
                enabled = true
                createdTimestamp = "2021-07-14T16:20:15".toTimestamp()
                updatedTimestamp = "2021-07-14T16:20:15".toTimestamp()
                operatorUIDs = "uid1,uid2".toOperatorUIDs()
                withPostback {
                    id = 123
                    name = "Signup postback"
                    countries = "IT,SE".toCountries()
                    marketingSourceIDs = "id3,id4".toMarketingSourceIDs()
                    url = "https://host-2.com/signup"
                    type = "signup"
                }
            }
        }

        // when
        val affiliate = affiliateDocument.toJson()

        // then
        assertThat(affiliate.affiliateId).isEqualTo("66253")
        assertThat(affiliate.affiliateName).isEqualTo("Gutro")
        assertThat(affiliate.enabled).isEqualTo(true)
        assertThat(affiliate.createdTimestamp).isEqualTo("2021-07-14T16:20:15".toLocalDateTime())
        assertThat(affiliate.operatorUIDs).hasSize(2)
        assertThat(affiliate.operatorUIDs).containsExactly("uid1", "uid2")

        // and
        assertThat(affiliate.postbacks).hasSize(1)
        val postback = affiliate.postbacks.first()
        assertThat(postback.id).isEqualTo(123)
        assertThat(postback.name).isEqualTo("Signup postback")
        assertThat(postback.countries).hasSize(2)
        assertThat(postback.countries).containsExactly("IT", "SE")
        assertThat(postback.marketingSourceIDs).hasSize(2)
        assertThat(postback.marketingSourceIDs).containsExactly("id3", "id4")
        assertThat(postback.url).isEqualTo("https://host-2.com/signup")
        assertThat(postback.type).isEqualTo("signup")
    }

    @Test
    fun `should convert flamingo update affiliate request to update affiliate command`() {
        // given
        val flamingoUpdateAffiliateRequest = UpdateAffiliateRequest {
            affiliateId = "667788"
            affiliateName = "Updated affiliate"
            enabled = true
            operatorUIDs = listOf("111", "222", "555", "777")
            withPostback {
                id = 0
                name = "Signup postback"
                countries = listOf("IT", "SE")
                marketingSourceIDs = listOf("333", "444")
                url = "https://host-updated.com/signup"
                type = "signup"
            }
            withPostback {
                id = 1
                url = "https://"
                countries = listOf("SE")
                marketingSourceIDs = listOf("888", "999")
                type = "depositThreshold"
                withThreshold {
                    url = "https://host-30.com/depositThreshold"
                    amount = 30.30
                }
                withThreshold {
                    url = "https://host-39.com/depositThreshold"
                    amount = 33.33
                }
            }
        }

        // when
        val updateAffiliateCommand = flamingoUpdateAffiliateRequest.toDTO()

        // then
        assertThat(updateAffiliateCommand.affiliateId).isEqualTo("667788")
        assertThat(updateAffiliateCommand.affiliateName).isEqualTo("Updated affiliate")
        assertThat(updateAffiliateCommand.enabled).isTrue
        assertThat(updateAffiliateCommand.operatorUIDs.operatorUIDsList)
            .containsExactly("111", "222", "555", "777")

        // and
        val postbackDTOsList = updateAffiliateCommand.postbacks.postbackDTOsList
        assertThat(postbackDTOsList).hasSize(2)

        // and
        val firstPostbackDTO = postbackDTOsList.first()
        assertThat(firstPostbackDTO.id).isEqualTo(0)
        assertThat(firstPostbackDTO.name).isEqualTo("Signup postback")
        assertThat(firstPostbackDTO.countries.countriesList).containsExactly("IT", "SE")
        assertThat(firstPostbackDTO.marketingSourceIDs.marketingSourceIDsList).containsExactly("333", "444")
        assertThat(firstPostbackDTO.url).isEqualTo("https://host-updated.com/signup")
        assertThat(firstPostbackDTO.type).isEqualTo("signup")
        assertThat(firstPostbackDTO.thresholds.thresholdDTOsList).hasSize(0)

        // and
        val secondPostbackDTO = postbackDTOsList.last()
        assertThat(secondPostbackDTO.id).isEqualTo(1)
        assertThat(secondPostbackDTO.countries.countriesList).containsExactly("SE")
        assertThat(secondPostbackDTO.marketingSourceIDs.marketingSourceIDsList).containsExactly("888", "999")
        assertThat(secondPostbackDTO.url).isEqualTo("https://")
        assertThat(secondPostbackDTO.type).isEqualTo("depositThreshold")
        assertThat(secondPostbackDTO.thresholds.thresholdDTOsList).hasSize(2)

        // and
        val firstThreshold = secondPostbackDTO.thresholds.thresholdDTOsList.first()
        assertThat(firstThreshold.url).isEqualTo("https://host-30.com/depositThreshold")
        assertThat(firstThreshold.amount).isEqualTo(30.30)

        // and
        val secondThreshold = secondPostbackDTO.thresholds.thresholdDTOsList.last()
        assertThat(secondThreshold.url).isEqualTo("https://host-39.com/depositThreshold")
        assertThat(secondThreshold.amount).isEqualTo(33.33)
    }
}
