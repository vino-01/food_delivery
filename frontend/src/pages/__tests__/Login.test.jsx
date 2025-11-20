import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Login from '../Login'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock localStorage
const mockLocalStorage = {
  setItem: vi.fn(),
  getItem: vi.fn(),
  removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

const LoginWrapper = () => (
  <MemoryRouter>
    <Login />
  </MemoryRouter>
)

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form correctly', () => {
    render(<LoginWrapper />)

    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByText('Login to continue ordering delicious meals')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByText('New here?')).toBeInTheDocument()
    expect(screen.getByText('Create an account')).toBeInTheDocument()
  })

  it('should have correct form inputs with proper attributes', () => {
    render(<LoginWrapper />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('required')
  })

  it('should update input values when typing', async () => {
    const user = userEvent.setup()
    render(<LoginWrapper />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('should successfully login and navigate to home', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      token: 'mock-token',
      user: { id: '1', name: 'John Doe', email: 'john@example.com' }
    }

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    render(<LoginWrapper />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'john@example.com',
          password: 'password123'
        })
      })
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', mockResponse.token)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.user))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should display error message when login fails', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Invalid credentials'

    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: errorMessage })
    })

    render(<LoginWrapper />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'wrong@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
      expect(screen.getByText(errorMessage)).toHaveClass('error')
    })

    expect(mockNavigate).not.toHaveBeenCalled()
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
  })

  it('should display generic error message when no message provided', async () => {
    const user = userEvent.setup()

    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({})
    })

    render(<LoginWrapper />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Login failed')).toBeInTheDocument()
    })
  })

  it('should handle network errors gracefully', async () => {
    const user = userEvent.setup()

    mockFetch.mockRejectedValue(new Error('Network error'))

    render(<LoginWrapper />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('should clear error message when form is resubmitted', async () => {
    const user = userEvent.setup()

    // First submission - error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'First error' })
    })

    // Second submission - success
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        token: 'token',
        user: { id: '1', name: 'John', email: 'john@example.com' }
      })
    })

    render(<LoginWrapper />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    // First submission
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('First error')).toBeInTheDocument()
    })

    // Second submission
    await user.clear(passwordInput)
    await user.type(passwordInput, 'correctpassword')
    await user.click(submitButton)

    // Error should be cleared immediately on form submission
    await waitFor(() => {
      expect(screen.queryByText('First error')).not.toBeInTheDocument()
    })

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should prevent form submission when required fields are empty', async () => {
    const user = userEvent.setup()
    render(<LoginWrapper />)

    const submitButton = screen.getByRole('button', { name: /login/i })
    
    await user.click(submitButton)

    // Should not make API call when form validation fails
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should have correct link to signup page', () => {
    render(<LoginWrapper />)

    const signupLink = screen.getByText('Create an account')
    expect(signupLink).toHaveAttribute('href', '/signup')
  })

  it('should handle form submission via Enter key', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      token: 'token',
      user: { id: '1', name: 'John', email: 'john@example.com' }
    }

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    render(<LoginWrapper />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', expect.any(Object))
    })

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})