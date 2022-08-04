export const noop = () => {}

export const wait = (ms: number) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(true)
  }, ms)
})
