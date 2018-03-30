import { ITorrent } from '../src/Torrent/torrent'

describe('Torrent Casting', () => {
  it('should cast a basic torrent object', () => {
    const obj = {
      title: 'Life.in.Pieces.S03E15.WEBRip.x264-ION10',
      category: 'TV Episodes',
      download: 'link',
      seeders: 6,
      leechers: 17,
      size: 215070088,
      pubdate: '2018-03-30 15:21:06 +0000',
      episode_info: {
        imdb: 'tt4384086',
        tvrage: null,
        tvdb: '295778',
        themoviedb: '63398',
        airdate: '2018-03-29',
        epnum: '15',
        seasonnum: '3',
        title: 'Graffiti Cute Jewelry Shots'
      },
      ranked: 1,
      info_page:
        'https://torrentapi.org/redirect_to_info.php?token=ai9m2o4web&p=1_5_1_4_9_7_5__f69a6749e3'
    } as ITorrent
    expect(obj.title).toBe('Life.in.Pieces.S03E15.WEBRip.x264-ION10')
    expect(obj.episode_info.epnum).toBe('15')
  })
})
