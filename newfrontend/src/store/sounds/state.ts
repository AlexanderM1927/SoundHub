import { Sound } from "../../vite-env"

export default function () : {
  searchResults: any,
  loading: boolean,
  searchText: string,
  song: Sound,
  playlist: any[],
  position: Number
} {
  return {
    searchResults: null,
    loading: false,
    searchText: '',
    song: null,
    playlist: [],
    position: 1
    //
  }
}
