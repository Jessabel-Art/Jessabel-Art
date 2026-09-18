/** Small, dependency-free validation primitives. */

export function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

export function isValidEmail(value: string): boolean {
  // Deliberately permissive: catches obvious mistakes without rejecting
  // legitimate addresses. Authoritative validation belongs on the server.
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

export function minLength(value: string, length: number): boolean {
  return value.trim().length >= length;
}
