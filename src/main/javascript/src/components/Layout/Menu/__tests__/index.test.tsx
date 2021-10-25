import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import Menu  from '..';

jest.mock('./../../../../utils/role-check', () => ({
  hasRole: jest.fn().mockImplementation(() => true),
}));

let component: any = null;

describe('<Menu />', () => {

  beforeAll(() => {
    act(() => {
      render(<Menu />);
      component = screen.getByTestId('main-menu');
    });
  })

  afterAll(() => {
    component.remove();
    component = null;
  });

  it('matches snapshot', () => {
    expect(component).toMatchSnapshot();
  });

});