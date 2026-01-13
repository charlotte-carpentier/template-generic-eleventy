/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Panel (Datepicker)                           │
   │ Calendar navigation and date selection                  │
   └─────────────────────────────────────────────────────────┘ */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const SELECTOR_PANEL = '[data-panel-type="date"]';
const SELECTOR_CALENDARS = '[data-panel-calendars]';
const SELECTOR_MONTH_WRAPPER = '[data-panel-month-wrapper]';
const SELECTOR_NAV_PREV = '[data-panel-nav-prev]';
const SELECTOR_NAV_NEXT = '[data-panel-nav-next]';
const SELECTOR_DATE = '[data-panel-date]';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_HEADERS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Utility Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Get next month/year
 * @param {number} month - Current month (0-11)
 * @param {number} year - Current year
 * @returns {Object} Next month and year
 */
const getNextMonth = (month, year) => {
  const next = month + 1;
  return next > 11 ? { month: 0, year: year + 1 } : { month: next, year };
};

/**
 * Get classes from panel container data attributes
 * @param {HTMLElement} panel - Panel element
 * @returns {Object} Classes object
 */
const getClasses = (panel) => {
  const container = panel.querySelector(SELECTOR_CALENDARS);
  const monthWrapper = panel.querySelector(SELECTOR_MONTH_WRAPPER);

  if (!container) return {};

  return {
    calendar: container.dataset.classCalendar || '',
    header: container.dataset.classHeader || '',
    dayHeader: container.dataset.classDayHeader || '',
    grid: container.dataset.classGrid || '',
    dateCurrent: container.dataset.classDateCurrent || '',
    dateOutside: container.dataset.classDateOutside || '',
    dateSelected: container.dataset.classDateSelected || '',
    monthLabel: monthWrapper?.dataset.classMonthLabel || ''
  };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize all datepicker panels
 * @returns {void}
 */
export const initPanel = () => {
  document.querySelectorAll(SELECTOR_PANEL).forEach(setupPanel);
};

/**
 * Setup single panel
 * @param {HTMLElement} panel - Panel element
 * @returns {void}
 */
const setupPanel = (panel) => {
  const variant = panel.dataset.panelVariant || 'simple';
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const classes = getClasses(panel);

  const state = {
    panel,
    classes,
    selectedDates: new Set(),
    calendars: variant === 'double'
      ? [
          { month: currentMonth, year: currentYear },
          getNextMonth(currentMonth, currentYear)
        ]
      : [{ month: currentMonth, year: currentYear }]
  };

  generateLabels(panel, state);
  generateCalendars(panel, state);

  const prevBtn = panel.querySelector(SELECTOR_NAV_PREV);
  const nextBtn = panel.querySelector(SELECTOR_NAV_NEXT);

  prevBtn?.addEventListener('click', () => navigate(panel, state, -1));
  nextBtn?.addEventListener('click', () => navigate(panel, state, 1));

  const calendarsContainer = panel.querySelector(SELECTOR_CALENDARS);
  if (calendarsContainer) {
    calendarsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest(SELECTOR_DATE);
      if (btn?.dataset.dateKey && !btn.disabled) {
        toggleDate(btn, state);
      }
    });
  }
};

/**
 * Generate month labels
 * @param {HTMLElement} panel - Panel element
 * @param {Object} state - Panel state
 * @returns {void}
 */
const generateLabels = (panel, state) => {
  const wrapper = panel.querySelector(SELECTOR_MONTH_WRAPPER);
  if (!wrapper) return;

  const fragment = document.createDocumentFragment();

  state.calendars.forEach(({ month, year }) => {
    const label = document.createElement('span');
    label.className = state.classes.monthLabel;
    label.dataset.panelMonth = 'true';
    label.textContent = `${MONTHS[month]} ${year}`;
    fragment.appendChild(label);
  });

  wrapper.innerHTML = '';
  wrapper.appendChild(fragment);
};

/**
 * Generate calendars
 * @param {HTMLElement} panel - Panel element
 * @param {Object} state - Panel state
 * @returns {void}
 */
const generateCalendars = (panel, state) => {
  const container = panel.querySelector(SELECTOR_CALENDARS);
  if (!container) return;

  const fragment = document.createDocumentFragment();

  state.calendars.forEach(({ month, year }) => {
    fragment.appendChild(createCalendar(month, year, state));
  });

  container.innerHTML = '';
  container.appendChild(fragment);
};

/**
 * Create calendar element
 * @param {number} month - Month (0-11)
 * @param {number} year - Year
 * @param {Object} state - Panel state
 * @returns {HTMLElement} Calendar element
 */
const createCalendar = (month, year, state) => {
  const { classes } = state;
  const cal = document.createElement('div');
  cal.className = classes.calendar;
  cal.dataset.panelCalendar = 'true';

  const headerGrid = document.createElement('div');
  headerGrid.className = classes.header;

  DAY_HEADERS.forEach(day => {
    const header = document.createElement('div');
    header.className = classes.dayHeader;
    header.textContent = day;
    headerGrid.appendChild(header);
  });

  cal.appendChild(headerGrid);

  const grid = document.createElement('div');
  grid.className = classes.grid;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  for (let i = firstDay - 1; i >= 0; i--) {
    grid.appendChild(createBtn(prevMonthDays - i, 'prev', true, null, state));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isSelected = state.selectedDates.has(dateKey);
    grid.appendChild(createBtn(d, 'current', false, dateKey, state, isSelected));
  }

  const totalCells = firstDay + daysInMonth;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  for (let d = 1; d <= remaining; d++) {
    grid.appendChild(createBtn(d, 'next', true, null, state));
  }

  cal.appendChild(grid);
  return cal;
};

/**
 * Create date button
 * @param {number} day - Day number
 * @param {string} type - Button type (current/prev/next)
 * @param {boolean} disabled - Disabled state
 * @param {string|null} dateKey - Date key (YYYY-MM-DD)
 * @param {Object} state - Panel state
 * @param {boolean} isSelected - Selected state
 * @returns {HTMLElement} Button element
 */
const createBtn = (day, type, disabled, dateKey, state, isSelected = false) => {
  const { classes } = state;
  const btn = document.createElement('button');

  btn.type = 'button';
  btn.textContent = day;
  btn.disabled = disabled;
  btn.dataset.panelDate = type === 'current' ? day : `${type}-${day}`;

  btn.className = type === 'current' ? classes.dateCurrent : classes.dateOutside;

  if (type === 'current') {
    btn.dataset.dateKey = dateKey;
    if (isSelected) {
      btn.className += ` ${classes.dateSelected}`;
    }
  }

  return btn;
};

/**
 * Navigate months
 * @param {HTMLElement} panel - Panel element
 * @param {Object} state - Panel state
 * @param {number} dir - Direction (-1 or 1)
 * @returns {void}
 */
const navigate = (panel, state, dir) => {
  state.calendars.forEach(cal => {
    cal.month += dir;

    if (cal.month > 11) {
      cal.month = 0;
      cal.year++;
    } else if (cal.month < 0) {
      cal.month = 11;
      cal.year--;
    }
  });

  generateLabels(panel, state);
  generateCalendars(panel, state);
};

/**
 * Toggle date selection
 * @param {HTMLElement} btn - Date button element
 * @param {Object} state - Panel state
 * @returns {void}
 */
const toggleDate = (btn, state) => {
  const { dateKey } = btn.dataset;
  const { classes } = state;

  if (!dateKey) return;

  const isSelected = state.selectedDates.has(dateKey);

  if (isSelected) {
    state.selectedDates.delete(dateKey);
    btn.className = classes.dateCurrent;
  } else {
    state.selectedDates.add(dateKey);
    btn.className = `${classes.dateCurrent} ${classes.dateSelected}`;
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
