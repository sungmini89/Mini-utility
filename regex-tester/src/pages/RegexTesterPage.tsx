import React from 'react';
import RegexTester from '../components/RegexTester';

/**
 * Wrapper page for the RegexTester component.  Separating the page
 * facilitates route‑based code splitting in larger applications.
 */
const RegexTesterPage: React.FC = () => {
  return <RegexTester />;
};

export default RegexTesterPage;