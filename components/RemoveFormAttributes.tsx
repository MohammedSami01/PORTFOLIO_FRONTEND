'use client'

import { useEffect } from 'react'

export default function RemoveFormAttributes() {
  useEffect(() => {
    // Function to remove problematic attributes
    const removeAttributes = () => {
      try {
        // Remove from all elements with fdprocessedid
        document.querySelectorAll('[fdprocessedid]').forEach(el => {
          el.removeAttribute('fdprocessedid')
        })
        
        // Also remove from form elements that might get processed later
        const formElements = ['input', 'button', 'textarea', 'select', 'form', 'a', 'div', 'span']
        formElements.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            if (el.hasAttribute('fdprocessedid')) {
              el.removeAttribute('fdprocessedid')
            }
          })
        })
      } catch (error) {
        console.error('Error removing attributes:', error)
      }
    }

    // Run immediately
    removeAttributes()
    
    // Set up a MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      removeAttributes()
    })

    // Start observing the document with the configured parameters
    observer.observe(document.documentElement, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['fdprocessedid']
    })

    // Also run periodically as a fallback
    const interval = setInterval(removeAttributes, 500)
    
    // Add event listeners for user interactions that might trigger form processing
    const eventNames = ['click', 'input', 'focus', 'blur', 'change']
    const handleInteraction = () => {
      removeAttributes()
      // Add a small delay to catch any attributes added after the interaction
      setTimeout(removeAttributes, 100)
    }
    
    eventNames.forEach(event => {
      window.addEventListener(event, handleInteraction, true)
    })
    
    return () => {
      clearInterval(interval)
      observer.disconnect()
      // Clean up event listeners
      eventNames.forEach(event => {
        window.removeEventListener(event, handleInteraction, true)
      })
    }
  }, [])

  return null
}
