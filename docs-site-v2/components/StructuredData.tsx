import React from 'react';
import { SITE_DATES } from '../constants';

interface StructuredDataProps {
  structuredData?: object;
}

const StructuredData: React.FC<StructuredDataProps> = ({ structuredData }) => {
  const combinedData = [
    // Global Software Application Schema
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "MCP Aegis",
      "applicationCategory": "DeveloperApplication",
      "applicationSubCategory": "Testing Framework",
      "operatingSystem": "Node.js",
      "description": "A comprehensive Node.js testing library for Model Context Protocol (MCP) servers with YAML-based declarative testing and programmatic testing capabilities.",
      "url": "https://aegis.rhino-inquisitor.com",
      "downloadUrl": "https://www.npmjs.com/package/mcp-aegis",
      "installUrl": "https://aegis.rhino-inquisitor.com/installation",
      "softwareVersion": "1.0.17",
      "datePublished": SITE_DATES.PUBLISHED,
      "dateModified": SITE_DATES.MODIFIED,
      "author": {
        "@type": "Person",
        "name": "Thomas Theunen",
        "url": "https://github.com/taurgis"
      },
      "publisher": {
        "@type": "Person",
        "name": "Thomas Theunen"
      },
      "programmingLanguage": ["JavaScript", "TypeScript"],
      "runtimePlatform": "Node.js",
      "keywords": "MCP, Model Context Protocol, testing, Node.js, YAML testing, programmatic testing, pattern matching, JSON-RPC, stdio, MCP server testing",
      "requirements": "Node.js 18+, npm",
      "featureList": [
        "YAML-based Declarative Testing",
        "Programmatic Testing API", 
        "Advanced Pattern Matching",
        "JSON-RPC 2.0 Protocol Testing",
        "CI/CD Integration",
        "Rich Error Reporting"
      ],
      "screenshot": "https://aegis.rhino-inquisitor.com/mcp-aegis-testing-framework.png",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "license": "https://opensource.org/licenses/MIT",
      "codeRepository": "https://github.com/taurgis/sfcc-dev-mcp",
      "maintainer": {
        "@type": "Person", 
        "name": "Thomas Theunen"
      }
    },
    // Page-specific structured data (if provided)
    ...(structuredData ? [structuredData] : [])
  ];

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedData) }} 
    />
  );
};

export default StructuredData;