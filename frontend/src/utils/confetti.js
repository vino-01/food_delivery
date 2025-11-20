export function mountConfetti() {
  const id = 'confetti-canvas'
  if (document.getElementById(id)) return
  const c = document.createElement('canvas')
  c.id = id
  c.style.position = 'fixed'
  c.style.left = '0'
  c.style.top = '0'
  c.style.width = '100vw'
  c.style.height = '100vh'
  c.style.pointerEvents = 'none'
  c.style.zIndex = '9999'
  document.body.appendChild(c)
}

export function celebrateBurst(durationMs = 1500) {
  mountConfetti()
  const c = document.getElementById('confetti-canvas')
  const ctx = c.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const resize = () => { c.width = Math.floor(window.innerWidth * dpr); c.height = Math.floor(window.innerHeight * dpr) }
  resize(); window.addEventListener('resize', resize)

  const colors = ['#f8f5ff','#f3ebff','#e9dbff','#d6bcfa','#a78bfa','#8b5cf6','#6d28d9','#c4b5fd']
  const N = 160
  const pieces = Array.from({ length: N }).map(() => ({
    x: Math.random() * c.width,
    y: -Math.random() * 80,
    vx: (Math.random() - 0.5) * 6 * dpr,
    vy: Math.random() * 8 * dpr + 4 * dpr,
    w: (6 + Math.random() * 8) * dpr,
    h: (8 + Math.random() * 14) * dpr,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    color: colors[Math.floor(Math.random() * colors.length)]
  }))

  const start = performance.now()
  let raf
  const tick = (t) => {
    const elapsed = t - start
    ctx.clearRect(0, 0, c.width, c.height)
    for (const p of pieces) {
      p.x += p.vx
      p.y += p.vy
      p.r += p.vr
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.r)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h)
      ctx.restore()
    }
    if (elapsed < durationMs) raf = requestAnimationFrame(tick)
    else { cancelAnimationFrame(raf); setTimeout(() => { c.remove() }, 300) }
  }
  raf = requestAnimationFrame(tick)
}

export function attachGlobalCelebrate() {
  if (window.__celebrate_bound) return
  window.__celebrate_bound = true
  window.addEventListener('celebrate', () => celebrateBurst())
}

