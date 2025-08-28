import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import CaseConverter from '.';

describe('CaseConverter', () => {
  test('converts text to uppercase when UPPERCASE option is selected', () => {
    render(<CaseConverter />);
    const input = screen.getByLabelText('Input text') as HTMLTextAreaElement;
    const uppercaseButton = screen.getByText('UPPERCASE');
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.click(uppercaseButton);
    const output = screen.getByLabelText('Output text') as HTMLTextAreaElement;
    expect(output.value).toBe('HELLO');
  });
});