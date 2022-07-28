import React, {Fragment, useRef} from 'react'
import {useInfiniteQuery} from '@tanstack/react-query'
import {useRouter} from 'next/router'

export type Episode = {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
  url: string
  created: string
}

const Episodes = () => {
  const router = useRouter()
  const {pageId} = router.query
  const pageCountRef = useRef(pageId || 1)
  const {data, isLoading, fetchNextPage, hasNextPage} = useInfiniteQuery(
    ['infiniteEpisodes'],
    async ({pageParam = pageCountRef.current}) =>
      await fetch(
        `https://rickandmortyapi.com/api/episode/?page=${pageParam}`,
      ).then(result => result.json()),
    {
      getNextPageParam: (lastPage, _allPages) => {
        if (lastPage.info.next) {
          pageCountRef.current = lastPage.info.next.split('=')[1]
          return lastPage.info.next.split('=')[1]
        }
      },
    },
  )

  const loadMoreEpisodes = () => {
    fetchNextPage()
    router.push(`episodes/?pageId=${pageCountRef.current}`, undefined, {
      shallow: true,
    })
  }

  console.log('pageCountRef', pageCountRef.current)

  return (
    <>
      <ul>
        {isLoading ? (
          <li>Loading...</li>
        ) : (
          data?.pages.map((group, index) => (
            <Fragment key={index}>
              {group.results.map((episode: Episode, index: number) => (
                <li key={index}>{episode.name}</li>
              ))}
            </Fragment>
          ))
        )}
      </ul>
      {hasNextPage && (
        <button onClick={loadMoreEpisodes}>Load more episodes</button>
      )}
    </>
  )
}

export default Episodes
