import React from "react";
import { AffiliateContext } from "~/components/Affiliate/AffiliateContextProvider";

import { fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AffiliateBaseSettingsFormProps from "../";

const mockedSetCurrentAffiliate = jest.fn();
const mockedSetSelectedBrands = jest.fn();

const mockedCurrentAffiliate = (props?: any) => ({
  affiliateId: "1337",
  enabled: true,
  affiliateName: "I am Batman",
  createdTimestamp: "2021-11-30T10:10:17",
  updatedTimestamp: "2022-05-02T07:42:56",
  operatorUIDs: ["Gutro", "GoGoCasino"],
  postbacks: [],
  ...props,
});

const getDefaultContext: any = (currentAffiliateProps) => ({
  value: {
    currentAffiliate: mockedCurrentAffiliate(currentAffiliateProps),
    brands: [
      {
        brand: "Gutro",
        label: "Gutro",
        countries: [
          {
            iso: "SE",
          },
          {
            iso: "FI",
          },
        ],
      },
      {
        brand: "GoGoCasino",
        label: "GoGoCasino",
        countries: [
          {
            iso: "DK",
          },
          {
            iso: "DE",
          },
        ],
      },
      {
        brand: "LiveCasino",
        label: "LiveCasino",
        countries: [
          {
            iso: "NO",
          },
        ],
      },
    ],
    setCurrentAffiliate: mockedSetCurrentAffiliate,
    setSelectedBrands: mockedSetSelectedBrands,
  },
});

describe("<AffiliateBaseSettingsFormProps />", () => {
  beforeEach(() => {
    mockedSetSelectedBrands.mockReset();
    mockedSetCurrentAffiliate.mockReset();
  });

  describe("renders correctly ", () => {
    it("by default", () => {
      const { asFragment, getByTestId } = render(
        <AffiliateContext.Provider {...getDefaultContext()}>
          <AffiliateBaseSettingsFormProps hasEditRights />
        </AffiliateContext.Provider>
      );

      expect(getByTestId("affiliate-id")).not.toBeEnabled();
      expect(asFragment()).toMatchSnapshot();
    });

    it("without any edit rights", () => {
      const { asFragment, getByTestId } = render(
        <AffiliateContext.Provider {...getDefaultContext()}>
          <AffiliateBaseSettingsFormProps hasEditRights={false} />
        </AffiliateContext.Provider>
      );

      expect(getByTestId("affiliate-id")).not.toBeEnabled();
      expect(getByTestId("affiliate-name")).not.toBeEnabled();
      expect(asFragment()).toMatchSnapshot();
    });

    it("when it's not saved", () => {
      const { asFragment, getByTestId } = render(
        <AffiliateContext.Provider
          {...getDefaultContext({
            affiliateId: null,
            createdTimestamp: null,
            updatedTimestamp: null,
            operatorUIDs: [],
            enabled: false,
          })}
        >
          <AffiliateBaseSettingsFormProps hasEditRights />
        </AffiliateContext.Provider>
      );

      expect(getByTestId("affiliate-id")).toBeEnabled();
      expect(asFragment()).toMatchSnapshot();
    });

    it("when saved but not edited", () => {
      const { asFragment } = render(
        <AffiliateContext.Provider
          {...getDefaultContext({
            updatedTimestamp: null,
          })}
        >
          <AffiliateBaseSettingsFormProps hasEditRights />
        </AffiliateContext.Provider>
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("handles inputs", () => {
    it("when changing name", () => {
      const { getByTestId } = render(
        <AffiliateContext.Provider {...getDefaultContext()}>
          <AffiliateBaseSettingsFormProps hasEditRights />
        </AffiliateContext.Provider>
      );

      const inputField = getByTestId("affiliate-name");
      const inputValue = "I am Bethoven";
      const currentAffiliate = mockedCurrentAffiliate();

      expect(getByTestId("affiliate-name")).toHaveValue(
        currentAffiliate.affiliateName
      );

      fireEvent.change(inputField, { target: { value: inputValue } });

      expect(getByTestId("affiliate-name")).toHaveValue(inputValue);
      expect(mockedSetCurrentAffiliate).toHaveBeenCalledTimes(1);
      expect(mockedSetCurrentAffiliate).toHaveBeenCalledWith({
        ...currentAffiliate,
        affiliateName: inputValue,
      });
    });

    it("when changing id", () => {
      const { getByTestId } = render(
        <AffiliateContext.Provider {...getDefaultContext()}>
          <AffiliateBaseSettingsFormProps hasEditRights />
        </AffiliateContext.Provider>
      );

      const inputField = getByTestId("affiliate-id");
      const inputValue = "SCHOOPDAWOOP";
      const currentAffiliate = mockedCurrentAffiliate();

      expect(getByTestId("affiliate-id")).toHaveValue(
        currentAffiliate.affiliateId
      );

      fireEvent.change(inputField, { target: { value: inputValue } });

      expect(getByTestId("affiliate-id")).toHaveValue(inputValue);
      expect(mockedSetCurrentAffiliate).toHaveBeenCalledTimes(1);
      expect(mockedSetCurrentAffiliate).toHaveBeenCalledWith({
        ...currentAffiliate,
        affiliateId: inputValue,
      });
    });

    it("when adding a brand", async () => {
      const { getByTestId } = render(
        <AffiliateContext.Provider
          {...getDefaultContext({
            operatorUIDs: [],
          })}
        >
          <AffiliateBaseSettingsFormProps hasEditRights />
        </AffiliateContext.Provider>
      );

      const currentAffiliate = mockedCurrentAffiliate();

      const selectElement: any = getByTestId(
        "affiliate-brand-select"
      ).firstElementChild;
      fireEvent.mouseDown(selectElement);

      waitFor(() => {
        expect(getByTestId("select-brand-Gutro")).toBeInTheDocument();
      });

      const brandOption = getByTestId("select-brand-Gutro");

      userEvent.click(brandOption, undefined);

      expect(mockedSetCurrentAffiliate).toHaveBeenCalledTimes(1);
      expect(mockedSetCurrentAffiliate).toHaveBeenCalledWith({
        ...currentAffiliate,
        operatorUIDs: ["Gutro"],
      });
    });

    it("when adding and removing brands", async () => {
      const { getByTestId } = render(
        <AffiliateContext.Provider
          {...getDefaultContext({
            operatorUIDs: ["Gutro"],
          })}
        >
          <AffiliateBaseSettingsFormProps hasEditRights />
        </AffiliateContext.Provider>
      );

      const currentAffiliate = mockedCurrentAffiliate();

      const selectElement: any = getByTestId(
        "affiliate-brand-select"
      ).firstElementChild;
      fireEvent.mouseDown(selectElement);

      waitFor(() => {
        expect(getByTestId("select-brand-GoGoCasino")).toBeInTheDocument();
      });

      userEvent.click(getByTestId("select-brand-GoGoCasino"), undefined);
      fireEvent.mouseDown(selectElement);

      waitFor(() => {
        expect(getByTestId("select-brand-Gutro")).toBeInTheDocument();
      });

      userEvent.click(getByTestId("select-brand-Gutro"), undefined);

      expect(mockedSetCurrentAffiliate).toHaveBeenCalledTimes(2);
      expect(mockedSetCurrentAffiliate).toHaveBeenNthCalledWith(1, {
        ...currentAffiliate,
        operatorUIDs: ["Gutro", "GoGoCasino"],
      });

      expect(mockedSetCurrentAffiliate).toHaveBeenNthCalledWith(2, {
        ...currentAffiliate,
        operatorUIDs: ["GoGoCasino"],
      });
    });
  });
});
