import { Brand, Country } from '~/types';

export const getUniqueCountriesFromSelectedBrands = (selectedBrands: Brand[]): Country[] => {
  const availableCountries: Country[] = [];

  (selectedBrands || [])
    .filter(Boolean)
    .forEach(({ countries }) => {
      (countries || []).forEach((country) => {

        if (!availableCountries.some(({ iso }) => country.iso === iso)) {
          availableCountries.push(country);
        }
      });
    });

  return availableCountries;
};
