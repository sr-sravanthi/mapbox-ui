export interface TrashRequest {
  userid?: string
  timestamp?: Date | null,
  nELatitude: number,
  nWLatitude: number,
  sELatitude: number,
  sWLatitude: number,
  nELongitude: number,
  nWLongitude: number,
  sELongitude: number,
  sWLongitude: number,
  zoom: number
}
