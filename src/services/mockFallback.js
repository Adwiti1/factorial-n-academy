export const mockFallbackEnabled = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true'

export function requireMockFallback(error, context) {
  if (!mockFallbackEnabled) {
    throw new Error(`${context}. Firebase is not connected or the request failed: ${error.message}`)
  }

  console.warn(`${context}; using mock fallback:`, error.message)
}
