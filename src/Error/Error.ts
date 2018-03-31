export interface IErrorResponse {
  code: number
}

export class ErrorResponse extends Error implements IErrorResponse {
  code: number

  constructor(error: string, code: number) {
    super(error)
    this.code = code
    this.name = 'ErrorResponse'
  }
}
