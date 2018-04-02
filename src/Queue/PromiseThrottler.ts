import { PromiseFactory, QueuedPromise } from './QueuedPromise'

/**
 * Throttle the promise and only execute them one at a time
 */
export class PromiseThrottler {
  private _delayBetweenPromise: number
  private _queue: Array<QueuedPromise<any>> = []
  private _lastStart: number = 0

  /**
   *
   * @param {number} delayBetweenPromise in milliseconds
   */
  constructor(delayBetweenPromise: number) {
    this._delayBetweenPromise = delayBetweenPromise
  }

  /**
   * Delay between promises
   * @param {number} value
   */
  set delayBetweenPromise(value: number) {
    this._delayBetweenPromise = value
  }

  /**
   * Add a promise to the queue
   * @param {PromiseFactory<T>} promiseFactory
   * @returns {Promise<T>}
   */
  add<T>(promiseFactory: PromiseFactory<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this._queue.push(new QueuedPromise<T>(resolve, reject, promiseFactory))
      this._dequeue()
    })
  }

  private _dequeue(): void {
    if (this._queue.length === 0) {
      return
    }

    const elapsedTime = Date.now() - this._lastStart
    if (elapsedTime < this._delayBetweenPromise) {
      setTimeout(() => this._dequeue(), this._delayBetweenPromise - elapsedTime)
      return
    }

    this._execute()
  }

  private _execute(): void {
    const selected = this._queue.shift()
    if (!selected) {
      return
    }

    this._lastStart = Date.now()

    selected.execute()
  }
}
