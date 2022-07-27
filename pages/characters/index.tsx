import type {NextPage} from 'next'
import Image from 'next/image'
import {useEffect, useState, useRef, FC, useCallback} from 'react'
import styles from '../../styles/Characters.module.css'
import {useRouter} from 'next/router'
import Link from 'next/link'
import type {CharacterType, StateCharactersType} from '../../types/character'

const Characters: FC = () => {
  const [{status, characters, error}, setCharactersState] =
    useState<StateCharactersType>({
      status: 'idle',
      characters: [],
      error: null,
    })
  const router = useRouter()
  const {pageId} = router.query

  const countRef = useRef(1)

  const fetchNextUser = useRef((count: number) => {})
  const searchRef = useRef<HTMLInputElement>(null)

  fetchNextUser.current = async (count: number) => {
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character/?page=${count}`,
      )
      const character = await response.json()
      const updateCharacters = [...characters, ...character.results]

      setCharactersState({
        status: 'resolve',
        characters: updateCharacters,
        error: null,
      })
    } catch (error: any) {
      setCharactersState({
        status: 'rejected',
        characters: [],
        error: error.message,
      })
    }
  }

  const getFilter = async (wordSearch: string) => {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?name=${wordSearch}`,
    )
    const data = await response.json()
    setCharactersState({
      status: 'resolve',
      characters: data.results,
      error: null,
    })
  }

  useEffect(() => {
    if (pageId) {
      countRef.current = Number(pageId)
      fetchNextUser.current(Number(pageId))
    } else {
      fetchNextUser.current(countRef.current)
    }
  }, [pageId])

  let appendQueryPageId = useCallback(
    (id: number) => {
      router.push({query: {pageId: id.toString()}}, undefined, {
        shallow: true,
      })
    },
    [router],
  )

  const handleLoadMoreCharacters = () => {
    countRef.current += 1
    appendQueryPageId(countRef.current)
  }

  const handleSearch = () => {
    if (searchRef.current) {
      const wordSearch = searchRef.current.value
      getFilter(wordSearch)
    }
  }

  if (status === 'rejected') {
    return <div>{error}</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Rick An Morty</h1>
        <div className={styles.inputContainer}>
          <div>
            <input type="text" placeholder="search" ref={searchRef} />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>
      <div>
        <ul className={styles.list}>
          {characters.map((character: CharacterType, index) => (
            <li key={`${character.id}-${index}`}>
              <div>
                <Link href={`/character/${character.id}`}>
                  <a>
                    <div className={styles.imageContainer}>
                      <Image
                        src={character.image}
                        alt={character.name}
                        layout="fill"
                      />
                    </div>
                  </a>
                </Link>
              </div>
              <h5>{character.name}</h5>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.loadmoreContainer}>
        <button onClick={handleLoadMoreCharacters}>Load More</button>
      </div>
    </div>
  )
}

export default Characters
