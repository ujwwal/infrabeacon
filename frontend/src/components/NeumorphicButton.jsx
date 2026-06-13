import React from 'react';

export default function NeumorphicButton({ children, onClick, primary = false, className = '', style = {} }) {
  const baseStyle = {
    padding: '16px 24px',
    borderRadius: '16px',
    border: 'none',
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'all 0.2s ease-in-out',
    boxShadow: 'var(--shadow-extruded-sm)',
    backgroundColor: primary ? 'var(--accent-color)' : 'var(--bg-color)',
    color: primary ? '#ffffff' : 'var(--text-main)',
    ...style
  };

  const [isPressed, setIsPressed] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const pressedStyle = {
    ...baseStyle,
    boxShadow: primary ? 'none' : 'var(--shadow-pressed)',
    transform: 'scale(0.97)',
  };

  const hoverStyle = {
    ...baseStyle,
    transform: 'translateY(-1px)',
    boxShadow: 'var(--shadow-extruded)',
  };

  let currentStyle = baseStyle;
  if (isPressed) {
    currentStyle = pressedStyle;
  } else if (isHovered) {
    currentStyle = hoverStyle;
  }

  return (
    <button
      style={currentStyle}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}
