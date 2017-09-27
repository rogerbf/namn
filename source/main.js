import fetch from "isomorphic-unfetch"
import cheerio from "cheerio"

const constructSearchUrl = name =>
  `http://www.scb.se/hitta-statistik/sverige-i-siffror/namnsok/Search/?nameSearchInput=${name}`

const extractTotal = html =>
  parseInt(
    html(`h2`, `.nameSearchResultNumbers`)
      .text()
      .trim()
      .replace(/\D/g, ``),
    10
  )

const prepareResults = html =>
  html(`p`, `.nameSearchResultNumbers`)
    .toArray()
    .map(element =>
      html(element)
        .text()
        .trim()
    )

const extractGenderSpecificData = (gender, data) => {
  const genderRegExp = new RegExp(gender)
  const filteredData = data.filter(s => genderRegExp.test(s))

  const name = parseInt(
    filteredData
      .filter(s => /tilltalsnamn/.test(s))
      .pop()
      .replace(/\D/g, ``)
  )

  const firstName = parseInt(
    filteredData
      .filter(s => /förnamn/.test(s))
      .pop()
      .replace(/\D/g, ``)
  )

  return { firstName, name }
}

const extractLastName = data =>
  parseInt(
    data
      .filter(s => /efternamn/.test(s))
      .pop()
      .replace(/\D/g, ``)
  )

export const getStatistics = async name => {
  const response = await fetch(constructSearchUrl(name))
  const document = await response.text()

  const html = cheerio.load(document)
  const rows = prepareResults(html)

  return {
    total: extractTotal(html),
    women: extractGenderSpecificData(`kvinnor`, rows),
    men: extractGenderSpecificData(`män`, rows),
    lastName: extractLastName(rows)
  }
}
