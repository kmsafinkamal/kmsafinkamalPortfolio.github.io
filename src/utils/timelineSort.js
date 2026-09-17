/**
 * Academic Timeline Parsing, Chronological Sorting, and Milestone Classification Utility
 */

/**
 * Parses a year or date string into comparable numeric values.
 *
 * @param {string} yearStr
 * @returns {{ start: number, end: number, isCurrent: boolean, original: string }}
 */
export function parseTimelineYear(yearStr = '') {
  if (!yearStr) return { start: 0, end: 0, isCurrent: false, original: '' };
  const str = String(yearStr).trim();
  const lower = str.toLowerCase();

  const isCurrent =
    lower.includes('current') ||
    lower.includes('present') ||
    lower.includes('ongoing') ||
    lower.includes('now');

  // Extract all 4-digit years
  const matches = str.match(/\b(19\d\d|20\d\d)\b/g);

  if (isCurrent) {
    const startYear = matches && matches.length > 0 ? parseInt(matches[0], 10) : new Date().getFullYear();
    return {
      start: startYear,
      end: 9999,
      isCurrent: true,
      original: str
    };
  }

  if (matches && matches.length >= 2) {
    const y1 = parseInt(matches[0], 10);
    const y2 = parseInt(matches[1], 10);
    return {
      start: Math.min(y1, y2),
      end: Math.max(y1, y2),
      isCurrent: false,
      original: str
    };
  }

  if (matches && matches.length === 1) {
    const y = parseInt(matches[0], 10);
    return {
      start: y,
      end: y,
      isCurrent: false,
      original: str
    };
  }

  return { start: 0, end: 0, isCurrent: false, original: str };
}

/**
 * Determines whether a milestone is an educational degree / graduation credential,
 * as opposed to an institutional faculty appointment.
 *
 * @param {Object} item - Milestone with role and optional description
 * @returns {boolean}
 */
export function isEducationMilestone(item = {}) {
  const role = (item.role || '').toLowerCase();
  const desc = (item.description || '').toLowerCase();
  const combined = `${role} ${desc}`;

  // Comprehensive degree markers
  const keywords = [
    'b.sc',
    'bsc',
    'bachelor',
    'm.sc',
    'msc',
    'm.s.',
    'master',
    'ph.d',
    'phd',
    'doctorate',
    'doctoral',
    'degree',
    'diploma',
    'graduated',
    'postgraduate',
    'post-graduate'
  ];

  return keywords.some((kw) => {
    // Check if keyword is in role or combined text
    return role.includes(kw) || combined.includes(kw);
  });
}

/**
 * Sorts an array of timeline items chronologically or reverse-chronologically.
 *
 * @param {Array} items - List of milestone objects containing a `year` property.
 * @param {'desc'|'asc'} order - 'desc' (default: newest first) or 'asc' (oldest first).
 * @returns {Array} New sorted array.
 */
export function sortTimeline(items = [], order = 'desc') {
  if (!Array.isArray(items)) return [];

  const copy = [...items];

  return copy.sort((a, b) => {
    const parsedA = parseTimelineYear(a.year);
    const parsedB = parseTimelineYear(b.year);

    // If one is Current/Ongoing and the other is not
    if (parsedA.isCurrent && !parsedB.isCurrent) {
      return order === 'desc' ? -1 : 1;
    }
    if (!parsedA.isCurrent && parsedB.isCurrent) {
      return order === 'desc' ? 1 : -1;
    }

    // Both current: compare start year
    if (parsedA.isCurrent && parsedB.isCurrent) {
      return order === 'desc' ? parsedB.start - parsedA.start : parsedA.start - parsedB.start;
    }

    // Compare end year
    if (parsedA.end !== parsedB.end) {
      return order === 'desc' ? parsedB.end - parsedA.end : parsedA.end - parsedB.end;
    }

    // Secondary: compare start year
    if (parsedA.start !== parsedB.start) {
      return order === 'desc' ? parsedB.start - parsedA.start : parsedA.start - parsedB.start;
    }

    return 0;
  });
}
