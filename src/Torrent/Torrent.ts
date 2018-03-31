import { EpisodeInfo } from './EpisodeInfo'

export interface Torrent {
  readonly title: string
  readonly category: string
  readonly download: string
  readonly seeders: number
  readonly leechers: number
  readonly size: number
  readonly episode_info: EpisodeInfo
}

export interface TorrentCollection {
  readonly torrent_results: Array<Torrent>
}
