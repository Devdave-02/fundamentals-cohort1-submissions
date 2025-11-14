export function add(a: number, b: number) {
  return a + b;
}

export function discont(price: number, percent: number) {
  if (percent < 0 || percent > 100) throw new Error("Invalid discount");
  return price - (price * percent) / 100;
}
