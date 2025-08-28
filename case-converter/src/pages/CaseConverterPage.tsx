import React from 'react';
import CaseConverter from '../components/CaseConverter';

/**
 * A simple wrapper page for the CaseConverter component.  Keeping pages
 * separate from components helps with route‑based code splitting and
 * organisation when multiple utilities are present.
 */
const CaseConverterPage: React.FC = () => {
  return <CaseConverter />;
};

export default CaseConverterPage;