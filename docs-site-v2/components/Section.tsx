import React from 'react';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3; // Could be used later for spacing variants
  noMargin?: boolean;
}

// Centralized layout wrapper to ensure consistent vertical rhythm + anchor offset.
// scroll-mt-28 pairs with a fixed/sticky header (adjust if header height changes).
export const Section: React.FC<SectionProps> = ({ id, children, className = '', level = 2, noMargin }) => {
  const spacing = noMargin ? '' : 'mb-16';
  return (
    <section id={id} className={`scroll-mt-28 ${spacing} ${className}`}>
      {children}
    </section>
  );
};

export default Section;