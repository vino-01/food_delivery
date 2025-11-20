import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mountToast, showToast } from '../toast'

describe('toast utilities', () => {
  let mockRequestAnimationFrame
  let mockSetTimeout

  beforeEach(() => {
    // Clear DOM
    document.body.innerHTML = ''
    
    // Mock requestAnimationFrame
    mockRequestAnimationFrame = vi.fn((callback) => callback())
    global.requestAnimationFrame = mockRequestAnimationFrame
    
    // Mock setTimeout
    mockSetTimeout = vi.fn((callback, delay) => {
      if (delay === 300) {
        // Don't execute the inner timeout immediately for remove operations
        return 1
      }
      callback() // Execute immediately for testing
      return 1
    })
    global.setTimeout = mockSetTimeout
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('mountToast', () => {
    it('should create toast container if it does not exist', () => {
      expect(document.getElementById('toast-container')).toBeNull()
      
      mountToast()
      
      const container = document.getElementById('toast-container')
      expect(container).toBeInstanceOf(HTMLElement)
      expect(container.className).toBe('toast-container')
      expect(document.body.contains(container)).toBe(true)
    })

    it('should not create duplicate toast container', () => {
      mountToast()
      mountToast()
      
      const containers = document.querySelectorAll('#toast-container')
      expect(containers).toHaveLength(1)
    })

    it('should reuse existing toast container', () => {
      mountToast()
      const firstContainer = document.getElementById('toast-container')
      
      mountToast()
      const secondContainer = document.getElementById('toast-container')
      
      expect(firstContainer).toBe(secondContainer)
    })
  })

  describe('showToast', () => {
    it('should create and display toast message', () => {
      const message = 'Test toast message'
      
      showToast(message)
      
      const container = document.getElementById('toast-container')
      const toastElement = container.querySelector('.toast')
      
      expect(container).toBeInstanceOf(HTMLElement)
      expect(toastElement).toBeInstanceOf(HTMLElement)
      expect(toastElement.textContent).toBe(message)
    })

    it('should mount container if it does not exist', () => {
      expect(document.getElementById('toast-container')).toBeNull()
      
      showToast('test message')
      
      expect(document.getElementById('toast-container')).toBeInstanceOf(HTMLElement)
    })

    it('should add "in" class to toast element', () => {
      showToast('test message')
      
      const toastElement = document.querySelector('.toast')
      
      expect(mockRequestAnimationFrame).toHaveBeenCalled()
      expect(toastElement.classList.contains('in')).toBe(true)
    })

    it('should use default timeout of 2000ms', () => {
      showToast('test message')
      
      // Should be called twice: once for the main timeout, once for the remove timeout
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 2000)
    })

    it('should use custom timeout when provided', () => {
      const customTimeout = 5000
      
      showToast('test message', customTimeout)
      
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), customTimeout)
    })

    it('should remove toast element after timeout', () => {
      // Mock setTimeout to actually execute callbacks with proper timing
      const timeouts = []
      global.setTimeout = vi.fn((callback, delay) => {
        timeouts.push({ callback, delay })
        return timeouts.length
      })
      
      showToast('test message', 1000)
      
      // Find the timeout that should remove the 'in' class
      const removeInTimeout = timeouts.find(t => t.delay === 1000)
      expect(removeInTimeout).toBeDefined()
      
      const toastElement = document.querySelector('.toast')
      expect(toastElement.classList.contains('in')).toBe(true)
      
      // Execute the timeout callback
      removeInTimeout.callback()
      
      expect(toastElement.classList.contains('in')).toBe(false)
    })

    it('should handle multiple toast messages', () => {
      showToast('First message')
      showToast('Second message')
      showToast('Third message')
      
      const container = document.getElementById('toast-container')
      const toastElements = container.querySelectorAll('.toast')
      
      expect(toastElements).toHaveLength(3)
      expect(toastElements[0].textContent).toBe('First message')
      expect(toastElements[1].textContent).toBe('Second message')
      expect(toastElements[2].textContent).toBe('Third message')
    })

    it('should create toast with correct CSS class', () => {
      showToast('test message')
      
      const toastElement = document.querySelector('.toast')
      expect(toastElement.className).toBe('toast in')
    })
  })
})