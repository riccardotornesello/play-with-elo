export function generateValidationError(path: string[], message: string) {
  return { code: 'custom', message: message, path: path };
}
