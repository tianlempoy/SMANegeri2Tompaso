/**
 * Utility functions for year management
 */

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

/**
 * Gets the current academic year string
 * Example: if April 2026 -> "2025/2026"
 */
export const getAcademicYear = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed, 6 is July
  
  if (month < 6) { // January - June
    return `${year - 1}/${year}`;
  } else { // July - December
    return `${year}/${year + 1}`;
  }
};

/**
 * Gets the year used for PPDB branding
 * Example: if April 2026 -> 2026
 */
export const getPPDBYear = (): number => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // If we are in the second half of the year (July onwards), 
  // PPDB is likely for the NEXT year.
  // However, most schools show the current year's intake if it's still ongoing.
  // For SMAN 2 Tompaso, let's assume they want the year the student will start.
  // If it's April 2026, it's PPDB 2026.
  if (month >= 6) {
    return year + 1;
  }
  return year;
};

/**
 * Gets the academic year targeted by PPDB
 * Example: if April 2026 -> "2026/2027"
 */
export const getTargetAcademicYear = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  
  if (month < 6) { // First half
    return `${year}/${year + 1}`;
  } else { // Second half
    return `${year + 1}/${year + 2}`;
  }
};
