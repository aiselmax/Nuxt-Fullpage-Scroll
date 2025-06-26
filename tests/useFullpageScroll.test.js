import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

describe('useFullpageScroll', () => {
  let useFullpageScroll

  beforeEach(async () => {
    // Mock useNuxtApp BEFORE importing
    vi.doMock('#app', () => ({
      useNuxtApp: () => ({
        $gsap: {
          set: vi.fn(),
          to: vi.fn(() => ({ kill: vi.fn() })),
          timeline: vi.fn(() => ({
            to: vi.fn().mockReturnThis(),
            kill: vi.fn()
          })),
          getProperty: vi.fn(() => -100),
          isTweening: vi.fn(() => false)
        },
        $draggable: {
          create: vi.fn(() => [{
            kill: vi.fn(),
            vars: { snap: [] }
          }])
        }
      })
    }))

    // Now import the composable
    const module = await import('../composables/useFullpageScroll.js')
    useFullpageScroll = module.useFullpageScroll
  })

  it('should initialize with correct values', () => {
    const slides = ref([
      { tooltip: 'Slide 1' },
      { tooltip: 'Slide 2' },
      { tooltip: 'Slide 3' }
    ])

    const result = useFullpageScroll(slides)
    
    console.log('Result:', result) // Debug output
    console.log('slideCount:', result?.slideCount?.value)
    
    expect(result).toBeDefined()
    expect(result.slideCount.value).toBe(3)
    expect(result.activeSlide.value).toBe(0)
  })

  it('should handle navigation', () => {
    const slides = ref([
      { tooltip: 'Slide 1' },
      { tooltip: 'Slide 2' }
    ])

    const { goToSlide, activeSlide } = useFullpageScroll(slides)
    
    goToSlide(1)
    expect(activeSlide.value).toBe(1)
  })

  it('should not navigate to invalid slides', () => {
    const slides = ref([{ tooltip: 'Slide 1' }, { tooltip: 'Slide 2' }])
    const { goToSlide, activeSlide } = useFullpageScroll(slides)
    
    goToSlide(-1)  // Invalid
    expect(activeSlide.value).toBe(0)
    
    goToSlide(5)   // Invalid  
    expect(activeSlide.value).toBe(0)
    
    goToSlide(1)   // Valid
    expect(activeSlide.value).toBe(1)
  })

  it('should calculate tooltips correctly', () => {
    const slides = ref([
      { tooltip: 'First' },
      { tooltip: 'Second' },
      { tooltip: 'Third' }
    ])
    const { toolTips } = useFullpageScroll(slides)
    
    expect(toolTips.value).toEqual(['First', 'Second', 'Third'])
  })

  it('should handle slides without tooltips', () => {
    const slides = ref([{}, { tooltip: 'Has tooltip' }, {}])
    const { toolTips } = useFullpageScroll(slides)
    
    expect(toolTips.value).toEqual([undefined, 'Has tooltip', undefined])
  })

  it('should handle empty slides array', () => {
    const slides = ref([])
    const { slideCount, toolTips, activeSlide } = useFullpageScroll(slides)
    
    expect(slideCount.value).toBe(0)
    expect(toolTips.value).toEqual([])
    expect(activeSlide.value).toBe(0)
  })

  it('should handle null slides', () => {
    const slides = ref(null)
    const { slideCount, toolTips } = useFullpageScroll(slides)
    
    expect(slideCount.value).toBe(0)
    expect(toolTips.value).toEqual([])
  })

  it('should update slideCount when slides change', () => {
    const slides = ref([{ tooltip: 'One' }])
    const { slideCount } = useFullpageScroll(slides)
    
    expect(slideCount.value).toBe(1)
    
    slides.value.push({ tooltip: 'Two' })
    expect(slideCount.value).toBe(2)
    
    slides.value = []
    expect(slideCount.value).toBe(0)
  })

  it('should handle different animation types', () => {
    const slides = ref([{ tooltip: '1' }, { tooltip: '2' }])
    
    const animations = ['default', 'overshoot', 'elastic', 'scale', 'rotate', 'bounce', 'fade', 'tilt', 'split', 'flip']
    
    animations.forEach(type => {
      const result = useFullpageScroll(slides, type)
      expect(result).toBeDefined()
      expect(result.slideCount.value).toBe(2)
    })
  })

  it('should set slide refs correctly', () => {
    const slides = ref([{ tooltip: '1' }, { tooltip: '2' }])
    const { setSlideRef } = useFullpageScroll(slides)
    
    const mockElement1 = { id: 'slide-0' }
    const mockElement2 = { id: 'slide-1' }
    
    // Should not throw
    expect(() => setSlideRef(mockElement1, 0)).not.toThrow()
    expect(() => setSlideRef(mockElement2, 1)).not.toThrow()
    expect(() => setSlideRef(null, 2)).not.toThrow()
  })

  it('should handle boundary navigation', () => {
    const slides = ref([{ tooltip: '1' }, { tooltip: '2' }, { tooltip: '3' }])
    const { goToSlide, activeSlide } = useFullpageScroll(slides)
    
    // Start at 0
    expect(activeSlide.value).toBe(0)
    
    // Can't go below 0
    goToSlide(-5)
    expect(activeSlide.value).toBe(0)
    
    // Go to last slide  
    goToSlide(2)
    expect(activeSlide.value).toBe(2)
    
    // Can't go above max
    goToSlide(10)
    expect(activeSlide.value).toBe(2)
  })

  it('should not navigate to same slide', () => {
    const slides = ref([{ tooltip: '1' }, { tooltip: '2' }])
    const { goToSlide, activeSlide } = useFullpageScroll(slides)
    
    expect(activeSlide.value).toBe(0)
    
    // Try to go to same slide
    goToSlide(0)
    expect(activeSlide.value).toBe(0)
  })

  it('should provide all required refs and functions', () => {
    const slides = ref([{ tooltip: 'Test' }])
    const result = useFullpageScroll(slides)
    
    // Check all exported properties exist
    expect(result.fullpageWrapperRef).toBeDefined()
    expect(result.slidesWrapperRef).toBeDefined()
    expect(result.setSlideRef).toBeTypeOf('function')
    expect(result.activeSlide).toBeDefined()
    expect(result.dotProgress).toBeDefined()
    expect(result.slideCount).toBeDefined()
    expect(result.toolTips).toBeDefined()
    expect(result.isInitialized).toBeDefined()
    expect(result.handleArrowClick).toBeTypeOf('function')
    expect(result.goToSlide).toBeTypeOf('function')
  })

  it('should initialize with DOM elements', async () => {
    const slides = ref([{ tooltip: '1' }, { tooltip: '2' }])
    const { 
      fullpageWrapperRef, 
      slidesWrapperRef, 
      setSlideRef,
      isInitialized 
    } = useFullpageScroll(slides)
    
    // Mock DOM elements
    fullpageWrapperRef.value = { style: {} }
    slidesWrapperRef.value = { style: {} }
    setSlideRef({ style: {} }, 0)
    setSlideRef({ style: {} }, 1)
    
    // Mock window.innerHeight
    Object.defineProperty(window, 'innerHeight', { value: 800 })
    
    // Should still be false until proper initialization in onMounted
    expect(isInitialized.value).toBe(false)
  })
})