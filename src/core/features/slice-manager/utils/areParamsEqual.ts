export function areParamsEqual(
  params1: Record<string, unknown> | undefined,
  params2: Record<string, unknown> | undefined
): boolean {
  if (params1 === params2) {
    return true;
  }
  if (!params1 || !params2) {
    return false;
  }

  const keys1 = Object.keys(params1).sort();
  const keys2 = Object.keys(params2).sort();

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let i = 0; i < keys1.length; i++) {
    if (keys1[i] !== keys2[i]) {
      return false;
    }
    if (params1[keys1[i]] !== params2[keys2[i]]) {
      return false;
    }
  }

  return true;
}
