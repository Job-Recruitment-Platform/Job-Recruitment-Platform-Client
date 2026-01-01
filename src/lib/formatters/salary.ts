/**
 * Format salary amount based on currency
 * @param amount - The salary amount
 * @param currency - The currency code (e.g., 'VND', 'USD')
 * @returns Formatted salary string
 */
export const formatSalary = (amount: number | undefined, currency: string): string => {
   if (!amount) return '0'

   if (currency === 'VND') {
      if (amount >= 1000000) {
         return `${(amount / 1000000).toFixed(0)} triệu`
      }
      return amount.toLocaleString()
   }

   return amount.toLocaleString()
}
