const mongoose = require('mongoose');

// Require models from the local models directory
const Product = require('./models/Product');
const Review = require('./models/Review');
const CartItem = require('./models/CartItem');
const ContactSubmission = require('./models/Contactsubmissions');
const TeamMember = require('./models/Teammembers');
const Testimonial = require('./models/Testimonial');

(async () => {
  try {
    console.log('AMI Seed Engine: Commencing data deployment...');

    // 1. SEED PRODUCTS
    const productCount = await Product.countDocuments();
    let seededProducts = [];

    if (productCount === 0) {
      console.log('Seeding products...');
      const productsData = [
        {
          name: "Apex 900 Carbon Strike",
          slug: "apex-900-carbon-strike",
          category: "stick",
          subCategory: "Drag-Flick Stick",
          price: 8999,
          compareAtPrice: 10999,
          images: [
            "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1606907291416-f540788201b1?auto=format&fit=crop&w=600&q=80"
          ],
          flexRating: "High",
          weight: "520g",
          length: "37.5\"",
          material: "95% Premium Carbon, 5% Kevlar",
          skillLevel: "Pro",
          stockCount: 14,
          badge: "Bestseller",
          description: "The Apex 900 was engineered specifically for elite drag-flickers who load late and release hard. Featuring an ultra-low bow and reinforced sweet-spot, it turns raw wrist torque into pure ball velocity without compromised feedback. Complete control, devastating power.",
          avgRating: 4.9,
          reviewCount: 42
        },
        {
          name: "Vanguard Extreme Bow",
          slug: "vanguard-extreme-bow",
          category: "stick",
          subCategory: "Mid-Bow Playmaker",
          price: 7499,
          compareAtPrice: 8499,
          images: [
            "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80"
          ],
          flexRating: "Medium",
          weight: "535g",
          length: "36.5\"",
          material: "75% Japanese Carbon, 20% Fiberglass, 5% Aramid",
          skillLevel: "Intermediate",
          stockCount: 8,
          badge: "New",
          description: "Our premier mid-bow weapon designed for midfield orchestrators. Offers maximum contact surface for aerial trapping, precision passing, and rapid slap-shots. Built to withstand physical turf battles with enhanced shock absorption tech.",
          avgRating: 4.7,
          reviewCount: 19
        },
        {
          name: "Padel Pro Aero 300",
          slug: "padel-pro-aero-300",
          category: "paddle",
          subCategory: "Control Racket",
          price: 9499,
          compareAtPrice: 11999,
          images: [
            "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80"
          ],
          flexRating: "High",
          weight: "365g",
          length: "18\"",
          material: "12K Carbon Thread & EVA Foam Core",
          skillLevel: "Pro",
          stockCount: 6,
          badge: "Bestseller",
          description: "Unleash explosive power and absolute spin-control on the padel court. The Aero 300 boasts custom geometric drilling and high-density EVA memory core for players who dictate rallies and demand relentless feedback on defensive blocks.",
          avgRating: 4.8,
          reviewCount: 31
        },
        {
          name: "Vortex Match Padel Racket",
          slug: "vortex-match-padel-racket",
          category: "paddle",
          subCategory: "Power Racket",
          price: 6999,
          compareAtPrice: 7999,
          images: [
            "https://images.unsplash.com/photo-1613564834361-9436948817d1?auto=format&fit=crop&w=600&q=80"
          ],
          flexRating: "Medium",
          weight: "360g",
          length: "18\"",
          material: "3K Carbon Face & Soft Core",
          skillLevel: "Intermediate",
          stockCount: 3,
          badge: "None",
          description: "A perfectly balanced racket offering an oversized sweet-spot for consistent overhead smashes and quick defensive recovery. The 3K carbon weave mitigates vibration to prevent elbow fatigue through multi-set games.",
          avgRating: 4.5,
          reviewCount: 15
        },
        {
          name: "Championship Armor Shin Guards",
          slug: "championship-armor-shin-guards",
          category: "kit",
          subCategory: "Protective Gear",
          price: 1899,
          compareAtPrice: 2499,
          images: [
            "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?auto=format&fit=crop&w=600&q=80"
          ],
          flexRating: "Low",
          weight: "180g",
          length: "Large",
          material: "Hardened PP Shell & Shock-Absorbent EVA Foam",
          skillLevel: "Beginner",
          stockCount: 25,
          badge: "None",
          description: "Full-coverage anatomical shin shields designed to deflect heavy strikes. Moisture-wicking breathable internal sleeve keeps you dry and locked-in from first whistle to penalty shootout.",
          avgRating: 4.6,
          reviewCount: 8
        },
        {
          name: "Pro-Grip Field Hockey Glove",
          slug: "pro-grip-field-hockey-glove",
          category: "kit",
          subCategory: "Protective Gear",
          price: 1499,
          compareAtPrice: 1999,
          images: [
            "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=600&q=80"
          ],
          flexRating: "Medium",
          weight: "95g",
          length: "Medium",
          material: "Molded Thermoplastic Armor & Textured Silicon Palm",
          skillLevel: "Intermediate",
          stockCount: 19,
          badge: "New",
          description: "Full left-hand protection with high-density foam padding protecting your knuckles from turf abrasion and stick contact. Ergonomically articulated to maintain ultimate feel of the grip tape.",
          avgRating: 4.8,
          reviewCount: 22
        }
      ];
      seededProducts = await Product.insertMany(productsData);
      console.log(`Successfully seeded ${seededProducts.length} premium products.`);
    } else {
      seededProducts = await Product.find();
      console.log('Products already exist in database.');
    }

    // 2. SEED REVIEWS (Targeted specifically to our seeded products)
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0 && seededProducts.length > 0) {
      console.log('Seeding verified product reviews...');
      const apexProduct = seededProducts.find(p => p.slug === "apex-900-carbon-strike");
      const padelProduct = seededProducts.find(p => p.slug === "padel-pro-aero-300");

      const reviewsData = [];
      if (apexProduct) {
        reviewsData.push(
          {
            productId: apexProduct._id.toString(),
            userName: "Rohan Shetty",
            rating: 5,
            comment: "The low bow setup on this Apex 900 has singlehandedly improved my drag-flick velocity. Absolutely no vibration on off-center hits. Pure power.",
            verifiedBuyer: true,
            createdAt: new Date()
          },
          {
            productId: apexProduct._id.toString(),
            userName: "Coach Marcus Taylor",
            rating: 5,
            comment: "Equipped our top three forwards with AMI Apex sticks this season. The speed on dynamic transitions and aerials is unmatched. Standard-defining hardware.",
            verifiedBuyer: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
          }
        );
      }
      if (padelProduct) {
        reviewsData.push(
          {
            productId: padelProduct._id.toString(),
            userName: "Alejandro Gomez",
            rating: 5,
            comment: "Exceptional spin control. The surface texture is rugged enough to really grip the ball on slice overheads. Very sturdy frame.",
            verifiedBuyer: true,
            createdAt: new Date()
          }
        );
      }

      if (reviewsData.length > 0) {
        await Review.insertMany(reviewsData);
        console.log(`Seeded ${reviewsData.length} technical reviews.`);
      }
    }

    // 3. SEED TESTIMONIALS
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      console.log('Seeding testimonials...');
      await Testimonial.insertMany([
        {
          quote: "AMI sticks don't bend under pressure — they transfer it directly into the goal. The craft in these carbon layers is legendary.",
          authorName: "R. Shetty",
          authorRole: "State League Forward & Golden Boot",
          avatar: "https://i.pravatar.cc/300?img=12"
        },
        {
          quote: "Switching our team to the Vanguard series reduced wrist fatigue across the board and spiked our short-corner conversion rate by 22%.",
          authorName: "Marcus Taylor",
          authorRole: "Head Coach, West City Hockey Club",
          avatar: "https://i.pravatar.cc/300?img=11"
        },
        {
          quote: "The Aero 300 Padel racket delivers surgical precision. My defensive blocks are crisp and my smashes find the fence consistently.",
          authorName: "Sofia Alvarez",
          authorRole: "National Padel Challenger finalist",
          avatar: "https://i.pravatar.cc/300?img=47"
        }
      ]);
      console.log('Seeded brand testimonials.');
    }

    // 4. SEED TEAM MEMBERS (Craftspeople & Founders)
    const teamCount = await TeamMember.countDocuments();
    if (teamCount === 0) {
      console.log('Seeding team members...');
      await TeamMember.insertMany([
        {
          name: "Alistair Vance",
          role: "Co-Founder & Lead Material Engineer",
          photo: "https://i.pravatar.cc/300?img=60",
          bio: "Former international midfielder with 15 years in composite polymer research. Designed AMI's signature three-layer carbon layup."
        },
        {
          name: "Elena Rostova",
          role: "Director of Racket Engineering",
          photo: "https://i.pravatar.cc/300?img=49",
          bio: "Aerospace engineer specializing in structural carbon-weave dynamics. Elena ensures our padel rackets maintain uniform structural rebound."
        },
        {
          name: "Vikram Malhotra",
          role: "Master Carver & Mold Technician",
          photo: "https://i.pravatar.cc/300?img=68",
          bio: "Hand-shaping elite sports hardware since 1994. Vikram personally inspects and signs off on every mold blueprint before pressure-curing."
        }
      ]);
      console.log('Seeded expert team roster.');
    }

    console.log('AMI Seed Engine: Database priming sequence successfully completed.');
  } catch (error) {
    console.error('AMI Seed Engine: Critical failure during seeding:', error);
  }
})();