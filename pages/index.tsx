import type {NextPage} from 'next'
import Image from 'next/image'
import {useEffect, useState, useRef} from 'react'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import type {CharacterType, StateCharactersType} from '../types/character'

const Home: NextPage = () => {
  const [{status, characters, error}, setCharactersState] =
    useState<StateCharactersType>({
      status: 'idle',
      characters: [],
      error: null,
    })
  const [info, setInfo] = useState({})
  const [pageStatus, setPageStatus] = useState(1)

  const fetchNextUser = useRef(() => {})
  const searchRef = useRef<HTMLInputElement>(null)

  fetchNextUser.current = async () => {
    try {
      setCharactersState({status: 'pending', characters: [], error: null})
      const response = await fetch(
        `https://rickandmortyapi.com/api/character/?page=${pageStatus}`,
      )
      const character = await response.json()
      const updateCharacters = [...characters, ...character.results]
      setInfo({
        info: character.info,
      })
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
      `https://rickandmortyapi.com/api/character/?page=2&name=${wordSearch}`,
    )
    const data = await response.json()
    setCharactersState({
      status: 'resolve',
      characters: data.results,
      error: null,
    })
  }

  useEffect(() => {
    fetchNextUser.current()
  }, [pageStatus])

  const handleLoadMore = () => {
    setPageStatus(prev => prev + 1)
  }

  if (status === 'loading') {
    return <div>...loading</div>
  }

  if (status === 'rejected') {
    return <div>{error}</div>
  }

  const handleSearch = () => {
    if (searchRef.current) {
      const wordSearch = searchRef.current.value
      getFilter(wordSearch)
    }
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
          {characters.map((character: CharacterType) => (
            <li key={character.id}>
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
        <button onClick={handleLoadMore}>Load More</button>
      </div>
    </div>
  )
}

export default Home
