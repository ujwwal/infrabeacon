import React from 'react';

export default function NeumorphicCard({ children, className = '', padding = '24px', style = {} }) {
  const defaultStyle = {
    backgroundColor: 'var(--bg-color)',
    borderRadius: '24px',
    padding: padding,
    boxShadow: 'var(--shadow-extruded)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'all 0.2s ease-in-out',
    ...style
  };

  return (
    <div style={defaultStyle} className={className}>
      {children}
    </div>
  );
}
