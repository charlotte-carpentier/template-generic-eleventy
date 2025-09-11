/* ============================================================
   @ORGANISMS - SECTION-PORTFOLIO
   - Portfolio carousel navigation with performance optimizations
============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  // Cache for performance optimization
  let dimensionsCache = {
    itemWidth: 0,
    gap: 16,
    containerWidth: 0,
    isValid: false
  };
  
  // Trouve le bon carousel selon le layout visible
  function findActiveCarousel() {
    const layouts = ['.home-layout__sm', '.home-layout__md', '.home-layout__lg', '.home-layout__xl'];
    
    for (const layout of layouts) {
      const layoutElement = document.querySelector(layout);
      if (layoutElement && window.getComputedStyle(layoutElement).display !== 'none') {
        return layoutElement.querySelector('#portfolio-carousel');
      }
    }
    
    // Fallback pour usage standalone
    return document.querySelector('#portfolio-carousel');
  }
  
  const carousel = findActiveCarousel();
  if (!carousel) return;
  
  const dots = carousel.closest('.section-portfolio').querySelectorAll('.portfolio-dot');
  
  if (!carousel || dots.length === 0) return;
  
  // Get carousel items
  const items = carousel.querySelectorAll('.section-portfolio-item');
  
  // Update dimensions cache
  function updateDimensionsCache() {
    dimensionsCache.itemWidth = items[0]?.offsetWidth || 0;
    dimensionsCache.containerWidth = carousel.offsetWidth;
    dimensionsCache.isValid = true;
  }
  
  // Invalidate cache on resize
  function invalidateCache() {
    dimensionsCache.isValid = false;
  }
  
  // Mouse drag pour desktop/tablet
  let isDragging = false;
  let startX;
  let scrollLeft;
  
  // Set initial cursor
  carousel.style.cursor = 'grab';
  
  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    scrollLeft = carousel.scrollLeft;
    carousel.style.cursor = 'grabbing';
  });
  
  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = startX - x;
    carousel.scrollLeft = scrollLeft + walk;
  });
  
  carousel.addEventListener('mouseup', () => {
    isDragging = false;
    carousel.style.cursor = 'grab';
  });
  
  carousel.addEventListener('mouseleave', () => {
    isDragging = false;
    carousel.style.cursor = 'grab';
  });
  
  // Dots management with accessibility
  function setDotStyles() {
    dots.forEach((dot, index) => {
      // Style par défaut
      dot.style.backgroundColor = '#ffffff';
      dot.style.border = '3px solid #000000';
      dot.setAttribute('aria-selected', 'false');
    });
  }
  
  function updateActiveDot() {
    // Update cache if invalid
    if (!dimensionsCache.isValid) {
      updateDimensionsCache();
    }
    
    const scrollLeft = carousel.scrollLeft;
    const { itemWidth, gap, containerWidth } = dimensionsCache;
    
    // Calcul pour déterminer quelle image on voit le plus
    let currentIndex = 0;
    let maxVisiblePixels = 0;
    
    items.forEach((item, index) => {
      const itemLeft = index * (itemWidth + gap);
      const itemRight = itemLeft + itemWidth;
      
      const visibleLeft = Math.max(itemLeft, scrollLeft);
      const visibleRight = Math.min(itemRight, scrollLeft + containerWidth);
      const visiblePixels = Math.max(0, visibleRight - visibleLeft);
      
      if (visiblePixels > maxVisiblePixels) {
        maxVisiblePixels = visiblePixels;
        currentIndex = index;
      }
    });
    
    // Sécurité
    currentIndex = Math.max(0, Math.min(currentIndex, dots.length - 1));
    
    // Reset tous les dots
    dots.forEach(dot => {
      dot.style.backgroundColor = '#ffffff';
      dot.setAttribute('aria-selected', 'false');
    });
    
    // Active le dot courant
    if (dots[currentIndex]) {
      dots[currentIndex].style.backgroundColor = '#c4ffcb';
      dots[currentIndex].setAttribute('aria-selected', 'true');
    }
  }
  
  // Handle dot clicks
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      // Update cache if invalid
      if (!dimensionsCache.isValid) {
        updateDimensionsCache();
      }
      
      const { itemWidth, gap } = dimensionsCache;
      const scrollPosition = index * (itemWidth + gap);
      
      carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      
      // Force l'activation du dot cliqué
      dots.forEach(d => {
        d.style.backgroundColor = '#ffffff';
        d.setAttribute('aria-selected', 'false');
      });
      dot.style.backgroundColor = '#c4ffcb';
      dot.setAttribute('aria-selected', 'true');
    });
  });
  
  // Listen to scroll events
  let scrollTimeout;
  carousel.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveDot, 50);
  });
  
  // Listen to resize events to invalidate cache
  window.addEventListener('resize', invalidateCache);
  
  // Initialize
  updateDimensionsCache();
  setDotStyles();
  if (dots[0]) {
    dots[0].style.backgroundColor = '#c4ffcb';
    dots[0].setAttribute('aria-selected', 'true');
  }
  
  // Cleanup function (if needed for dynamic components)
  return function cleanup() {
    window.removeEventListener('resize', invalidateCache);
  };
});