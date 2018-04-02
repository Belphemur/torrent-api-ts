import { PromiseThrottler } from '../src/Queue/PromiseThrottler'

describe('Promise Throttler', () => {
  const timing = 250
  const timingChange = 500
  it('resolved promise should return the right result', (done: () => void) => {
    const promiseThrottler = new PromiseThrottler(timing)
    const start = Date.now()
    const promise = promiseThrottler.add<number>(() => {
      return Promise.resolve(11)
    })

    promise.then((data: number) => {
      expect(data).toBe(11)
      done()
    })
  })

  it('should execute directly first item', (done: () => void) => {
    const promiseThrottler = new PromiseThrottler(timing)
    const start = Date.now()
    const promise = promiseThrottler.add<number>(() => {
      return Promise.resolve(11)
    })

    promise.then(() => {
      expect(Date.now() - start).toBeLessThanOrEqual(5)
      done()
    })
  })

  it('should respect delay', (done: () => void) => {
    const promiseThrottler = new PromiseThrottler(timing)
    promiseThrottler.add<number>(() => {
      return Promise.resolve(11)
    })

    const start = Date.now()
    const promise = promiseThrottler.add<number>(() => {
      return Promise.resolve(10)
    })

    promise.then(() => {
      expect(Date.now() - start).toBeGreaterThanOrEqual(timing)
      done()
    })
  })

  it('should respect delay after change', (done: () => void) => {
    const promiseThrottler = new PromiseThrottler(timing)
    promiseThrottler.add<number>(() => {
      return Promise.resolve(11)
    })

    promiseThrottler.delayBetweenPromise = timingChange

    const start = Date.now()
    const promise = promiseThrottler.add<number>(() => {
      return Promise.resolve(10)
    })

    promise.then(() => {
      expect(Date.now() - start).toBeGreaterThanOrEqual(timingChange)
      done()
    })
  })
})
