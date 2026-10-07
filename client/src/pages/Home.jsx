import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Badge, Spinner, Stat } from '../components/ui';

export default function Home() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Newsletter form state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products');
        // Filter or slice to get featured/bestsellers or first 4
        const items = response.data;
        const filtered = items.filter(p => p.badge === 'Bestseller' || p.badge === 'New').slice(0, 4);
        setFeaturedProducts(filtered.length > 0 ? filtered : items.slice(0, 4));
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Could not load featured gear. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      // Simulate/post subscription
      await axios.post('/api/contactsubmissions', {
        name: newsletterEmail,
        email: newsletterEmail,
        phone: '',
        subject: 'Newsletter Subscription',
        message: 'Newsletter subscription request from home page.'
      });
      setSubmitSuccess(true);
      setNewsletterEmail('');
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Subscription failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Kinetic diagonal turf stripe background pattern overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          backgroundImage: 'repeating-linear-gradient(120deg, rgba(30,122,61,0.06) 0px, rgba(30,122,61,0.06) 40px, transparent 40px, transparent 80px)',
          pointerEvents: 'none'
        }} />
        
        {/* Radical gradient glow behind the headline */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30,122,61,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Hero image background with optimized contrast */}
        <img 
          className="hero-bg" 
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80" 
          alt="Field hockey players mid strike on astroturf"
          style={{ opacity: 0.22, filter: 'grayscale(20%) contrast(110%)' }}
        />

        <div className="container animate-in" style={{ position: 'relative', zIndex: 2 }}>
          <span className="hero-eyebrow" style={{ color: 'var(--accent)', letterSpacing: '0.15em', fontWeight: 700 }}>
            ENGINEERED TO DOMINATE
          </span>
          
          <h1 style={{ 
            fontFamily: '"Archivo Black", sans-serif', 
            fontSize: 'clamp(2.8rem, 6vw + 1rem, 5rem)', 
            lineHeight: 1.02, 
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: 'var(--text)',
            marginTop: '12px',
            marginBottom: '24px'
          }}>
            Strike <span className="gradient-text">First.</span>
          </h1>

          <p className="hero-subtitle" style={{ 
            fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)', 
            color: 'var(--muted)',
            maxWidth: '680px',
            lineHeight: 1.6,
            marginBottom: '40px'
          }}>
            AMI engineers elite-grade hockey sticks, high-precision paddle rackets, and absolute field kit built for players who train like tomorrow's final is already underway.
          </p>

          <div className="hero-actions" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigate('/shop')}
              style={{
                boxShadow: '0 10px 26px -8px rgba(30,122,61,0.55)',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
            >
              Shop The Range
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => navigate('/about')}
              style={{ fontWeight: 700, textTransform: 'uppercase' }}
            >
              Our Story
            </Button>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP & SCOREBOARD STATS */}
      <section className="section" style={{ background: 'var(--surface-2)', padding: '50px 0', borderY: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid-4" style={{ gap: '24px' }}>
            <div className="card" style={{ background: 'var(--surface)', border: 'none', padding: '24px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '2.5rem', color: 'var(--primary)', borderBottom: '3px solid var(--accent)', display: 'inline-block', paddingBottom: '4px', marginBottom: '8px' }}>
                14+
              </div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                National Teams Equipped
              </div>
            </div>

            <div className="card" style={{ background: 'var(--surface)', border: 'none', padding: '24px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '2.5rem', color: 'var(--primary)', borderBottom: '3px solid var(--accent)', display: 'inline-block', paddingBottom: '4px', marginBottom: '8px' }}>
                200K+
              </div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                Sticks On The Field
              </div>
            </div>

            <div className="card" style={{ background: 'var(--surface)', border: 'none', padding: '24px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '2.5rem', color: 'var(--primary)', borderBottom: '3px solid var(--accent)', display: 'inline-block', paddingBottom: '4px', marginBottom: '8px' }}>
                EST. '94
              </div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                Championship Heritage
              </div>
            </div>

            <div className="card" style={{ background: 'var(--surface)', border: 'none', padding: '24px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '2.5rem', color: 'var(--primary)', borderBottom: '3px solid var(--accent)', display: 'inline-block', paddingBottom: '4px', marginBottom: '8px' }}>
                100%
              </div>
              <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
                Carbon-Fibre Cured
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY SHOWCASE */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '48px', height: '4px', background: 'var(--accent)', transform: 'rotate(-3deg)' }} />
              <span className="eyebrow" style={{ color: 'var(--secondary)', fontWeight: 700, letterSpacing: '0.12em' }}>
                PRECISION CATEGORIES
              </span>
            </div>
            <h2 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', fontSize: 'clamp(2rem, 3vw, 3rem)' }}>
              Gear Built To <span className="gradient-text">Overpower</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '600px' }}>
              Engineered with championship materials and fine-tuned configurations. Select your weapon discipline below.
            </p>
          </div>

          <div className="grid-3" style={{ gap: 'var(--gutter)' }}>
            {/* Sticks */}
            <div className="card animate-in" style={{ border: '1px solid var(--border)', borderRadius: '14px', background: 'var(--surface)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                <img 
                  src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80" 
                  alt="Field hockey sticks" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                  <Badge variant="primary">Elite Flex Control</Badge>
                </div>
              </div>
              <div style={{ padding: '28px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', fontSize: '1.4rem', margin: '0 0 12px 0' }}>
                    Hockey Sticks
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                    Flex, strike, and control. Built with multi-layer high modulus carbon fibre to turn wrist speed directly into clinical ball speed.
                  </p>
                </div>
                <Button variant="secondary" fullWidth onClick={() => navigate('/shop?category=stick')}>
                  Explore Sticks
                </Button>
              </div>
            </div>

            {/* Paddles */}
            <div className="card animate-in" style={{ border: '1px solid var(--border)', borderRadius: '14px', background: 'var(--surface)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                <img 
                  src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80" 
                  alt="Padel paddle racket close up" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                  <Badge variant="warning">Aerodynamic Core</Badge>
                </div>
              </div>
              <div style={{ padding: '28px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', fontSize: '1.4rem', margin: '0 0 12px 0' }}>
                    Paddle Rackets
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                    Built for raw court pace, strung for uncompromising sweet-spot precision. Experience dynamic recovery responsiveness.
                  </p>
                </div>
                <Button variant="secondary" fullWidth onClick={() => navigate('/shop?category=paddle')}>
                  Explore Paddles
                </Button>
              </div>
            </div>

            {/* Field Kit */}
            <div className="card animate-in" style={{ border: '1px solid var(--border)', borderRadius: '14px', background: 'var(--surface)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                <img 
                  src="https://images.unsplash.com/photo-1512412086892-a249822a8497?auto=format&fit=crop&w=600&q=80" 
                  alt="Field hockey equipment kit" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                  <Badge variant="success">Impact Resistant</Badge>
                </div>
              </div>
              <div style={{ padding: '28px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', fontSize: '1.4rem', margin: '0 0 12px 0' }}>
                    Field Kit
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                    Shin guards, tactical gloves, composite balls, and heavy-duty armor. The whole protective uniform of winning.
                  </p>
                </div>
                <Button variant="secondary" fullWidth onClick={() => navigate('/shop?category=kit')}>
                  Explore Field Kit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY AMI (CRAFTSMANSHIP SPLIT) */}
      <section className="section" style={{ background: 'var(--surface)', borderY: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '60px' }}>
            <div className="animate-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '48px', height: '4px', background: 'var(--accent)', transform: 'rotate(-3deg)' }} />
                <span className="eyebrow" style={{ color: 'var(--secondary)', fontWeight: 700, letterSpacing: '0.12em' }}>
                  ENGINEERING LAB
                </span>
              </div>
              
              <h2 style={{ 
                fontFamily: '"Archivo Black", sans-serif', 
                textTransform: 'uppercase', 
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                lineHeight: 1.1,
                marginBottom: '20px'
              }}>
                Three Layers. <span className="gradient-text">Zero</span> Compromise.
              </h2>
              
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '30px' }}>
                Every single AMI stick is laid up carefully by hand using aerospace grade carbon fibre layers, woven and pressure-cured under intense hydraulic control to ensure that your shot never flinches, regardless of impact severity.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    background: 'var(--surface-2)', 
                    color: 'var(--primary)', 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontFamily: '"Archivo Black"', 
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>
                    01
                  </div>
                  <div>
                    <h4 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', margin: '0 0 4px 0', fontSize: '1.1rem' }}>
                      Kevlar Power Core
                    </h4>
                    <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: 0 }}>
                      An ultra-dense backbone that dampens heavy vibrations while returning maximum kinetic rebound.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    background: 'var(--surface-2)', 
                    color: 'var(--primary)', 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontFamily: '"Archivo Black"', 
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>
                    02
                  </div>
                  <div>
                    <h4 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', margin: '0 0 4px 0', fontSize: '1.1rem' }}>
                      Bi-Axial Carbon Mesh
                    </h4>
                    <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: 0 }}>
                      Laid at precise 45-degree angles to absorb torsional twisting, maintaining pinpoint striking accuracy.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    background: 'var(--surface-2)', 
                    color: 'var(--primary)', 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontFamily: '"Archivo Black"', 
                    fontSize: '1.2rem',
                    flexShrink: 0
                  }}>
                    03
                  </div>
                  <div>
                    <h4 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', margin: '0 0 4px 0', fontSize: '1.1rem' }}>
                      Resin-Rich Outer Shell
                    </h4>
                    <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: 0 }}>
                      Protects against pitch abrasion, sand wear, and defensive stick hacking over seasons of hard play.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-in" style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                right: '20px',
                bottom: '20px',
                border: '4px solid var(--accent)',
                borderRadius: '14px',
                zIndex: 1,
                pointerEvents: 'none'
              }} />
              <img 
                src="https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=800&q=80" 
                alt="Carbon fiber composite engineering details" 
                style={{ 
                  width: '100%', 
                  height: '480px', 
                  objectFit: 'cover', 
                  borderRadius: '14px', 
                  position: 'relative', 
                  zIndex: 2,
                  boxShadow: 'var(--shadow-xl)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS CAROUSEL / GRID */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: '50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '48px', height: '4px', background: 'var(--accent)', transform: 'rotate(-3deg)' }} />
              <span className="eyebrow" style={{ color: 'var(--secondary)', fontWeight: 700, letterSpacing: '0.12em' }}>
                CURRENT ARMORY
              </span>
            </div>
            <h2 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', fontSize: 'clamp(2rem, 3vw, 3rem)' }}>
              The Starting <span className="gradient-text">Eleven</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
              Our most-fielded gear and elite tools of execution this season.
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <Spinner size="lg" color="primary" />
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : (
            <div className="grid-4" style={{ gap: '24px' }}>
              {featuredProducts.map((product) => (
                <div 
                  key={product._id} 
                  className="card" 
                  style={{ 
                    border: '1px solid var(--border)', 
                    borderRadius: '14px', 
                    background: 'var(--surface)', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: '0 14px 30px -18px rgba(16,35,26,0.25)'
                  }}
                >
                  {/* Bestseller/New Badge */}
                  {product.badge && product.badge !== 'None' && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '16px', 
                      left: '16px', 
                      zIndex: 10,
                      background: 'var(--accent)', 
                      color: 'var(--text)', 
                      padding: '4px 10px', 
                      fontWeight: 800, 
                      fontSize: '0.7rem', 
                      textTransform: 'uppercase', 
                      borderRadius: '4px',
                      transform: 'rotate(-4deg)',
                      boxShadow: '0 4px 10px rgba(245,166,35,0.4)'
                    }}>
                      {product.badge}
                    </div>
                  )}

                  <div 
                    onClick={() => navigate(`/product/${product.slug}`)} 
                    style={{ position: 'relative', height: '260px', overflow: 'hidden', cursor: 'pointer' }}
                  >
                    <img 
                      src={product.images ? (Array.isArray(product.images) ? product.images[0] : product.images.split(',')[0]) : 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80'}
                      alt={product.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    />
                  </div>

                  <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)' }}>
                          {product.category}
                        </span>
                        {product.skillLevel && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                            {product.skillLevel}
                          </span>
                        )}
                      </div>
                      
                      <h4 
                        onClick={() => navigate(`/product/${product.slug}`)}
                        style={{ 
                          fontFamily: '"Archivo Black", sans-serif', 
                          fontSize: '1.1rem', 
                          margin: '0 0 12px 0', 
                          cursor: 'pointer',
                          color: 'var(--text)',
                          lineHeight: '1.2'
                        }}
                      >
                        {product.name}
                      </h4>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                        {product.material && <span style={{ fontSize: '0.7rem', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: '4px' }}>{product.material}</span>}
                        {product.flexRating && <span style={{ fontSize: '0.7rem', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: '4px' }}>{product.flexRating} Flex</span>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '1.3rem', color: 'var(--text)' }}>
                        ₹{product.price?.toLocaleString()}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/product/${product.slug}`)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Button variant="secondary" size="lg" onClick={() => navigate('/shop')}>
              View Full Armor Catalog
            </Button>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS & CLUB TRUST */}
      <section className="section" style={{ background: 'var(--surface)', borderY: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: '50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '48px', height: '4px', background: 'var(--accent)', transform: 'rotate(-3deg)' }} />
              <span className="eyebrow" style={{ color: 'var(--secondary)', fontWeight: 700, letterSpacing: '0.12em' }}>
                VERIFIED PLAYERS
              </span>
            </div>
            <h2 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', fontSize: 'clamp(2rem, 3vw, 3rem)' }}>
              Endorsed By The <span className="gradient-text">Relentless</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
              From premier league goal-scorers to elite club coaches. Real performance, measured in results.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '32px' }}>
            <div className="card" style={{ padding: '32px', background: 'var(--surface-2)', border: 'none', borderRadius: '14px', boxShadow: 'var(--shadow-sm)' }}>
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text)', lineHeight: '1.6', marginBottom: '24px' }}>
                "AMI sticks don't bend under heavy contact pressure — they transfer it entirely. The low-bow flex point on the Apex 900 lets me load drag-flicks later with absolute transfer speed."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img 
                  src="https://i.pravatar.cc/300?img=11" 
                  alt="R. Shetty" 
                  className="avatar"
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '0.95rem', margin: 0, textTransform: 'uppercase' }}>
                    R. Shetty
                  </h4>
                  <p style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, margin: 0 }}>
                    State League Forward
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '32px', background: 'var(--surface-2)', border: 'none', borderRadius: '14px', boxShadow: 'var(--shadow-sm)' }}>
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text)', lineHeight: '1.6', marginBottom: '24px' }}>
                "We switched our entire university academy over to AMI protective kit and composite sticks. The shock dampening has reduced thumb fatigue completely, keeping our squad relentless."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img 
                  src="https://i.pravatar.cc/300?img=12" 
                  alt="Coach Dave Miller" 
                  className="avatar"
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '0.95rem', margin: 0, textTransform: 'uppercase' }}>
                    Dave Miller
                  </h4>
                  <p style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, margin: 0 }}>
                    Varsity Head Coach
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '32px', background: 'var(--surface-2)', border: 'none', borderRadius: '14px', boxShadow: 'var(--shadow-sm)' }}>
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text)', lineHeight: '1.6', marginBottom: '24px' }}>
                "The core responsiveness of the AMI Paddle is completely unmatched. The ball rebound response is instant, giving me absolute control on crucial cross-court reflex returns."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img 
                  src="https://i.pravatar.cc/300?img=33" 
                  alt="Elena Rostova" 
                  className="avatar"
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '0.95rem', margin: 0, textTransform: 'uppercase' }}>
                    Elena Rostova
                  </h4>
                  <p style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, margin: 0 }}>
                    Padel Club Champion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DYNAMIC VIDEO EMBED */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '48px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '48px', height: '4px', background: 'var(--accent)', transform: 'rotate(-3deg)' }} />
                <span className="eyebrow" style={{ color: 'var(--secondary)', fontWeight: 700, letterSpacing: '0.12em' }}>
                  AMI IN MOTION
                </span>
              </div>
              <h2 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', fontSize: '2.2rem', marginBottom: '16px' }}>
                Witness Championship <span className="gradient-text">Speed</span>
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem', marginBottom: '24px' }}>
                Watch our carbon-fibre structures undergo maximum deflection testing and fast-paced pitch training drills.
              </p>
              <Button variant="secondary" onClick={() => navigate('/about')}>
                Read Development Heritage
              </Button>
            </div>
            <div>
              <div className="video-embed" style={{ 
                borderRadius: '14px', 
                overflow: 'hidden', 
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border)'
              }}>
                <iframe 
                  src="https://www.youtube.com/embed/gLgX68Kq5x4" 
                  title="Field Hockey Training Video" 
                  allowFullScreen
                  style={{ width: '100%', height: '315px', border: 'none' }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER / FINAL CTA BAND */}
      <section className="section" style={{ padding: 0 }}>
        <div className="container" style={{ maxWidth: 'var(--content-width)' }}>
          <div className="cta-section animate-in" style={{ 
            background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)', 
            borderRadius: '16px',
            padding: '60px',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <span className="eyebrow" style={{ color: 'var(--accent)', letterSpacing: '0.15em', fontWeight: 800 }}>
                JOIN THE Starting Lineup
              </span>
              <h2 style={{ 
                fontFamily: '"Archivo Black", sans-serif', 
                textTransform: 'uppercase', 
                fontSize: 'clamp(2rem, 4vw, 3.2rem)', 
                color: 'white',
                marginTop: '12px',
                marginBottom: '16px'
              }}>
                Your Game Is <span style={{ color: 'var(--accent)' }}>Waiting.</span>
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 32px auto', lineHeight: '1.6' }}>
                Join the AMI newsletter registry to get professional advice, exclusive limited edition product releases, and custom field-kit fitting guides.
              </p>

              {submitSuccess ? (
                <div className="alert alert-success" style={{ maxWidth: '500px', margin: '0 auto', color: 'var(--text)' }}>
                  ✓ You are on the registry! Expect premium releases in your inbox soon.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} style={{ 
                  display: 'flex', 
                  flexDirection: 'row', 
                  gap: '12px', 
                  maxWidth: '500px', 
                  margin: '0 auto',
                  flexWrap: 'wrap'
                }}>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    style={{ 
                      flexGrow: 1, 
                      padding: '14px 20px', 
                      borderRadius: '8px', 
                      border: 'none', 
                      background: 'rgba(255,255,255,0.9)',
                      color: 'var(--text)',
                      fontWeight: 500
                    }} 
                  />
                  <Button 
                    type="submit" 
                    variant="primary" 
                    loading={submitting}
                    style={{ 
                      background: 'var(--accent)', 
                      color: 'var(--text)', 
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}
                  >
                    Secure Spot
                  </Button>
                </form>
              )}

              {submitError && (
                <div style={{ color: '#ff6b6b', marginTop: '12px', fontWeight: 600 }}>
                  {submitError}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" style={{ marginTop: '120px', background: 'var(--text)', color: 'white', padding: '80px 0 40px 0' }}>
        <div className="container">
          <div className="footer-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '40px',
            marginBottom: '60px' 
          }}>
            <div>
              <span style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '1.8rem', color: 'white' }}>
                AMI<span style={{ color: 'var(--primary)' }}>.</span>
              </span>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: '16px', lineHeight: '1.6', fontSize: '0.95rem' }}>
                Premium athletic engineering for unrelenting field competitors. Hand-laid composite systems that never flinch.
              </p>
            </div>
            <div>
              <h4 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', fontSize: '1rem', color: 'white', marginBottom: '20px' }}>
                Shop Range
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/shop?category=stick" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Hockey Sticks</Link></li>
                <li><Link to="/shop?category=paddle" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Paddle Rackets</Link></li>
                <li><Link to="/shop?category=kit" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Field Protective Kit</Link></li>
                <li><Link to="/shop" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>All Equipment</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', fontSize: '1rem', color: 'white', marginBottom: '20px' }}>
                The Brand
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link to="/about" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Craftsmanship Story</Link></li>
                <li><Link to="/about#sustainability" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Sustainability Policy</Link></li>
                <li><Link to="/contact" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Support & Claims</Link></li>
                <li><Link to="/contact?subject=Dealer" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none'}}>Bulk & Team orders</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', fontSize: '1rem', color: 'white', marginBottom: '20px' }}>
                Contact Lab
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem', margin: '0 0 12px 0' }}>
                11 High Modulus Dr, Sector 4<br />
                Padel & Turf District, AMI
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem', margin: 0 }}>
                Email: support@ami-sports.com<br />
                Phone: +91 98450 12944
              </p>
            </div>
          </div>

          <div style={{ 
            borderTop: '1px solid rgba(255,255,255,0.1)', 
            paddingTop: '30px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: '20px',
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            <span>&copy; {new Date().getFullYear()} AMI Sports Inc. All premium field rights reserved.</span>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span style={{ cursor: 'pointer' }}>Terms of Service</span>
              <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
              <span style={{ cursor: 'pointer' }}>Hex Carbon Patents</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}