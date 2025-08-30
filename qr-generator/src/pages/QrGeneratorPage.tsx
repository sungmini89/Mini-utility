import React from 'react';
import QrGenerator from '../components/QrGenerator';

/**
 * Page wrapper for the QR Code generator. This component is used by the router
 * to render the generator at the root path. Separating the page allows for
 * additional pages in the future and keeps routing concerns out of the main
 * component implementation.
 */
const QrGeneratorPage: React.FC = () => {
  return <QrGenerator />;
};

export default QrGeneratorPage;