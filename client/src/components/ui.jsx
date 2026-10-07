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

function _showToast(message, type = 'info') {
  if (typeof document === 'undefined') return;
  const colors = { success: '#16a34a', error: '#dc2626', warning: '#d97706', info: '#374151' };
  const el = document.createElement('div');
  el.textContent = message;
  el.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:9999;padding:12px 20px;border-radius:10px;color:#fff;font-size:14px;font-weight:500;background:${colors[type]||colors.info};box-shadow:0 4px 16px rgba(0,0,0,.18);transition:opacity .3s;`;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3000);
}
export const toast = Object.assign(
  (message, type) => _showToast(message, type),
  { success: (m) => _showToast(m, 'success'), error: (m) => _showToast(m, 'error'), warning: (m) => _showToast(m, 'warning'), info: (m) => _showToast(m, 'info') }
);

export function Alert({ children, variant = 'error', className = '', ...props }) {
  const cls = variant === 'success' ? 'alert alert-success' : variant === 'info' ? 'alert alert-info' : 'alert alert-error';
  return (
    <div className={`${cls} ${className}`} style={{ margin: '1rem 0', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid currentColor' }} {...props}>
      {children}
    </div>
  );
}

export function Stat({ value, label, className = '' }) {
  return (
    <div className={`stat ${className}`} style={{ textAlign: 'center', padding: '1rem' }}>
      <div className="stat-value" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary, #6366f1)' }}>{value}</div>
      <div className="stat-label" style={{ fontSize: '0.875rem', color: 'var(--muted, #64748b)', marginTop: '0.25rem' }}>{label}</div>
    </div>
  );
}

export function Input({ className = '', style = {}, ...props }) {
  return <input className={className} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border, rgba(0,0,0,.12))', borderRadius: '8px', fontSize: '0.9375rem', background: 'var(--surface, #fff)', color: 'var(--text, #111)', outline: 'none', ...style }} {...props} />;
}

export function Textarea({ className = '', style = {}, ...props }) {
  return <textarea className={className} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border, rgba(0,0,0,.12))', borderRadius: '8px', fontSize: '0.9375rem', background: 'var(--surface, #fff)', color: 'var(--text, #111)', outline: 'none', resize: 'vertical', minHeight: '100px', ...style }} {...props} />;
}

const UI = { Button, Card, Badge, Spinner, Alert, Stat, toast, Input, Textarea };
export default UI;