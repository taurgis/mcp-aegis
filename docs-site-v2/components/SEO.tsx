import React from 'react';
import { Head } from 'vite-react-ssg';
import { buildFullUrl, normalizeUrlPath } from '../utils/url';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = 'MCP Aegis',
  description = 'A comprehensive Node.js testing library for Model Context Protocol (MCP) servers. YAML-based declarative testing and programmatic testing with advanced pattern matching capabilities.',
  keywords = 'MCP, Model Context Protocol, testing, Node.js, YAML testing, programmatic testing, pattern matching, JSON-RPC, stdio, MCP server testing',
  canonical,
  ogImage = 'https://aegis.rhino-inquisitor.com/mcp-aegis-testing-framework.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false
}) => {
  const baseUrl = 'https://aegis.rhino-inquisitor.com';
  
  // Normalize canonical URL to ensure trailing slash for GitHub Pages compatibility
  let fullCanonical = baseUrl;
  if (canonical !== undefined) {
    if (canonical === '' || canonical === '/') {
      fullCanonical = baseUrl;
    } else {
      fullCanonical = buildFullUrl(baseUrl, canonical);
    }
  }
  
  const fullTitle = title === 'MCP Aegis' ? title : `${title} | MCP Aegis`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Basic Meta Tags */}
      <meta name="author" content="Thomas Theunen" />
      <meta name="publisher" content="Thomas Theunen" />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content="MCP Aegis" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:creator" content="@taurgis" />
      <meta name="twitter:site" content="@taurgis" />

      {/* Additional Meta Tags */}
      <meta name="application-name" content="MCP Aegis" />
      <meta name="msapplication-tooltip" content={description} />
      <meta name="apple-mobile-web-app-title" content="MCP Aegis" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />


    </Head>
  );
};

export default SEO;