// plugins/gsap.client.js
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // Plugins registrieren
    gsap.registerPlugin(Draggable, InertiaPlugin)
    
    return {
      provide: {
        gsap,
        draggable: Draggable,
        inertia: InertiaPlugin
      }
    }
  }
})