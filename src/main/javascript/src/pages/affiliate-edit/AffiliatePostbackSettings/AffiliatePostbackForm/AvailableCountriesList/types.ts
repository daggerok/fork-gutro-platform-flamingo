import { Brand } from '~/types';

export type AvailableCountriesListProps = {
  selectedCountries: string[],
  selectedBrands: Brand[],
  onCountryToggled(iso: string): void,
};
