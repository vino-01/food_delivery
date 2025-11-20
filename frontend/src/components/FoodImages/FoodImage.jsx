import React from 'react'
import './FoodImages.css'

export const RestaurantBannerImage = ({ restaurant = {}, className = '' }) => {
  const imgUrl = restaurant.image || restaurant.imageUrl || restaurant.banner

  const style = imgUrl
    ? { backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined

  const ariaLabel = restaurant.name ? `${restaurant.name} banner` : 'restaurant banner'

  return (
    <div
      className={`restaurant-banner-image ${className}`}
      style={style}
      role="img"
      aria-label={ariaLabel}
    />
  )
}

export default RestaurantBannerImage
