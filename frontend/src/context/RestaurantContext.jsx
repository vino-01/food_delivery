import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { peruduriRestaurants } from '../data/peruduriRestaurants'
import { getRestaurantContacts, getRestaurants } from '../services/api'

// Simple static cache of restaurant data and derived contacts
const RestaurantContext = createContext(null)

// Generate contact info (demo): phone numbers + emails
// If future backend supplies these, this can be replaced.
const generateContacts = (restaurants) => {
  return restaurants.reduce((acc, r, idx) => {
    const basePhone = `98765${String(4310 + idx).padStart(4,'0')}`.slice(0,10)
    const emailSlug = r.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
    acc[r._id] = {
      phone: `+91 ${basePhone}`,
      email: `${emailSlug}@yummybites.com`
    }
    return acc
  }, {})
}

export const RestaurantProvider = ({ children }) => {
  const byId = useMemo(() => peruduriRestaurants.reduce((m, r) => { m[r._id] = r; return m }, {}), [])
  const contactsGenerated = useMemo(() => generateContacts(peruduriRestaurants), [])
  const [contacts, setContacts] = useState(() => {
    let overrides = {}
    try { overrides = JSON.parse(localStorage.getItem('restaurantContactsOverrides') || '{}') } catch {}
    return { ...contactsGenerated, ...overrides }
  })

  const updateRestaurantContact = (id, contact) => {
    setContacts(prev => {
      const next = { ...prev, [id]: { ...prev[id], ...contact } }
      const overrides = JSON.parse(localStorage.getItem('restaurantContactsOverrides') || '{}')
      overrides[id] = { ...overrides[id], ...contact }
      localStorage.setItem('restaurantContactsOverrides', JSON.stringify(overrides))
      return next
    })
  }

  const syncRemoteContacts = async () => {
    try {
      const contactsData = await getRestaurantContacts()
      const map = Array.isArray(contactsData) ? contactsData.reduce((m, r) => { if (r._id && (r.phone || r.email)) m[r._id] = { phone: r.phone, email: r.email }; return m }, {}) : {}
      if (Object.keys(map).length) {
        setContacts(prev => ({ ...prev, ...map }))
        return
      }
    } catch (e) {
      console.warn('contacts endpoint failed', e.message)
    }
    // Fallback to restaurants endpoint if contacts empty
    try {
      const restData = await getRestaurants()
      const map2 = Array.isArray(restData) ? restData.reduce((m, r) => { if (r._id && (r.phone || r.email)) m[r._id] = { phone: r.phone, email: r.email }; return m }, {}) : {}
      if (Object.keys(map2).length) setContacts(prev => ({ ...prev, ...map2 }))
    } catch (e2) {
      console.warn('restaurants fetch failed for contacts fallback', e2.message)
    }
  }

  useEffect(() => { syncRemoteContacts() }, [])

  const value = useMemo(() => ({ list: peruduriRestaurants, byId, contacts, updateRestaurantContact, syncRemoteContacts }), [contacts])
  return <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>
}

export const useRestaurantData = () => {
  const ctx = useContext(RestaurantContext)
  if (!ctx) throw new Error('useRestaurantData must be used within RestaurantProvider')
  return ctx
}

export const useRestaurant = (restaurantId) => {
  const { byId, contacts, updateRestaurantContact } = useRestaurantData()
  const restaurant = byId[restaurantId]
  return {
    ...restaurant,
    contact: contacts[restaurantId],
    updateRestaurantContact
  }
}

export const useAllRestaurants = () => {
  const { list } = useRestaurantData()
  return list
}

export default RestaurantContext
