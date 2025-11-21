import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import "./Home.css";
import { peruduriRestaurants } from '../data/peruduriRestaurants'
import { getStats, getRestaurants } from '../services/api'
import SmartReorderCard from '../components/SmartFeatures/SmartReorderCard.jsx'

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ delivered: null, avgRating: null, userCount: null });
  const [restaurants, setRestaurants] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${searchQuery}`);
    } else {
      showToast("Please enter a restaurant or dish to search.", "error");
    }
  };

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [statsData, restaurantsData] = await Promise.all([
          getStats().catch(e => { console.warn('stats failed', e.message); return null }),
          getRestaurants().catch(e => { console.warn('restaurants failed', e.message); return [] })
        ])
        if (!mounted) return
        if (statsData) setStats(statsData)
        let list = Array.isArray(restaurantsData) ? restaurantsData : []
        list = list.map(item => {
          if (item.image) return item
          const local = peruduriRestaurants.find(l => l._id === item._id || l.name === item.name)
          if (local && local.image) return { ...item, image: local.image }
          return item
        })
        setRestaurants(list)
      } catch (err) {
        console.error('Failed to load home stats', err)
      } finally {
        if (mounted) setLoadingStats(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="home-container">
      <header className="hero">
        <div className="hero-content container">
          <div className="hero-text">
            <h1 className="hero-title">
              Delicious Food, <span className="hero-subtitle">Delivered to Your Door</span>
            </h1>
            <p className="hero-description">
              Order from your favorite local restaurants with ease and speed. Freshly prepared meals, delivered hot and fast.
            </p>
            <form onSubmit={handleSearch} className="search-box">
              <input
                type="text"
                placeholder="Search for restaurants or dishes..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn btn-primary">
                Search
              </button>
            </form>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{loadingStats ? '—' : restaurants.length}</span>
              <span className="stat-label">Restaurants</span>
            </div>
            <div className="stat">
              <span className="stat-number">{loadingStats ? '—' : (stats.userCount ?? 0)}</span>
              <span className="stat-label">Customers</span>
            </div>
            <div className="stat">
              <span className="stat-number">{loadingStats ? '—' : (stats.delivered ?? 0)}</span>
              <span className="stat-label">Orders Delivered</span>
            </div>
          </div>
        </div>
      </header>

      <section className="categories" style={{ cursor: 'pointer' }} onClick={() => navigate('/restaurants')}>
        <div className="container">
          <h2 className="section-title">Explore Cuisines</h2>
          <div className="categories-grid">
            <div className="category-card">
              <span className="category-icon">🍛</span>
              <h3>Indian</h3>
            </div>
            <div className="category-card">
              <span className="category-icon">🍕</span>
              <h3>Italian</h3>
            </div>
            <div className="category-card">
              <span className="category-icon">🍜</span>
              <h3>Chinese</h3>
            </div>
            <div className="category-card">
              <span className="category-icon">🌮</span>
              <h3>Mexican</h3>
            </div>
            <div className="category-card">
              <span className="category-icon">🍔</span>
              <h3>American</h3>
            </div>
            <div className="category-card">
              <span className="category-icon">🍰</span>
              <h3>Desserts</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Restaurants section removed per request */}

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose YummyBites?</h2>
          <div className="features-grid">
            <div className="feature-card card">
              <span className="feature-icon">⚡</span>
              <h3>Lightning-Fast Delivery</h3>
              <p>Get your food delivered super quick, so you never have to wait long to satisfy your cravings.</p>
            </div>
            <div className="feature-card card">
              <span className="feature-icon">⭐</span>
              <h3>Top-Rated Restaurants</h3>
              <p>Choose from a curated selection of the best local restaurants, all highly-rated by fellow food lovers.</p>
            </div>
            <div className="feature-card card">
              <span className="feature-icon">📱</span>
              <h3>Easy to Use App</h3>
              <p>Our intuitive app makes ordering a breeze, from browsing menus to secure payment, it's all seamless.</p>
            </div>
            <div className="feature-card card">
              <span className="feature-icon">💳</span>
              <h3>Secure Payments</h3>
              <p>Pay with confidence using our secure and flexible payment options, including COD and online methods.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2 className="cta-title">Ready to Order?</h2>
          <p className="cta-description">Join thousands of happy customers and get your favorite food delivered today!</p>
          <a href="/restaurants" className="cta-button btn-primary">
            Browse Restaurants
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;