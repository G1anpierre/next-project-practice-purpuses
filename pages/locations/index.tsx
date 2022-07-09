import React, {FC, useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import styles from '../../styles/Locations.module.css'

const Locations: FC = () => {
  const router = useRouter()
  const {locationId} = router.query

  const [page, setPage] = useState(1)
  const [locations, setLocations] = useState([])
  const [specificLocation, setSpecificLocation] = useState({
    type: '',
    residents: [],
  })
  const [residentsData, setResidentsData] = useState<any>([])

  const handleMore = () => {
    setPage(page + 1)
  }

  let appendQuery = (id: string) => {
    router.query.locationId = id
    router.push(router)
  }

  useEffect(() => {
    if (locationId) {
      getSpecificLocation(locationId)
    } else {
      getAllLocations()
    }
  }, [locationId])

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

  const getAllLocations = async () => {
    const response = await fetch('https://rickandmortyapi.com/api/location')
    const data = await response.json()
    setLocations(data.results)
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
        {locations.map((location: any) => (
          <li
            key={location.id}
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
      <button onClick={handleMore}>load more</button>
    </div>
  )
}

export default Locations
