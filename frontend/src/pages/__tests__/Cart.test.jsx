import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Cart from '../Cart'

// Mock the cart context
const mockCartContext = {
  items: [],
  removeFromCart: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
  getTotalPrice: vi.fn(() => 0)
}

vi.mock('../../context/CartContext', () => ({
  useCart: () => mockCartContext
}))

// Mock fetch
global.fetch = vi.fn()

// Mock window.alert
global.alert = vi.fn()

// Mock console.error
global.console.error = vi.fn()

// Mock window.dispatchEvent
global.dispatchEvent = vi.fn()

const CartWrapper = () => (
  <MemoryRouter>
    <Cart />
  </MemoryRouter>
)

describe('Cart Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCartContext.items = []
    mockCartContext.getTotalPrice.mockReturnValue(0)
  })

  describe('Empty Cart', () => {
    it('should display empty cart message when no items', () => {
      render(<CartWrapper />)

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
      expect(screen.getByText('Add some delicious items to get started!')).toBeInTheDocument()
      expect(screen.getByText('Browse Restaurants')).toBeInTheDocument()
      expect(screen.getByText('🛒')).toBeInTheDocument()
    })

    it('should have link to restaurants page', () => {
      render(<CartWrapper />)

      const browseLink = screen.getByText('Browse Restaurants')
      expect(browseLink.closest('a')).toHaveAttribute('href', '/restaurants')
    })
  })

  describe('Cart with Items', () => {
    beforeEach(() => {
      mockCartContext.items = [
        {
          id: 1,
          name: 'Pizza Margherita',
          price: 250,
          quantity: 2,
          restaurantId: 'r1',
          restaurantName: 'Italian Bistro'
        },
        {
          id: 2,
          name: 'Chicken Biryani',
          price: 320,
          quantity: 1,
          restaurantId: 'r2',
          restaurantName: 'Spice Garden',
          allergyNote: 'No onions please'
        }
      ]
      mockCartContext.getTotalPrice.mockReturnValue(820) // 250*2 + 320*1
    })

    it('should display cart items correctly', () => {
      render(<CartWrapper />)

      expect(screen.getByText('Your Cart')).toBeInTheDocument()
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
      expect(screen.getByText('Chicken Biryani')).toBeInTheDocument()
      expect(screen.getByText('Italian Bistro')).toBeInTheDocument()
      expect(screen.getByText('Spice Garden')).toBeInTheDocument()
    })

    it('should display item prices correctly', () => {
      render(<CartWrapper />)

      expect(screen.getByText('₹250')).toBeInTheDocument()
      expect(screen.getByText('₹320')).toBeInTheDocument()
    })

    it('should display item quantities correctly', () => {
      render(<CartWrapper />)

      const quantitySpans = screen.getAllByText(/^[0-9]+$/).filter(el => 
        el.className === 'quantity'
      )
      
      expect(quantitySpans).toHaveLength(2)
      expect(quantitySpans[0]).toHaveTextContent('2')
      expect(quantitySpans[1]).toHaveTextContent('1')
    })

    it('should display allergy notes when present', () => {
      render(<CartWrapper />)

      expect(screen.getByText('Special note: No onions please')).toBeInTheDocument()
      expect(screen.getByText('⚠️')).toBeInTheDocument()
    })

    it('should not display allergy note when not present', () => {
      mockCartContext.items = [
        {
          id: 1,
          name: 'Pizza',
          price: 250,
          quantity: 1,
          restaurantId: 'r1',
          restaurantName: 'Pizzeria'
        }
      ]

      render(<CartWrapper />)

      expect(screen.queryByText(/Special note:/)).not.toBeInTheDocument()
      expect(screen.queryByText('⚠️')).not.toBeInTheDocument()
    })

    it('should update quantity when + button is clicked', async () => {
      const user = userEvent.setup()
      render(<CartWrapper />)

      const plusButtons = screen.getAllByText('+')
      await user.click(plusButtons[0])

      expect(mockCartContext.updateQuantity).toHaveBeenCalledWith(1, 3) // item.id, new quantity
    })

    it('should update quantity when - button is clicked', async () => {
      const user = userEvent.setup()
      render(<CartWrapper />)

      const minusButtons = screen.getAllByText('-')
      await user.click(minusButtons[0])

      expect(mockCartContext.updateQuantity).toHaveBeenCalledWith(1, 1) // item.id, new quantity
    })

    it('should remove item when Remove button is clicked', async () => {
      const user = userEvent.setup()
      render(<CartWrapper />)

      const removeButtons = screen.getAllByText('Remove')
      await user.click(removeButtons[0])

      expect(mockCartContext.removeFromCart).toHaveBeenCalledWith(1)
    })

    it('should clear cart when Clear All is clicked', async () => {
      const user = userEvent.setup()
      render(<CartWrapper />)

      const clearAllButton = screen.getByText('Clear All')
      await user.click(clearAllButton)

      expect(mockCartContext.clearCart).toHaveBeenCalled()
    })

    it('should display order summary correctly', () => {
      render(<CartWrapper />)

      expect(screen.getByText('Order Summary')).toBeInTheDocument()
      expect(screen.getByText('Subtotal')).toBeInTheDocument()
      expect(screen.getByText('₹820')).toBeInTheDocument() // subtotal
      expect(screen.getByText('Delivery Fee')).toBeInTheDocument()
      expect(screen.getByText('₹40')).toBeInTheDocument() // delivery fee
      expect(screen.getByText('Taxes')).toBeInTheDocument()
      expect(screen.getByText('₹41')).toBeInTheDocument() // 5% tax on 820
      expect(screen.getByText('Total')).toBeInTheDocument()
      expect(screen.getByText('₹901')).toBeInTheDocument() // 820 + 40 + 41
    })

    it('should group items by restaurant name', () => {
      render(<CartWrapper />)

      // Both restaurant sections should exist
      expect(screen.getByText('Italian Bistro')).toBeInTheDocument()
      expect(screen.getByText('Spice Garden')).toBeInTheDocument()
    })

    it('should use restaurant ID as fallback when name not available', () => {
      mockCartContext.items = [
        {
          id: 1,
          name: 'Pizza',
          price: 250,
          quantity: 1,
          restaurantId: 'r1'
          // no restaurantName
        }
      ]

      render(<CartWrapper />)

      expect(screen.getByText('Restaurant r1')).toBeInTheDocument()
    })
  })

  describe('Checkout Process', () => {
    beforeEach(() => {
      mockCartContext.items = [
        {
          id: 1,
          name: 'Pizza',
          price: 250,
          quantity: 2,
          restaurantId: 'r1',
          restaurantName: 'Pizzeria'
        },
        {
          id: 2,
          name: 'Burger',
          price: 180,
          quantity: 1,
          restaurantId: 'r2',
          restaurantName: 'Burger House',
          allergyNote: 'No pickles'
        }
      ]
      mockCartContext.getTotalPrice.mockReturnValue(680)
    })

    it('should successfully place order', async () => {
      const user = userEvent.setup()
      fetch.mockResolvedValue({ ok: true })

      render(<CartWrapper />)

      const placeOrderButton = screen.getByText('Place Order')
      await user.click(placeOrderButton)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(2) // Two restaurants, two orders
      })

      // Check first order (Pizzeria)
      expect(fetch).toHaveBeenCalledWith('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: 'r1',
          items: [
            {
              name: 'Pizza',
              price: 250,
              quantity: 2,
              allergyNote: null
            }
          ],
          total: 500
        })
      })

      // Check second order (Burger House)
      expect(fetch).toHaveBeenCalledWith('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: 'r2',
          items: [
            {
              name: 'Burger',
              price: 180,
              quantity: 1,
              allergyNote: 'No pickles'
            }
          ],
          total: 180
        })
      })

      expect(mockCartContext.clearCart).toHaveBeenCalled()
      expect(alert).toHaveBeenCalledWith('Orders placed successfully!')
      expect(dispatchEvent).toHaveBeenCalledWith(new CustomEvent('celebrate'))
    })

    it('should show loading state during checkout', async () => {
      const user = userEvent.setup()
      
      // Make fetch hang to test loading state
      fetch.mockReturnValue(new Promise(() => {}))

      render(<CartWrapper />)

      const placeOrderButton = screen.getByText('Place Order')
      await user.click(placeOrderButton)

      expect(screen.getByText('Placing Order...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Placing Order...' })).toBeDisabled()
    })

    it('should handle checkout errors gracefully', async () => {
      const user = userEvent.setup()
      fetch.mockRejectedValue(new Error('Network error'))

      render(<CartWrapper />)

      const placeOrderButton = screen.getByText('Place Order')
      await user.click(placeOrderButton)

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Checkout failed:', expect.any(Error))
        expect(alert).toHaveBeenCalledWith('Failed to place order. Please try again.')
      })

      expect(mockCartContext.clearCart).not.toHaveBeenCalled()
      expect(dispatchEvent).not.toHaveBeenCalled()

      // Should reset loading state
      expect(screen.getByText('Place Order')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Place Order' })).not.toBeDisabled()
    })

    it('should not checkout when cart is empty', async () => {
      const user = userEvent.setup()
      mockCartContext.items = []

      render(<CartWrapper />)

      // Cart should be empty, so no checkout button should be visible
      expect(screen.queryByText('Place Order')).not.toBeInTheDocument()
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should handle items without allergy notes correctly', async () => {
      const user = userEvent.setup()
      mockCartContext.items = [
        {
          id: 1,
          name: 'Pizza',
          price: 250,
          quantity: 1,
          restaurantId: 'r1'
          // no allergyNote property
        }
      ]
      fetch.mockResolvedValue({ ok: true })

      render(<CartWrapper />)

      const placeOrderButton = screen.getByText('Place Order')
      await user.click(placeOrderButton)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            restaurantId: 'r1',
            items: [
              {
                name: 'Pizza',
                price: 250,
                quantity: 1,
                allergyNote: null
              }
            ],
            total: 250
          })
        })
      })
    })
  })
})