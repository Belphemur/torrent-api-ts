import { Token, TokenResponse } from './Token/Token'
import Axios from 'axios'
import { DefaultSearch, SearchCategory, SearchParams } from './Request/SearchParams'
import { TorrentCollection } from './Torrent/Torrent'
import { ErrorResponse } from './Error/Error'
import { RequestParams } from './Request/Params'
import { PromiseThrottler } from './Queue/PromiseThrottler'

export default class TorrentSearch {
  private _appName: string
  private _userAgent: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
  private _token: Token = Token.expired()
  private _queue: PromiseThrottler = new PromiseThrottler(2000)

  private _endpoint: string = 'https://torrentapi.org/pubapi_v2.php'

  /**
   * The search object
   * @param {string} appName needed TorrentApi to identify the client
   * @param {string} userAgent in case the one we set stop workin (chrome vers. 60)
   * @param {string} endpoint if the end point change and we didn't update fast enough, you can change it here
   */
  constructor(appName: string, userAgent?: string, endpoint?: string) {
    this._appName = appName
    if (userAgent) {
      this._userAgent = userAgent
    }
    if (endpoint) {
      this._endpoint = endpoint
    }
  }

  /**
   * Change delay between each request
   *
   * Only change this if you know what you're doing
   * @param {number} value
   */
  set delayBetweenRequests(value: number) {
    this._queue.delayBetweenPromise = value
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

  /**
   * Ensure we have a valid token to do requests on their API
   * @returns {Promise<Token>}
   */
  private ensureToken(): Promise<Token> {
    if (this._token.hasExpired()) {
      return this._delayedRequest<TokenResponse>({ get_token: 'get_token' })
        .then(data => {
          return new Token(data.token)
        })
        .then((token: Token) => {
          this._token = token
          return token
        })
        .catch(e => {
          console.warn("Couldn't get the token")
          throw e
        })
    }
    return Promise.resolve(this._token)
  }

  /**
   * Do request on the api
   * @param {RequestParams} params
   * @returns {Promise<T>}
   * @private
   */
  private _request<T>(params: RequestParams): Promise<T> {
    return this.ensureToken()
      .then(() => {
        return this._delayedRequest<T>(params)
      })
      .catch(e => {
        if (e instanceof ErrorResponse && e.code === 4) {
          this._token.invalidate()
          return this._request<T>(params)
        }
        return Promise.reject(e)
      })
  }

  /**
   * The API is rate limited, be sure to only do the request in the right time to avoid hitting the rate limiting
   * @param {RequestParams} params
   * @returns {Promise<T>}
   * @private
   */
  private _delayedRequest<T>(params: RequestParams): Promise<T> {
    return this._queue.add<T>(() => this._processRequest<T>(params))
  }

  /**
   * Set all the query parameters for the request
   *
   * Check also for token expired
   * @param {RequestParams} params
   * @returns {Promise<T>}
   * @private
   */
  private _processRequest<T>(params: RequestParams): Promise<T> {
    if (!this._token.hasExpired()) {
      params.token = this._token.token
    }
    params.app_id = this._appName

    const options = {
      method: 'GET',
      url: this._endpoint,
      params: params,
      headers: {
        'User-Agent': this._userAgent
      }
    }

    return Axios.request(options)
      .then((response: any) => response.data)
      .then((data: any) => {
        if (data.error_code) {
          return Promise.reject(new ErrorResponse(data.error, data.error_code))
        }
        return data
      })
      .then((data: any) => {
        return data as T
      })
  }
}
