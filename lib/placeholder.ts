export function colorFromString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return `#${"00000".slice(0, 6 - c.length)}${c}`;
}

export function getBlurDataURL(key: string, w = 16, h = 16) {
  const color = colorFromString(key || "placeholder");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><rect width='100%' height='100%' fill='${color}'/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default getBlurDataURL;
