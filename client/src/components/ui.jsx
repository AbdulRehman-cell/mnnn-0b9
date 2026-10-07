import React from 'react';

/**
 * UI Button Component matching the site design system.
 */
export function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button', 
  disabled = false, 
  className = '', 
  style = {} 
}) {
  const getButtonClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'ghost':
        return 'btn-ghost';
      default:
        return 'btn-primary';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${getButtonClass()} ${className}`}
      style={{ 
        cursor: disabled ? 'not-allowed' : 'pointer', 
        opacity: disabled ? 0.6 : 1,
        ...style 
      }}
    >
      {children}
    </button>
  );
}

/**
 * UI Card Component matching the site design system.
 */
export function Card({ 
  children, 
  className = '', 
  elevated = false, 
  style = {} 
}) {
  const cardClass = elevated ? 'card card-elevated' : 'card';
  return (
    <div className={`${cardClass} ${className}`} style={style}>
      {children}
    </div>
  );
}

/**
 * UI Badge Component for labels, tags, and active status indicators.
 */
export function Badge({ 
  children, 
  className = '', 
  style = {} 
}) {
  return (
    <span 
      className={`badge ${className}`} 
      style={{ 
        display: 'inline-block', 
        padding: '0.25rem 0.75rem', 
        borderRadius: '50px', 
        fontSize: '0.85rem', 
        fontWeight: 'bold',
        ...style 
      }}
    >
      {children}
    </span>
  );
}

/**
 * UI Spinner Component to display loading state animations.
 */
export function Spinner({ 
  className = '', 
  color = 'var(--accent)', 
  size = '32px' 
}) {
  return (
    <div 
      className={`spinner ${className}`} 
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `3px solid rgba(255, 255, 255, 0.1)`,
        borderRadius: '50%',
        borderTopColor: color,
        animation: 'spin 1s linear infinite',
      }}
    />
  );
}

// Global CSS injection helper for keyframes spinner support if missing
if (typeof document !== 'undefined') {
  const styleId = 'ui-components-spinner-keyframes';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Export object for default import compatibility expected by the importer
const UI = {
  Button,
  Card,
  Badge,
  Spinner
};

export default UI;