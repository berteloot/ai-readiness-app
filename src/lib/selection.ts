// src/lib/selection.ts
export function enforceNoneExclusive(values: string[] = []) {
  const set = new Set(values.map(v => v.toLowerCase()));
  if (set.has("none") && set.size > 1) return ["none"];
  return Array.from(set);
}