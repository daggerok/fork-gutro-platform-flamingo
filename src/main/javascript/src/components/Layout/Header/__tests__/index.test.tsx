import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Header from '..';

jest.mock('./../../../Common/EnvironmentFlag', () => 'environment-flag');

describe('<Header />', () => {

  it('matches snapshot', () => {
    act(() => {
      render(<Header children />);
    });

    const component = screen.getByTestId('header');

    expect(component).toMatchSnapshot();
  });

  it('uses correct logo image src', () => {
    act(() => {
      render(<Header children />);
    });

    const logo = screen.getByTestId('header-logo');

    expect(logo.getAttribute('src')).toEqual('logo.png');
  });

  it('renders title', () => {
    act(() => {
      render(<Header children />);
    });
    
    const title = screen.getByTestId('header-title');

    expect(title.innerHTML).toEqual('Flamingo');
  });

});