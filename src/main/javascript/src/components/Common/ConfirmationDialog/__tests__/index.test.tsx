import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import ConfirmationDialog  from '..';

let onOkClickSpy = jest.fn();
let onCancelClickSpy = jest.fn();

let component: any = null;

const BASE_PROPS = {
  onOkClick: onOkClickSpy,
  onCancelClick: onCancelClickSpy,
  title: 'A nice title',
  subTitle: 'A nicer subtitle',
}

describe('<ConfirmationDialog />', () => {

    beforeAll(() => {
      render(<ConfirmationDialog {...BASE_PROPS} />);
      component = screen.getByTestId('confirmation-dialog');
    });
  
    it('matches snapshot', () => {
      expect(component).toMatchSnapshot();
    });
  
    it('renders expected title', () => {
      const titleElem = component.getElementsByClassName('ant-result-title');
  
      expect(titleElem[0].innerHTML).toBe('A nice title');
    });
  
    it('renders expected subtitle', () => {
      const subtitleElem = component.getElementsByClassName('ant-result-subtitle');
  
      expect(subtitleElem[0].innerHTML).toBe('A nicer subtitle');
    });
  
    afterAll(() => {
      component.remove();
      component = null;
    });

  describe('handles button events', () => {

    it('calls onClick as expected', () => {
      render(<ConfirmationDialog { ...BASE_PROPS } />);
      const okButton = screen.getByTestId('confirmation-ok-button');
      userEvent.click(okButton);

      expect(onOkClickSpy).toHaveBeenCalledTimes(1);
      okButton.remove();
    });

    it('calls onCancel as expected', () => {
      render(<ConfirmationDialog { ...BASE_PROPS } />);
      const cancelButton = screen.getByTestId('confirmation-cancel-button');
      userEvent.click(cancelButton);

      expect(onCancelClickSpy).toHaveBeenCalledTimes(1);
      cancelButton.remove();
    });

  });

});