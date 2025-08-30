import React from 'react';
import LoremGenerator from '../components/LoremGenerator';

/**
 * Wrapper page for the LoremGenerator component.  Keeping it separate
 * facilitates future route‑based code splitting and organization.
 */
const LoremGeneratorPage: React.FC = () => {
  return <LoremGenerator />;
};

export default LoremGeneratorPage;