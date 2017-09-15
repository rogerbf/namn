import fetch from "isomorphic-unfetch"
import cheerio from "cheerio"

const getSearchUrl = name =>
  `http://www.scb.se/hitta-statistik/sverige-i-siffror/namnsok/Search/?nameSearchInput=${name}`

const getTotal = $ =>
  parseInt(
    $(`h2`, `.nameSearchResultNumbers`)
      .text()
      .trim()
      .replace(/\D/g, ``),
    10
  )

const search = async name => {
  const url = getSearchUrl(name)
  const response = await fetch(url)
  const html = await response.text()
  const $ = cheerio.load(html)
  const total = getTotal($)
  return total
}

export default search
