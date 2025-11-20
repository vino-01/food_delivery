import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cravings, getCuisinesByCraving, cuisines } from '../data/cuisinesData'
import './pages.css'

const Cravings = () => {
  const [selectedCraving, setSelectedCraving] = useState(null)
  const [matchingCuisines, setMatchingCuisines] = useState([])
  const [timeOfDay, setTimeOfDay] = useState('')
  const [mood, setMood] = useState('')
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    // Determine time of day for personalized recommendations
    const hour = new Date().getHours()
    if (hour < 12) setTimeOfDay('morning')
    else if (hour < 17) setTimeOfDay('afternoon')
    else if (hour < 21) setTimeOfDay('evening')
    else setTimeOfDay('night')

    // Generate initial recommendations
    generateRecommendations()
  }, [])

  useEffect(() => {
    if (selectedCraving) {
      const cuisines = getCuisinesByCraving(selectedCraving.id)
      setMatchingCuisines(cuisines)
    } else {
      setMatchingCuisines([])
    }
  }, [selectedCraving])

  const generateRecommendations = () => {
    const hour = new Date().getHours()
    let timeBasedCravings = []

    if (hour < 12) {
      // Morning cravings
      timeBasedCravings = cravings.filter(c => 
        ['healthy', 'comfort', 'quick-bites'].includes(c.id)
      )
    } else if (hour < 17) {
      // Afternoon cravings
      timeBasedCravings = cravings.filter(c => 
        ['spicy', 'traditional', 'healthy'].includes(c.id)
      )
    } else if (hour < 21) {
      // Evening cravings
      timeBasedCravings = cravings.filter(c => 
        ['comfort', 'party-food', 'exotic'].includes(c.id)
      )
    } else {
      // Night cravings
      timeBasedCravings = cravings.filter(c => 
        ['comfort', 'quick-bites', 'sweet'].includes(c.id)
      )
    }

    setRecommendations(timeBasedCravings.slice(0, 3))
  }

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning! What sounds good for breakfast?"
    if (hour < 17) return "Good afternoon! Time for a delicious lunch?"
    if (hour < 21) return "Good evening! Ready for dinner?"
    return "Late night cravings? We've got you covered!"
  }

  const getMoodBasedSuggestions = (selectedMood) => {
    const moodMap = {
      happy: ['party-food', 'sweet', 'exotic'],
      stressed: ['comfort', 'sweet', 'healthy'],
      energetic: ['spicy', 'quick-bites', 'traditional'],
      relaxed: ['comfort', 'traditional', 'healthy'],
      adventurous: ['exotic', 'spicy', 'party-food'],
      nostalgic: ['traditional', 'comfort', 'sweet']
    }
    
    return moodMap[selectedMood] || []
  }

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood)
    const moodCravings = getMoodBasedSuggestions(selectedMood)
    const suggestedCravings = cravings.filter(c => moodCravings.includes(c.id))
    setRecommendations(suggestedCravings)
  }

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'low': return '#26C6DA'
      case 'medium': return '#FFA726'
      case 'high': return '#FF4757'
      default: return '#A55EEA'
    }
  }

  return (
    <div className='page cravings-page'>
      {/* Hero Section */}
      <div className='cravings-hero'>
        <div className='hero-content'>
          <h1>What Are You Craving?</h1>
          <p className='hero-greeting'>{getTimeBasedGreeting()}</p>
          <div className='craving-stats'>
            <div className='stat'>
              <span className='stat-number'>{cravings.length}</span>
              <span className='stat-label'>Craving Types</span>
            </div>
            <div className='stat'>
              <span className='stat-number'>{cuisines.length}</span>
              <span className='stat-label'>Cuisines</span>
            </div>
            <div className='stat'>
              <span className='stat-number'>1000+</span>
              <span className='stat-label'>Dishes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Selector */}
      <section className='mood-section'>
        <h2>🎭 How are you feeling today?</h2>
        <p>Let us suggest cravings based on your mood</p>
        <div className='mood-grid'>
          {[
            { id: 'happy', emoji: '😊', name: 'Happy', color: '#FFD93D' },
            { id: 'stressed', emoji: '😰', name: 'Stressed', color: '#FF6B6B' },
            { id: 'energetic', emoji: '⚡', name: 'Energetic', color: '#4ECDC4' },
            { id: 'relaxed', emoji: '😌', name: 'Relaxed', color: '#95E1D3' },
            { id: 'adventurous', emoji: '🌟', name: 'Adventurous', color: '#A8E6CF' },
            { id: 'nostalgic', emoji: '🥺', name: 'Nostalgic', color: '#FFB6C1' }
          ].map(moodOption => (
            <button
              key={moodOption.id}
              className={`mood-card ${mood === moodOption.id ? 'active' : ''}`}
              style={{ '--mood-color': moodOption.color }}
              onClick={() => handleMoodSelect(moodOption.id)}
            >
              <div className='mood-emoji'>{moodOption.emoji}</div>
              <span className='mood-name'>{moodOption.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <section className='recommendations-section'>
          <h2>
            🎯 {mood ? 'Perfect for your mood' : `Perfect for ${timeOfDay}`}
          </h2>
          <div className='recommendations-grid'>
            {recommendations.map(craving => (
              <button
                key={craving.id}
                className='recommendation-card'
                style={{ '--craving-color': craving.color }}
                onClick={() => setSelectedCraving(craving)}
              >
                <div className='recommendation-emoji'>{craving.emoji}</div>
                <div className='recommendation-info'>
                  <h3>{craving.name}</h3>
                  <p>{craving.description}</p>
                  <div className='recommendation-meta'>
                    <span 
                      className='intensity-badge'
                      style={{ backgroundColor: getIntensityColor(craving.intensity) }}
                    >
                      {craving.intensity} intensity
                    </span>
                    <span className='matching-count'>
                      {craving.matchingCuisines.length} cuisines
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* All Cravings */}
      <section className='all-cravings-section'>
        <h2>Explore All Cravings</h2>
        <div className='cravings-grid'>
          {cravings.map(craving => (
            <button
              key={craving.id}
              className={`craving-card ${selectedCraving?.id === craving.id ? 'active' : ''}`}
              style={{ '--craving-color': craving.color }}
              onClick={() => setSelectedCraving(selectedCraving?.id === craving.id ? null : craving)}
            >
              <div className='craving-header'>
                <div className='craving-emoji'>{craving.emoji}</div>
                <div className='craving-info'>
                  <h3>{craving.name}</h3>
                  <p>{craving.description}</p>
                </div>
              </div>
              
              <div className='craving-meta'>
                <div className='intensity-indicator'>
                  <span className='intensity-label'>Intensity:</span>
                  <div className='intensity-dots'>
                    {[1, 2, 3].map(dot => (
                      <div
                        key={dot}
                        className={`intensity-dot ${
                          (craving.intensity === 'low' && dot <= 1) ||
                          (craving.intensity === 'medium' && dot <= 2) ||
                          (craving.intensity === 'high' && dot <= 3)
                            ? 'active' : ''
                        }`}
                        style={{ backgroundColor: getIntensityColor(craving.intensity) }}
                      ></div>
                    ))}
                  </div>
                </div>
                
                <div className='matching-cuisines-count'>
                  {craving.matchingCuisines.length} matching cuisines
                </div>
              </div>

              <div className='popular-dishes-preview'>
                <span className='preview-label'>Popular:</span>
                <div className='dishes-preview'>
                  {craving.popularDishes.slice(0, 2).map((dish, idx) => (
                    <span key={idx} className='dish-preview-tag'>
                      {dish}
                    </span>
                  ))}
                  {craving.popularDishes.length > 2 && (
                    <span className='more-dishes'>
                      +{craving.popularDishes.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Selected Craving Details */}
      {selectedCraving && (
        <section className='selected-craving-section'>
          <div className='selected-craving-header'>
            <div className='selected-craving-info'>
              <div className='selected-emoji'>{selectedCraving.emoji}</div>
              <div>
                <h2>{selectedCraving.name}</h2>
                <p>{selectedCraving.description}</p>
              </div>
            </div>
            <button 
              className='close-selection'
              onClick={() => setSelectedCraving(null)}
            >
              ✕
            </button>
          </div>

          <div className='craving-details'>
            <div className='popular-dishes-section'>
              <h3>Popular Dishes</h3>
              <div className='popular-dishes-grid'>
                {selectedCraving.popularDishes.map((dish, idx) => (
                  <div key={idx} className='popular-dish-card'>
                    <span className='dish-name'>{dish}</span>
                    <span className='dish-category'>
                      {selectedCraving.matchingCuisines[idx % selectedCraving.matchingCuisines.length]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className='matching-cuisines-section'>
              <h3>🌍 Matching Cuisines ({matchingCuisines.length})</h3>
              {matchingCuisines.length > 0 ? (
                <div className='matching-cuisines-grid'>
                  {matchingCuisines.map(cuisine => (
                    <Link
                      key={cuisine.id}
                      to={`/cuisine/${cuisine.id}`}
                      className='matching-cuisine-card'
                      style={{ '--cuisine-color': cuisine.color }}
                    >
                      <div className='cuisine-emoji'>{cuisine.emoji}</div>
                      <div className='cuisine-info'>
                        <h4>{cuisine.name}</h4>
                        <p>{cuisine.restaurants} restaurants</p>
                        <div className='cuisine-stats'>
                          <span>⚡ {cuisine.deliveryTime}</span>
                          <span>💰 ₹{cuisine.avgPrice}</span>
                          <span>🔥 {cuisine.popularity}%</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className='no-matching-cuisines'>
                  <p>No matching cuisines found for this craving.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className='quick-actions-section'>
        <h2>🚀 Quick Actions</h2>
        <div className='quick-actions-grid'>
          <Link to='/cuisines' className='quick-action-card'>
            <div className='action-icon'>🌍</div>
            <div className='action-info'>
              <h3>Browse All Cuisines</h3>
              <p>Explore our complete collection of cuisines</p>
            </div>
          </Link>
          
          <Link to='/restaurants' className='quick-action-card'>
            <div className='action-icon'>🏪</div>
            <div className='action-info'>
              <h3>Find Restaurants</h3>
              <p>Discover restaurants near you</p>
            </div>
          </Link>
          
          <button 
            className='quick-action-card'
            onClick={() => {
              const randomCraving = cravings[Math.floor(Math.random() * cravings.length)]
              setSelectedCraving(randomCraving)
            }}
          >
            <div className='action-icon'>🎲</div>
            <div className='action-info'>
              <h3>Surprise Me!</h3>
              <p>Let us pick a random craving for you</p>
            </div>
          </button>
        </div>
      </section>
    </div>
  )
}

export default Cravings