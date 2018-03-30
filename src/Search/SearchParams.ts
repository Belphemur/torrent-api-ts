import { RequestParams } from '../torrent-api-ts'

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
  search_string?: string
  search_imdb?: string
  category?: SearchCategory
  format?: JsonFormat
  min_seeders?: number
  min_leechers?: number
  ranked?: boolean
  sort?: SortOrder
  limit?: number
}
