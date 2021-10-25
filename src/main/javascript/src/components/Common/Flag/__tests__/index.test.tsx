import React from 'react';
import { render, screen } from '@testing-library/react';

import Flag  from '..';

let component: any = null;

describe('<Flag />', () => {

  beforeAll(() => {
    render(<Flag country="mt"/>);
    component = screen.getByTestId('flag-component');
  });

  it('matches snapshot', () => {
    expect(component).toMatchSnapshot();
  });

  it('applies correct country class - malta', () => {
    expect(component).toHaveClass('flag-icon flag-icon-mt');
  });

  afterAll(() => {
    component.remove();
    component = null;
  });

});