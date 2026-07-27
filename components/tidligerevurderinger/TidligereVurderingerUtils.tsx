function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

export function deepEqual(objekt1: unknown, objekt2: unknown, ignorerFelt: string[] = []): boolean {
  if (objekt1 === objekt2) return true;

  if (!isRecord(objekt1) || !isRecord(objekt2)) {
    return false;
  }

  const keys1 = Object.keys(objekt1).filter((key) => !ignorerFelt.includes(key));
  const keys2 = Object.keys(objekt2).filter((key) => !ignorerFelt.includes(key));

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(objekt1[key], objekt2[key], ignorerFelt)) {
      return false;
    }
  }

  return true;
}
