package com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate

import com.gearsofleo.platform.aux.affiliate.api.AffiliatePaginationApiProtos.SortOrder.valueOf
import com.gearsofleo.platform.aux.affiliate.api.client.AffiliateClient
import com.gearsofleo.platform.aux.affiliate.api.client.extensions.deleteAffiliateById
import com.gearsofleo.platform.aux.affiliate.api.client.extensions.getAffiliateById
import com.gearsofleo.platform.aux.affiliate.api.client.extensions.getAffiliates
import com.gearsofleo.platform.aux.affiliate.api.client.extensions.searchAffiliates
import com.gearsofleo.platform.aux.affiliate.api.exceptions.AffiliateAlreadyExistException
import com.gearsofleo.platform.aux.affiliate.api.exceptions.AffiliateNotFoundException
import com.gearsofleo.platform.aux.affiliate.api.extensions.page
import com.gearsofleo.platform.flamingo.infrastructure.rest.affiliate.extensions.Error
import org.apache.logging.log4j.kotlin.logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatus.BAD_REQUEST
import org.springframework.http.HttpStatus.CONFLICT
import org.springframework.http.HttpStatus.NOT_FOUND
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/affiliate")
class AffiliateResource(@Autowired val affiliateClient: AffiliateClient) {

    @PostMapping("/create-affiliate")
    @ResponseStatus(HttpStatus.CREATED)
    fun createAffiliate(@RequestBody body: CreateAffiliateRequest) =
        affiliateClient
            .createAffiliate(body.toDTO())
            .toJson()

    @PutMapping("/update-affiliate")
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun updateAffiliate(@RequestBody body: UpdateAffiliateRequest) =
        affiliateClient
            .updateAffiliate(body.toDTO())
            .toJson()

    @GetMapping("/{affiliateId}")
    @ResponseStatus(HttpStatus.OK)
    fun getAffiliateById(@PathVariable("affiliateId") id: String) =
        affiliateClient
            .getAffiliateById { affiliateId = id }
            .toJson()

    @GetMapping(path = ["", "/"])
    @ResponseStatus(HttpStatus.OK)
    fun searchAffiliates(
        @RequestParam(name = "status", defaultValue = "") statusParam: String,
        @RequestParam(name = "text", defaultValue = "") textParam: String,
        paginationParams: Pageable,
    ): List<Affiliate> = when {
        statusParam.isBlank() and textParam.isBlank() ->
            affiliateClient
                .getAffiliates {
                    page {
                        number = paginationParams.page
                        size = paginationParams.size
                        sortBy = paginationParams.sortBy
                        sortOrder = valueOf(paginationParams.sortOrder.name)
                    }
                }
                .toJson()
        else ->
            affiliateClient
                .searchAffiliates {
                    text = textParam
                    status = statusParam
                    page {
                        number = paginationParams.page
                        size = paginationParams.size
                        sortBy = paginationParams.sortBy
                        sortOrder = valueOf(paginationParams.sortOrder.name)
                    }

                }
                .toJson()
    }

    @DeleteMapping("/{affiliateId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteAffiliateById(@PathVariable("affiliateId") id: String) =
        affiliateClient
            .deleteAffiliateById { affiliateId = id }

    @ExceptionHandler(Throwable::class)
    fun errorHandler(e: Throwable): ResponseEntity<Error> = e.run {
        val httpStatus = when (e) {
            is AffiliateAlreadyExistException -> CONFLICT
            is AffiliateNotFoundException -> NOT_FOUND
            else -> BAD_REQUEST
        }
        val error = Error {
            code = httpStatus.value()
            status = httpStatus.reasonPhrase
            message = e.message ?: "Unexpected error"
        }
        logger().warn { "$error has been converted from $e" }
        ResponseEntity.status(httpStatus).body(error)
    }
}
