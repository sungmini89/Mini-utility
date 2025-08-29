import React from 'react';
import DiffChecker from '../components/DiffChecker';

/**
 * A wrapper page component for the DiffChecker.  Keeping pages separate
 * from components allows for better organisation and potential route‑based
 * code splitting in larger applications.
 */
const DiffCheckerPage: React.FC = () => {
  return <DiffChecker />;
};

export default DiffCheckerPage;