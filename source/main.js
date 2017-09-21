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
  const sexRegExp = new RegExp(sex)
  const filteredStrings = strings.filter(s => sexRegExp.test(s))

  const name = parseInt(
    filteredStrings
      .filter(s => /tilltalsnamn/.test(s))
      .pop()
      .replace(/\D/g, ``)
  )

  const firstName = parseInt(
    filteredStrings
      .filter(s => /förnamn/.test(s))
      .pop()
      .replace(/\D/g, ``)
  )

  return { firstName, name }
}

const search = async name => {
  const url = getSearchUrl(name)
  const response = await fetch(url)
  const html = await response.text()
  const $ = cheerio.load(html)
  const total = getTotal($)
  const resultStrings = getResultStrings($)
  const women = getNumbers(`kvinnor`, resultStrings)
  const men = getNumbers(`män`, resultStrings)
  const lastName = parseInt(
    resultStrings
      .filter(s => /efternamn/.test(s))
      .pop()
      .replace(/\D/g, ``)
  )
  return {
    total,
    women,
    men,
    lastName
  }
}

export default search
