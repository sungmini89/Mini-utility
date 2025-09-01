import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import PasswordStrength from '.';

describe('PasswordStrength', () => {
  test('shows password input field', () => {
    render(<PasswordStrength />);
    expect(screen.getByLabelText(/Enter Password/i)).toBeInTheDocument();
  });

  test('shows strength analysis when password is entered', () => {
    render(<PasswordStrength />);
    const input = screen.getByLabelText(/Enter Password/i);
    fireEvent.change(input, { target: { value: 'TestPassword123!' } });
    expect(screen.getByText(/Strength Level/i)).toBeInTheDocument();
  });

  test('shows password tips section', () => {
    render(<PasswordStrength />);
    expect(screen.getByText(/Password Tips/i)).toBeInTheDocument();
  });
});

