import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../Navbar'
import { CartProvider } from '../../../context/CartContext'

// Mock the cart context
const mockUseCart = vi.fn()

vi.mock('../../../context/CartContext', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useCart: () => mockUseCart(),
  }
})

const NavbarWrapper = ({ initialEntries = ['/'] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    <CartProvider>
      <Navbar />
    </CartProvider>
  </MemoryRouter>
)

describe('Navbar', () => {
  beforeEach(() => {
    mockUseCart.mockReturnValue({
      getTotalItems: () => 0,
    })
  })

  it('should render brand name correctly', () => {
    render(<NavbarWrapper />)
    
    expect(screen.getByText('YummyBites')).toBeInTheDocument()
    // Brand logo has been removed - only text remains
  })

  it('should render all navigation links', () => {
    render(<NavbarWrapper />)
    
    // Check for essential navigation links (simplified navbar)
    const expectedLinks = [
      'Home', 'Restaurants', 'Cart', 'Login'
    ]

    expectedLinks.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    // Check that removed links are not present
    expect(screen.queryByText('Near Me')).not.toBeInTheDocument()
    expect(screen.queryByText('Cuisines')).not.toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()

    // Check that all nav links have SVG icons
    const navIcons = document.querySelectorAll('.nav-icon')
    expect(navIcons).toHaveLength(4) // 4 navigation links now
  })

  it('should highlight active link correctly', () => {
    render(<NavbarWrapper initialEntries={['/restaurants']} />)
    
    const restaurantsLink = screen.getByText('Restaurants').closest('.nav-link')
    const homeLink = screen.getByText('Home').closest('.nav-link')
    
    expect(restaurantsLink).toHaveClass('active')
    expect(homeLink).not.toHaveClass('active')
  })

  it('should show cart badge when items exist', () => {
    mockUseCart.mockReturnValue({
      getTotalItems: () => 3,
    })

    render(<NavbarWrapper />)
    
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('3')).toHaveClass('cart-badge')
  })

  it('should not show cart badge when no items', () => {
    mockUseCart.mockReturnValue({
      getTotalItems: () => 0,
    })

    render(<NavbarWrapper />)
    
    expect(screen.queryByText('0')).not.toBeInTheDocument()
    const cartBadge = document.querySelector('.cart-badge')
    expect(cartBadge).not.toBeInTheDocument()
  })

  it('should have correct link destinations', () => {
    render(<NavbarWrapper />)
    
    const linkTests = [
      { text: 'Home', href: '/' },
      { text: 'Restaurants', href: '/restaurants' },
      { text: 'Cart', href: '/cart' },
      { text: 'Login', href: '/login' },
    ]

    linkTests.forEach(({ text, href }) => {
      const link = screen.getByText(text).closest('a')
      expect(link).toHaveAttribute('href', href)
    })
  })

  it('should apply cart-link class to cart link', () => {
    render(<NavbarWrapper />)
    
    const cartLink = screen.getByText('Cart').closest('.nav-link')
    expect(cartLink).toHaveClass('cart-link')
  })

  it('should highlight multiple active states correctly', () => {
    // Only test routes that exist in the simplified navbar
    const routes = [
      { route: '/', activeText: 'Home' },
      { route: '/restaurants', activeText: 'Restaurants' },
      { route: '/cart', activeText: 'Cart' },
      { route: '/login', activeText: 'Login' },
    ]

    routes.forEach(({ route, activeText }) => {
      const { unmount } = render(<NavbarWrapper initialEntries={[route]} />)
      
      const activeLink = screen.getByText(activeText).closest('.nav-link')
      expect(activeLink).toHaveClass('active')
      
      unmount()
    })
  })
})