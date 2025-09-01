import React from 'react';
import PasswordGenerator from '../components/PasswordGenerator';

/**
 * Page component that renders the PasswordGenerator utility. This
 * indirection makes it easy to add additional pages in the future.
 */
const PasswordGeneratorPage: React.FC = () => {
  return <PasswordGenerator />;
};

export default PasswordGeneratorPage;