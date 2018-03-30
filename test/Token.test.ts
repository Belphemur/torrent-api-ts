import { Token } from '../src/Token/Token'

describe('Token', () => {
  it('expired token should be expired', () => {
    let token = Token.expired()
    expect(token.hasExpired()).toBeTruthy()
  })
  it("new token shouldn't be expired", () => {
    let token = new Token('Test')
    expect(token.hasExpired()).toBeFalsy()
  })
})
