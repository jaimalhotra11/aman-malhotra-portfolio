import React, { useState, useEffect } from 'react';

const photos = [
  { src: '/photo1.jpeg', caption: '' },
  { src: '/photo2.jpeg', caption: '' },
  { src: '/photo3.jpeg', caption: '' },
  { src: '/photo4.jpeg', caption: '' },
];

export default function App() {
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    const timer = setInterval(() => {
      setActivePhoto(prev => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'DM Sans', sans-serif;
          background: #fdf8ef;
          color: #2d1f0a;
          overflow-x: hidden;
        }
        :root {
          --gold: #c9a84c;
          --gold-light: #e8d5a3;
          --gold-dark: #8a6a1e;
          --cream: #fdf8ef;
          --deep: #1a1209;
          --text: #2d1f0a;
          --muted: #7a6040;
          --border: rgba(201,168,76,0.3);
          --card: rgba(255,250,240,0.9);
        }

        /* Fade in */
        .page { opacity: 0; transform: translateY(12px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .page.visible { opacity: 1; transform: translateY(0); }

        /* Hero */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem 1.5rem;
          background:
            radial-gradient(ellipse 70% 50% at 20% 15%, rgba(201,168,76,0.1) 0%, transparent 65%),
            radial-gradient(ellipse 60% 60% at 80% 80%, rgba(201,168,76,0.07) 0%, transparent 65%),
            #fdf8ef;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 48px, rgba(201,168,76,0.04) 48px, rgba(201,168,76,0.04) 49px),
            repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(201,168,76,0.04) 48px, rgba(201,168,76,0.04) 49px);
          pointer-events: none;
        }

        .om { font-size: 2.2rem; color: var(--gold); display: block; margin-bottom: 1rem; animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

        .swirl-line {
          display: flex; align-items: center; justify-content: center;
          gap: 0.8rem; color: var(--gold); font-size: 0.75rem;
          letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 2rem;
        }
        .swirl-line::before, .swirl-line::after {
          content: ''; width: 90px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold));
        }
        .swirl-line::after { background: linear-gradient(90deg, var(--gold), transparent); }

        /* Photo carousel */
        .photo-hero-wrap {
          position: relative;
          margin-bottom: 1.5rem;
          display: inline-block;
        }
        .photo-hero {
          width: min(280px, 68vw);
          height: min(380px, 92vw);
          border-radius: 200px;
          overflow: hidden;
          border: 3px solid var(--gold);
          box-shadow: 0 8px 40px rgba(201,168,76,0.25), 0 2px 8px rgba(0,0,0,0.12);
          position: relative;
        }
        .photo-hero img {
          width: 100%; height: 100%; object-fit: cover; object-position: top center;
          transition: opacity 0.8s ease;
          position: absolute; top: 0; left: 0;
        }
        .photo-hero img.active { opacity: 1; }
        .photo-hero img.hidden { opacity: 0; }

        .slider-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,250,240,0.92); border: 1.5px solid var(--gold);
          color: var(--gold-dark); font-size: 1.3rem; line-height: 1;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10;
          box-shadow: 0 2px 10px rgba(201,168,76,0.25);
          transition: background 0.2s, transform 0.15s;
          user-select: none;
        }
        .slider-arrow.prev { left: -18px; }
        .slider-arrow.next { right: -18px; }
        .slider-arrow:hover { background: var(--gold-light); }

        .photo-dots {
          display: flex; gap: 6px; justify-content: center; margin-bottom: 1.5rem;
        }
        .photo-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--gold-light); cursor: pointer;
          transition: background 0.3s, transform 0.3s; border: none;
        }
        .photo-dot.active { background: var(--gold); transform: scale(1.3); }

        .name-hero {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.8rem, 8vw, 4.5rem);
          font-weight: 600; color: var(--deep);
          line-height: 1.05; letter-spacing: 0.01em; margin-bottom: 0.3rem;
        }
        .tagline {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 1.15rem;
          color: var(--gold-dark); margin-bottom: 1.5rem;
        }
        .hero-pills {
          display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 2.5rem;
        }
        .hero-pill {
          background: rgba(201,168,76,0.1); border: 0.5px solid rgba(201,168,76,0.45);
          border-radius: 100px; padding: 0.3rem 0.9rem;
          font-size: 0.8rem; color: var(--gold-dark); font-weight: 500;
        }
        .scroll-hint {
          font-size: 0.72rem; letter-spacing: 0.15em; color: var(--muted);
          text-transform: uppercase; display: flex; align-items: center; gap: 0.5rem;
          animation: bounce 2s ease-in-out infinite;
        }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }

        /* Main content */
        .main { max-width: 860px; margin: 0 auto; padding: 3rem 1.5rem 5rem; }

        .sec-label {
          font-size: 0.68rem; font-weight: 500; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--gold-dark); margin-bottom: 0.8rem;
          display: flex; align-items: center; gap: 0.6rem;
        }
        .sec-label::after { content: ''; flex: 1; height: 0.5px; background: var(--border); }

        .card {
          background: var(--card);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 18px; padding: 1.6rem; margin-bottom: 1.5rem;
          box-shadow: 0 2px 16px rgba(201,168,76,0.08), 0 1px 4px rgba(0,0,0,0.04);
        }

        .grid2 {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.2rem;
        }

        .info-row { display: flex; flex-direction: column; gap: 0.2rem; }
        .info-lbl { font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); font-weight: 500; }
        .info-val { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-weight: 500; color: var(--deep); line-height: 1.3; }
        .info-sub { font-size: 0.82rem; color: var(--muted); margin-top: 2px; }

        /* Photo gallery */
        .gallery {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;
        }
        .gallery-item {
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(201,168,76,0.35);
          cursor: pointer; position: relative;
          aspect-ratio: 4/5;
          transition: transform 0.25s, box-shadow 0.25s;
          box-shadow: 0 2px 10px rgba(0,0,0,0.07);
        }
        .gallery-item:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(201,168,76,0.25); }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
        .gallery-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: linear-gradient(transparent, rgba(10,7,3,0.62));
          padding: 1.2rem 0.5rem 0.6rem;
          display: flex; align-items: center; justify-content: center;
          gap: 0.3rem; color: #fff; font-size: 0.7rem;
          letter-spacing: 0.08em; text-transform: uppercase;
          opacity: 0; transition: opacity 0.25s;
        }
        .gallery-item:hover .gallery-overlay { opacity: 1; }

        /* Lightbox */
        .lightbox-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(10,7,3,0.92);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .lightbox-img {
          max-width: 90vw; max-height: 90vh;
          border-radius: 12px;
          border: 2px solid var(--gold);
          box-shadow: 0 0 60px rgba(201,168,76,0.3);
          cursor: default;
        }
        .lightbox-close {
          position: fixed; top: 1.2rem; right: 1.5rem;
          font-size: 1.8rem; color: var(--gold); cursor: pointer;
          background: none; border: none; line-height: 1;
        }

        /* Bio */
        .bio-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem; font-style: italic;
          line-height: 1.85; color: var(--text);
          text-align: center; padding: 0.25rem 0.75rem;
        }

        /* Pills */
        .pills { display: flex; flex-wrap: wrap; gap: 0.6rem; }
        .pill {
          background: rgba(201,168,76,0.1); border: 0.5px solid rgba(201,168,76,0.4);
          border-radius: 100px; padding: 0.4rem 1rem;
          font-size: 0.85rem; color: var(--gold-dark); font-weight: 500;
        }

        /* CTA */
        .cta-card {
          background: linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04));
          border: 1px solid rgba(201,168,76,0.4);
          border-radius: 16px; padding: 2rem 1.5rem; text-align: center; margin-bottom: 1.5rem;
        }
        .cta-title { font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; font-weight: 600; color: var(--deep); margin-bottom: 0.3rem; }
        .cta-sub { font-size: 0.85rem; color: var(--muted); margin-bottom: 1.3rem; }
        .wa-btn {
          display: inline-flex; align-items: center; gap: 0.6rem;
          background: #25d366; color: #fff; border-radius: 100px;
          padding: 0.75rem 2rem; font-size: 0.95rem; font-weight: 500;
          text-decoration: none; letter-spacing: 0.02em;
          box-shadow: 0 4px 18px rgba(37,211,102,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .wa-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(37,211,102,0.4); }

        .footer {
          text-align: center; padding: 2rem 0 0;
          font-size: 0.75rem; color: var(--muted); letter-spacing: 0.05em;
        }
        .footer .om-sm { color: var(--gold); }

        @media (max-width: 480px) {
          .gallery { grid-template-columns: repeat(2, 1fr); }
          .gallery-item { aspect-ratio: 4/5; }
        }
      `}</style>

      <div className={`page ${visible ? 'visible' : ''}`}>

        {/* Hero */}
        <section className="hero">
          <span className="om">ॐ</span>

          <div className="photo-hero-wrap">
            <button className="slider-arrow prev" onClick={() => setActivePhoto(p => (p - 1 + photos.length) % photos.length)}>&#8249;</button>
            <div className="photo-hero">
              {photos.map((p, i) => (
                <img key={i} src={p.src} alt={p.caption} className={i === activePhoto ? 'active' : 'hidden'} />
              ))}
            </div>
            <button className="slider-arrow next" onClick={() => setActivePhoto(p => (p + 1) % photos.length)}>&#8250;</button>
          </div>

          <div className="photo-dots">
            {photos.map((_, i) => (
              <button key={i} className={`photo-dot ${i === activePhoto ? 'active' : ''}`} onClick={() => setActivePhoto(i)} />
            ))}
          </div>

          <h1 className="name-hero">Aman Malhotra</h1>
          <p className="tagline">Software Engineer · Entrepreneur · Explorer</p>

          <div className="hero-pills">
            <span className="hero-pill">28 Years</span>
            <span className="hero-pill">5'11"</span>
            <span className="hero-pill">MBA</span>
            <span className="hero-pill">Faridabad, Haryana</span>
            <span className="hero-pill">₹22–25 LPA</span>
          </div>

          <div className="scroll-hint">
            <span>↓</span> Scroll to know more <span>↓</span>
          </div>
        </section>

        {/* Main */}
        <main className="main">

          {/* Photos */}
          <div className="sec-label">Photo Gallery</div>
          <div className="card" style={{ padding: '1rem' }}>
            <div className="gallery">
              {photos.map((p, i) => (
                <div key={i} className="gallery-item" onClick={() => setLightbox(i)}>
                  <img src={p.src} alt={`Photo ${i + 1}`} />
                  <div className="gallery-overlay">⊕ View full</div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal */}
          <div className="sec-label">Personal Details</div>
          <div className="card">
            <div className="grid2">
              <div className="info-row"><span className="info-lbl">Full Name</span><span className="info-val">Aman Malhotra</span></div>
              <div className="info-row"><span className="info-lbl">Date of Birth</span><span className="info-val">19 December 1997 · Age 28</span></div>
              <div className="info-row"><span className="info-lbl">Height</span><span className="info-val">5 Feet 11 Inches</span></div>
              <div className="info-row"><span className="info-lbl">City & State</span><span className="info-val">Faridabad, Haryana</span></div>
            </div>
          </div>

          {/* Religion */}
          <div className="sec-label">Religion & Community</div>
          <div className="card">
            <div className="grid2">
              <div className="info-row">
                <span className="info-lbl">Religion</span>
                <span className="info-val">Hindu</span>
                <span className="info-sub">हिन्दू</span>
              </div>
              <div className="info-row">
                <span className="info-lbl">Caste</span>
                <span className="info-val">Khatri</span>
                <span className="info-sub">खत्री</span>
              </div>
              <div className="info-row">
                <span className="info-lbl">Gotra</span>
                <span className="info-val">Kaushal</span>
                <span className="info-sub">कौशल</span>
              </div>
            </div>
          </div>

          {/* Career */}
          <div className="sec-label">Education & Career</div>
          <div className="card">
            <div className="grid2">
              <div className="info-row"><span className="info-lbl">Qualification</span><span className="info-val">MBA</span></div>
              <div className="info-row"><span className="info-lbl">Profession</span><span className="info-val">Software Engineer</span></div>
              <div className="info-row"><span className="info-lbl">Company</span><span className="info-val">MNC, Gurugram</span></div>
              <div className="info-row"><span className="info-lbl">Entrepreneurship</span><span className="info-val">Own Startup</span></div>
              <div className="info-row" style={{ gridColumn: '1 / -1' }}>
                <span className="info-lbl">Annual Income</span>
                <span className="info-val">₹ 22 – 25 Lakhs Per Annum</span>
              </div>
            </div>
          </div>

          {/* Family */}
          <div className="sec-label">Family Details</div>
          <div className="card">
            <div className="grid2">
              <div className="info-row">
                <span className="info-lbl">Father</span>
                <span className="info-val">Mr. Sanjeev Malhotra</span>
                <span className="info-sub">Business</span>
              </div>
              <div className="info-row">
                <span className="info-lbl">Mother</span>
                <span className="info-val">Mrs. Sujata Malhotra</span>
                <span className="info-sub">Homemaker</span>
              </div>
              <div className="info-row">
                <span className="info-lbl">Siblings</span>
                <span className="info-val">1 Brother</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="sec-label">About Aman</div>
          <div className="card">
            <p className="bio-text">
              A driven and ambitious professional who balances the discipline of corporate life with the entrepreneurial spirit of building something of his own. An avid traveller with a love for the sea, he brings the same energy and curiosity to everything he does. Rooted in strong family values, he seeks a life partner who shares a vision for growth, harmony, and meaningful companionship.
            </p>
          </div>

          {/* Hobbies */}
          <div className="sec-label">Hobbies & Interests</div>
          <div className="card">
            <div className="pills">
              <span className="pill">🏋️ Gymnasium</span>
              <span className="pill">🧘 Meditation</span>
              <span className="pill">🏸 Badminton</span>
              <span className="pill">✈️ Travelling</span>
            </div>
          </div>

          {/* CTA */}
          <div className="cta-card">
            <p className="cta-title">Get in Touch</p>
            <p className="cta-sub">For further enquiries, feel free to reach out on WhatsApp</p>
            <a className="wa-btn" href="https://wa.me/919654448556" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              +91 96544 48556
            </a>
          </div>

          <div className="footer">
            <span className="om-sm">ॐ</span> श्री गणेशाय नमः <span className="om-sm">ॐ</span>
            <br />
            <span style={{ marginTop: '4px', display: 'block' }}>With Blessings of the Almighty</span>
          </div>

        </main>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <img
            className="lightbox-img"
            src={photos[lightbox].src}
            alt={photos[lightbox].caption}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
