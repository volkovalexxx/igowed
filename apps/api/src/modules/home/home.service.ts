import { homePageData } from './home.data.js'
import type { HomePagePayload } from './home.types.js'

export function getHomePagePayload(): HomePagePayload {
  return homePageData
}
