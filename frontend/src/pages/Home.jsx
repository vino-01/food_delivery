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
            <SmartReorderCard />
          </div>
        </div>
      </header>

      <section className="categories">
        <div className="container">
          <h2 className="section-title">Explore Cuisines</h2>
          <div className="categories-grid">
            <a href="/cuisine/indian" className="category-card">
              <span className="category-icon">🍛</span>
              <h3>Indian</h3>
            </a>
            <a href="/cuisine/italian" className="category-card">
              <span className="category-icon">🍕</span>
              <h3>Italian</h3>
            </a>
            <a href="/cuisine/chinese" className="category-card">
              <span className="category-icon">🍜</span>
              <h3>Chinese</h3>
            </a>
            <a href="/cuisine/mexican" className="category-card">
              <span className="category-icon">🌮</span>
              <h3>Mexican</h3>
            </a>
            <a href="/cuisine/american" className="category-card">
              <span className="category-icon">🍔</span>
              <h3>American</h3>
            </a>
            <a href="/cuisine/desserts" className="category-card">
              <span className="category-icon">🍰</span>
              <h3>Desserts</h3>
            </a>
          </div>
        </div>
      </section>

      <section className="restaurants">
        <div className="container">
          <h2 className="section-title">Popular Restaurants</h2>
          <div className="restaurants-grid">
            {restaurants && restaurants.length > 0 ? (
              restaurants.slice(0, 3).map((r) => (
                <a key={r._id || r.id || r.name} href={`/restaurant/${r._id || r.id || ''}`} className="restaurant-card">
                      <div
                        className="restaurant-image"
                        style={r.image ? { backgroundImage: `url(${r.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                      >
                        {!r.image && <span className="restaurant-icon">🍽️</span>}
                      </div>
                  <div className="restaurant-info">
                    <h3>{r.name}</h3>
                    <p className="cuisine">{r.cuisine || r.categories || ''}</p>
                    <div className="restaurant-meta">
                      <span className="rating">{r.rating ? `⭐ ${r.rating}` : '⭐ —'}</span>
                      <span className="delivery-time">{r.etaMins ? ` • ${r.etaMins}-${r.etaMins + 15} min` : ''}</span>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              /* fallback static cards */
              <>
                <a href="/restaurant/1" className="restaurant-card">
                  <div className="restaurant-image">
                    <span className="restaurant-icon">🍽️</span>
                  </div>
                  <div className="restaurant-info">
                    <h3>Gourmet Grill</h3>
                    <p className="cuisine">Modern European</p>
                    <div className="restaurant-meta">
                      <span className="rating">⭐ 4.5</span>
                      <span className="delivery-time"> • 30-45 min</span>
                    </div>
                  </div>
                </a>
                <a href="/restaurant/2" className="restaurant-card">
                  <div className="restaurant-image">
                    <span className="restaurant-icon">🍣</span>
                  </div>
                  <div className="restaurant-info">
                    <h3>Sushi Haven</h3>
                    <p className="cuisine">Japanese, Sushi</p>
                    <div className="restaurant-meta">
                      <span className="rating">⭐ 4.8</span>
                      <span className="delivery-time"> • 20-30 min</span>
                    </div>
                  </div>
                </a>
                <a href="/restaurant/3" className="restaurant-card">
                  <div className="restaurant-image">
                    <span className="restaurant-icon">🌶️</span>
                  </div>
                  <div className="restaurant-info">
                    <h3>Spice Route</h3>
                    <p className="cuisine">Authentic Indian</p>
                    <div className="restaurant-meta">
                      <span className="rating">⭐ 4.2</span>
                      <span className="delivery-time"> • 40-50 min</span>
                    </div>
                  </div>
                </a>
              </>
            )}
          </div>
        </div>
      </section>

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