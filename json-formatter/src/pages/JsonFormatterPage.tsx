import React from 'react';
import JsonFormatter from '../components/JsonFormatter';

/**
 * Wrapper page for the JsonFormatter component.  Separating the page
 * facilitates route‑based code splitting.
 */
const JsonFormatterPage: React.FC = () => {
  return <JsonFormatter />;
};

export default JsonFormatterPage;