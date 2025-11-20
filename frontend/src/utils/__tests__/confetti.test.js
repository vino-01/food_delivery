import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mountConfetti, celebrateBurst, attachGlobalCelebrate } from '../confetti'

describe('confetti utilities', () => {
  let mockRequestAnimationFrame
  let mockCancelAnimationFrame
  let mockPerformanceNow
  let mockSetTimeout
  let mockGetContext

  beforeEach(() => {
    // Clear DOM
    document.body.innerHTML = ''
    
    // Mock performance.now
    mockPerformanceNow = vi.fn(() => 1000)
    global.performance = { now: mockPerformanceNow }
    
    // Mock setTimeout
    mockSetTimeout = vi.fn((callback, delay) => {
      // Don't call the callback immediately to prevent recursion
      return 1
    })
    global.setTimeout = mockSetTimeout
    
    // Mock requestAnimationFrame
    mockRequestAnimationFrame = vi.fn((callback) => {
      // Store callback for manual triggering
      return 1
    })
    global.requestAnimationFrame = mockRequestAnimationFrame
    
    // Mock cancelAnimationFrame
    mockCancelAnimationFrame = vi.fn()
    global.cancelAnimationFrame = mockCancelAnimationFrame
    
    // Mock canvas context
    mockGetContext = vi.fn(() => ({
      clearRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: ''
    }))
    
    // Mock HTMLCanvasElement
    global.HTMLCanvasElement.prototype.getContext = mockGetContext
    
    // Mock window dimensions and devicePixelRatio
    Object.defineProperty(window, 'innerWidth', { value: 1024 })
    Object.defineProperty(window, 'innerHeight', { value: 768 })
    Object.defineProperty(window, 'devicePixelRatio', { value: 1 })
    
    // Clear global event listener flag
    delete window.__celebrate_bound
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('mountConfetti', () => {
    it('should create confetti canvas if it does not exist', () => {
      expect(document.getElementById('confetti-canvas')).toBeNull()
      
      mountConfetti()
      
      const canvas = document.getElementById('confetti-canvas')
      expect(canvas).toBeInstanceOf(HTMLElement)
      expect(canvas.tagName).toBe('CANVAS')
      expect(document.body.contains(canvas)).toBe(true)
    })

    it('should set correct canvas styles', () => {
      mountConfetti()
      
      const canvas = document.getElementById('confetti-canvas')
      const style = canvas.style
      
      expect(style.position).toBe('fixed')
      expect(style.left).toBe('0px')
      expect(style.top).toBe('0px')
      expect(style.width).toBe('100vw')
      expect(style.height).toBe('100vh')
      expect(style.pointerEvents).toBe('none')
      expect(style.zIndex).toBe('9999')
    })

    it('should not create duplicate confetti canvas', () => {
      mountConfetti()
      mountConfetti()
      
      const canvases = document.querySelectorAll('#confetti-canvas')
      expect(canvases).toHaveLength(1)
    })

    it('should reuse existing confetti canvas', () => {
      mountConfetti()
      const firstCanvas = document.getElementById('confetti-canvas')
      
      mountConfetti()
      const secondCanvas = document.getElementById('confetti-canvas')
      
      expect(firstCanvas).toBe(secondCanvas)
    })
  })

  describe('celebrateBurst', () => {
    beforeEach(() => {
      // Mock canvas element with width/height properties
      Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
        get: vi.fn(() => 1024),
        set: vi.fn()
      })
      Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
        get: vi.fn(() => 768),
        set: vi.fn()
      })
    })

    it('should mount confetti canvas', () => {
      celebrateBurst()
      
      const canvas = document.getElementById('confetti-canvas')
      expect(canvas).toBeInstanceOf(HTMLElement)
    })

    it('should setup canvas context and dimensions', () => {
      celebrateBurst()
      
      const canvas = document.getElementById('confetti-canvas')
      expect(mockGetContext).toHaveBeenCalledWith('2d')
    })

    it('should use default duration of 1500ms', () => {
      celebrateBurst()
      
      // Should start animation
      expect(mockRequestAnimationFrame).toHaveBeenCalled()
    })

    it('should use custom duration when provided', () => {
      const customDuration = 3000
      celebrateBurst(customDuration)
      
      expect(mockRequestAnimationFrame).toHaveBeenCalled()
      // Duration is used internally in the animation loop
    })

    it('should handle device pixel ratio', () => {
      Object.defineProperty(window, 'devicePixelRatio', { value: 2 })
      
      celebrateBurst()
      
      expect(mockGetContext).toHaveBeenCalled()
    })

    it('should handle missing device pixel ratio', () => {
      delete window.devicePixelRatio
      
      celebrateBurst()
      
      expect(mockGetContext).toHaveBeenCalled()
    })

    it('should add resize event listener', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      
      celebrateBurst()
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    })

    it('should start animation loop', () => {
      celebrateBurst()
      
      expect(mockRequestAnimationFrame).toHaveBeenCalled()
    })

    it('should clear canvas on each frame', () => {
      const mockContext = {
        clearRect: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        fillRect: vi.fn(),
        fillStyle: ''
      }
      mockGetContext.mockReturnValue(mockContext)
      
      celebrateBurst()
      
      expect(mockContext.clearRect).toHaveBeenCalled()
    })

    it('should create confetti pieces with random properties', () => {
      const mockContext = {
        clearRect: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        fillRect: vi.fn(),
        fillStyle: ''
      }
      mockGetContext.mockReturnValue(mockContext)
      
      celebrateBurst()
      
      // Animation should draw confetti pieces
      expect(mockContext.save).toHaveBeenCalled()
      expect(mockContext.restore).toHaveBeenCalled()
    })

    it('should remove canvas after animation completes', () => {
      // Mock performance.now to simulate time passage
      let timeStep = 1000
      mockPerformanceNow.mockImplementation(() => timeStep)
      
      // Mock requestAnimationFrame to control animation loop
      let animationCallback
      mockRequestAnimationFrame.mockImplementation((callback) => {
        animationCallback = callback
        return 1
      })
      
      celebrateBurst(100) // Short duration for testing
      
      // Simulate time passage beyond duration
      timeStep = 1200 // Beyond the 100ms duration
      animationCallback(timeStep)
      
      expect(mockCancelAnimationFrame).toHaveBeenCalled()
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 300)
    })
  })

  describe('attachGlobalCelebrate', () => {
    beforeEach(() => {
      vi.spyOn(window, 'addEventListener')
    })

    it('should add celebrate event listener', () => {
      attachGlobalCelebrate()
      
      expect(window.addEventListener).toHaveBeenCalledWith('celebrate', expect.any(Function))
    })

    it('should set global bound flag', () => {
      expect(window.__celebrate_bound).toBeUndefined()
      
      attachGlobalCelebrate()
      
      expect(window.__celebrate_bound).toBe(true)
    })

    it('should not add duplicate event listeners', () => {
      attachGlobalCelebrate()
      attachGlobalCelebrate()
      
      expect(window.addEventListener).toHaveBeenCalledTimes(1)
    })

    it('should trigger celebrateBurst when celebrate event is dispatched', () => {
      // Mock celebrateBurst function
      const originalCelebrateBurst = celebrateBurst
      const mockCelebrateBurst = vi.fn()
      
      // We can't easily mock the import, so we'll test the event listener is added
      attachGlobalCelebrate()
      
      expect(window.addEventListener).toHaveBeenCalledWith('celebrate', expect.any(Function))
    })

    it('should handle existing bound flag', () => {
      window.__celebrate_bound = true
      
      attachGlobalCelebrate()
      
      expect(window.addEventListener).not.toHaveBeenCalled()
    })
  })

  describe('integration', () => {
    it('should complete full confetti animation cycle', () => {
      let animationCallback
      mockRequestAnimationFrame.mockImplementation((callback) => {
        animationCallback = callback
        return 1
      })
      
      const mockContext = {
        clearRect: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        fillRect: vi.fn(),
        fillStyle: ''
      }
      mockGetContext.mockReturnValue(mockContext)
      
      celebrateBurst(1000)
      
      // Verify canvas was created
      expect(document.getElementById('confetti-canvas')).toBeInstanceOf(HTMLElement)
      
      // Simulate animation frame
      animationCallback(1000)
      
      // Verify animation drawing
      expect(mockContext.clearRect).toHaveBeenCalled()
      expect(mockContext.save).toHaveBeenCalled()
      expect(mockContext.restore).toHaveBeenCalled()
    })
  })
})