/**
 * Job Formatters Utilities
 * Contains formatting functions for job-related data
 */

/**
 * Format salary range for display
 * @param salaryMin - Minimum salary
 * @param salaryMax - Maximum salary
 * @param currency - Currency code (e.g., USD, VND)
 * @returns Formatted salary string
 */
export const formatSalary = (
   salaryMin: number | undefined,
   salaryMax: number | undefined,
   currency: string
): string => {
   if (!salaryMin || !salaryMax) {
      return 'Thương lượng'
   }
   return `${salaryMin} - ${salaryMax} ${currency}`
}

/**
 * Format experience requirement for display
 * @param years - Number of experience years required
 * @returns Formatted experience string
 */
export const formatExperience = (years: number): string => {
   if (years === 0) {
      return 'Không yêu cầu'
   }
   return `${years} năm`
}

/**
 * Format job title (capitalize first letter)
 * @param title - Job title
 * @returns Formatted title
 */
export const formatJobTitle = (title: string): string => {
   if (!title) return ''
   return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
}

/**
 * Format date for display
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export const formatDate = (timestamp: number): string => {
   const date = new Date(timestamp)
   return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
   })
}

/**
 * Format date and time for saved job display
 * @param date - Date object or date string
 * @returns Formatted date and time string (e.g., "27/10/2025 - 14:30")
 */
export const formatSavedDateTime = (date: Date | string): string => {
   const dateObj = typeof date === 'string' ? new Date(date) : date

   const dateStr = dateObj.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
   })

   const timeStr = dateObj.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
   })

   return `${dateStr} - ${timeStr}`
}
