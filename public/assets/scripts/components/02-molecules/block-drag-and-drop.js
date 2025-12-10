/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Block Drag and Drop                          │
   │ HTML5 drag and drop file upload functionality           │
   │ Path: src/assets/scripts/components/02-molecules/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview File upload with drag and drop - WCAG 2.2 AA compliant
 * @module molecules/block-drag-and-drop
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  SELECTORS: {
    CONTAINER: '[data-drag-drop="true"]',
    DROPZONE: '[data-drag-drop-zone]',
    BUTTON: '[data-drag-drop-button]',
    INPUT: '[data-drag-drop-input]',
    STATUS: '[data-drag-drop-status]'
  },
  CLASSES: {
    ACTIVE: 'drag-active',
    ERROR: 'drag-error',
    SUCCESS: 'drag-success'
  },
  DEFAULTS: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: []
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize drag and drop
 * @returns {void}
 */
export function initBlockDragAndDrop() {
  const containers = document.querySelectorAll(CONFIG.SELECTORS.CONTAINER);

  if (containers.length === 0) return;

  // Window-level event prevention (MDN 2025 best practice)
  setupWindowEvents();

  containers.forEach(container => setupDropzone(container));
}

/**
 * Setup window-level drag events
 * @returns {void}
 */
function setupWindowEvents() {
  // Prevent default file drop on window
  window.addEventListener('dragover', (e) => {
    if ([...e.dataTransfer.items].some((item) => item.kind === 'file')) {
      e.preventDefault();
    }
  });

  window.addEventListener('drop', (e) => {
    if ([...e.dataTransfer.items].some((item) => item.kind === 'file')) {
      e.preventDefault();
    }
  });
}

/**
 * Setup dropzone element
 * @param {HTMLElement} container - Container element
 * @returns {void}
 */
function setupDropzone(container) {
  const dropzone = container.querySelector(CONFIG.SELECTORS.DROPZONE);
  const button = container.querySelector(CONFIG.SELECTORS.BUTTON);
  const input = container.querySelector(CONFIG.SELECTORS.INPUT);
  const status = container.querySelector(CONFIG.SELECTORS.STATUS);

  if (!dropzone || !input || !status) return;

  // Get configuration from data attributes
  const config = {
    maxSize: parseInt(container.getAttribute('data-max-size')) || CONFIG.DEFAULTS.MAX_FILE_SIZE,
    allowedTypes: container.getAttribute('data-allowed-types')?.split(',') || CONFIG.DEFAULTS.ALLOWED_TYPES,
    multiple: container.hasAttribute('data-multiple')
  };

  // Prevent default on dropzone
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
  });

  // Visual feedback on drag
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.add(CONFIG.CLASSES.ACTIVE);
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.remove(CONFIG.CLASSES.ACTIVE);
    }, false);
  });

  // Handle drop
  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    handleFiles({ files, container, input, status, config });
  }, false);

  // Click handlers (WCAG 2.5.7 single-pointer alternative)
  dropzone.addEventListener('click', () => {
    input.click();
  });

  if (button) {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      input.click();
    });
  }

  // File input change
  input.addEventListener('change', (e) => {
    handleFiles({ files: e.target.files, container, input, status, config });
  });

  // Keyboard accessibility (WCAG 2.1.1 Level A)
  dropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      input.click();
    }
  });
}

/**
 * Prevent default drag behaviors
 * @param {Event} e - Event object
 * @returns {void}
 */
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// File Handling
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Handle dropped or selected files
 * @param {Object} options - Handler options
 * @param {FileList} options.files - Files to handle
 * @param {HTMLElement} options.container - Container element
 * @param {HTMLElement} options.input - Input element
 * @param {HTMLElement} options.status - Status element
 * @param {Object} options.config - Configuration
 * @returns {void}
 */
function handleFiles({ files, container, input, status, config }) {
  const dropzone = container.querySelector(CONFIG.SELECTORS.DROPZONE);

  // Clear previous states
  dropzone?.classList.remove(CONFIG.CLASSES.ERROR, CONFIG.CLASSES.SUCCESS);

  const fileArray = Array.from(files);

  // Check multiple files
  if (!config.multiple && fileArray.length > 1) {
    announceError({ status, message: 'Only one file allowed' });
    return;
  }

  // Validate files
  const validFiles = [];
  for (const file of fileArray) {
    const validation = validateFile(file, config);

    if (!validation.valid) {
      announceError({ status, message: validation.error });
      return;
    }

    validFiles.push(file);
  }

  // Success
  if (validFiles.length > 0) {
    announceSuccess({ status, files: validFiles });

    // Dispatch custom event
    container.dispatchEvent(new CustomEvent('hat:upload-start', {
      detail: { files: validFiles },
      bubbles: true
    }));
  }
}

/**
 * Validate file
 * @param {File} file - File to validate
 * @param {Object} config - Configuration
 * @returns {Object} Validation result
 */
function validateFile(file, config) {
  // Check size
  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: `File too large (max ${formatBytes(config.maxSize)})`
    };
  }

  // Check type
  if (config.allowedTypes.length > 0 && !config.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed (${file.type})`
    };
  }

  return { valid: true };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// ARIA Announcements
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Announce error to screen readers
 * @param {Object} options - Announce options
 * @param {HTMLElement} options.status - Status element
 * @param {string} options.message - Error message
 * @returns {void}
 */
function announceError({ status, message }) {
  if (!status) return;

  status.textContent = `Error: ${message}`;

  // Auto-clear after 3 seconds
  setTimeout(() => {
    status.textContent = '';
  }, 3000);
}

/**
 * Announce success to screen readers
 * @param {Object} options - Announce options
 * @param {HTMLElement} options.status - Status element
 * @param {Array<File>} options.files - Valid files
 * @returns {void}
 */
function announceSuccess({ status, files }) {
  if (!status) return;

  const count = files.length;
  const names = files.map(f => f.name).join(', ');

  status.textContent = `${count} file${count > 1 ? 's' : ''} selected: ${names}`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Utilities
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Format bytes to human readable
 * @param {number} bytes - Bytes
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted string
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
