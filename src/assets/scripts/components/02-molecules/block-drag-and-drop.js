/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Block Drag and Drop                          │
   │ HTML5 drag and drop file upload functionality           │
   │ Path: src/assets/scripts/components/02-molecules/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview File upload with drag and drop
 * @module molecules/block-drag-and-drop
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  DROPZONE_SELECTOR: '[data-drag-drop-zone]',
  BUTTON_SELECTOR: '[data-drag-drop-button]',
  INPUT_SELECTOR: '[data-drag-drop-input]',
  ACTIVE_CLASS: 'drag-active',
  ERROR_CLASS: 'drag-error',
  SUCCESS_CLASS: 'drag-success',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB default
  ALLOWED_TYPES: [] // Empty = all types allowed
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize drag and drop
 * @returns {void}
 */
export function initBlockDragAndDrop() {
  const containers = document.querySelectorAll('[data-drag-drop="true"]');
  containers.forEach(container => setupDropzone(container));
}

/**
 * Setup dropzone element
 * @param {HTMLElement} container - Container element
 * @returns {void}
 */
function setupDropzone(container) {
  const dropzone = container.querySelector(CONFIG.DROPZONE_SELECTOR);
  const button = container.querySelector(CONFIG.BUTTON_SELECTOR);
  const input = container.querySelector(CONFIG.INPUT_SELECTOR);
  
  if (!dropzone || !input) return;
  
  // Get configuration from data attributes
  const maxSize = parseInt(container.getAttribute('data-max-size')) || CONFIG.MAX_FILE_SIZE;
  const allowedTypes = container.getAttribute('data-allowed-types')?.split(',') || CONFIG.ALLOWED_TYPES;
  const multiple = container.hasAttribute('data-multiple');
  
  // Prevent default drag behaviors on dropzone only
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
  });
  
  // Highlight drop zone on drag
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.add(CONFIG.ACTIVE_CLASS);
    }, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.remove(CONFIG.ACTIVE_CLASS);
    }, false);
  });
  
  // Handle drop on dropzone only
  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    handleFiles(files, container, input, maxSize, allowedTypes, multiple);
  }, false);
  
  // Handle click to browse - on dropzone
  dropzone.addEventListener('click', () => {
    input.click();
  });
  
  // Handle click to browse - on button if it exists
  if (button) {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      input.click();
    });
  }
  
  // Handle file input change
  input.addEventListener('change', (e) => {
    handleFiles(e.target.files, container, input, maxSize, allowedTypes, multiple);
  });
  
  // Keyboard accessibility for dropzone
  dropzone.setAttribute('tabindex', '0');
  dropzone.setAttribute('role', 'button');
  dropzone.setAttribute('aria-label', 'Click or drag files to upload');
  
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


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// File Handling
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Handle dropped or selected files
 * @param {FileList} files - Files to handle
 * @param {HTMLElement} dropzone - Dropzone element
 * @param {HTMLElement} input - Input element
 * @param {number} maxSize - Max file size
 * @param {Array<string>} allowedTypes - Allowed MIME types
 * @param {boolean} multiple - Allow multiple files
 * @returns {void}
 */
function handleFiles(files, dropzone, input, maxSize, allowedTypes, multiple) {
  // Clear previous states
  dropzone.classList.remove(CONFIG.ERROR_CLASS, CONFIG.SUCCESS_CLASS);
  
  const fileArray = Array.from(files);
  
  // Check multiple files
  if (!multiple && fileArray.length > 1) {
    showError(dropzone, 'Un seul fichier autorisé');
    return;
  }
  
  // Validate each file
  const validFiles = [];
  for (const file of fileArray) {
    const validation = validateFile(file, maxSize, allowedTypes);
    
    if (!validation.valid) {
      showError(dropzone, validation.error);
      return;
    }
    
    validFiles.push(file);
  }
  
  // All files valid
  if (validFiles.length > 0) {
    showSuccess(dropzone, validFiles);
    
    // Dispatch custom event with files
    dropzone.dispatchEvent(new CustomEvent('files-selected', {
      detail: { files: validFiles },
      bubbles: true
    }));
  }
}

/**
 * Validate file
 * @param {File} file - File to validate
 * @param {number} maxSize - Max file size
 * @param {Array<string>} allowedTypes - Allowed MIME types
 * @returns {Object} Validation result
 */
function validateFile(file, maxSize, allowedTypes) {
  // Check size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Fichier trop volumineux (max ${formatBytes(maxSize)})`
    };
  }
  
  // Check type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non autorisé (${file.type})`
    };
  }
  
  return { valid: true };
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UI Feedback
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Show error message
 * @param {HTMLElement} dropzone - Dropzone element
 * @param {string} message - Error message
 * @returns {void}
 */
function showError(dropzone, message) {
  dropzone.classList.add(CONFIG.ERROR_CLASS);
  dropzone.setAttribute('data-error', message);
  
  // Create/update error element
  let errorEl = dropzone.querySelector('.drag-drop-error');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'drag-drop-error';
    errorEl.setAttribute('role', 'alert');
    dropzone.appendChild(errorEl);
  }
  errorEl.textContent = message;
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    dropzone.classList.remove(CONFIG.ERROR_CLASS);
    if (errorEl) errorEl.remove();
  }, 3000);
}

/**
 * Show success state
 * @param {HTMLElement} dropzone - Dropzone element
 * @param {Array<File>} files - Valid files
 * @returns {void}
 */
function showSuccess(dropzone, files) {
  dropzone.classList.add(CONFIG.SUCCESS_CLASS);
  
  // Create/update file list
  let listEl = dropzone.querySelector('.drag-drop-files');
  if (!listEl) {
    listEl = document.createElement('div');
    listEl.className = 'drag-drop-files';
    listEl.setAttribute('role', 'status');
    dropzone.appendChild(listEl);
  }
  
  listEl.innerHTML = files.map(file => 
    `<div class="file-item">
      <span class="file-name">${file.name}</span>
      <span class="file-size">${formatBytes(file.size)}</span>
    </div>`
  ).join('');
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Utilities
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// Charlotte Carpentier · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━