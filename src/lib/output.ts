export function normalizeOutput(value: string) {
  return value.replace(/\r\n/g, "\n").trim().split(/\s+/).filter(Boolean).join(" ");
}

export function outputsMatch(actual: string, expected: string) {
  return normalizeOutput(actual) === normalizeOutput(expected);
}
