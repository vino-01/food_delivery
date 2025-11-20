import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act, renderHook } from '@testing-library/react'
import { CartProvider, useCart } from '../CartContext'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

describe('CartContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue('[]')
  })

  describe('CartProvider', () => {
    it('should provide cart context to children', () => {
      const TestComponent = () => {
        const { items } = useCart()
        return <div data-testid="items-count">{items.length}</div>
      }

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      )

      expect(screen.getByTestId('items-count')).toHaveTextContent('0')
    })

    it('should load initial state from localStorage', () => {
      const initialItems = JSON.stringify([
        { id: 1, name: 'Pizza', price: 10, quantity: 2, restaurantId: 'r1' }
      ])
      mockLocalStorage.getItem.mockReturnValue(initialItems)

      const TestComponent = () => {
        const { items } = useCart()
        return <div data-testid="items-count">{items.length}</div>
      }

      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      )

      expect(screen.getByTestId('items-count')).toHaveTextContent('1')
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('cart')
    })
  })

  describe('useCart hook', () => {
    it('should throw error when used outside CartProvider', () => {
      expect(() => {
        renderHook(() => useCart())
      }).toThrow('useCart must be used within a CartProvider')
    })

    it('should add item to cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      const testItem = {
        name: 'Pizza',
        price: 10,
        restaurantId: 'r1'
      }

      act(() => {
        result.current.addToCart(testItem)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0]).toMatchObject({
        ...testItem,
        quantity: 1
      })
      expect(result.current.items[0].id).toBeDefined()
    })

    it('should increase quantity when adding existing item', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
        { id: 1, name: 'Pizza', price: 10, quantity: 1, restaurantId: 'r1' }
      ]))

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      const testItem = {
        name: 'Pizza',
        price: 10,
        restaurantId: 'r1'
      }

      act(() => {
        result.current.addToCart(testItem)
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].quantity).toBe(2)
    })

    it('should remove item from cart', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
        { id: 1, name: 'Pizza', price: 10, quantity: 1, restaurantId: 'r1' }
      ]))

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      act(() => {
        result.current.removeFromCart(1)
      })

      expect(result.current.items).toHaveLength(0)
    })

    it('should update item quantity', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
        { id: 1, name: 'Pizza', price: 10, quantity: 1, restaurantId: 'r1' }
      ]))

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      act(() => {
        result.current.updateQuantity(1, 3)
      })

      expect(result.current.items[0].quantity).toBe(3)
    })

    it('should remove item when quantity updated to 0', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
        { id: 1, name: 'Pizza', price: 10, quantity: 1, restaurantId: 'r1' }
      ]))

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      act(() => {
        result.current.updateQuantity(1, 0)
      })

      expect(result.current.items).toHaveLength(0)
    })

    it('should clear all items from cart', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
        { id: 1, name: 'Pizza', price: 10, quantity: 1, restaurantId: 'r1' },
        { id: 2, name: 'Burger', price: 8, quantity: 2, restaurantId: 'r2' }
      ]))

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      act(() => {
        result.current.clearCart()
      })

      expect(result.current.items).toHaveLength(0)
    })

    it('should calculate total price correctly', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
        { id: 1, name: 'Pizza', price: 10, quantity: 2, restaurantId: 'r1' },
        { id: 2, name: 'Burger', price: 8, quantity: 1, restaurantId: 'r2' }
      ]))

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      expect(result.current.getTotalPrice()).toBe(28) // (10 * 2) + (8 * 1)
    })

    it('should calculate total items count correctly', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
        { id: 1, name: 'Pizza', price: 10, quantity: 2, restaurantId: 'r1' },
        { id: 2, name: 'Burger', price: 8, quantity: 3, restaurantId: 'r2' }
      ]))

      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      expect(result.current.getTotalItems()).toBe(5) // 2 + 3
    })

    it('should save to localStorage on state change', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      })

      const testItem = {
        name: 'Pizza',
        price: 10,
        restaurantId: 'r1'
      }

      act(() => {
        result.current.addToCart(testItem)
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'cart',
        expect.stringContaining('Pizza')
      )
    })
  })
})