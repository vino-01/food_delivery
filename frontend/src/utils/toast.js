// Simple toast notification utility

export const showToast = (message, type = 'success', duration = 4000) => {
  // Create toast element
  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.textContent = message
  
  // Style the toast
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    padding: 16px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 300px;
    word-wrap: break-word;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
  `

  // Set background color based on type
  const colors = {
    success: '#a78bfa',
    error: '#ef4444',
    warning: '#d6bcfa',
    info: '#c4b5fd'
  }
  
  toast.style.backgroundColor = colors[type] || colors.info

  // Add to DOM
  document.body.appendChild(toast)

  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)'
  }, 10)

  // Auto remove
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, duration)

  // Click to dismiss
  toast.addEventListener('click', () => {
    toast.style.transform = 'translateX(100%)'
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  })

  return toast
}

// Convenience methods
export const showSuccessToast = (message, duration) => showToast(message, 'success', duration)
export const showErrorToast = (message, duration) => showToast(message, 'error', duration)
export const showWarningToast = (message, duration) => showToast(message, 'warning', duration)
export const showInfoToast = (message, duration) => showToast(message, 'info', duration)