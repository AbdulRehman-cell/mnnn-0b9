import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Badge, Spinner, Alert, Stat } from '../components/ui';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  
  // Checkout Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const navigate = useNavigate();

  // Load Cart Items from Server
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cartitems');
      setCartItems(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Could not retrieve your cart items. Please refresh or try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update Cart Quantity
  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) {
      removeItem(itemId);
      return;
    }
    try {
      await axios.put(`/api/cartitems/${itemId}`, { quantity: newQty });
      // Instantly dispatch event to sync App.jsx count badge
      window.dispatchEvent(new Event('cart-updated'));
      fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update product quantity.');
    }
  };

  // Remove Item
  const removeItem = async (itemId) => {
    try {
      await axios.delete(`/api/cartitems/${itemId}`);
      window.dispatchEvent(new Event('cart-updated'));
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item from your gear cart.');
    }
  };

  // Calculate Subtotals
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const shippingFee = totalAmount > 15000 ? 0 : 450;
  const grandTotal = totalAmount + shippingFee;

  // Simulate Order Submission
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !address || !postalCode) {
      setError('Please provide all required shipping details.');
      return;
    }

    setCheckoutLoading(true);
    setError('');

    try {
      // Create a mock order process: Clear all cart items sequentially
      for (const item of cartItems) {
        await axios.delete(`/api/cartitems/${item._id}`);
      }

      // Notify header count to update
      window.dispatchEvent(new Event('cart-updated'));
      
      // Success state
      setCheckoutSuccess(true);
      setCartItems([]);
      
      // Reset form fields
      setFullName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setPostalCode('');
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An error occurred while placing your championship order. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="cart-page" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      
      {/* Dynamic Brand MOTIF Header Strip */}
      <div style={{
        background: 'repeating-linear-gradient(120deg, rgba(30,122,61,0.06) 0px, rgba(30,122,61,0.06) 40px, transparent 40px, transparent 80px)',
        padding: '40px 0',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Kinetic design light blob */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'var(--primary)',
          opacity: 0.1,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          borderRadius: '50%'
        }} />

        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '48px',
              height: '4px',
              background: 'var(--accent)',
              transform: 'rotate(-3deg)'
            }} />
            <span className="eyebrow" style={{ color: 'var(--secondary)', fontWeight: 700 }}>
              AMI STRIKE COMMAND
            </span>
          </div>
          <h1 style={{ 
            fontFamily: '"Archivo Black", sans-serif', 
            fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', 
            fontWeight: 900, 
            letterSpacing: '-0.02em', 
            color: 'var(--text)',
            margin: 0,
            textTransform: 'uppercase'
          }}>
            YOUR GEAR <span className="gradient-text">LOCKER</span>
          </h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--muted)', fontSize: '1.1rem' }}>
            Verify your specifications, dial in the quantities, and claim your advantage before game day.
          </p>
        </div>
      </div>

      {/* Main Grid Section */}
      <section className="section" style={{ padding: '40px 0' }}>
        <div className="container">
          {error && (
            <div style={{ marginBottom: '24px' }}>
              <Alert variant="error" title="Action Blocked">
                {error}
              </Alert>
            </div>
          )}

          {checkoutSuccess ? (
            <div className="animate-in" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '650px', margin: '0 auto' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'var(--surface-2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 24px auto',
                border: '2px solid var(--primary)'
              }}>
                <span style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>✓</span>
              </div>
              <h2 style={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 900, color: 'var(--text)', textTransform: 'uppercase', marginBottom: '16px' }}>
                ORDER LOCKED IN.
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '32px' }}>
                Your championship-grade weapons are being prepared in our workshop. A gear specialist will dispatch tracking coordinates to your email shortly. Prepare to dominate.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <Link to="/shop" className="btn-primary" style={{ padding: '14px 28px', textDecoration: 'none' }}>
                  SHOP NEW ARRIVALS
                </Link>
                <Link to="/" className="btn-secondary" style={{ padding: '14px 28px', textDecoration: 'none' }}>
                  RETURN HOME
                </Link>
              </div>
            </div>
          ) : loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
              <Spinner size="lg" color="primary" />
              <p style={{ marginTop: '16px', color: 'var(--muted)', fontFamily: '"Inter", sans-serif' }}>
                Securing live inventory records...
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="animate-in" style={{ textAlign: 'center', padding: '80px 20px' }}>
              <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: '20px' }}>⚔️</span>
              <h2 style={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text)' }}>
                YOUR LOCKER IS EMPTY
              </h2>
              <p style={{ color: 'var(--muted)', maxWidth: '500px', margin: '12px auto 32px auto', fontSize: '1.1rem' }}>
                You haven't added any field hockey sticks, paddle rackets, or gear to your current roster yet.
              </p>
              <Link to="/shop" className="btn-primary" style={{ display: 'inline-block', padding: '16px 36px', textDecoration: 'none' }}>
                DISCOVER THE RANGE
              </Link>
            </div>
          ) : (
            <div className="grid grid-2" style={{ gridTemplateColumns: '1.6fr 1fr', gap: '32px', alignItems: 'start' }}>
              
              {/* Left Column: Cart Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border)', paddingBottom: '12px' }}>
                  <h3 style={{ fontFamily: '"Archivo Black", sans-serif', margin: 0, textTransform: 'uppercase', fontSize: '1.25rem' }}>
                    FIELD ACTIVE ITEMS ({cartItems.length})
                  </h3>
                  <Link to="/shop" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>
                    + Add More Gear
                  </Link>
                </div>

                {cartItems.map((item) => (
                  <div key={item._id} className="card animate-in" style={{
                    display: 'flex',
                    gap: '20px',
                    padding: '20px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    position: 'relative'
                  }}>
                    {/* Item Thumbnail */}
                    <div style={{ 
                      width: '100px', 
                      height: '100px', 
                      borderRadius: '8px', 
                      background: 'var(--surface-2)', 
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1px solid var(--border)'
                    }}>
                      <img 
                        src={item.image || 'https://picsum.photos/seed/gear-fallback/150/150'} 
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Details Block */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ 
                            fontFamily: '"Archivo Black", sans-serif', 
                            fontSize: '1.1rem', 
                            margin: '0 0 4px 0', 
                            color: 'var(--text)',
                            textTransform: 'uppercase'
                          }}>
                            {item.name}
                          </h4>
                          <button 
                            onClick={() => removeItem(item._id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#DE3C3C',
                              fontSize: '0.9rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              transition: 'background 0.2s'
                            }}
                            title="Remove item"
                            onMouseEnter={(e) => e.target.style.background = '#FFEBEB'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                          >
                            REMOVE
                          </button>
                        </div>
                        <p style={{ margin: '0 0 8px 0', color: 'var(--muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                          PRESET FLEX & SIZE CERTIFIED
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Quantity Manipulator */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', background: 'var(--surface-2)' }}>
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                            style={{ padding: '6px 12px', border: 'none', background: 'transparent', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            -
                          </button>
                          <span style={{ padding: '0 12px', fontWeight: 'bold', color: 'var(--text)' }}>
                            {item.quantity || 1}
                          </span>
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                            style={{ padding: '6px 12px', border: 'none', background: 'transparent', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            +
                          </button>
                        </div>

                        {/* Price Display */}
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ 
                            fontFamily: '"Archivo Black", sans-serif', 
                            fontSize: '1.15rem', 
                            color: 'var(--primary)' 
                          }}>
                            ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Secure Guarantee Strip */}
                <div style={{ 
                  background: 'var(--surface-2)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px', 
                  padding: '16px 20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginTop: '12px'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text)', textTransform: 'uppercase' }}>
                      AMI DEFENSIVE ASSURANCE GUARANTEE
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                      All composite hockey sticks and paddle rackets feature our elite 1-Year structural fracture warranty.
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Checkout & Summary */}
              <div>
                <div className="card" style={{
                  background: 'var(--surface)',
                  border: '1.5px solid var(--primary)',
                  borderRadius: '14px',
                  padding: '28px',
                  boxShadow: 'var(--shadow-lg)',
                  position: 'sticky',
                  top: '120px'
                }}>
                  <h3 style={{ 
                    fontFamily: '"Archivo Black", sans-serif', 
                    fontSize: '1.3rem', 
                    margin: '0 0 20px 0', 
                    textTransform: 'uppercase',
                    borderBottom: '2px solid var(--border)',
                    paddingBottom: '12px'
                  }}>
                    ORDER SUMMARY
                  </h3>

                  {/* Summary Rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
                      <span>Subtotal ({cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0)} items)</span>
                      <span style={{ fontWeight: 600 }}>₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
                      <span>Championship Delivery</span>
                      {shippingFee === 0 ? (
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>FREE OVER ₹15k</span>
                      ) : (
                        <span>₹{shippingFee}</span>
                      )}
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', fontSize: '1.05rem' }}>Grand Total</span>
                      <span style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '1.5rem', color: 'var(--text)' }}>
                        ₹{grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Form */}
                  <form onSubmit={handleCheckout} style={{ borderTop: '2px solid var(--border)', paddingTop: '20px' }}>
                    <h4 style={{ 
                      fontFamily: '"Archivo Black", sans-serif', 
                      fontSize: '0.95rem', 
                      margin: '0 0 16px 0', 
                      color: 'var(--secondary)', 
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      DEPLOY TO FIELD ADDRESS
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', color: 'var(--text)' }}>
                          Full Name *
                        </label>
                        <input 
                          type="text" 
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Captain Sandeep" 
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', color: 'var(--text)' }}>
                            Email Address *
                          </label>
                          <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="captain@team.com" 
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', color: 'var(--text)' }}>
                            Active Contact Number
                          </label>
                          <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210" 
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', color: 'var(--text)' }}>
                          Delivery Address *
                        </label>
                        <textarea 
                          required
                          rows="2"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Stadium Road, Block C, Club Headquarters" 
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', color: 'var(--text)' }}>
                            Postal / Zip Code *
                          </label>
                          <input 
                            type="text" 
                            required
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="110001" 
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', color: 'var(--text)' }}>
                            Payment Portal *
                          </label>
                          <select 
                            value={paymentMethod} 
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface-2)' }}
                          >
                            <option value="UPI">UPI / NetBanking</option>
                            <option value="CARD">Credit/Debit Card</option>
                            <option value="COD">Cash on Turf Delivery</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn-primary" 
                      disabled={checkoutLoading}
                      style={{ 
                        width: '100%', 
                        padding: '16px', 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold',
                        textAlign: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      {checkoutLoading ? (
                        <>
                          <Spinner size="sm" color="white" /> SECURING LIVE STOCK...
                        </>
                      ) : (
                        `CONFIRM SHIPMENT • ₹${grandTotal.toLocaleString('en-IN')}`
                      )}
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* Craftsmanship & Precision Highlight Strip */}
      <section className="section" style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid grid-3">
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>⚡</span>
              <h4 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', margin: '0 0 8px 0', fontSize: '1rem' }}>
                KINETIC PRECISION
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
                Every stick carbon weave is hand-laid and heat-cured under high-pressure conditions.
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>✈️</span>
              <h4 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', margin: '0 0 8px 0', fontSize: '1rem' }}>
                EXPRESS TRACKED SHIPPING
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
                Fully insured transport via secure sports freight lines. Instant tracking updates via SMS.
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>🔥</span>
              <h4 style={{ fontFamily: '"Archivo Black", sans-serif', textTransform: 'uppercase', margin: '0 0 8px 0', fontSize: '1rem' }}>
                CLUB LEVEL DISCOUNTED RATIO
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
                Need custom branding or bulk gear sets? Our specialized team works directly with academies worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}