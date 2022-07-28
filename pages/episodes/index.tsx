import React, {Fragment} from 'react'
import {dehydrate, QueryClient, useInfiniteQuery} from '@tanstack/react-query'
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

const Episodes = () => {
  const {data, isLoading, fetchNextPage, hasNextPage} = useInfiniteQuery(
    ['infiniteEpisodes'],
    async ({pageParam = 1}) =>
      await fetch(
        `https://rickandmortyapi.com/api/episode/?page=${pageParam}`,
      ).then(result => result.json()),
    {
      getNextPageParam: (lastPage, _allPages) => {
        if (lastPage.info.next) {
          return lastPage.info.next.split('=')[1]
        }
      },
    },
  )

  const loadMoreEpisodes = () => {
    fetchNextPage()
  }

  console.log('data', data)

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

// export const getServerSideProps: GetServerSideProps = async context => {
//   let page = 2
//   if (context.query.page) {
//     page = parseInt(context.query.page)
//   }
//   const queryClient = new QueryClient()
//   await queryClient.prefetchQuery(
//     ['infiniteEpisodes', page],
//     async () =>
//       await fetch(`https://rickandmortyapi.com/api/episode/?page=${page}`).then(
//         result => result.json(),
//       ),
//   )
//   return {props: {dehydratedState: dehydrate(queryClient)}}
// }
