package com.gearsofleo.platform.flamingo.infrastructure.rest.brand

data class BrandJson(val brand: String?, val label: String?)

data class BrandWithDetailsJson(
    val brand: String?,
    val label: String?,
    val countries: List<CountryJson>,
    val links: List<CountryCurrencyLanguageLinkJson>
)

data class CountryJson(
    val iso: String,
    val active: Boolean
)

data class CountryCurrencyLanguageLinkJson(
    val countryIso: String,
    val currencyIsos: List<String>,
    val languageIsos: List<String>
)
