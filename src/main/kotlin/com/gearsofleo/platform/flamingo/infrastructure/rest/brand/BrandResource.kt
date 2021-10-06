package com.gearsofleo.platform.flamingo.infrastructure.rest.brand

import com.gearsofleo.platform.aux.country.feign.client.BrandQueryClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class BrandResource(private val countryClient: BrandQueryClient) {

    @GetMapping("/brand")
    fun all(): List<BrandJson> =
        countryClient.getBrands().toJson()

    @GetMapping("/brands-with-details")
    fun loadCountriesAndLinksByAllBrands(): List<BrandWithDetailsJson> =
        countryClient.getBrandsWithDetails().toJson()
}
