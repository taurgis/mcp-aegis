import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  canonical?: string;
  robots?: string;
}

const DEFAULT_SEO = {
  title: 'MCP Conductor - Node.js Testing Library for Model Context Protocol Servers',
  description: 'MCP Conductor is a comprehensive Node.js testing library for Model Context Protocol (MCP) servers. Features declarative YAML-based testing, robust protocol compliance validation, 11+ pattern matching capabilities, and rich reporting for MCP server development.',
  keywords: 'MCP, Model Context Protocol, testing, Node.js, MCP server, protocol testing, YAML testing, JSON-RPC, stdio, API testing, developer tools, test automation, MCP validation',
  ogTitle: 'MCP Conductor - Node.js Testing Library for Model Context Protocol',
  ogDescription: 'Comprehensive testing framework for MCP servers with YAML-based tests, pattern matching, and protocol compliance validation. Streamline your Model Context Protocol development.',
  ogUrl: 'https://conductor.rhino-inquisitor.com/',
  twitterTitle: 'MCP Conductor - Node.js Testing Library for Model Context Protocol',
  twitterDescription: 'Test your MCP servers with ease using declarative YAML tests, pattern matching, and comprehensive protocol validation.',
  canonical: 'https://conductor.rhino-inquisitor.com/',
  robots: 'index, follow'
};

export const useSEO = (props: SEOProps = {}) => {
  const seoConfig = { ...DEFAULT_SEO, ...props };
  
  useEffect(() => {
    // Update document title
    document.title = seoConfig.title;
    
    // Helper function to update or create meta tag
    const updateMetaTag = (selector: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          const property = selector.match(/property="([^"]+)"/)?.[1];
          if (property) element.setAttribute('property', property);
        } else if (selector.includes('name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };
    
    // Helper function to update or create link tag
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Update meta tags
    updateMetaTag('meta[name="description"]', seoConfig.description);
    updateMetaTag('meta[name="keywords"]', seoConfig.keywords);
    updateMetaTag('meta[name="robots"]', seoConfig.robots);
    
    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', seoConfig.ogTitle);
    updateMetaTag('meta[property="og:description"]', seoConfig.ogDescription);
    updateMetaTag('meta[property="og:url"]', seoConfig.ogUrl);
    
    // Update Twitter Card tags
    updateMetaTag('meta[name="twitter:title"]', seoConfig.twitterTitle);
    updateMetaTag('meta[name="twitter:description"]', seoConfig.twitterDescription);
    
    // Update canonical URL
    updateLinkTag('canonical', seoConfig.canonical);
  }, [seoConfig.title, seoConfig.description, seoConfig.keywords, seoConfig.robots, seoConfig.ogTitle, seoConfig.ogDescription, seoConfig.ogUrl, seoConfig.twitterTitle, seoConfig.twitterDescription, seoConfig.canonical]);
};

// Component version for ease of use
export const SEOHead: React.FC<SEOProps> = (props) => {
  useSEO(props);
  return null; // This component doesn't render anything visible
};

export default useSEO;
