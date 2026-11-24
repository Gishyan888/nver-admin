export function fieldErrorFromDetails(
  details: Record<string, unknown> | null,
  field: string,
): string | undefined {
  if (!details) {
    return undefined
  }
  const value = details[field]
  if (typeof value === 'string' && value.length > 0) {
    return value
  }
  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0]
  }
  return undefined
}

export function isEmailInValidForm(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
