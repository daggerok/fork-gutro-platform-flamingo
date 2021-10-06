package com.gearsofleo.platform.flamingo.affiliate

import com.gearsofleo.platform.aux.affiliate.api.exceptions.AffiliateAlreadyExistException
import com.gearsofleo.platform.aux.affiliate.api.exceptions.AffiliateNotFoundException
import com.gearsofleo.platform.flamingo.infrastructure.IntegrationTest
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.AffiliateResource
import com.gearsofleo.rhino.core.exception.InvalidValueException
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Tag
import org.junit.jupiter.api.Tags
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.fail
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus.BAD_REQUEST
import org.springframework.http.HttpStatus.CONFLICT
import org.springframework.http.HttpStatus.NOT_FOUND

/**
 * See: com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.AffiliateResource#errorHandler
 */
@DisplayName("Affiliate exception handler tests")
@Suppress("SpringJavaInjectionPointsAutowiringInspection")
class AffiliateExceptionHandlerTests(@Autowired val affiliateResource: AffiliateResource) : IntegrationTest() {

    @Test
    @Tags(Tag("RET-14229"), Tag("RET-14230"))
    fun `should handle affiliate already exist exception`() {
        // given
        val exception = AffiliateAlreadyExistException("660721")

        // when
        val response = affiliateResource.errorHandler(exception)

        // then
        assertThat(response.statusCode).isEqualTo(CONFLICT)

        // and
        val message = response.body?.message ?: fail("Message should not be null")
        assertThat(message).contains("Affiliate(660721) already exist")
    }

    @Test
    fun `should handle affiliate not found exception`() {
        // given
        val exception = AffiliateNotFoundException("3325")

        // when
        val response = affiliateResource.errorHandler(exception)

        // then
        assertThat(response.statusCode).isEqualTo(NOT_FOUND)

        // and
        val message = response.body?.message ?: fail("Message should not be null")
        assertThat(message).contains("Affiliate(3325) not found")
    }

    @Test
    fun `should handle unexpected error exception`() {
        // given
        val exception = InvalidValueException("wrong affiliate")

        // when
        val response = affiliateResource.errorHandler(exception)

        // then
        assertThat(response.statusCode).isEqualTo(BAD_REQUEST)

        // and
        val message = response.body?.message ?: fail("Message should not be null")
        assertThat(message).contains("wrong affiliate")
    }
}
