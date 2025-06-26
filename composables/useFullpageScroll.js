import { ref, computed, onMounted, onUnmounted, nextTick, readonly } from 'vue'

const CONFIG = {
  ANIMATION_DURATION: 0.6,
  ANIMATION_EASE: 'power2.inOut',
  EDGE_RESISTANCE: 1,
  WHEEL_DEBOUNCE: 80,
  WHEEL_THRESHOLD: 30,
  RESIZE_DEBOUNCE: 100,
  SNAP_THRESHOLD: 10
}

export function useFullpageScroll(slides, animationType = 'default') {
  const fullpageWrapperRef = ref(null)
  const slidesWrapperRef = ref(null)
  const slideRefs = ref([])

  const activeSlide = ref(0)
  const dotProgress = ref(1)
  const isInitialized = ref(false)
  const isAnimating = ref(false)

  const offsets = ref([])
  const viewportHeight = ref(0)
  const draggableInstance = ref(null)

  let gsap = null
  let Draggable = null

  const resizeTimer = ref(null)
  const wheelTimer = ref(null)
  let lastWheelTime = 0

  const slideCount = computed(() => slides.value?.length || 0)
  const toolTips = computed(() => slides.value?.map(slide => slide.tooltip) || [])

  const canNavigate = computed(() =>
    isInitialized.value && (gsap ? !gsap.isTweening(slidesWrapperRef.value) : false)
  )

  const setSlideRef = (el, index) => {
    if (el) slideRefs.value[index] = el
  }

  const loadGSAPPlugins = () => {
    const { $gsap, $draggable } = useNuxtApp()
    if (!$gsap || !$draggable) {
      console.error('GSAP plugins not available')
      return false
    }
    gsap = $gsap
    Draggable = $draggable
    return true
  }

  const setupLayout = () => {
    if (!slidesWrapperRef.value || slideRefs.value.length === 0) return false

    viewportHeight.value = window.innerHeight
    const vh = viewportHeight.value

    gsap.set(slidesWrapperRef.value, { height: slideCount.value * vh })
    gsap.set(slideRefs.value, { height: vh })

    offsets.value = slideRefs.value.map((_, i) => -i * vh)

    gsap.set(slidesWrapperRef.value, { y: offsets.value[0] })

    return true
  }

  const updateDotProgress = () => {
    if (!slidesWrapperRef.value || !gsap) return
    const currentY = gsap.getProperty(slidesWrapperRef.value, 'y')
    dotProgress.value = Number((Math.abs(currentY) / viewportHeight.value + 1).toFixed(1))
  }

  const setupDraggable = () => {
    if (!slidesWrapperRef.value || !fullpageWrapperRef.value) return

    draggableInstance.value = Draggable.create(slidesWrapperRef.value, {
      type: 'y',
      edgeResistance: CONFIG.EDGE_RESISTANCE,
      bounds: fullpageWrapperRef.value,
      snap: offsets.value,
      inertia: true,
      onDrag: updateDotProgress,
      onThrowUpdate: updateDotProgress,
      onDragEnd() {
        const closest = offsets.value.reduce((acc, val, idx) => {
          return Math.abs(val - this.endY) < Math.abs(offsets.value[acc] - this.endY)
            ? idx : acc
        }, 0)
        activeSlide.value = closest
      }
    })[0]
  }

  const animations = {
    'default': (target, y) => gsap.to(target, {
      y,
      duration: CONFIG.ANIMATION_DURATION,
      ease: 'power2.inOut',
      onUpdate: updateDotProgress
    }),
    'overshoot': (target, y) => gsap.to(target, {
      y,
      duration: CONFIG.ANIMATION_DURATION,
      ease: 'back.inOut(1.7)',
      onUpdate: updateDotProgress
    }),
    'elastic': (target, y) => gsap.to(target, {
      y,
      duration: CONFIG.ANIMATION_DURATION,
      ease: 'elastic.inOut(1, 0.3)',
      onUpdate: updateDotProgress
    }),
    'scale': (target, y) => {
      const tl = gsap.timeline({ onUpdate: updateDotProgress })
      tl.to(target, { y, duration: CONFIG.ANIMATION_DURATION, ease: 'power2.inOut' })
        .to(target, { scale: 0.95, duration: CONFIG.ANIMATION_DURATION / 2 }, 0)
        .to(target, { scale: 1, duration: CONFIG.ANIMATION_DURATION / 2 }, CONFIG.ANIMATION_DURATION / 2)
      return tl
    },
    'rotate': (target, y) => {
      const tl = gsap.timeline({ onUpdate: updateDotProgress })
      tl.to(target, { y, duration: CONFIG.ANIMATION_DURATION, ease: 'power2.inOut' })
        .to(target, { rotation: 5, duration: CONFIG.ANIMATION_DURATION / 2 }, 0)
        .to(target, { rotation: 0, duration: CONFIG.ANIMATION_DURATION / 2 }, CONFIG.ANIMATION_DURATION / 2)
      return tl
    },
    'bounce': (target, y) => gsap.to(target, {
      y,
      duration: CONFIG.ANIMATION_DURATION * 1.2,
      ease: "bounce.out",
      onStart: () => isAnimating.value = true,
      onUpdate: updateDotProgress,
      onComplete: () => isAnimating.value = false
    }),
    
    'fade': (target, y) => {
      const tl = gsap.timeline({
        onStart: () => isAnimating.value = true,
        onUpdate: updateDotProgress,
        onComplete: () => isAnimating.value = false
      })
      tl.to(target, {
        opacity: 0.7,
        duration: CONFIG.ANIMATION_DURATION / 3,
        ease: "power1.out"
      }).to(target, {
        y,
        opacity: 1,
        duration: CONFIG.ANIMATION_DURATION,
        ease: "power2.inOut"
      }, "<0.2")
      return tl
    },
    
    'tilt': (target, y) => {
      return gsap.to(target, {
        y,
        rotationX: -8,
        rotationY: 3,
        transformPerspective: CONFIG.PERSPECTIVE,
        duration: CONFIG.ANIMATION_DURATION,
        ease: "back.out(1.2)",
        onStart: () => isAnimating.value = true,
        onUpdate: updateDotProgress,
        onComplete: () => {
          gsap.to(target, { 
            rotationX: 0, 
            rotationY: 0, 
            duration: 0.2 
          })
          isAnimating.value = false
        }
      })
    },
    
    'split': (target, y) => {
      const tl = gsap.timeline({
        onStart: () => isAnimating.value = true,
        onUpdate: updateDotProgress,
        onComplete: () => isAnimating.value = false
      })
      tl.to(target, {
        y: y - 50,
        duration: CONFIG.ANIMATION_DURATION / 2,
        ease: "power2.out"
      }).to(target, {
        y,
        duration: CONFIG.ANIMATION_DURATION / 2,
        ease: "power2.in"
      })
      return tl
    },
    
    'flip': (target, y) => {
      return gsap.to(target, {
        y,
        rotationY: 180,
        duration: CONFIG.ANIMATION_DURATION,
        ease: "power2.inOut",
        onStart: () => isAnimating.value = true,
        onUpdate: updateDotProgress,
        onComplete: () => {
          gsap.to(target, { rotationY: 0, duration: 0 })
          isAnimating.value = false
        }
      })
    }
  }

  const navigateToSlide = (index) => {
    if (offsets.value[index] === undefined) return
    const target = slidesWrapperRef.value
    const y = offsets.value[index]
    animations[animationType](target, y)
  }

  const getNextIndex = (dir) => {
    const cur = activeSlide.value
    const max = slideCount.value - 1
    return dir === 'down' ? Math.min(cur + 1, max)
         : dir === 'up' ? Math.max(cur - 1, 0)
         : cur
  }

  const handleArrowClick = (direction) => {
    if (!canNavigate.value) return
    const ni = getNextIndex(direction)
    if (ni !== activeSlide.value) {
      activeSlide.value = ni
      navigateToSlide(ni)
    }
  }

  const goToSlide = (index) => {
    if (index !== activeSlide.value && index >= 0 && index < slideCount.value) {
      activeSlide.value = index
      navigateToSlide(index)
    }
  }

  const handleWheel = (e) => {
    if (!canNavigate.value) return
    e.preventDefault()
    const now = Date.now()
    if (wheelTimer.value || (now - lastWheelTime) < CONFIG.WHEEL_DEBOUNCE) return
    if (Math.abs(e.deltaY) < CONFIG.WHEEL_THRESHOLD) return

    lastWheelTime = now
    wheelTimer.value = setTimeout(() => {
      const dir = e.deltaY > 0 ? 'down' : 'up'
      const ni = getNextIndex(dir)
      if (ni !== activeSlide.value) {
        activeSlide.value = ni
        navigateToSlide(ni)
      }
      wheelTimer.value = null
    }, CONFIG.WHEEL_DEBOUNCE)
  }

  const handleKeyDown = (e) => {
    const keyMap = {
      'ArrowDown': 'down',
      'ArrowUp': 'up',
      'Home': 'first',
      'End': 'last'
    }
    const dir = keyMap[e.key]
    if (!dir || !canNavigate.value) return

    e.preventDefault()
    const ni = (dir === 'first') ? 0 :
               (dir === 'last') ? slideCount.value - 1 :
               getNextIndex(dir)
    if (ni !== activeSlide.value) {
      activeSlide.value = ni
      navigateToSlide(ni)
    }
  }

  const debounce = (fn, wait, timerRef) => {
    clearTimeout(timerRef.value)
    timerRef.value = setTimeout(fn, wait)
  }

  const handleResize = () => {
    if (!isInitialized.value) return
    debounce(() => {
      if (setupLayout() && draggableInstance.value) {
        draggableInstance.value.vars.snap = offsets.value
        gsap.set(slidesWrapperRef.value, { y: offsets.value[activeSlide.value] })
        updateDotProgress()
      }
    }, CONFIG.RESIZE_DEBOUNCE, resizeTimer)
  }

  const init = async () => {
    if (isInitialized.value || !loadGSAPPlugins()) return
    await nextTick()
    if (!slidesWrapperRef.value || !fullpageWrapperRef.value || slideRefs.value.length === 0) {
      console.warn('Required DOM elements not found')
      return
    }
    if (setupLayout()) {
      setupDraggable()
      updateDotProgress()
      isInitialized.value = true
    }
  }

  const addListeners = () => {
    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
  }

  const removeListeners = () => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('wheel', handleWheel)
    window.removeEventListener('keydown', handleKeyDown)
  }

  const cleanup = () => {
    clearTimeout(resizeTimer.value)
    clearTimeout(wheelTimer.value)
    removeListeners()
    if (draggableInstance.value) {
      draggableInstance.value.kill()
      draggableInstance.value = null
    }
    isInitialized.value = false
  }

  onMounted(async () => {
    await init()
    if (isInitialized.value) addListeners()
  })

  onUnmounted(cleanup)

  return {
    fullpageWrapperRef,
    slidesWrapperRef,
    setSlideRef,
    activeSlide: readonly(activeSlide),
    dotProgress: readonly(dotProgress),
    slideCount,
    toolTips,
    isInitialized: readonly(isInitialized),
    handleArrowClick,
    goToSlide
  }
}