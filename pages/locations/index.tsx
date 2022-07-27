import React, {FC, useState, useEffect, useCallback, useRef} from 'react'
import {useRouter} from 'next/router'
import styles from '../../styles/Locations.module.css'

const Locations: FC = () => {
  const router = useRouter()
  const {locationId} = router.query
  const {pageId} = router.query

  const pageCountRef = useRef(1)
  const [locations, setLocations] = useState<any>([])
  const [specificLocation, setSpecificLocation] = useState({
    type: '',
    residents: [],
  })
  const [residentsData, setResidentsData] = useState<any>([])

  const handleMoreLocations = () => {
    pageCountRef.current += 1
    appendPageQuery(pageCountRef.current)
  }

  let appendQuery = (id: string) => {
    router.push({query: {locationId: id}}, undefined, {shallow: true})
  }

  let appendPageQuery = useCallback(
    (id: number) => {
      router.push({query: {pageId: id.toString()}}, undefined, {shallow: true})
    },
    [router],
  )

  useEffect(() => {
    if (locationId) {
      getSpecificLocation(locationId)
    } else {
      getAllLocations()
    }
  }, [locationId])

  useEffect(() => {
    if (pageId) {
      getAllLocations(pageId)
    }
  }, [pageId])

  useEffect(() => {
    const getResidents = async () => {
      const specificLocationArray = specificLocation.residents
      const responses = await Promise.all(
        specificLocationArray.map(specificLocation =>
          fetch(specificLocation).then(res => res.json()),
        ),
      )
      setResidentsData(responses)
    }

    getResidents()
  }, [specificLocation])

  const getAllLocations = async (id: string | string[] = '1') => {
    const response = await fetch(
      `https://rickandmortyapi.com/api/location?page=${id}`,
    )
    const data = await response.json()
    const updatedData = [...locations, ...data.results]
    setLocations(updatedData)
  }

  const getSpecificLocation = async (id: string | string[]) => {
    const response = await fetch(
      `https://rickandmortyapi.com/api/location/${id}`,
    )
    const data = await response.json()
    setSpecificLocation(data)
  }

  return (
    <div>
      <ul className={styles.list}>
        {locations.map((location: any, index: number) => (
          <li
            key={`${location.id}-${index}`}
            onClick={() => appendQuery(location.id)}
            className={styles.item}
          >
            <span className={styles.locationName}>{location.name}</span>
            {locationId === location.id.toString() && (
              <div className={styles.card}>
                <div>type: {specificLocation.type}</div>
                <div>
                  residents:
                  <ul>
                    {residentsData.map((resident: any) => (
                      <li key={resident.id}>{resident.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <button onClick={() => handleMoreLocations()}>load more</button>
    </div>
  )
}

export default Locations
