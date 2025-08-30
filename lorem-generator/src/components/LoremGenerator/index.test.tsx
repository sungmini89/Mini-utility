import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import LoremGenerator from '.';

// Tests for the LoremGenerator component.  Ensure that clicking
// generate produces output and updates the history list.  Uses
// asynchronous assertions because the toast is displayed after the
// generation completes.
describe('LoremGenerator', () => {
  test('generates lorem and updates history on generate button click', async () => {
    render(<LoremGenerator />);
    const generateButton = screen.getByText('Generate');
    fireEvent.click(generateButton);
    // The toast should appear confirming generation succeeded
    await waitFor(() => {
      expect(screen.getByText('Lorem generated')).toBeInTheDocument();
    });
    // The history list should no longer show the empty state
    expect(screen.queryByText('No history yet.')).not.toBeInTheDocument();
  });
});