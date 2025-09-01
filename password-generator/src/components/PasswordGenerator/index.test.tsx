import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import PasswordGenerator from '.';

describe('PasswordGenerator', () => {
  test('generates a password when clicking generate with default options', () => {
    render(<PasswordGenerator />);
    // At first there should be no generated passwords
    expect(screen.getByText(/No passwords generated yet/i)).toBeInTheDocument();
    const generateButton = screen.getByText(/Generate/i);
    fireEvent.click(generateButton);
    // Expect at least one password code element to appear
    const codes = screen.queryAllByText((content, element) => element?.tagName.toLowerCase() === 'code');
    expect(codes.length).toBeGreaterThanOrEqual(1);
  });
});