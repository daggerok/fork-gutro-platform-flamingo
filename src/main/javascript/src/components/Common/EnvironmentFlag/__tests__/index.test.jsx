import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import EnvironmentFlag from '..';

jest.mock('./../../Flag', () => 'mock-flag');

let component = null;

describe('<EnvironmentFlag />', () => {

  beforeAll(() => {
    act(() => {
      component = mount(<EnvironmentFlag />)
    });
  });

  it('matches snapshot', () => {
    expect(component.html()).toMatchSnapshot()
  });

  afterAll(() => {
    component.remove();
    component = null;
  });

}); 


   