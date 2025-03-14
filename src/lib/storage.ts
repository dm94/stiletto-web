export function getStoredItem(key: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(key);
}

export function storeItem(key: string, value: string | boolean): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(key, String(value));
}

export function removeStoredItem(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(key);
}

export function clearStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.clear();
} 