// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { Token, TokenResponse } from './Token/Token'
import Request from 'request-promise-native'
import { DefaultSearch, SearchCategory, SearchParams } from './Search/SearchParams'
import { TorrentCollection } from './Torrent/torrent'

export interface RequestParams {
  mode?: string
  get_token?: string
  app_id?: string
  token?: string

  [key: string]: any
}

export default class TorrentSearch {
  private _appName: string
  private _userAgent: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
  private _token: Token = Token.expired()
  private _lastRequest: Date | null = null

  private _endpoint: string = 'https://torrentapi.org/pubapi_v2.php'

  constructor(appName: string, userAgent?: string, endpoint?: string) {
    this._appName = appName
    if (userAgent) {
      this._userAgent = userAgent
    }
    if (endpoint) {
      this._endpoint = endpoint
    }
  }

  private static _getQueryParams(params: RequestParams): string {
    let str = []
    for (let p in params) {
      if (!params.hasOwnProperty(p)) {
        continue
      }
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]))
    }
    return str.join('&')
  }

  /**
   * Advanced search with possibility to set all the different parameters
   * @param {SearchParams} search
   * @returns {Promise<TorrentCollection>}
   */
  public searchAdvanced(search: SearchParams): Promise<TorrentCollection> {
    return this._request<TorrentCollection>(search)
  }

  /**
   * Search and in which category
   * @param {string} search
   * @param {SearchCategory} category
   * @returns {Promise<TorrentCollection>}
   */
  public search(search: string, category: SearchCategory): Promise<TorrentCollection> {
    return this.searchAdvanced(new DefaultSearch(search, category))
  }

  private ensureToken(): Promise<Token> {
    if (this._token.hasExpired()) {
      return this._delayedRequest<TokenResponse>({ get_token: 'get_token' }).then(data => {
        this._token = new Token(data.token)
        return this._token
      })
    }
    return Promise.resolve(this._token)
  }

  private _request<T>(params: RequestParams): Promise<T> {
    return this.ensureToken().then(() => {
      return this._delayedRequest<T>(params)
    })
  }

  private _delayedRequest<T>(params: RequestParams): Promise<T> {
    if (this._lastRequest) {
      const currentTimeDiff = Date.now() - +this._lastRequest
      if (currentTimeDiff <= 2100) {
        return new Promise<T>(resolve => setTimeout(resolve, 2100 - currentTimeDiff)).then(() =>
          this._processRequest<T>(params)
        )
      }
    }
    return this._processRequest<T>(params)
  }

  private _processRequest<T>(params: RequestParams): Promise<T> {
    if (!this._token.hasExpired()) {
      params.token = this._token.token
    }
    params.app_id = this._appName

    this._lastRequest = new Date()

    const options = {
      method: 'GET',
      uri: this._endpoint + '?' + TorrentSearch._getQueryParams(params),
      headers: {
        'User-Agent': this._userAgent
      }
    }

    return Request(options)
      .then((response: any) => JSON.parse(response))
      .then((data: any) => {
        return data as T
      })
  }
}
