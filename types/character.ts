export type LocationType = {
  name: string
  url: string
}

export type OriginType = {
  name: string
  url: string
}

export type CharacterType = {
  created: string
  episode: string[]
  gender: string
  id: number
  image: string
  locations: LocationType
  name: string
  origin: OriginType
  species: string
  status: string
  type: string
  url: string
}

export type StateCharactersType = {
  status: string
  characters: CharacterType[]
  error: null
}
