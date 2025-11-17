/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Pagination                                   │
   │ Page navigation with keyboard and ARIA support          │
   │ Path: src/assets/scripts/components/02-molecules/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Pagination navigation functionality
 * @module molecules/pagination
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
    PAGINATION_SELECTOR: '[data-pagination]',
    PAGE_LINK_SELECTOR: '[data-pagination-page]',
    PREV_SELECTOR: '[data-pagination-prev]',
    NEXT_SELECTOR: '[data-pagination-next]',
    CURRENT_CLASS: 'pagination-current',
    DISABLED_CLASS: 'pagination-disabled'
  };
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Core Functions
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Initialize pagination
   * @returns {void}
   */
  export function initPagination() {
    const paginations = document.querySelectorAll(CONFIG.PAGINATION_SELECTOR);
    paginations.forEach(pagination => setupPagination(pagination));
  }
  
  /**
   * Setup pagination element
   * @param {HTMLElement} pagination - Pagination element
   * @returns {void}
   */
  function setupPagination(pagination) {
    const currentPage = parseInt(pagination.getAttribute('data-pagination-current')) || 1;
    const totalPages = parseInt(pagination.getAttribute('data-pagination-total')) || 1;
    
    // Setup ARIA
    pagination.setAttribute('role', 'navigation');
    pagination.setAttribute('aria-label', 'Pagination');
    
    // Setup page links
    const pageLinks = pagination.querySelectorAll(CONFIG.PAGE_LINK_SELECTOR);
    pageLinks.forEach(link => {
      const page = parseInt(link.getAttribute('data-pagination-page'));
      
      if (page === currentPage) {
        link.classList.add(CONFIG.CURRENT_CLASS);
        link.setAttribute('aria-current', 'page');
        link.setAttribute('tabindex', '-1');
      } else {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          goToPage(pagination, page, totalPages);
        });
      }
    });
    
    // Setup prev button
    const prevBtn = pagination.querySelector(CONFIG.PREV_SELECTOR);
    if (prevBtn) {
      if (currentPage === 1) {
        disableButton(prevBtn);
      } else {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          goToPage(pagination, currentPage - 1, totalPages);
        });
      }
    }
    
    // Setup next button
    const nextBtn = pagination.querySelector(CONFIG.NEXT_SELECTOR);
    if (nextBtn) {
      if (currentPage === totalPages) {
        disableButton(nextBtn);
      } else {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          goToPage(pagination, currentPage + 1, totalPages);
        });
      }
    }
    
    // Keyboard navigation
    pagination.addEventListener('keydown', (e) => {
      handlePaginationKeydown(e, pagination, currentPage, totalPages);
    });
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Navigation
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Go to specific page
   * @param {HTMLElement} pagination - Pagination element
   * @param {number} page - Page number
   * @param {number} totalPages - Total pages
   * @returns {void}
   */
  function goToPage(pagination, page, totalPages) {
    if (page < 1 || page > totalPages) return;
    
    // Update current page attribute
    pagination.setAttribute('data-pagination-current', page);
    
    // Dispatch custom event
    pagination.dispatchEvent(new CustomEvent('page-change', {
      detail: { page, totalPages },
      bubbles: true
    }));
    
    // Update UI
    updatePaginationUI(pagination, page, totalPages);
  }
  
  /**
   * Update pagination UI
   * @param {HTMLElement} pagination - Pagination element
   * @param {number} currentPage - Current page
   * @param {number} totalPages - Total pages
   * @returns {void}
   */
  function updatePaginationUI(pagination, currentPage, totalPages) {
    // Update page links
    const pageLinks = pagination.querySelectorAll(CONFIG.PAGE_LINK_SELECTOR);
    pageLinks.forEach(link => {
      const page = parseInt(link.getAttribute('data-pagination-page'));
      
      if (page === currentPage) {
        link.classList.add(CONFIG.CURRENT_CLASS);
        link.setAttribute('aria-current', 'page');
        link.setAttribute('tabindex', '-1');
      } else {
        link.classList.remove(CONFIG.CURRENT_CLASS);
        link.removeAttribute('aria-current');
        link.setAttribute('tabindex', '0');
      }
    });
    
    // Update prev button
    const prevBtn = pagination.querySelector(CONFIG.PREV_SELECTOR);
    if (prevBtn) {
      if (currentPage === 1) {
        disableButton(prevBtn);
      } else {
        enableButton(prevBtn);
      }
    }
    
    // Update next button
    const nextBtn = pagination.querySelector(CONFIG.NEXT_SELECTOR);
    if (nextBtn) {
      if (currentPage === totalPages) {
        disableButton(nextBtn);
      } else {
        enableButton(nextBtn);
      }
    }
    
    // Announce to screen readers
    announcePageChange(currentPage, totalPages);
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Keyboard Navigation
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   * @param {HTMLElement} pagination - Pagination element
   * @param {number} currentPage - Current page
   * @param {number} totalPages - Total pages
   * @returns {void}
   */
  function handlePaginationKeydown(event, pagination, currentPage, totalPages) {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (currentPage > 1) {
          goToPage(pagination, currentPage - 1, totalPages);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (currentPage < totalPages) {
          goToPage(pagination, currentPage + 1, totalPages);
        }
        break;
      case 'Home':
        event.preventDefault();
        goToPage(pagination, 1, totalPages);
        break;
      case 'End':
        event.preventDefault();
        goToPage(pagination, totalPages, totalPages);
        break;
    }
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Utilities
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Disable button
   * @param {HTMLElement} button - Button element
   * @returns {void}
   */
  function disableButton(button) {
    button.classList.add(CONFIG.DISABLED_CLASS);
    button.setAttribute('aria-disabled', 'true');
    button.setAttribute('tabindex', '-1');
  }
  
  /**
   * Enable button
   * @param {HTMLElement} button - Button element
   * @returns {void}
   */
  function enableButton(button) {
    button.classList.remove(CONFIG.DISABLED_CLASS);
    button.setAttribute('aria-disabled', 'false');
    button.setAttribute('tabindex', '0');
  }
  
  /**
   * Announce page change to screen readers
   * @param {number} currentPage - Current page
   * @param {number} totalPages - Total pages
   * @returns {void}
   */
  function announcePageChange(currentPage, totalPages) {
    const announcement = `Page ${currentPage} sur ${totalPages}`;
    
    let liveRegion = document.getElementById('pagination-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'pagination-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = announcement;
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Public API
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Set current page programmatically
   * @param {HTMLElement} pagination - Pagination element
   * @param {number} page - Page number
   * @returns {void}
   */
  export function setCurrentPage(pagination, page) {
    const totalPages = parseInt(pagination.getAttribute('data-pagination-total')) || 1;
    goToPage(pagination, page, totalPages);
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // May your bugs be forever exiled to the shadow realm ✦
  // HAT · 2025
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━