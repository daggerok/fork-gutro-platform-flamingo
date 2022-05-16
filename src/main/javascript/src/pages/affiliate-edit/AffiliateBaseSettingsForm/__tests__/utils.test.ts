import { Brand, Country } from '~/types';
import { UNAVAILABLE_COUNTRIES_ERROR } from '../constants';
import { containsUnavailableCountries, isCountryUnavailable, unavailableCountries } from '../utils';

const gutroBrand: Brand = {
  brand: 'Gutro',
  label: 'Gutro',
  countries: [{
    iso: "SE",
    active: true
  },
  {
    iso: "FI",
    active: false
  },
  {
    iso: "JL",
    active: false
  }]
};

const batmanBrand: Brand = {
  brand: 'batman',
  label: 'batman',
  countries: [{
    iso: "SE",
    active: true
  },
  {
    iso: "NO",
    active: true
  }]
};

const selectedBrands: Brand[] = [
  gutroBrand,
  batmanBrand,
];


describe("containsUnavailableCountries", () => {
  it("should throw when postback has missing country", () => {
    try {
      containsUnavailableCountries(gutroBrand,
        ["SE", "DE"]
      )
    } catch (e: any) {
      expect(e.message).toBe(`${UNAVAILABLE_COUNTRIES_ERROR} ${gutroBrand.label}: DE`);
    }
  });

  it("should throw and build message correctly", () => {
    try {
      containsUnavailableCountries(gutroBrand, ["HAHA", "I", "AM", "BATMAN"])
    } catch (e: any) {
      expect(e.message).toBe(`${UNAVAILABLE_COUNTRIES_ERROR} ${gutroBrand.label}: HAHA, I, AM, BATMAN`);
    }
  });

  it("should not throw when all countries are available", () => {
    expect(containsUnavailableCountries(gutroBrand, ["SE", "FI", "JL"])).toBe(false);
  });

  it("should not throw when postback is missing some countries the brand has", () => {
    expect(containsUnavailableCountries(gutroBrand, ["SE"])).toBe(false);
  });
});

describe("isCountryUnavailable", () => {
  it("should give expected result", () => {
    [
      {
        country: { iso: 'SE', active: true },
        expected: false,
      },
      {
        country: { iso: 'NO', active: true },
        expected: true,
      },
      {
        country: { iso: 'DK', active: true },
        expected: true,
      }
    ].forEach(({ country, expected }) => expect(isCountryUnavailable(country, selectedBrands)).toBe(expected))
  });
});

describe("unavailableCountries", () => {
  it("should return missing countries when one brand is missing the input country", () => {
    const countries = [{
      iso: "SE",
      active: true
    },
    {
      iso: "NO",
      active: true
    }];

    expect(unavailableCountries(countries, selectedBrands)).toEqual([{
      iso: "NO",
      active: true
    }])
  });

  it("should only return a missing country once", () => {
    const countries = [{
      iso: "SE",
      active: true
    },
    {
      iso: "NO",
      active: true
    },
    {
      iso: "NO",
      active: true
    }];

    expect(unavailableCountries(countries, selectedBrands)).toEqual([{
      iso: "NO",
      active: true
    }])
  });

  it("should not return any countries when all countries are accounted for", () => {
    const countries = [{
      iso: "SE",
      active: true
    }];

    expect(unavailableCountries(countries, selectedBrands)).toEqual([])
  });

  it("should not return any countries", () => {
    expect(unavailableCountries([], selectedBrands)).toEqual([])
  });
});