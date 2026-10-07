import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Badge, Spinner } from '../components/ui';

export default function About() {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states for institutional/bulk inquiries
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Bulk-Team Order',
    message: ''
  });

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/teammembers');
        setTeamMembers(response.data);
        setError('');
      } catch (err) {
        console.error('Failed to load team members:', err);
        // Fallback team members if API is empty or failing
        setTeamMembers([
          {
            _id: '1',
            name: 'Vikram "Vik" Malhotra',
            role: 'Head of Carbon Layup & Engineering',
            bio: '22 years designing composite structures. Former aerospace engineer who brought vacuum-pressure curing techniques into premium field hockey stick prototyping.',
            photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
          },
          {
            _id: '2',
            name: 'Sarah van der Berg',
            role: 'Product Lead, Padel & Racket Division',
            bio: 'Former professional player who guides court feedback directly into the tooling workshop. Focused on honeycomb core dampening and weight-to-power balance.',
            photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
          },
          {
            _id: '3',
            name: 'Coach Marcus Sterling',
            role: 'Director of Club & Team Partnerships',
            bio: 'Coordinates customized equipment kits with over 110 senior academies worldwide. Ensuring every team receives bespoke stiffness tuning.',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess(false);

    try {
      // Send to contactsubmissions endpoint (part of customer interaction)
      await axios.post('/api/contactsubmissions', formData);
      setFormSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Bulk-Team Order',
        message: ''
      });
    } catch (err) {
      console.error('Form submission failed:', err);
      setFormError(err.response?.data?.error || 'Failed to submit inquiry. Please try again or email us directly.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="about-page animate-in">
      {/* 1. COMPACT HERO */}
      <section className="hero" style={{ minHeight: '400px', position: 'relative', display: 'flex', alignItems: 'center' }}>
        <img 
          className="hero-bg" 
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80" 
          alt="Field Hockey Turf Close Up" 
          style={{ opacity: '0.25' }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>OUR HERITAGE</span>
          <h1 style={{ color: 'var(--text)' }}>
            FORGED FOR THE FIELD, <span className="gradient-text">SINCE 1994.</span>
          </h1>
          <p className="hero-subtitle" style={{ color: 'var(--muted)', maxWidth: '640px' }}>
            AMI started in a single workshop with one obsession: a composite stick that never lets the player down under intense pressure.
          </p>
          <div className="hero-actions">
            <Button variant="primary" onClick={() => navigate('/shop')}>
              SHOP THE RANGE
            </Button>
            <Button variant="secondary" onClick={() => {
              const element = document.getElementById('partnership-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}>
              TEAM INQUIRIES
            </Button>
          </div>
        </div>
      </section>

      {/* 2. STATS BOARDWALK */}
      <section className="section" style={{ padding: '40px 0', background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="grid-4">
            <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center', padding: '24px' }}>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', textDecoration: 'underline', textDecorationColor: 'var(--accent)', textUnderlineOffset: '8px' }}>
                30+
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '16px', color: 'var(--text)' }}>
                YEARS IN THE GAME
              </div>
            </div>
            <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center', padding: '24px' }}>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', textDecoration: 'underline', textDecorationColor: 'var(--accent)', textUnderlineOffset: '8px' }}>
                200K+
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '16px', color: 'var(--text)' }}>
                STICKS FIELDED
              </div>
            </div>
            <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center', padding: '24px' }}>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', textDecoration: 'underline', textDecorationColor: 'var(--accent)', textUnderlineOffset: '8px' }}>
                14
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '16px', color: 'var(--text)' }}>
                NATIONAL TEAMS
              </div>
            </div>
            <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center', padding: '24px' }}>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', textDecoration: 'underline', textDecorationColor: 'var(--accent)', textUnderlineOffset: '8px' }}>
                100%
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '16px', color: 'var(--text)' }}>
                COMPOSITE INTEGRITY
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CRAFTSMANSHIP TIMELINE & STEPS */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '48px', height: '4px', background: 'var(--accent)', transform: 'rotate(-3deg)' }}></span>
              THE BLUEPRINT
            </span>
            <h2 style={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 900 }}>
              EVERY STICK PASSES THROUGH <span className="gradient-text">11 HANDS.</span>
            </h2>
            <p style={{ color: 'var(--muted)', maxWidth: '600px', margin: '0 auto' }}>
              From initial aerospace-grade carbon braiding to the final grip tension check, our manufacturing sequence is non-negotiable.
            </p>
          </div>

          <div className="grid-3" style={{ marginTop: '48px' }}>
            <div className="feature-card" style={{ border: '1px solid var(--border)', padding: '32px' }}>
              <div className="feature-icon" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '16px' }}>01</div>
              <h3 style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '1.25rem', marginBottom: '12px' }}>TRIPLE CARBON LAYUP</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                We weave distinct weights of premium carbon fibre by hand. This deliberate layering prevents microscopic shear failure during explosive drag-flicks.
              </p>
            </div>

            <div className="feature-card" style={{ border: '1px solid var(--border)', padding: '32px' }}>
              <div className="feature-icon" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '16px' }}>02</div>
              <h3 style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '1.25rem', marginBottom: '12px' }}>PRESSURE-CURED</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Rather than ambient-air curing, our shafts undergo controlled high-temperature autoclaving. It pushes resin into every cell, maximizing mechanical load return.
              </p>
            </div>

            <div className="feature-card" style={{ border: '1px solid var(--border)', padding: '32px' }}>
              <div className="feature-icon" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '16px' }}>03</div>
              <h3 style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '1.25rem', marginBottom: '12px' }}>STRIKE VELOCITY LAB</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Every single production run has randomly-selected samples subjected to rigorous pneumatic strike stress. If it flexes out of margin by 1%, the batch is recycled.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKSHOP & MATERIAL SHOWCASE */}
      <section className="section" style={{ background: 'var(--surface-2)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '48px' }}>
            <div>
              <span className="eyebrow">LAB & TOOLING</span>
              <h2 style={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 900, marginBottom: '24px' }}>
                THREE LAYERS. <span className="gradient-text">ZERO COMPROMISE.</span>
              </h2>
              <p style={{ color: 'var(--muted)', marginBottom: '16px', lineHeight: '1.7' }}>
                Standard sticks use commercial-grade fibreglass centers to cut costs. AMI relies on a continuous structural carbon spine, running right from the tip of the head all the way into the end cap.
              </p>
              <p style={{ color: 'var(--muted)', marginBottom: '24px', lineHeight: '1.7' }}>
                This creates perfect kinetic translation. The energy stored in your shoulders goes entirely into the ball — not lost into shaft vibrations that leave your palms stinging.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontFamily: '"Archivo Black", sans-serif', margin: '0 0 8px 0', fontSize: '1rem' }}>CARBON DENSITY</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>90% Raw Japanese carbon composite fibers</p>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontFamily: '"Archivo Black", sans-serif', margin: '0 0 8px 0', fontSize: '1rem' }}>BOW GEOMETRY</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>Optimized 24mm low-bow curves</p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" 
                alt="Engineering Material Weave" 
                style={{ width: '100%', borderRadius: '14px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. MEET THE TEAM / THE PEOPLE BEHIND THE POWER */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '48px', height: '4px', background: 'var(--accent)', transform: 'rotate(-3deg)' }}></span>
              DEVELOPMENT TEAM
            </span>
            <h2 style={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 900 }}>
              THE PEOPLE BEHIND <span className="gradient-text">THE POWER</span>
            </h2>
            <p style={{ color: 'var(--muted)', maxWidth: '600px', margin: '0 auto' }}>
              Meet the compound engineers and competitive players shaping the next generation of AMI equipment.
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
              <Spinner size="lg" color="primary" />
            </div>
          ) : (
            <div className="grid-3" style={{ marginTop: '48px' }}>
              {teamMembers.map((member) => (
                <div className="card" key={member._id} style={{ border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '320px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: '1.2rem', margin: '0 0 6px 0', color: 'var(--text)' }}>
                        {member.name}
                      </h3>
                      <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '16px', letterSpacing: '0.05em' }}>
                        {member.role}
                      </span>
                      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
                        {member.bio}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. SUSTAINABILITY COMMITMENT */}
      <section className="section" style={{ background: 'var(--text)', color: 'var(--bg)' }}>
        <div className="container" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>CIRCULAR PRODUCTION</span>
          <h2 style={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 900, color: 'var(--bg)', marginTop: '8px' }}>
            WE CUT CARBON WASTE, <span className="gradient-text">NOT CORNERS.</span>
          </h2>
          <p style={{ maxWidth: '680px', margin: '16px auto 0 auto', color: 'rgba(250, 251, 247, 0.75)', lineHeight: '1.6', fontSize: '1.1rem' }}>
            Offcuts and scrap carbon fibre sheets from our stick molds are shredded and integrated into technical support plates. Nothing leaves our manufacturing floor unused.
          </p>
        </div>
      </section>

      {/* 7. CLUB / INSTITUTIONAL INQUIRIES FORM */}
      <section id="partnership-section" className="section" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-head" style={{ marginBottom: '32px' }}>
            <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '48px', height: '4px', background: 'var(--accent)', transform: 'rotate(-3deg)' }}></span>
              CLUB & TEAM QUOTES
            </span>
            <h2 style={{ fontFamily: '"Archivo Black", sans-serif', fontWeight: 900 }}>
              BULK ACADEMY & <span className="gradient-text">TEAM STICK ORDERS</span>
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              Looking to outfit a state league side, academy class, or padel club? Fill out the brief below and our bulk team division will build a custom-spec package proposal.
            </p>
          </div>

          <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '32px', borderRadius: '14px', boxShadow: 'var(--shadow-lg)' }}>
            {formSuccess ? (
              <div className="alert alert-success" style={{ padding: '32px', textAlign: 'center' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>✓</span>
                <h3 style={{ fontFamily: '"Archivo Black", sans-serif', margin: '0 0 8px 0' }}>APPLICATION RECEIVED</h3>
                <p style={{ margin: 0 }}>
                  We have logged your custom bulk requirement. A technical sales engineer will reach out to schedule a flex prototype call within 48 hours.
                </p>
                <div style={{ marginTop: '24px' }}>
                  <Button variant="primary" onClick={() => setFormSuccess(false)}>
                    Submit Another Inquiry
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                {formError && (
                  <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                    {formError}
                  </div>
                )}
                
                <div className="grid-2" style={{ marginBottom: '20px', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text)' }}>
                      Your Name *
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="e.g. Coach Alexander"
                      style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text)' }}>
                      Contact Email *
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="you@clubdomain.com"
                      style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ marginBottom: '20px', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text)' }}>
                      Phone Number *
                    </label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="e.g. +91 98765 43210"
                      style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text)' }}>
                      Inquiry Type *
                    </label>
                    <select 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleInputChange} 
                      required 
                      style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface)' }}
                    >
                      <option value="Bulk-Team Order">Bulk Academy Order (30+ units)</option>
                      <option value="Dealer Inquiry">Authorized Retailer / Pro Shop stockist</option>
                      <option value="Custom Flex Build">Bespoke Athlete Prototype Design</option>
                      <option value="General">General Corporate Heritage Question</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text)' }}>
                    Describe Your Team & Equipment Requirements *
                  </label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleInputChange} 
                    required 
                    rows="5" 
                    placeholder="Provide details about standard bow profile preferences, expected quantity of sticks/rackets, or school branding integration..."
                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit' }}
                  ></textarea>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={formLoading} 
                    style={{ minWidth: '180px' }}
                  >
                    {formLoading ? 'Submitting Request...' : 'SEND INQUIRY'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}