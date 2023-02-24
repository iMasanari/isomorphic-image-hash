export const distance = (a: string, b: string) => {
  let count = 0

  for (let i = a.length; i--;) {
    if (a[i] !== b[i]) {
      ++count
    }
  }

  return count
}
