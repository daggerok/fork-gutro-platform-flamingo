import { Brand, Country } from '~/types';

import { UNAVAILABLE_COUNTRIES_ERROR } from './constants';

export const getSelectedBrandObjectFromOperatorUid = (operatorUid: string, brands: Brand[]): any => {
  return brands.find((brand: Brand) => brand.brand === operatorUid);
};

export const containsUnavailableCountries = (brand: Brand, countries: string[] | undefined): boolean => {
  const brandCountryIsos: Array<string> = brand.countries?.map(
    ({ iso }) => iso
  );

  if (countries) {
    const hasUnavailableCountry = countries.some((country) =>
      brandCountryIsos.every((iso: string) => country !== iso)
    );

    if (hasUnavailableCountry) {
      const unavailableIsos = countries.filter((country) =>
        brandCountryIsos.every((iso: string) => country !== iso)
      );

      throw new Error(`${UNAVAILABLE_COUNTRIES_ERROR} ${brand.label}: ${unavailableIsos.join(', ')}`);
    }
  }

  return false;
};

export const isCountryUnavailable = (country: Country, selectedBrands: Brand[]): boolean => {
  return selectedBrands
    .some(({ countries }) => countries
      .every((brandCountry) => brandCountry.iso !== country.iso));
};

export const unavailableCountries = (countries: Country[], selectedBrands: Brand[]): Country[] => {
  const unavailableCountries: Country[] = [];

  for (const country of (countries || [])) {
    if (isCountryUnavailable(country, selectedBrands) && unavailableCountries.every(c => c.iso !== country.iso)) {
      unavailableCountries.push(country);
    }
  }

  return unavailableCountries;
};

