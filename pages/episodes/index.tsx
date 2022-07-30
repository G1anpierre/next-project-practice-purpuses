import React, {Fragment, useRef} from 'react'
import {useInfiniteQuery} from '@tanstack/react-query'
import {useRouter} from 'next/router'
import {GetServerSideProps} from 'next'

export type Episode = {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
  url: string
  created: string
}

const Episodes = ({pageId}: {pageId: string}) => {
  const router = useRouter()
  const pageCountRef = useRef(undefined)
  const {data, isLoading, fetchNextPage, hasNextPage} = useInfiniteQuery(
    ['infiniteEpisodes'],
    async ({pageParam = pageId || 1}) =>
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
    router.push(`episodes/?pageId=${pageCountRef.current}`, undefined, {
      shallow: true,
    })
    fetchNextPage()
  }

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

export const getServerSideProps: GetServerSideProps = async context => {
  const {query} = context
  const {pageId} = query
  return {
    props: {
      pageId: pageId?.toString() || '1',
    },
  }
}
