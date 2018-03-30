import { IEpisodeInfo } from './EpisodeInfo'

export interface ITorrent {
  readonly title: string
  readonly category: string
  readonly download: string
  readonly seeders: number
  readonly leechers: number
  readonly size: number
  readonly episode_info: IEpisodeInfo
}
