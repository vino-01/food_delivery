import React, { useState, useEffect } from 'react'
import './AllergenManager.css'
import { commonAllergens, dietaryPreferences, popularCustomizations } from '../../data/peruduriRestaurants'
import { showWarningToast } from '../../utils/toast'

const AllergenManager = ({ menuItem, onCustomizationChange, customizations = {} }) => {
  const [activeTab, setActiveTab] = useState('allergens')
  const [selectedAllergens, setSelectedAllergens] = useState([])
  const [dietaryRestrictions, setDietaryRestrictions] = useState([])
  const [customizations_local, setCustomizations] = useState({
    spiceLevel: 'Medium',
    sweetness: 'Medium',
    oilContent: 'Medium',
    saltContent: 'Medium',
    portion: 'Regular',
    ...customizations
  })
  const [specialInstructions, setSpecialInstructions] = useState('')

  useEffect(() => {
    // Load user's saved preferences
    const savedPreferences = JSON.parse(localStorage.getItem('userDietaryPreferences') || '{}')
    if (savedPreferences.allergens) setSelectedAllergens(savedPreferences.allergens)
    if (savedPreferences.dietary) setDietaryRestrictions(savedPreferences.dietary)
  }, [])

  const handleAllergenToggle = (allergen) => {
    const updated = selectedAllergens.includes(allergen)
      ? selectedAllergens.filter(a => a !== allergen)
      : [...selectedAllergens, allergen]
    
    setSelectedAllergens(updated)
    savePreferences({ allergens: updated, dietary: dietaryRestrictions })
    
    // Check if this item contains the allergen
    const hasAllergen = menuItem.allergens?.includes(allergen)
    if (hasAllergen && updated.includes(allergen)) {
      showWarningToast(`This item contains ${allergen}. Add a note if you want to avoid it.`)
    }
  }

  const handleDietaryToggle = (dietary) => {
    const updated = dietaryRestrictions.includes(dietary)
      ? dietaryRestrictions.filter(d => d !== dietary)
      : [...dietaryRestrictions, dietary]
    
    setDietaryRestrictions(updated)
    savePreferences({ allergens: selectedAllergens, dietary: updated })
  }

  const handleCustomizationChange = (key, value) => {
    const updated = { ...customizations_local, [key]: value }
    setCustomizations(updated)
    
    if (onCustomizationChange) {
      onCustomizationChange({
        ...updated,
        allergens: selectedAllergens,
        dietaryRestrictions,
        specialInstructions,
        itemAllergens: menuItem.allergens || []
      })
    }
  }

  const savePreferences = (preferences) => {
    localStorage.setItem('userDietaryPreferences', JSON.stringify(preferences))
  }

  const getAllergenWarnings = () => {
    if (!menuItem.allergens) return []
    return menuItem.allergens.filter(allergen => selectedAllergens.includes(allergen))
  }

  const warnings = getAllergenWarnings()

  return (
    <div className="allergen-manager">
      <div className="allergen-tabs">
        <button 
          className={`tab-btn ${activeTab === 'allergens' ? 'active' : ''}`}
          onClick={() => setActiveTab('allergens')}
        >
          🚨 Allergens
        </button>
        <button 
          className={`tab-btn ${activeTab === 'customize' ? 'active' : ''}`}
          onClick={() => setActiveTab('customize')}
        >
          🎯 Customize
        </button>
        <button 
          className={`tab-btn ${activeTab === 'dietary' ? 'active' : ''}`}
          onClick={() => setActiveTab('dietary')}
        >
          🥗 Dietary
        </button>
        <button 
          className={`tab-btn ${activeTab === 'instructions' ? 'active' : ''}`}
          onClick={() => setActiveTab('instructions')}
        >
          📝 Instructions
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'allergens' && (
          <div className="allergens-section">
            <h4>⚠️ Select Your Allergens</h4>
            <p className="help-text">We'll warn you if any item contains these allergens</p>
            
            {warnings.length > 0 && (
              <div className="allergen-warnings">
                <h5>🚨 ALLERGEN WARNING for this item:</h5>
                {warnings.map(allergen => (
                  <div key={allergen} className="warning-item">
                    ⚠️ Contains <strong>{allergen}</strong>
                  </div>
                ))}
                <p className="warning-note">Please specify avoidance in special instructions</p>
              </div>
            )}

            <div className="allergen-grid">
              {commonAllergens.map(allergen => (
                <label key={allergen} className="allergen-option">
                  <input
                    type="checkbox"
                    checked={selectedAllergens.includes(allergen)}
                    onChange={() => handleAllergenToggle(allergen)}
                  />
                  <span className="allergen-label">{allergen}</span>
                </label>
              ))}
            </div>

            {/* Complete Ingredients List */}
            {menuItem.ingredients && menuItem.ingredients.length > 0 && (
              <div className="item-ingredients">
                <h5>Complete Ingredients List:</h5>
                <div className="ingredients-list">
                  {menuItem.ingredients.map((ingredient, index) => (
                    <span key={index} className="ingredient-tag">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {menuItem.allergens && menuItem.allergens.length > 0 && (
              <div className="item-allergens">
                <h5>This item contains:</h5>
                <div className="item-allergen-list">
                  {menuItem.allergens.map(allergen => (
                    <span key={allergen} className="item-allergen-tag">
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'customize' && (
          <div className="customize-section">
            <h4>🎯 Customize Your Order</h4>
            
            {menuItem.customizable?.spice && (
              <div className="customization-group">
                <label>🌶️ Spice Level:</label>
                <select
                  value={customizations_local.spiceLevel}
                  onChange={(e) => handleCustomizationChange('spiceLevel', e.target.value)}
                >
                  {menuItem.customizable.spice.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            )}

            {menuItem.customizable?.sweetness && (
              <div className="customization-group">
                <label>🍯 Sweetness:</label>
                <select
                  value={customizations_local.sweetness}
                  onChange={(e) => handleCustomizationChange('sweetness', e.target.value)}
                >
                  {menuItem.customizable.sweetness.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            )}

            {menuItem.customizable?.portion && (
              <div className="customization-group">
                <label>📏 Portion Size:</label>
                <select
                  value={customizations_local.portion}
                  onChange={(e) => handleCustomizationChange('portion', e.target.value)}
                >
                  {menuItem.customizable.portion.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}

            {menuItem.customizable?.extras && (
              <div className="customization-group">
                <label>➕ Add Extras:</label>
                <div className="extras-grid">
                  {menuItem.customizable.extras.map(extra => (
                    <label key={extra} className="extra-option">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const extras = customizations_local.extras || []
                          const updated = e.target.checked 
                            ? [...extras, extra]
                            : extras.filter(e => e !== extra)
                          handleCustomizationChange('extras', updated)
                        }}
                      />
                      <span>{extra}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {menuItem.customizable?.avoid && (
              <div className="customization-group">
                <label>🚫 Avoid Ingredients:</label>
                <div className="avoid-grid">
                  {menuItem.customizable.avoid.map(item => (
                    <label key={item} className="avoid-option">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const avoid = customizations_local.avoid || []
                          const updated = e.target.checked 
                            ? [...avoid, item]
                            : avoid.filter(a => a !== item)
                          handleCustomizationChange('avoid', updated)
                        }}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dietary' && (
          <div className="dietary-section">
            <h4>🥗 Dietary Preferences</h4>
            <div className="dietary-grid">
              {dietaryPreferences.map(dietary => (
                <label key={dietary} className="dietary-option">
                  <input
                    type="checkbox"
                    checked={dietaryRestrictions.includes(dietary)}
                    onChange={() => handleDietaryToggle(dietary)}
                  />
                  <span className="dietary-label">{dietary}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'instructions' && (
          <div className="instructions-section">
            <h4>📝 Special Instructions</h4>
            <textarea
              value={specialInstructions}
              onChange={(e) => {
                setSpecialInstructions(e.target.value)
                if (onCustomizationChange) {
                  onCustomizationChange({
                    ...customizations_local,
                    allergens: selectedAllergens,
                    dietaryRestrictions,
                    specialInstructions: e.target.value
                  })
                }
              }}
              placeholder="Any special requests? e.g., 'Please avoid onions', 'Make it less spicy', 'Extra crispy', etc."
              rows={4}
            />
            
            <div className="instruction-suggestions">
              <h5>💡 Common Requests:</h5>
              <div className="suggestion-buttons">
                {[
                  'Make it less spicy',
                  'No onions please',
                  'Extra crispy',
                  'Less oil',
                  'Make it fresh',
                  'Pack separately',
                  'Add extra sauce',
                  'No green chilies'
                ].map(suggestion => (
                  <button
                    key={suggestion}
                    className="suggestion-btn"
                    onClick={() => {
                      const current = specialInstructions
                      const updated = current ? `${current}, ${suggestion}` : suggestion
                      setSpecialInstructions(updated)
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {warnings.length > 0 && (
        <div className="final-warning">
          <strong>⚠️ FINAL REMINDER:</strong> This item contains allergens you've specified. 
          Please ensure you've mentioned your requirements in special instructions.
        </div>
      )}
    </div>
  )
}

export default AllergenManager