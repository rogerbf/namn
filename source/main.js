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

const getResultStrings = $ =>
  $(`p`, `.nameSearchResultNumbers`)
    .toArray()
    .map(element =>
      $(element)
        .text()
        .trim()
    )

const getNumbers = (sex, strings) => {
  const filteredStrings = strings.filter(s => new RegExp(sex).test(s))
  const firstName = parseInt(
    filteredStrings.filter(s => /tilltalsnamn/.test(s)).pop()
  )
  return { firstName }
}

const search = async name => {
  const url = getSearchUrl(name)
  const response = await fetch(url)
  const html = await response.text()
  const $ = cheerio.load(html)
  const total = getTotal($)
  const resultStrings = getResultStrings($)
  const women = getNumbers(`kvinnor`, resultStrings)
  return {
    total,
    women
  }
}

export default search
