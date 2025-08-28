import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import CharacterCounter from '.';

describe('CharacterCounter', () => {
  test('updates statistics when text changes', () => {
    render(<CharacterCounter />);
    const textarea = screen.getByLabelText(/Text input area/i) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    // Characters (with spaces) should be 11 for "Hello world".
    expect(screen.getByText('Characters (with spaces)')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
    // Word count should be 2.
    expect(screen.getByText('Words')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});