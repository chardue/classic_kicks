export function getImageUrl(path) {
  if (!path) return "/images/logo.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  return `/${path}`;
}