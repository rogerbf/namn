import fetch from "isomorphic-unfetch"
import cheerio from "cheerio"

const getSearchUrl = name =>
  `http://www.scb.se/hitta-statistik/sverige-i-siffror/namnsok/Search/?nameSearchInput=${name}`

const search = async name => {
  const url = getSearchUrl(name)
  const response = await fetch(url)
  const html = await response.text()
  const $ = cheerio.load(html)
  return $(`#name-result`).text()
}

export default search
