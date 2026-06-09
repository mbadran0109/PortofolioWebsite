/*
  scripts.shared.js - Shared JavaScript for Mohamed Badran portfolio site

  Responsibilities:
    - Animate fade-up elements on load
    - Reveal cards via IntersectionObserver
    - Handle collapsible service card toggle behavior
    - Wire "More" button navigation
    - Load EmailJS SDK on demand and handle contact form submission

  Load this file on every page. It auto-detects which features are needed
  based on what elements exist in the DOM - no configuration required.
*/

document.addEventListener('DOMContentLoaded', function () { // Run script only after the HTML document is fully parsed
  const fadeEls = Array.from(document.querySelectorAll('.animate-fade-up')); // Find all fade-up elements and convert NodeList to an Array
  fadeEls.forEach(el => { // Iterate over each fade-up element
    const delay = el.getAttribute('data-animate-delay') || '0s'; // Read custom transition delay, fallback to 0 seconds
    el.style.transitionDelay = delay; // Apply the delay to the element's CSS
    setTimeout(() => el.classList.add('show'), 50); // Add the 'show' class after 50ms to trigger the CSS animation
  }); // End of fade-up elements loop

  const cards = document.querySelectorAll('.card'); // Find all card elements on the page
  if (cards.length) { // Verify at least one card exists
    const obs = new IntersectionObserver((entries) => { // Create an IntersectionObserver for scroll-based triggers
      entries.forEach(entry => { // Loop through elements entering/exiting the viewport
        if (entry.isIntersecting) { // If the card has entered the view
          entry.target.classList.add('revealed'); // Add the 'revealed' class to trigger animation
          obs.unobserve(entry.target); // Stop observing this card to run animation only once
        } // End of viewport check
      }); // End of intersection entries loop
    }, { threshold: 0.12 }); // Trigger intersection when 12% of the card is visible
    cards.forEach(c => obs.observe(c)); // Start observing each card element
  } // End of cards length check

  const toggleButtons = document.querySelectorAll('.toggle-btn'); // Find all "Details" toggle buttons inside service cards
  toggleButtons.forEach(btn => { // Loop through each toggle button
    btn.addEventListener('click', () => { // Attach click event listener to the button
      const card = btn.closest('.service-card'); // Find the closest parent service card of the clicked button
      if (!card) return; // Exit if the button isn't inside a service card

      const body = card.querySelector('.service-body'); // Find the collapsible content area within the card
      if (!body) return; // Exit if the body area is missing

      const isOpen = card.classList.contains('open'); // Check if the card currently has the 'open' class
      if (isOpen) { // If it's already open, run the close logic
        body.style.maxHeight = body.scrollHeight + 'px'; // Explicitly set height in pixels to transition from
        body.offsetHeight; // Force a DOM reflow to ensure the browser registers the pixel height before changing to 0px
        body.style.maxHeight = '0px'; // Set max-height to 0px to collapse the content smoothly
        btn.setAttribute('aria-expanded', 'false'); // Update accessibility attribute for screen readers
        card.classList.remove('open'); // Remove the visual 'open' class
        return; // Exit function so it doesn't run the open logic
      } // End of close logic

      card.classList.add('open'); // Add the 'open' class to the card to apply visual styling
      body.style.maxHeight = body.scrollHeight + 'px'; // Set max-height to its true content height to slide open
      btn.setAttribute('aria-expanded', 'true'); // Update accessibility attribute for screen readers

      const finishOpen = () => { // Create a cleanup function for when the CSS transition finishes
        if (card.classList.contains('open')) body.style.maxHeight = 'none'; // Clear inline max-height so text wraps naturally if window is resized
        body.removeEventListener('transitionend', finishOpen); // Remove this one-time event listener
      }; // End of cleanup function

      body.addEventListener('transitionend', finishOpen); // Wait for the max-height slide transition to end, then clean up
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // Smooth scroll the browser to show the opened card
    }); // End of click listener
  }); // End of toggle buttons loop

  document.addEventListener('click', (e) => { // Attach a global click listener to handle delegating "More" buttons
    const more = e.target.closest('.more-btn'); // See if the clicked element was a "More" button
    if (!more) return; // Exit if a non-more button was clicked

    const card = more.closest('.service-card'); // Find the parent service card
    if (!card || !card.classList.contains('open')) return; // Exit if the card isn't open (prevents accidental clicks while closing)

    const href = more.dataset.href; // Extract the destination URL from the data-href attribute
    if (href) window.location.href = href; // Redirect the browser to the service page
  }); // End of global click listener

  const EMAILJS_SERVICE_ID = 'mbadran.inquiry'; // The unique Service ID provided by EmailJS
  const EMAILJS_TEMPLATE_ID = 'mbadran.inquiry.template'; // The unique Template ID provided by EmailJS
  const EMAILJS_USER_ID = 'Q0UeVHKGUKCIpDaRz'; // The public key for the EmailJS account
  const EMAILJS_CDN = 'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js'; // The external CDN URL to dynamically load the EmailJS SDK

  function loadScript(url) { // Helper function to inject an external script tag asynchronously
    return new Promise((resolve, reject) => { // Return a promise that resolves when the script loads
      const s = document.createElement('script'); // Create the script tag
      s.src = url; // Assign the URL
      s.async = true; // Load script asynchronously to not block the main thread
      s.onload = () => resolve(); // Resolve the promise once loading is complete
      s.onerror = () => reject(new Error('Failed to load ' + url)); // Reject the promise if loading fails
      document.head.appendChild(s); // Inject the script tag into the document <head>
    }); // End of promise block
  } // End of loadScript function

  async function ensureEmailJS() { // Async function to make sure EmailJS SDK is loaded before using it
    if (!window.emailjs) { // Check if the global emailjs variable exists yet
      await loadScript(EMAILJS_CDN); // If it doesn't, wait for the script to load via the helper
    } // End of SDK check

    if (!window.emailjs) { // If it's still missing after loading
      throw new Error('EmailJS loaded but global not found'); // Throw an error blocking execution
    } // End of secondary check

    emailjs.init(EMAILJS_USER_ID); // Initialize EmailJS with the user public key
  } // End of ensureEmailJS function

  const contactForm = document.querySelector('#contact-form'); // Find the contact form on the page
  if (!contactForm) return; // Exit script if no contact form exists on this page

  contactForm.addEventListener('submit', async (ev) => { // Attach a submit listener to the form
    ev.preventDefault(); // Stop the form from causing a default page refresh

    const first = document.querySelector('#firstName')?.value.trim() || ''; // Safely extract and trim first name
    const last = document.querySelector('#lastName')?.value.trim() || ''; // Safely extract and trim last name
    const phone = document.querySelector('#phone')?.value.trim() || ''; // Safely extract and trim phone number
    const email = document.querySelector('#email')?.value.trim() || ''; // Safely extract and trim email address
    const message = document.querySelector('#message')?.value.trim() || ''; // Safely extract and trim message body
    const serviceSelect = document.querySelector('#service'); // Find the dropdown element
    const selectedService = serviceSelect && serviceSelect.selectedIndex > 0 // Validate a service is actually selected
      ? serviceSelect.options[serviceSelect.selectedIndex].textContent.trim() // Extract the literal text of the selected option
      : ''; // Fallback to empty string if no option selected

    const templateParams = { // Construct the data payload mapping to the EmailJS template variables
      to_email: 'mbadran0109@gmail.com', // Recipient destination
      client_email: email, // Email address of the sender (to reply to)
      cc_email: email, // CC address to bounce back a copy to the sender
      first_name: first, // Data for first name
      last_name: last, // Data for last name
      phone: phone, // Data for phone number
      service: selectedService, // Data for selected service
      message: message, // Data for the message context
      title: `Website inquiry: ${selectedService || 'General'} - ${first} ${last}`, // Dynamic subject line for the email
      time: new Date().toLocaleString() // Timestamp of when the form was submitted
    }; // End of templateParams block

    const success = document.getElementById('contact-success'); // Find the status message container
    if (success) { // If the message container exists
      success.style.display = 'inline-block'; // Make it visible
      success.textContent = 'Preparing email...'; // Indicate that loading has started
    } // End of visibility check

    try { // Begin try-catch block for API submission
      await ensureEmailJS(); // Ensure the SDK is downloaded and initialized
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams); // Send the payload via EmailJS API
      if (success) { // If submission succeeded
        success.style.display = 'inline-block'; // Ensure container is visible
        success.textContent = 'Message sent - thank you!'; // Show success message
      } // End of success message block
      contactForm.reset(); // Clear all form inputs
    } catch (err) { // If submission failed
      console.error('EmailJS error', err); // Log the error object to browser console
      if (success) { // Ensure container is visible
        success.style.display = 'inline-block'; // Keep container visible
        success.textContent = 'Error sending message'; // Show error message
      } // End of error message block
    } // End of try-catch block

    setTimeout(() => { // Set a timer to clear the message
      if (success) success.style.display = 'none'; // Hide the message element after 5 seconds
    }, 5000); // 5000 milliseconds
  }); // End of submit event listener
}); // End of DOMContentLoaded wrapper
