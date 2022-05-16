import { Alert, Button } from 'antd';
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import Flag from '~/components/Common/Flag';
import { isCountryUnavailable } from '~/pages/affiliate-edit/AffiliateBaseSettingsForm/utils';
import { Country } from '~/types';

import styles from './AvailableCountriesList.module.scss';
import { AvailableCountriesListProps } from './types';
import { getUniqueCountriesFromSelectedBrands } from './utils';

const AvailableCountriesList: React.FC<AvailableCountriesListProps> = ({
  selectedCountries,
  selectedBrands,
  onCountryToggled,
}: AvailableCountriesListProps) => {
  const [availableCountries, setAvailableCountries] = useState<Array<Country>>([]);

  useEffect(() => {
    const availableCountries =
      getUniqueCountriesFromSelectedBrands(selectedBrands);

    setAvailableCountries(availableCountries);
  }, [selectedBrands]);

  return (
    <>
      {availableCountries
        .filter((country: Country) => country.active)
        .sort((country) =>
          isCountryUnavailable(country, selectedBrands) ? 0 : -1
        )
        .map((country: Country) => {
          return (
            <Button
              className={styles.countryTag}
              key={country.iso}
              size="small"
              type={
                selectedCountries.includes(country.iso) ? 'primary' : 'ghost'
              }
              danger={isCountryUnavailable(country, selectedBrands)}
              onClick={(): void => onCountryToggled(country.iso)}
              data-testid={`country-button-${country.iso}`}
            >
              <Flag
                country={country.iso}
                isSmall
              />
              <span className={classnames(styles.countryIso)}>
                {country.iso}
              </span>
            </Button>
          );
        })}

      {!selectedCountries.length && (
        <Alert
          type="info"
          message="No selected country will enable this postback on all markets."
        />
      )}
    </>
  );
};

export default AvailableCountriesList;
