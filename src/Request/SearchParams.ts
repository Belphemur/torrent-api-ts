import { RequestParams } from './Params'

export enum SearchCategory {
  TV = 'tv',
  Movies = 'movies'
}

export enum JsonFormat {
  JSON = 'json',
  JSON_EXTENDED = 'json_extended'
}

export enum SortOrder {
  LAST = 'last',
  SEEDERS = 'seeders',
  LEECHERS = 'leechers'
}

export interface SearchParams extends RequestParams {
  search_string?: string // tslint:disable-line
  search_imdb?: string // tslint:disable-line
  category?: SearchCategory
  format?: JsonFormat
  min_seeders?: number // tslint:disable-line
  min_leechers?: number // tslint:disable-line
  ranked?: boolean
  sort?: SortOrder
  limit?: number
}

export class DefaultSearch implements SearchParams {
  readonly search_string?: string // tslint:disable-line
  readonly category: SearchCategory
  format: JsonFormat = JsonFormat.JSON_EXTENDED
  ranked?: boolean = false
  sort?: SortOrder = SortOrder.SEEDERS
  limit?: number = 100
  mode: string = 'search'

  constructor(searchString: string, category: SearchCategory) {
    this.search_string = searchString
    this.category = category
  }
}
