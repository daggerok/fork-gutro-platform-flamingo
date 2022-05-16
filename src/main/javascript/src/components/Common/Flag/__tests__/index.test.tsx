import React from "react";
import { render, screen } from "@testing-library/react";

import Flag from "..";

let component: any = null;

describe("<Flag />", () => {
  it("by default", () => {
    const { asFragment } = render(<Flag country="mt" />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("without countrry", () => {
    const { asFragment } = render(<Flag country={""} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("with small size", () => {
    const { asFragment } = render(<Flag country={"SE"} isSmall />);

    expect(asFragment()).toMatchSnapshot();
  });
});
