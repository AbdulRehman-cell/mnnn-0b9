import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

// Import Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Admin from './pages/Admin.jsx'

function App() {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  // Fetch cart count to display in header
  const fetchCartCount = async () => {
    try {
      const response = await axios.get('/api/cartitems');
      const count = response.data.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCartCount(count);
    } catch (error) {
      console.error('Failed to fetch cart count', error);
    }
  };

  useEffect(() => {
    fetchCartCount();
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Listener for custom cart update events so other pages can trigger a header refresh
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  return (
    <div className="app-layout">
      {/* Dynamic kinetic design indicator top line */}
      <div style={{ 
        height: '4px', 
        background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 50%, var(--secondary) 100%)',
        position: 'sticky',
        top: 0,
        zIndex: 1001
      }} />

      {/* Premium Sticky Header */}
      <header className="nav-minimal" style={{
        position: 'sticky',
        top: '4px',
        zIndex: 1000,
        background: 'rgba(250, 251, 247, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease-in-out'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 'var(--content-width)',
          margin: '0 auto',
          padding: 0
        }}>
          {/* Logo */}
          <Link to="/" className="nav-logo" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none'
          }}>
            <span style={{
              fontFamily: '"Archivo Black", sans-serif',
              fontWeight: 900,
              fontSize: '1.8rem',
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              display: 'inline-flex',
              alignItems: 'center'
            }}>
              AMI<span style={{ color: 'var(--primary)', marginLeft: '1px' }}>.</span>
            </span>
            <span className="badge" style={{
              fontSize: '0.65rem',
              backgroundColor: 'var(--text)',
              color: 'var(--bg)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 700,
              letterSpacing: '0.1em'
            }}>PRO</span>
          </Link>

          {/* Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px'
          }}>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "active" : ""}
              style={({ isActive }) => ({
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: isActive ? 'var(--primary)' : 'var(--muted)',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                paddingBottom: '4px',
                transition: 'color 0.15s ease'
              })}
            >
              Home
            </NavLink>
            <NavLink 
              to="/shop" 
              className={({ isActive }) => isActive ? "active" : ""}
              style={({ isActive }) => ({
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: isActive ? 'var(--primary)' : 'var(--muted)',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                paddingBottom: '4px',
                transition: 'color 0.15s ease'
              })}
            >
              Shop Gear
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => isActive ? "active" : ""}
              style={({ isActive }) => ({
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: isActive ? 'var(--primary)' : 'var(--muted)',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                paddingBottom: '4px',
                transition: 'color 0.15s ease'
              })}
            >
              Our Story
            </NavLink>
          </nav>

          {/* Right Actions: Cart & Quick Contact */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/cart" className="btn-secondary" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--text)'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>CART</span>
              <span className="badge" style={{
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '0.75rem',
                fontWeight: '900',
                marginLeft: '4px'
              }}>{cartCount}</span>
            </Link>

            <Link to="/about" className="btn-primary" style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              boxShadow: '0 4px 12px rgba(30,122,61,0.2)'
            }}>
              STRIKE FIRST
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ minHeight: 'calc(100vh - 350px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
      </Routes>
      </main>

      {/* Championship-Grade Footer */}
      <footer className="footer" style={{
        backgroundColor: 'var(--text)',
        color: 'var(--bg)',
        padding: '80px 24px 40px 24px',
        borderTop: '4px solid var(--primary)',
        marginTop: '80px'
      }}>
        <div className="container" style={{ maxWidth: 'var(--content-width)', margin: '0 auto' }}>
          <div className="footer-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}>
            {/* Brand block */}
            <div>
              <span style={{
                fontFamily: '"Archivo Black", sans-serif',
                fontWeight: 900,
                fontSize: '2rem',
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                display: 'block',
                marginBottom: '16px'
              }}>
                AMI<span style={{ color: 'var(--primary)' }}>.</span>
              </span>
              <p style={{
                color: 'var(--border)',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                Precision engineered hockey sticks, paddle rackets, and championship-grade field kit for athletes who train like the final is tomorrow.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}>EST. 1994</span>
                <span className="badge" style={{ backgroundColor: 'rgba(30,122,61,0.2)', color: 'var(--accent)' }}>CARBON RIGID</span>
              </div>
            </div>

            {/* Navigation links */}
            <div>
              <h4 style={{
                fontFamily: '"Archivo Black", sans-serif',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '20px'
              }}>
                Equipment Catalog
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/shop?category=stick" style={{ color: 'var(--border)', textDecoration: 'none', fontSize: '0.9rem' }}>Hockey Sticks</Link></li>
                <li><Link to="/shop?category=paddle" style={{ color: 'var(--border)', textDecoration: 'none', fontSize: '0.9rem' }}>Paddle Rackets</Link></li>
                <li><Link to="/shop?category=kit" style={{ color: 'var(--border)', textDecoration: 'none', fontSize: '0.9rem' }}>Field Accessories & Kit</Link></li>
                <li><Link to="/shop" style={{ color: 'var(--border)', textDecoration: 'none', fontSize: '0.9rem' }}>Pro Player Limited Editions</Link></li>
              </ul>
            </div>

            {/* Heritage / Story */}
            <div>
              <h4 style={{
                fontFamily: '"Archivo Black", sans-serif',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '20px'
              }}>
                The Workshop
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/about" style={{ color: 'var(--border)', textDecoration: 'none', fontSize: '0.9rem' }}>Heritage & Craftsmanship</Link></li>
                <li><span style={{ color: 'var(--border)', fontSize: '0.9rem' }}>11-Hand Process</span></li>
                <li><span style={{ color: 'var(--border)', fontSize: '0.9rem' }}>National Team Partnerships</span></li>
                <li><span style={{ color: 'var(--border)', fontSize: '0.9rem' }}>Custom Flex Engineering</span></li>
              </ul>
            </div>

            {/* Newsletter & Contact */}
            <div>
              <h4 style={{
                fontFamily: '"Archivo Black", sans-serif',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '20px'
              }}>
                Secure The Edge
              </h4>
              <p style={{ color: 'var(--border)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: '1.5' }}>
                Sign up to get notified of new prototype drops, field clinics, and exclusive pricing.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to AMI prototype drops!'); }} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="email" 
                  placeholder="Your play email" 
                  required
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    padding: '8px 12px',
                    fontSize: '0.85rem',
                    flexGrow: 1
                  }} 
                />
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  JOIN
                </button>
              </form>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '40px 0 24px 0' }} />

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--border)'
          }}>
            <span>© {new Date().getFullYear()} AMI Sports Group. All Rights Reserved. Forged for championship output.</span>
            <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
              <span>TERMS OF PLAY</span>
              <span>WARRANTY & REFUNDS</span>
              <span>STORY ARCHIVE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;