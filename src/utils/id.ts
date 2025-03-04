export function getRandomId() {
  return crypto.randomUUID().replaceAll("-", "");
}
