/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Block Drag and Drop                          │
   │ HTML5 drag and drop file upload functionality           │
   │ Path: src/assets/scripts/components/02-molecules/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview File upload with drag and drop - WCAG 2.2 AA compliant
 * @module molecules/block-drag-and-drop
 * @created 2025-09-15
 * @updated 2026-02-03 (Security Phase: magic numbers validation + filename sanitization)
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const SELECTOR_CONTAINER = '[data-drag-drop="true"]';
const SELECTOR_DROPZONE = '[data-drag-drop-zone]';
const SELECTOR_BUTTON = '[data-drag-drop-button]';
const SELECTOR_INPUT = '[data-drag-drop-input]';
const SELECTOR_STATUS = '[data-drag-drop-status]';

const CLASS_ACTIVE = 'drag-active';
const CLASS_ERROR = 'drag-error';
const CLASS_SUCCESS = 'drag-success';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [];

// Magic numbers for file type validation (OWASP File Upload Security)
const MAGIC_NUMBERS = {
  'jpg': [0xFF, 0xD8, 0xFF],
  'jpeg': [0xFF, 0xD8, 0xFF],
  'png': [0x89, 0x50, 0x4E, 0x47],
  'pdf': [0x25, 0x50, 0x44, 0x46],
  'gif': [0x47, 0x49, 0x46, 0x38],
  'webp': [0x52, 0x49, 0x46, 0x46],
  'xlsx': [0x50, 0x4B, 0x03, 0x04],
  'xls': [0xD0, 0xCF, 0x11, 0xE0],
  'docx': [0x50, 0x4B, 0x03, 0x04],
  'doc': [0xD0, 0xCF, 0x11, 0xE0]
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize drag and drop
 * @returns {void}
 */
export function initBlockDragAndDrop() {
  const containers = document.querySelectorAll(SELECTOR_CONTAINER);

  if (containers.length === 0) return;

  setupWindowEvents();
  containers.forEach(container => setupDropzone(container));
}

/**
 * Setup window-level drag events
 * @returns {void}
 */
function setupWindowEvents() {
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
  const dropzone = container.querySelector(SELECTOR_DROPZONE);
  const button = container.querySelector(SELECTOR_BUTTON);
  const input = container.querySelector(SELECTOR_INPUT);
  const status = container.querySelector(SELECTOR_STATUS);

  if (!dropzone || !input || !status) return;

  const config = {
    maxSize: parseInt(container.getAttribute('data-max-size')) || MAX_FILE_SIZE,
    allowedTypes: container.getAttribute('data-allowed-types')?.split(',') || ALLOWED_TYPES,
    multiple: container.hasAttribute('data-multiple')
  };

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, preventDefaults, false);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.add(CLASS_ACTIVE);
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, () => {
      dropzone.classList.remove(CLASS_ACTIVE);
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    handleFiles({ files, container, input, status, config });
  }, false);

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

  input.addEventListener('change', (e) => {
    handleFiles({ files: e.target.files, container, input, status, config });
  });

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
 * @returns {void}
 */
async function handleFiles({ files, container, input, status, config }) {
  const dropzone = container.querySelector(SELECTOR_DROPZONE);

  dropzone?.classList.remove(CLASS_ERROR, CLASS_SUCCESS);

  const fileArray = Array.from(files);

  if (!config.multiple && fileArray.length > 1) {
    announceError({ status, message: 'Only one file allowed' });
    return;
  }

  const validFiles = [];
  for (const file of fileArray) {
    // Await async validation with magic numbers
    const validation = await validateFile(file, config);

    if (!validation.valid) {
      announceError({ status, message: validation.error });
      return;
    }

    validFiles.push(file);
  }

  if (validFiles.length > 0) {
    announceSuccess({ status, files: validFiles });

    container.dispatchEvent(new CustomEvent('hat:upload-start', {
      detail: { files: validFiles },
      bubbles: true
    }));
  }
}

/**
 * Validate file with extension + magic numbers (OWASP best practice)
 * @param {File} file - File to validate
 * @param {Object} config - Configuration
 * @returns {Promise<Object>} Validation result
 */
async function validateFile(file, config) {
  // 1. Check file size
  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: `File too large (max ${formatBytes(config.maxSize)})`
    };
  }

  // 2. Extract file extension
  const ext = file.name.split('.').pop().toLowerCase();

  // 3. Check allowed extensions (from data-allowed-types or default list)
  const allowedExts = config.allowedTypes.length > 0
    ? config.allowedTypes.map(t => t.toLowerCase().replace('.', ''))
    : ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'];

  if (!allowedExts.includes(ext)) {
    return {
      valid: false,
      error: `File type not allowed (${ext})`
    };
  }

  // 4. Validate magic numbers (first bytes of file)
  const expectedMagic = MAGIC_NUMBERS[ext];

  if (expectedMagic) {
    try {
      const bytes = await file.slice(0, 4).arrayBuffer();
      const header = new Uint8Array(bytes);

      const matches = expectedMagic.every((byte, i) => byte === header[i]);

      if (!matches) {
        return {
          valid: false,
          error: 'File content does not match extension (possible spoofing)'
        };
      }
    } catch (error) {
      console.error('Magic number validation error:', error);
      // Allow file if validation fails (fallback to extension check)
    }
  }

  return { valid: true };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// ARIA Announcements
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Announce error to screen readers
 * @param {Object} options - Announce options
 * @returns {void}
 */
function announceError({ status, message }) {
  if (!status) return;

  status.textContent = `Error: ${message}`;

  setTimeout(() => {
    status.textContent = '';
  }, 3000);
}

/**
 * Announce success with sanitized filenames (OWASP Path Traversal prevention)
 * @param {Object} options - Announce options
 * @returns {void}
 */
function announceSuccess({ status, files }) {
  if (!status) return;

  const count = files.length;
  const sanitizedNames = files.map(f => sanitizeFilename(f.name));

  status.textContent = `${count} file${count > 1 ? 's' : ''} selected: ${sanitizedNames.join(', ')}`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Utilities
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Sanitize filename to prevent path traversal attacks
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .replace(/^\.+/, '')
    .slice(0, 255);
}

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
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
