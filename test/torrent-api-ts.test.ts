import TorrentSearch from '../src/torrent-api-ts'
import { SearchCategory } from '../src/Search/SearchParams'
import nock from 'nock'
import searchResponse from './response/search'

/**
 * Dummy test
 */
describe('Libary Test', () => {
  it('TorrentSearch is instantiable', () => {
    let torrentSearch = new TorrentSearch('test')
    expect(torrentSearch).toBeInstanceOf(TorrentSearch)
  })

  describe('doing requests', () => {
    beforeAll(() => {
      const scope = nock('https://torrentapi.org/')
        .get(uri => uri.includes('get_token'))
        .once()
        .reply(200, {
          token: 'new token'
        })

      scope
        .get(uri => uri.includes('Life.in.Pieces'))
        .once()
        .reply(200, searchResponse)
    })
    it('Search Life in Parts', (done: any) => {
      let torrentSearch = new TorrentSearch('test')
      torrentSearch.search('Life.in.Pieces', SearchCategory.TV).then(collection => {
        expect(collection.torrent_results.length).toBe(1)
        const result = collection.torrent_results[0]
        expect(result.title).toBe('Life.in.Pieces.S03E15.WEBRip.x264-ION10')
        expect(result.episode_info.title).toBe('Graffiti Cute Jewelry Shots')
        done()
      })
    })
  })
  describe('token reuse check', () => {
    beforeAll(() => {
      const scope = nock('https://torrentapi.org/')
        .get(uri => uri.includes('get_token'))
        .once()
        .reply(200, {
          token: 'new token'
        })

      scope
        .get(uri => uri.includes('Life.in.Pieces'))
        .twice()
        .reply(200, searchResponse)
    })

    it('Reuse token for different search', (done: any) => {
      let torrentSearch = new TorrentSearch('test')
      torrentSearch
        .search('Life.in.Pieces', SearchCategory.TV)
        .then(collection => {
          expect(collection.torrent_results.length).toBe(1)
          const result = collection.torrent_results[0]
          expect(result.title).toBe('Life.in.Pieces.S03E15.WEBRip.x264-ION10')
          expect(result.episode_info.title).toBe('Graffiti Cute Jewelry Shots')
        })
        .then(() => {
          return torrentSearch.search('Life.in.Pieces', SearchCategory.TV).then(collection => {
            expect(collection.torrent_results.length).toBe(1)
            const result = collection.torrent_results[0]
            expect(result.title).toBe('Life.in.Pieces.S03E15.WEBRip.x264-ION10')
            expect(result.episode_info.title).toBe('Graffiti Cute Jewelry Shots')
          })
        })
        .then(() => done())
    })
  })
})
