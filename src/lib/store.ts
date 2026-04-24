'use client';

const SAVED_KEY = 'youth_saved_issues';

export function getSavedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
  } catch {
    return [];
  }
}

export function toggleSaved(id: string): boolean {
  const saved = getSavedIds();
  const exists = saved.includes(id);
  const next = exists ? saved.filter((s) => s !== id) : [...saved, id];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return !exists;
}

export function isSaved(id: string): boolean {
  return getSavedIds().includes(id);
}
