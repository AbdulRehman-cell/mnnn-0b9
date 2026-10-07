import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Badge, Spinner, toast } from '../components/ui';

export default function Shop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering states
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSkill, setActiveSkill] = useState('All');
  const [activeFlex, setActiveFlex] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [priceLimit, setPriceLimit] = useState(15000);

  // Pagination
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products');
        setProducts(response.data || []);
        setError('');
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Unable to load high-performance gear. Please check your connection.');
        // Fallback robust mock data if API is loading or not seeded yet
        setProducts([
          {
            _id: 'm1',
            name: 'Apex 900 Carbon Strike',
            slug: 'apex-900-carbon-strike',
            category: 'stick',
            subCategory: 'Drag-Flick Elite',
            price: 8999,
            compareAtPrice: 11999,
            images: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=600',
            flexRating: 'High',
            weight: '520g',
            length: '36.5"',
            material: '95% Carbon, 5% Kevlar',
            skillLevel: 'Pro',
            badge: 'Bestseller',
            description: 'The Apex 900 was built for drag-flickers who load late and release hard — a low bow and stiff flex point turn wrist speed into ball speed.'
          },
          {
            _id: 'm2',
            name: 'Kevlar Pro 500',
            slug: 'kevlar-pro-500',
            category: 'stick',
            subCategory: 'Mid-Bow General',
            price: 6499,
            compareAtPrice: 7999,
            images: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600',
            flexRating: 'Medium',
            weight: '540g',
            length: '37.5"',
            material: '70% Carbon, 20% Fiberglass, 10% Kevlar',
            skillLevel: 'Intermediate',
            badge: 'New',
            description: 'Engineered for robust midfield possession and clean, sweeping distributions. Exceptional shock-absorption.'
          },
          {
            _id: 'm3',
            name: 'AMI Padel Raptor X',
            slug: 'ami-padel-raptor-x',
            category: 'paddle',
            subCategory: 'Teardrop Racket',
            price: 11200,
            compareAtPrice: 13500,
            images: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=600',
            flexRating: 'High',
            weight: '365g',
            length: 'Standard',
            material: '12K Carbon Face, EVA Pro Core',
            skillLevel: 'Pro',
            badge: 'Bestseller',
            description: 'Aerodynamic frame combined with high-tension face weaving delivers relentless smash power and turf-proven spin control.'
          },
          {
            _id: 'm4',
            name: 'Padel Nitro Aero',
            slug: 'padel-nitro-aero',
            category: 'paddle',
            subCategory: 'Round Control Racket',
            price: 8490,
            compareAtPrice: 0,
            images: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=600',
            flexRating: 'Medium',
            weight: '360g',
            length: 'Standard',
            material: '3K Woven Carbon, Soft EVA',
            skillLevel: 'Intermediate',
            badge: 'None',
            description: 'Optimized sweet spot with vibration dampening technology. Built for accurate placement and quick reflex volleys.'
          },
          {
            _id: 'm5',
            name: 'AMI Shield Shin Guards',
            slug: 'ami-shield-shin-guards',
            category: 'kit',
            subCategory: 'Anatomical Armor',
            price: 2499,
            compareAtPrice: 2999,
            images: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=600',
            flexRating: 'Low',
            weight: '180g',
            length: 'L',
            material: 'Polycarbonate Shield, Dual-foam Liner',
            skillLevel: 'Beginner',
            badge: 'None',
            description: 'Ventilated, ultra-hard shell defense designed specifically for heavy stick impact and sweep protection.'
          },
          {
            _id: 'm6',
            name: 'Grip Tape Mastery Pack',
            slug: 'grip-tape-mastery-pack',
            category: 'kit',
            subCategory: 'Accessories',
            price: 899,
            compareAtPrice: 1200,
            images: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&q=80&w=600',
            flexRating: 'None',
            weight: '40g',
            length: 'Universal',
            material: 'Championship Poly-Polymer',
            skillLevel: 'Beginner',
            badge: 'None',
            description: 'Non-slip grip tape engineered for humid mornings and intense matches. Soft cushioned texture reduces blisters.'
          },
          {
            _id: 'm7',
            name: 'Championship Goalie Glove Set',
            slug: 'championship-goalie-glove-set',
            category: 'kit',
            subCategory: 'Goalie Defensive',
            price: 13500,
            compareAtPrice: 15000,
            images: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=600',
            flexRating: 'High',
            weight: '680g',
            length: 'Standard',
            material: 'High Density Rebound Foam',
            skillLevel: 'Pro',
            badge: 'Bestseller',
            description: 'Maximum surface area coverage and elite rebound acceleration. Crafted for high-velocity shot deflections.'
          },
          {
            _id: 'm8',
            name: 'Vulcan Field Hockey Ball (Pack of 6)',
            slug: 'vulcan-field-hockey-ball-pack-of-6',
            category: 'kit',
            subCategory: 'Match Balls',
            price: 1800,
            compareAtPrice: 2400,
            images: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600',
            flexRating: 'None',
            weight: '156g each',
            length: 'Official',
            material: 'Dimpled PVC, Cork Center',
            skillLevel: 'Beginner',
            badge: 'None',
            description: 'Consistent roll behavior on wet and dry synthetic water-based turf fields. Official match-grade specifications.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await axios.post('/api/cartitems', {
        productId: product._id || product.slug,
        name: product.name,
        image: product.images,
        price: product.price,
        quantity: 1
      });
      toast.success(`${product.name} added to cart!`);
      // Dispatch custom event to trigger header refresh
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error('Could not add item to cart. Please try again.');
    }
  };

  // Filter application logic
  const filteredProducts = products.filter(product => {
    const matchCategory = activeCategory === 'All' || product.category === activeCategory.toLowerCase();
    const matchSkill = activeSkill === 'All' || product.skillLevel === activeSkill;
    const matchFlex = activeFlex === 'All' || product.flexRating === activeFlex;
    const matchPrice = product.price <= priceLimit;
    return matchCategory && matchSkill && matchFlex && matchPrice;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'low-to-high') return a.price - b.price;
    if (sortBy === 'high-to-low') return b.price - a.price;
    if (sortBy === 'bestsellers') return (b.badge === 'Bestseller' ? 1 : 0) - (a.badge === 'Bestseller' ? 1 : 0);
    return 0; // default layout order
  });

  const paginatedProducts = sortedProducts.slice(0, visibleCount);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      {/* Product Hero Header */}
      <section className="hero" style={{ 
        position: 'relative', 
        padding: '80px 0 60px 0', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--bg) 100%)'
      }}>
        {/* Kinetic Turf Stripe motif background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: 'repeating-linear-gradient(120deg, var(--primary) 0px, var(--primary) 40px, transparent 40px, transparent 80px)',
          zIndex: 0
        }} />
        
        {/* Glowing radial blob motif anchored top-right */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '350px',
          height: '350px',
          background: 'var(--primary)',
          filter: 'blur(100px)',
          opacity: 0.15,
          borderRadius: '50%',
          zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '4px',
              background: 'var(--accent)',
              transform: 'rotate(-3deg)'
            }} />
            <span className="eyebrow" style={{ color: 'var(--secondary)', fontWeight: 700, letterSpacing: '0.12em' }}>
              Full Catalog
            </span>
          </div>
          <h1 style={{ 
            fontFamily: '"Archivo Black", sans-serif', 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: 900, 
            lineHeight: 1.05, 
            textTransform: 'uppercase', 
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            color: 'var(--text)'
          }}>
            Every Stick. Every Racket. <span className="gradient-text">Every Edge.</span>
          </h1>
          <p className="hero-subtitle" style={{ color: 'var(--muted)', maxWidth: '680px', fontSize: '1.15rem', lineHeight: 1.6 }}>
            Filter by sport, flex, weight, or skill level — then step onto the field with absolute engineering authority.
          </p>
        </div>
      </section>

      {/* Main Filter and Product Grid Layout */}
      <section className="section" style={{ padding: '40px 0 100px 0' }}>
        <div className="container">
          
          {/* Top Control Bar with Quick Filters and Sorting */}
          <div style={{ 
            background: 'var(--surface)', 
            border: '1px solid var(--border)', 
            borderRadius: '16px', 
            padding: '24px', 
            marginBottom: '40px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* Category Filter Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', minWidth: '100px' }}>
                Category:
              </span>
              <div className="filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['All', 'Stick', 'Paddle', 'Kit'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setVisibleCount(8); }}
                    className={`btn-ghost ${activeCategory === cat ? 'active' : ''}`}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '30px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: activeCategory === cat ? 'var(--primary)' : 'var(--surface-2)',
                      color: activeCategory === cat ? '#FFFFFF' : 'var(--text)',
                      border: '1px solid transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {cat === 'All' ? 'All Gear' : cat + 's'}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid for fine-tuning filters */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '24px', 
              paddingTop: '20px', 
              borderTop: '1px solid var(--border)' 
            }}>
              
              {/* Skill level dropdown */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>
                  Skill Level
                </label>
                <select 
                  value={activeSkill} 
                  onChange={(e) => { setActiveSkill(e.target.value); setVisibleCount(8); }}
                  style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--text)' }}
                >
                  <option value="All">All Skill Levels</option>
                  <option value="Beginner">Beginner / Club</option>
                  <option value="Intermediate">Intermediate / State</option>
                  <option value="Pro">Professional Elite</option>
                </select>
              </div>

              {/* Flex level dropdown */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>
                  Flex Profile
                </label>
                <select 
                  value={activeFlex} 
                  onChange={(e) => { setActiveFlex(e.target.value); setVisibleCount(8); }}
                  style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--text)' }}
                >
                  <option value="All">All Flex Types</option>
                  <option value="High">Stiff / High Response</option>
                  <option value="Medium">Medium / Forgiving</option>
                  <option value="Low">Low Bow / Soft Control</option>
                </select>
              </div>

              {/* Sort selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>
                  Sort By
                </label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--text)' }}
                >
                  <option value="default">Default Match-Grade</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                  <option value="bestsellers">Bestselling Elite</option>
                </select>
              </div>

              {/* Max Price Range Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Max Price
                  </label>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                    ₹{priceLimit.toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="15000" 
                  step="500"
                  value={priceLimit}
                  onChange={(e) => { setPriceLimit(Number(e.target.value)); setVisibleCount(8); }}
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

            </div>
          </div>

          {/* Error notification if any */}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '30px' }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Loading state spinner */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0' }}>
              <Spinner size="lg" color="primary" />
            </div>
          ) : sortedProducts.length === 0 ? (
            /* Empty State Container */
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 40px', 
              background: 'var(--surface)', 
              borderRadius: '16px', 
              border: '1px solid var(--border)' 
            }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🏑</span>
              <h3 style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '1.5rem', marginBottom: '8px' }}>No gear matches that filter</h3>
              <p style={{ color: 'var(--muted)', marginBottom: '24px', maxWidth: '400px', margin: '8px auto 24px auto' }}>
                Try loosening your search filters or resetting to view the full championship lineup.
              </p>
              <Button onClick={() => {
                setActiveCategory('All');
                setActiveSkill('All');
                setActiveFlex('All');
                setPriceLimit(15000);
              }} variant="secondary">
                Reset All Filters
              </Button>
            </div>
          ) : (
            /* Dynamic Responsive Product Grid */
            <div>
              <div className="grid-4" style={{ gap: 'var(--gutter)' }}>
                {paginatedProducts.map((product, idx) => {
                  
                  // Injected Comparison Banner every 4 products
                  const showBanner = idx === 4;

                  return (
                    <React.Fragment key={product._id || product.slug}>
                      {showBanner && (
                        <div style={{ 
                          gridColumn: '1 / -1', 
                          background: 'linear-gradient(135deg, var(--secondary) 0%, #052a4b 100%)', 
                          borderRadius: '16px', 
                          padding: '32px 40px',
                          display: 'flex', 
                          flexWrap: 'wrap',
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          gap: '24px',
                          marginBottom: '20px',
                          color: '#FFFFFF'
                        }}>
                          <div>
                            <span className="badge" style={{ background: 'var(--accent)', color: 'var(--text)', marginBottom: '8px', fontWeight: 800 }}>
                              Decision Helper
                            </span>
                            <h3 style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '1.8rem', color: '#FFFFFF', margin: '4px 0 8px 0' }}>
                              Can't Decide? Compare Flex Ratings Side By Side.
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '600px', margin: 0, fontSize: '0.95rem' }}>
                              Stiffer flex generates maximum striking velocity, while balanced composite matrices elevate defensive receptions. Find your absolute peak match configuration.
                            </p>
                          </div>
                          <Button onClick={() => navigate('/about')} variant="primary" style={{ background: 'var(--accent)', color: 'var(--text)', border: 'none' }}>
                            Learn Core Tech
                          </Button>
                        </div>
                      )}

                      {/* Individual Sport Card Design */}
                      <div className="card" style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: '0 14px 30px -18px rgba(16,35,26,0.25)',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/product/${product.slug}`)}
                      >
                        {/* Premium Featured Rotated Pill Badge */}
                        {product.badge && product.badge !== 'None' && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            background: 'var(--accent)',
                            color: 'var(--text)',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            transform: 'rotate(-4deg)',
                            boxShadow: '0 4px 10px rgba(245,166,35,0.4)',
                            zIndex: 2
                          }}>
                            {product.badge}
                          </div>
                        )}

                        {/* Product Image Area */}
                        <div style={{ position: 'relative', background: 'var(--surface-2)', paddingBottom: '100%', overflow: 'hidden' }}>
                          <img 
                            src={product.images} 
                            alt={product.name}
                            className="img-cover"
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease'
                            }}
                          />
                        </div>

                        {/* Product Info Block */}
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary)' }}>
                              {product.subCategory || product.category}
                            </span>
                            <span style={{ fontSize: '0.75rem', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, color: 'var(--muted)' }}>
                              {product.skillLevel}
                            </span>
                          </div>

                          <h3 style={{ 
                            fontFamily: '"Archivo Black", sans-serif', 
                            fontSize: '1.15rem', 
                            fontWeight: 900, 
                            lineHeight: 1.2, 
                            color: 'var(--text)',
                            marginBottom: '10px',
                            textTransform: 'uppercase',
                            flexGrow: 1
                          }}>
                            {product.name}
                          </h3>

                          {/* Flex and Weight Mini stats */}
                          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', fontSize: '0.8rem', color: 'var(--muted)' }}>
                            {product.flexRating && product.flexRating !== 'None' && (
                              <span><strong>Flex:</strong> {product.flexRating}</span>
                            )}
                            {product.weight && (
                              <span><strong>Wt:</strong> {product.weight}</span>
                            )}
                          </div>

                          {/* Pricing & Call To Action Row */}
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            marginTop: 'auto', 
                            paddingTop: '12px', 
                            borderTop: '1px solid var(--border)' 
                          }}>
                            <div>
                              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)', fontFamily: '"Archivo Black", sans-serif' }}>
                                ₹{product.price.toLocaleString()}
                              </div>
                              {product.compareAtPrice > product.price && (
                                <div style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: 'var(--muted)' }}>
                                  ₹{product.compareAtPrice.toLocaleString()}
                                </div>
                              )}
                            </div>

                            {/* Avoid card click bubbling when clicking quick-add */}
                            <button 
                              className="btn-primary" 
                              style={{ 
                                padding: '8px 14px', 
                                fontSize: '0.8rem',
                                borderRadius: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontWeight: 700
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                            >
                              Add +
                            </button>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* High Performance Load More Action block */}
              {sortedProducts.length > visibleCount && (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                  <Button 
                    onClick={() => setVisibleCount(prev => prev + 8)} 
                    variant="secondary"
                    size="lg"
                    style={{ minWidth: '220px', fontWeight: 700, textTransform: 'uppercase' }}
                  >
                    Load More Gear
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Trust & Craftsmanship Scoreboard Summary banner */}
      <section className="section" style={{ background: 'var(--surface-2)', padding: '80px 0' }}>
        <div className="container">
          <div className="grid-3" style={{ gap: '30px' }}>
            <div className="card-white" style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <span className="stat-value" style={{ 
                fontFamily: '"Archivo Black", sans-serif', 
                fontSize: '3rem', 
                fontWeight: 900, 
                color: 'var(--primary)',
                display: 'block',
                marginBottom: '8px',
                borderBottom: '2px solid var(--accent)',
                paddingBottom: '8px',
                width: 'fit-content',
                margin: '0 auto 12px auto'
              }}>
                100%
              </span>
              <span className="stat-label" style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--text)' }}>
                Carbon-Cured Integrity
              </span>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                Every model is laid up by hand across layered carbon weave and pressure baked for zero-flinch strikes.
              </p>
            </div>

            <div className="card-white" style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <span className="stat-value" style={{ 
                fontFamily: '"Archivo Black", sans-serif', 
                fontSize: '3rem', 
                fontWeight: 900, 
                color: 'var(--primary)',
                display: 'block',
                marginBottom: '8px',
                borderBottom: '2px solid var(--accent)',
                paddingBottom: '8px',
                width: 'fit-content',
                margin: '0 auto 12px auto'
              }}>
                14
              </span>
              <span className="stat-label" style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--text)' }}>
                National Teams Equipped
              </span>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                Trusted on international turfs under grueling competitive conditions. Built for world-class speed.
              </p>
            </div>

            <div className="card-white" style={{ background: 'var(--surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <span className="stat-value" style={{ 
                fontFamily: '"Archivo Black", sans-serif', 
                fontSize: '3rem', 
                fontWeight: 900, 
                color: 'var(--primary)',
                display: 'block',
                marginBottom: '8px',
                borderBottom: '2px solid var(--accent)',
                paddingBottom: '8px',
                width: 'fit-content',
                margin: '0 auto 12px auto'
              }}>
                2-Yr
              </span>
              <span className="stat-label" style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--text)' }}>
                Impact Guarantee
              </span>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                Worry-free composite layup guarantees no premature structural fractures or composite splits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <div className="cta-section" style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
        padding: '80px 0',
        color: '#FFFFFF',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)', letterSpacing: '0.15em', fontWeight: 800, fontSize: '0.85rem' }}>
            Next Level Control
          </span>
          <h2 style={{ 
            fontFamily: '"Archivo Black", sans-serif', 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: 900, 
            color: '#FFFFFF', 
            margin: '12px auto 20px auto', 
            textTransform: 'uppercase',
            maxWidth: '800px'
          }}>
            Need a Fully Custom Team Build?
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '600px', margin: '0 auto 30px auto', fontSize: '1.1rem' }}>
            We engineer bespoke stiffness templates and custom shaft diameters for collegiate programs and field hockey clubs.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Button onClick={() => navigate('/contact')} style={{ background: 'var(--accent)', color: 'var(--text)', border: 'none' }}>
              Enquire Team Order
            </Button>
            <Button onClick={() => navigate('/about')} variant="ghost" style={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}>
              Explore Craftsmanship
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}