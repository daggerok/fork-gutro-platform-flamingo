package com.gearsofleo.platform.flamingo.infrastructure.rest.brand

import com.gearsofleo.platform.aux.country.query.api.PlatformAuxCountryQueryApiProtos.GetBrandsDocument
import com.gearsofleo.platform.aux.country.query.api.PlatformAuxCountryQueryApiProtos.GetBrandsWithDetailsDocument

// GetBrandsDocument => JSON

fun GetBrandsDocument.toJson(): List<BrandJson> =
    brandsList.map { BrandJson(it.brand, it.label) }

// GetBrandsWithDetailsDocument => JSON

fun GetBrandsWithDetailsDocument.toJson(): List<BrandWithDetailsJson> =
    brandsWithDetailsList.map { b ->
        BrandWithDetailsJson(
            b.brand,
            b.label,
            b.countriesList.map { c ->
                CountryJson(
                    c.iso,
                    c.active
                )
            },
            b.linksList.map { l ->
                CountryCurrencyLanguageLinkJson(
                    l.countryIso,
                    l.currencyIsosList,
                    l.languageIsosList
                )
            }
        )
    }
