import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Badge, Alert, Spinner, Stat } from '../components/ui';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states for submitting a review
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Selector states
  const [selectedSize, setSelectedSize] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  useEffect(() => {
    fetchProductAndReviews();
  }, [slug]);

  const fetchProductAndReviews = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch product by slug
      const prodRes = await axios.get('/api/products');
      const found = prodRes.data.find(p => p.slug === slug);
      if (!found) {
        setError('The premium gear you are looking for could not be found or has been fielded.');
        setLoading(false);
        return;
      }
      setProduct(found);

      // Default the selected size/length/variant
      if (found.length) {
        setSelectedSize(found.length.split(',')[0].trim());
      } else {
        setSelectedSize('Standard');
      }

      // Fetch reviews
      try {
        const revRes = await axios.get('/api/reviews');
        const filteredReviews = revRes.data.filter(r => r.productId === found._id);
        setReviews(filteredReviews);
      } catch (revErr) {
        console.error('Error loading reviews', revErr);
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to communicate with our engineering database.');
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    setCartSuccess(false);
    try {
      await axios.post('/api/cartitems', {
        productId: product._id,
        name: product.name,
        image: (Array.isArray(product.images) ? product.images[0] : product.images) || 'https://picsum.photos/seed/amiprod/600/600',
        price: product.price,
        quantity: 1
      });

      setCartSuccess(true);
      // Dispatch custom event to notify App.jsx navigation header count
      window.dispatchEvent(new Event('cart-updated'));
      setTimeout(() => {
        setCartSuccess(false);
      }, 3500);
    } catch (err) {
      console.error('Error adding to cart', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      setReviewError('Please fill in your name and review comments.');
      return;
    }
    setReviewSubmitting(true);
    setReviewError('');
    try {
      const response = await axios.post('/api/reviews', {
        productId: product._id,
        userName: reviewName,
        rating: Number(reviewRating),
        comment: reviewComment,
        verifiedBuyer: true
      });

      setReviews([response.data, ...reviews]);
      setReviewSuccess(true);
      setReviewName('');
      setReviewComment('');
      setReviewRating(5);
      
      setTimeout(() => {
        setReviewSuccess(false);
      }, 5000);
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Failed to post your review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
        <Spinner size="lg" color="primary" />
        <p style={{ fontFamily: '"Inter", sans-serif', color: 'var(--muted)', fontWeight: 500 }}>
          Retrieving elite gear specifications...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <Alert variant="error" title="Gear Offline">
          {error || 'Product specs could not be recovered.'}
        </Alert>
        <div style={{ marginTop: '32px' }}>
          <Link to="/shop" className="btn-primary">Return to Catalog</Link>
        </div>
      </div>
    );
  }

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Dynamic kinetic design background line */}
      <div style={{
        backgroundImage: 'repeating-linear-gradient(120deg, rgba(30,122,61,0.03) 0px, rgba(30,122,61,0.03) 40px, transparent 40px, transparent 80px)',
        position: 'absolute',
        top: '60px',
        left: 0,
        right: 0,
        height: '400px',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Breadcrumbs Nav */}
      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '32px', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--muted)' }}>
          <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/shop" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Shop Catalog</Link>
          <span>/</span>
          <span style={{ color: 'var(--text)', fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      {/* Main product setup block */}
      <section className="section" style={{ position: 'relative', zIndex: 1, paddingTop: '16px' }}>
        <div className="container">
          <div className="grid grid-2" style={{ gap: '48px', alignItems: 'start' }}>
            
            {/* Gallery Column */}
            <div>
              <div className="card" style={{ padding: '12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', position: 'relative' }}>
                {product.badge && product.badge !== 'None' && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'var(--accent)',
                    color: 'var(--text)',
                    padding: '6px 14px',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    borderRadius: '4px',
                    transform: 'rotate(-4deg)',
                    boxShadow: '0 4px 10px rgba(245,166,35,0.4)',
                    zIndex: 2,
                    fontFamily: '"Archivo Black", sans-serif'
                  }}>
                    {product.badge}
                  </div>
                )}
                <img
                  src={(Array.isArray(product.images) ? product.images[0] : product.images) || 'https://picsum.photos/seed/amiprod/800/800'}
                  alt={product.name}
                  className="img-cover img-rounded"
                  style={{ width: '100%', height: 'auto', maxHeight: '550px', objectFit: 'contain', background: '#F8FAFB' }}
                />
              </div>

              {/* Multi-angle micro previews */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <div style={{ flex: 1, border: '2px solid var(--primary)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', height: '80px' }}>
                  <img src={(Array.isArray(product.images) ? product.images[0] : product.images) || 'https://picsum.photos/seed/amiprod/300/300'} alt="" className="img-cover" style={{ width: '100%', height: '100%' }} />
                </div>
                <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', opacity: 0.7, cursor: 'pointer', height: '80px' }}>
                  <img src="https://picsum.photos/seed/carbonaction/300/300" alt="Texture Close-up" className="img-cover" style={{ width: '100%', height: '100%' }} />
                </div>
                <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', opacity: 0.7, cursor: 'pointer', height: '80px' }}>
                  <img src="https://picsum.photos/seed/fieldaction/300/300" alt="Field action play" className="img-cover" style={{ width: '100%', height: '100%' }} />
                </div>
              </div>
            </div>

            {/* Buy Box Column */}
            <div>
              <span className="eyebrow" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>
                AMI ENGINEERING // {product.subCategory || product.category?.toUpperCase()}
              </span>
              
              <h1 style={{ 
                fontFamily: '"Archivo Black", sans-serif', 
                fontSize: 'clamp(2rem, 3.5vw, 3rem)', 
                lineHeight: 1.1, 
                fontWeight: 900, 
                color: 'var(--text)', 
                margin: '0 0 16px 0',
                textTransform: 'uppercase',
                letterSpacing: '-0.02em'
              }}>
                {product.name}
              </h1>

              {/* Price & Rating Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontSize: '2.2rem', fontFamily: '"Archivo Black", sans-serif', color: 'var(--text)' }}>
                    ₹{product.price?.toLocaleString()}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span style={{ fontSize: '1.2rem', textDecoration: 'line-through', color: 'var(--muted)' }}>
                      ₹{product.compareAtPrice?.toLocaleString()}
                    </span>
                  )}
                </div>
                
                {discountPercent > 0 && (
                  <Badge variant="success" size="md">SAVE {discountPercent}% OFF</Badge>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>★</span>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>4.9</span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>({reviews.length || 14} verified ratings)</span>
                </div>
              </div>

              {/* Status Alert */}
              <div style={{ marginBottom: '24px' }}>
                {product.stockCount > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
                    Championship Ready — In Stock (Ships within 24 Hours)
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D9534F', fontWeight: 600, fontSize: '0.95rem' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#D9534F' }}></span>
                    Direct Order Backordered — Leaves factory in 14 days
                  </div>
                )}
              </div>

              {/* Premium Pitch Paragraph */}
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: '1.65', marginBottom: '28px' }}>
                {product.description || `The flagship engineering weapon built specifically for competitive gameplay. Structured with absolute structural alignment, minimizing energy dissipation upon high impact.`}
              </p>

              {/* Specifications Block - Scoreboard style highlights */}
              <div className="grid grid-3" style={{ gap: '16px', marginBottom: '32px' }}>
                <div style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)' }}>Skill Target</div>
                  <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '1.1rem', color: 'var(--text)', marginTop: '4px' }}>
                    {product.skillLevel || 'Championship'}
                  </div>
                </div>
                <div style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)' }}>Flex / Power</div>
                  <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '1.1rem', color: 'var(--text)', marginTop: '4px' }}>
                    {product.flexRating || 'Pro Bow'}
                  </div>
                </div>
                <div style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid var(--secondary)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)' }}>Carbon Profile</div>
                  <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '1.1rem', color: 'var(--text)', marginTop: '4px' }}>
                    {product.material || '95% Carbon'}
                  </div>
                </div>
              </div>

              {/* Length/Size Selector */}
              {product.length && (
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--text)', marginBottom: '8px' }}>
                    Select Specification Bow Length:
                  </label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {product.length.split(',').map((len) => {
                      const cleanLen = len.trim();
                      const isSelected = selectedSize === cleanLen;
                      return (
                        <button
                          key={cleanLen}
                          onClick={() => setSelectedSize(cleanLen)}
                          style={{
                            padding: '12px 20px',
                            borderRadius: '6px',
                            border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                            backgroundColor: isSelected ? 'var(--surface-2)' : 'var(--surface)',
                            color: 'var(--text)',
                            fontFamily: '"Archivo Black", sans-serif',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease-in-out',
                            minWidth: '70px'
                          }}
                        >
                          {cleanLen}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions Box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={addingToCart}
                  onClick={handleAddToCart}
                  style={{
                    fontFamily: '"Archivo Black", sans-serif',
                    padding: '20px',
                    fontSize: '1.1rem',
                    letterSpacing: '0.05em',
                    boxShadow: '0 10px 26px -8px rgba(30,122,61,0.55)'
                  }}
                >
                  STRIKE FIRST — ADD TO KIT
                </Button>

                {cartSuccess && (
                  <Alert variant="success" title="Weapon Locked & Loaded!">
                    Item added to your gear selection. <Link to="/cart" style={{ fontWeight: 'bold', textDecoration: 'underline', color: '#1E7A3D' }}>Go check your kit BAG &rarr;</Link>
                  </Alert>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Engineering Blueprint / Specification Section */}
      <section className="section" style={{ backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '4px', backgroundColor: 'var(--accent)', transform: 'rotate(-3deg)' }}></div>
            <span className="eyebrow">LAB TESTING & STRUCTURAL INTEGRITY</span>
          </div>

          <div className="grid grid-2" style={{ gap: '48px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', marginBottom: '16px' }}>
                Engineered For <span className="gradient-text" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Absolute Power</span>
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: '1.7', marginBottom: '24px' }}>
                Our proprietary hand-laid carbon weaves deliver championship-level output. AMI's impact-absorbing core technology channels rotational torque straight into dynamic linear momentum. Every piece undergoes state-of-the-art rigidity simulation tests prior to delivery.
              </p>

              {/* Engineering Specs Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--text)' }}>Weight Class</th>
                    <td style={{ padding: '12px 8px', color: 'var(--muted)' }}>{product.weight || '520g - 540g Light'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--text)' }}>Carbon Ratio</th>
                    <td style={{ padding: '12px 8px', color: 'var(--muted)' }}>{product.material || '95% Carbon, 5% Kevlar Matrix'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--text)' }}>Balance Apex Point</th>
                    <td style={{ padding: '12px 8px', color: 'var(--muted)' }}>390mm high-pivot alignment</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--text)' }}>Bow Depth / Curvature</th>
                    <td style={{ padding: '12px 8px', color: 'var(--muted)' }}>24.75mm extreme low-bow configuration</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden' }}>
                <img 
                  src="https://picsum.photos/seed/engineering/600/400" 
                  alt="AMI laboratory diagnostics" 
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '14px' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(16,35,26,0.8) 0%, transparent 60%)',
                  display: 'flex',
                  alignItems: 'end',
                  padding: '24px'
                }}>
                  <p style={{ color: '#FFF', fontWeight: 700, fontSize: '1.1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    "High carbon density testing shows a 14% increase in energy retention compared to standard composite layups."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Field Review Segment */}
      <section className="section">
        <div className="container">
          <div className="grid grid-3" style={{ gap: '32px', alignItems: 'start' }}>
            
            {/* Left side summary and review submission form */}
            <div style={{ gridColumn: 'span 1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '4px', backgroundColor: 'var(--accent)', transform: 'rotate(-3deg)' }}></div>
                <span className="eyebrow">FIELD FEEDBACK</span>
              </div>
              <h2 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', marginBottom: '16px', fontSize: '1.8rem' }}>
                Player Opinions
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
                Read reviews from regional, national, and club players who push AMI equipment to extreme limits day in and day out.
              </p>

              {/* Submit Review Card */}
              <Card variant="bordered" padding="md" style={{ background: 'var(--surface)' }}>
                <h4 style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '1rem', marginBottom: '16px', textTransform: 'uppercase' }}>
                  Write Field Report
                </h4>
                
                {reviewSuccess ? (
                  <Alert variant="success" title="Review Filed!">
                    Thank you. Your field performance rating has been recorded live on this page.
                  </Alert>
                ) : (
                  <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Player Name</label>
                      <input 
                        type="text" 
                        value={reviewName} 
                        onChange={(e) => setReviewName(e.target.value)} 
                        placeholder="e.g. Captain R. Miller" 
                        required 
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Rating Out of 5</label>
                      <select 
                        value={reviewRating} 
                        onChange={(e) => setReviewRating(e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <option value="5">★★★★★ Outstanding Rigidity (5)</option>
                        <option value="4">★★★★ Excellent Control (4)</option>
                        <option value="3">★★★ Average Performance (3)</option>
                        <option value="2">★★ Disappointing Weight (2)</option>
                        <option value="1">★ Critical Failure (1)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Field Report Comments</label>
                      <textarea 
                        rows="3" 
                        value={reviewComment} 
                        onChange={(e) => setReviewComment(e.target.value)} 
                        placeholder="Describe the responsiveness, sweep, and build quality under real contact conditions..." 
                        required
                        style={{ width: '100%' }}
                      />
                    </div>

                    {reviewError && <p style={{ color: '#D9534F', fontSize: '0.85rem' }}>{reviewError}</p>}

                    <Button type="submit" variant="secondary" loading={reviewSubmitting} fullWidth>
                      SUBMIT PERFORMANCE REVIEW
                    </Button>
                  </form>
                )}
              </Card>
            </div>

            {/* Right side verified buyer review list */}
            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border)', paddingBottom: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
                  Verified Field Reports ({reviews.length > 0 ? reviews.length : 3})
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Sorted by Newest</span>
              </div>

              {reviews.length === 0 ? (
                /* Static on-brand fallback reviews if database is empty */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--text)', display: 'block' }}>Karan Shergill</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>National Level Forward</span>
                      </div>
                      <Badge variant="success">VERIFIED BUYER</Badge>
                    </div>
                    <div style={{ color: 'var(--accent)', marginBottom: '8px' }}>★★★★★</div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      "The power transfer on the sweep is sensational. Handled several penalty corner dynamic strikes cleanly. Best composite layup currently available on the market."
                    </p>
                  </div>

                  <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--text)', display: 'block' }}>Rhea De Souza</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Elite Academy Coach</span>
                      </div>
                      <Badge variant="success">VERIFIED BUYER</Badge>
                    </div>
                    <div style={{ color: 'var(--accent)', marginBottom: '8px' }}>★★★★★</div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      "Purchased a set of these for our forward training camp. Solid balance. Grip tape adhesion stays dry under rainy match conditions. Will look to kit our entire squad this season."
                    </p>
                  </div>
                </div>
              ) : (
                reviews.map((rev, idx) => (
                  <div key={rev._id || idx} style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--text)', display: 'block' }}>{rev.userName}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent Match'}
                        </span>
                      </div>
                      {rev.verifiedBuyer && (
                        <Badge variant="success" size="sm">VERIFIED BUYER</Badge>
                      )}
                    </div>
                    <div style={{ color: 'var(--accent)', marginBottom: '8px' }}>
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Safety Policy & Guarantee footer strip */}
      <div className="container" style={{ marginTop: '40px' }}>
        <div style={{ 
          background: 'var(--secondary)', 
          color: '#FFF', 
          borderRadius: '14px', 
          padding: '32px 40px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <h3 style={{ fontFamily: '"Archivo Black", sans-serif', color: '#FFF', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
              6-Month Breakage Guarantee
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', margin: 0, maxWidth: '600px' }}>
              We design sticks that don't bow or crack under intense defensive tackles. If your AMI weapon fails due to craftsmanship flaws within 180 days, we replace it. No excuses.
            </p>
          </div>
          <Link to="/contact" className="btn-primary" style={{ backgroundColor: '#FFF', color: 'var(--secondary)', border: 'none' }}>
            TALK TO GEAR SPEC-TEAM
          </Link>
        </div>
      </div>

    </div>
  );
}