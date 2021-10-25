import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import LogoutButton from '..';

let component: any = null;

jest.mock('./../../../Common/EnvironmentFlag', () => 'environment-flag');

describe('<LogoutButton />', () => {

  it('matches snapshot', () => {

    act(() => {
      component = mount(<LogoutButton />);
    });
    
    expect(component.html()).toMatchSnapshot();
  });

});