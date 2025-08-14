/**
 * MAIN.JS
 * ---------
 * - Smooth Scrolling
 * - Sticky Navbar
 * - Scroll Animations (Intersection Observer)
 * - Lightbox Modal Functionality
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling for Anchor Links ---
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  
    // --- Sticky Navbar Shadow on Scroll ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          navbar.classList.add('navbar--scrolled');
        } else {
          navbar.classList.remove('navbar--scrolled');
        }
      });
    }
  
    // --- Fade-in Animation for Sections on Scroll ---
    const sections = document.querySelectorAll('section');
    const observerOptions = {
      root: null, // relative to the viewport
      rootMargin: '0px',
      threshold: 0.1 // 10% of the section must be visible
    };
  
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
  
    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  
    // --- Lightbox Functionality ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      const lightboxImage = lightbox.querySelector('.lightbox__image');
      const lightboxClose = lightbox.querySelector('.lightbox__close');
      const lightboxLeft = lightbox.querySelector('.lightbox-arrow--left');
      const lightboxRight = lightbox.querySelector('.lightbox-arrow--right');

      const openLightbox = (imageSrc, altText) => {
        lightboxImage.setAttribute('src', imageSrc);
        lightboxImage.setAttribute('alt', altText);
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-active');
      };

      const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-active');
      };

      // Handle design-only cards (including design gallery cards)
      const designCards = document.querySelectorAll('[data-project-type="design-only"]');
      designCards.forEach(card => {
        const imageSrc = card.getAttribute('data-image');
        const altText = card.querySelector('img').getAttribute('alt');
        
        card.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(imageSrc, altText);
        });
        
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(imageSrc, altText);
          }
        });
      });

      // Handle case study gallery items
      const galleryItems = document.querySelectorAll('.case-study-gallery__item');
      galleryItems.forEach(item => {
        const imageSrc = item.getAttribute('data-image');
        const altText = item.querySelector('img').getAttribute('alt');
        
        item.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(imageSrc, altText);
        });
        
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(imageSrc, altText);
          }
        });
      });

      // Close lightbox functionality
      lightboxClose.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          closeLightbox();
        }
      });

      // --- Video Play Button Functionality ---
      const videoPlayBtn = document.querySelector('.video-play-btn');
      const caseStudyVideo = document.querySelector('.case-study-video');
      
      if (videoPlayBtn && caseStudyVideo) {
        videoPlayBtn.addEventListener('click', () => {
          if (caseStudyVideo.paused) {
            caseStudyVideo.play();
            videoPlayBtn.style.display = 'none';
          }
        });

        // Show play button when video ends
        caseStudyVideo.addEventListener('ended', () => {
          videoPlayBtn.style.display = 'flex';
        });

        // Show play button when video is paused
        caseStudyVideo.addEventListener('pause', () => {
          videoPlayBtn.style.display = 'flex';
        });

        // Hide play button when video is playing
        caseStudyVideo.addEventListener('play', () => {
          videoPlayBtn.style.display = 'none';
        });

        // Handle video click to play/pause
        caseStudyVideo.addEventListener('click', () => {
          if (caseStudyVideo.paused) {
            caseStudyVideo.play();
          } else {
            caseStudyVideo.pause();
          }
        });
      }
    }

    // --- Design Gallery Carousel Functionality ---
    const carousel = document.querySelector('.design-gallery-carousel');
    if (carousel) {
      const leftArrow = document.querySelector('.carousel-arrow--left');
      const rightArrow = document.querySelector('.carousel-arrow--right');
      // Calculate card width + gap dynamically
      function getCardScrollAmount() {
        const card = carousel.querySelector('.design-gallery-card');
        if (!card) return 160 + 20; // fallback
        const style = window.getComputedStyle(card);
        const width = card.offsetWidth;
        const gap = parseInt(style.marginRight || 0) || 20;
        return width + gap;
      }
      leftArrow.addEventListener('click', () => {
        carousel.scrollBy({ left: -getCardScrollAmount(), behavior: 'smooth' });
      });
      rightArrow.addEventListener('click', () => {
        carousel.scrollBy({ left: getCardScrollAmount(), behavior: 'smooth' });
      });
      // --- Drag/Swipe to Scroll Logic ---
      let isDown = false;
      let startX;
      let scrollLeft;
      carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('dragging');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
      });
      carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('dragging');
      });
      carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('dragging');
      });
      carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.5;
        carousel.scrollLeft = scrollLeft - walk;
      });
      // Touch events for mobile
      carousel.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
      }, { passive: true });
      carousel.addEventListener('touchend', () => {
        isDown = false;
      });
      carousel.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.5;
        carousel.scrollLeft = scrollLeft - walk;
      }, { passive: true });
    }

    // Enhanced lightbox functionality for design gallery navigation
    const lightboxLeft = document.querySelector('.lightbox-arrow--left');
    const lightboxRight = document.querySelector('.lightbox-arrow--right');
    const designGalleryCards = Array.from(document.querySelectorAll('.design-gallery-card'));
    let currentDesignIndex = -1;

    function openDesignAtIndex(idx) {
      if (idx < 0 || idx >= designGalleryCards.length) return;
      const card = designGalleryCards[idx];
      const imageSrc = card.getAttribute('data-image');
      const altText = card.querySelector('img').getAttribute('alt');
      const lightbox = document.getElementById('lightbox');
      if (!lightbox) return;
      const lightboxImage = lightbox.querySelector('.lightbox__image');
      lightboxImage.setAttribute('src', imageSrc);
      lightboxImage.setAttribute('alt', altText);
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-active');
      lightbox.classList.add('design-gallery-card-active');
      currentDesignIndex = idx;
    }

    // Add navigation functionality for design gallery cards
    if (lightboxLeft && lightboxRight) {
      lightboxLeft.addEventListener('click', function() {
        if (currentDesignIndex === -1) return;
        openDesignAtIndex((currentDesignIndex - 1 + designGalleryCards.length) % designGalleryCards.length);
      });
      lightboxRight.addEventListener('click', function() {
        if (currentDesignIndex === -1) return;
        openDesignAtIndex((currentDesignIndex + 1) % designGalleryCards.length);
      });
    }

    // Enhanced keyboard navigation for design gallery
    document.addEventListener('keydown', function(e) {
      const lightbox = document.getElementById('lightbox');
      if (!lightbox || !lightbox.classList.contains('active') || currentDesignIndex === -1) return;
      if (e.key === 'ArrowLeft') {
        openDesignAtIndex((currentDesignIndex - 1 + designGalleryCards.length) % designGalleryCards.length);
      } else if (e.key === 'ArrowRight') {
        openDesignAtIndex((currentDesignIndex + 1) % designGalleryCards.length);
      }
    });

    // Override click handlers for design gallery cards to enable navigation
    designGalleryCards.forEach((card, idx) => {
      // Remove existing click handlers and add new ones
      const newCard = card.cloneNode(true);
      card.parentNode.replaceChild(newCard, card);
      
      newCard.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openDesignAtIndex(idx);
      });
      
      newCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDesignAtIndex(idx);
        }
      });
    });
  });