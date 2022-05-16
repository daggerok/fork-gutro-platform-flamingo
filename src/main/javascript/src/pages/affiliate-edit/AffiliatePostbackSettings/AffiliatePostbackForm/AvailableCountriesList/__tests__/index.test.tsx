import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AvailableCountriesList from '../';
import { AvailableCountriesListProps } from '../types';

jest.mock('../../../../../../components/Common/Flag');

const mockedOnCountryToggled = jest.fn();

const mockedSECountry = {
  iso: "SE",
  active: true,
};

const mockedNOCountry = {
  iso: "NO",
  active: true,
};

const mockedBatmanCountry = {
  iso: "BATMAN",
  active: true,
};

const defaultProps: AvailableCountriesListProps = {
  selectedBrands: [
    {
      brand: "Gutro",
      label: "Gutro",
      countries: [mockedSECountry, mockedNOCountry],
    },
    {
      brand: "GoGo",
      label: "GoGo",
      countries: [mockedSECountry, mockedNOCountry],
    },
  ],
  selectedCountries: [],
  onCountryToggled: mockedOnCountryToggled,
};

describe("<AvailableCountriesList />", () => {
  beforeEach(() => {
    mockedOnCountryToggled.mockReset();
  });

  describe("renders correctly", () => {
    it("by default", () => {
      const { asFragment } = render(
        <AvailableCountriesList {...defaultProps} />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it("with selected countries", () => {
      const props: AvailableCountriesListProps = {
        ...defaultProps,
        selectedCountries: [mockedSECountry.iso],
      };
      const { asFragment } = render(<AvailableCountriesList {...props} />);

      expect(asFragment()).toMatchSnapshot();
    });

    it("with selected country that isn't in all brands", () => {
      const props: AvailableCountriesListProps = {
        ...defaultProps,
        selectedBrands: [
          {
            brand: "Gutro",
            label: "Gutro",
            countries: [mockedSECountry, mockedNOCountry, mockedBatmanCountry],
          },
          {
            brand: "GoGo",
            label: "GoGo",
            countries: [mockedSECountry, mockedNOCountry],
          },
        ],
        selectedCountries: [mockedBatmanCountry.iso],
      };
      const { asFragment } = render(<AvailableCountriesList {...props} />);

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("handles inputs", () => {
    it("when clicking on a country", () => {
      const { getByTestId } = render(
        <AvailableCountriesList {...defaultProps} />
      );

      userEvent.click(getByTestId("country-button-SE"), undefined);
      expect(mockedOnCountryToggled).toHaveBeenCalledWith(mockedSECountry.iso);
    });

    it("when clicking on a country that isn't in all brands", () => {
      const props: AvailableCountriesListProps = {
        ...defaultProps,
        selectedBrands: [
          {
            brand: "Gutro",
            label: "Gutro",
            countries: [mockedSECountry, mockedNOCountry, mockedBatmanCountry],
          },
          {
            brand: "GoGo",
            label: "GoGo",
            countries: [mockedSECountry, mockedNOCountry],
          },
        ],
        selectedCountries: [],
      };
      const { getByTestId } = render(
        <AvailableCountriesList {...props} />
      );

      userEvent.click(getByTestId("country-button-BATMAN"), undefined);
      expect(mockedOnCountryToggled).toHaveBeenCalledWith(mockedBatmanCountry.iso);
    });
  });
});
