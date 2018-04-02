export type PromiseFactory<T> = () => Promise<T>

export class QueuedPromise<T> {
  private resolve: (value?: T | PromiseLike<T>) => void
  private reject: (reason?: any) => void
  private promiseFactory: PromiseFactory<T>

  constructor(
    resolve: (value?: PromiseLike<T> | T) => void,
    reject: (reason?: any) => void,
    promiseFactory: PromiseFactory<T>
  ) {
    this.resolve = resolve
    this.reject = reject
    this.promiseFactory = promiseFactory
  }

  /**
   * Build and execute the underlying promise
   */
  execute(): void {
    this.promiseFactory()
      .then(this.resolve)
      .catch(this.reject)
  }
}
