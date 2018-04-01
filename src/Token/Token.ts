export interface TokenResponse {
  readonly token: string
}

export class Token implements TokenResponse {
  readonly token: string
  private date: Date
  private invalid: boolean = false

  constructor(token: string) {
    this.token = token
    this.date = new Date()
  }

  /**
   * Expired token
   * @returns {Token}
   */
  static expired(): Token {
    const token = new Token('')
    token.invalid = true
    return token
  }

  /**
   * Has the token expired
   * @returns {boolean}
   */
  public hasExpired(): boolean {
    return this.invalid || (Date.now() - +this.date) / 60000 >= 14
  }

  /**
   * Invalidate a token
   */
  public invalidate(): void {
    this.invalid = true
  }
}
