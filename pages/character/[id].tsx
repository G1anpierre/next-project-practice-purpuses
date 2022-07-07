import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'

const CharacterDetail = () => {
  const router = useRouter()
  const {id} = router.query
  const [state, setState] = useState({name: ''})

  useEffect(() => {
    const getSingleCharacter = async () => {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character/${id}`,
      )
      const data = await response.json()
      setState(data)
    }

    getSingleCharacter()
  }, [id])

  return <div>CharacterDetail: {state.name}</div>
}

export default CharacterDetail
