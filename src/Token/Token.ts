export default class Token {
  readonly token: string
  private date: Date

  constructor(token: string) {
    this.token = token
    this.date = new Date()
  }

  /**
   * Expired token
   * @returns {Token}
   */
  static expired(): Token {
    return new Token('')
  }

  /**
   * Has the token expired
   * @returns {boolean}
   */
  public hasExpired(): boolean {
    return this.token === '' || (Date.now() - +this.date) / 60000 >= 14
  }
}
