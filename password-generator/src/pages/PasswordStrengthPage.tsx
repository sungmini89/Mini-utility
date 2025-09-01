import React from 'react';
import PasswordStrength from '../components/PasswordStrength';

/**
 * Page component that renders the PasswordStrength utility. This
 * indirection makes it easy to add additional pages in the future.
 */
const PasswordStrengthPage: React.FC = () => {
  return <PasswordStrength />;
};

export default PasswordStrengthPage;

