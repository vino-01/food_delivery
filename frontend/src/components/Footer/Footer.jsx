import React from 'react'

const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer style={{ background: 'var(--text)', color: 'white', marginTop: 'auto', padding: '48px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <strong style={{ fontSize: 20, fontWeight: 700 }}>YummyBites</strong>
            </div>
            <p style={{ opacity: 0.8, lineHeight: 1.7, fontSize: 15, color: 'var(--border)' }}>Delicious food delivered fast. Mood-based picks, group payments, and more.</p>
          </div>
          <div>
            <strong style={{ display: 'block', marginBottom: 10 }}>Explore</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              <li><a href="/mood" style={{ color: 'white', opacity: 0.9 }}>Mood Ordering</a></li>
              <li><a href="/restaurants" style={{ color: 'white', opacity: 0.9 }}>Restaurants</a></li>
              <li><a href="/my-orders" style={{ color: 'white', opacity: 0.9 }}>My Orders</a></li>
              <li><a href="/cart" style={{ color: 'white', opacity: 0.9 }}>Cart</a></li>
            </ul>
          </div>
          {/* Support section removed per request */}
          {/* Removed app download buttons per request */}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 32, paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <small style={{ opacity: 0.75, fontSize: 14 }}>© {year} YummyBites. All rights reserved.</small>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#" style={{ color: 'white', opacity: 0.9, fontSize: 14 }}>Privacy</a>
            <a href="#" style={{ color: 'white', opacity: 0.9, fontSize: 14 }}>Terms</a>
            <a href="#" style={{ color: 'white', opacity: 0.9, fontSize: 14 }}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


