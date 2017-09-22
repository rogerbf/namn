import fetch from "isomorphic-unfetch"
import cheerio from "cheerio"

const buildSearchUrl = name =>
  `http://www.scb.se/hitta-statistik/sverige-i-siffror/namnsok/Search/?nameSearchInput=${name}`

const extractTotal = html =>
  parseInt(
    html(`h2`, `.nameSearchResultNumbers`)
      .text()
      .trim()
      .replace(/\D/g, ``),
    10
  )

const getResultStrings = html =>
  html(`p`, `.nameSearchResultNumbers`)
    .toArray()
    .map(element =>
      html(element)
        .text()
        .trim()
    )

const extractGenderSpecificData = (sex, data) => {
  const sexRegExp = new RegExp(sex)
  const filteredData = data.filter(s => sexRegExp.test(s))

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

const search = async name => {
  const response = await fetch(buildSearchUrl(name))
  const document = await response.text()
  const html = cheerio.load(document)
  const data = getResultStrings(html)

  return {
    total: extractTotal(html),
    women: extractGenderSpecificData(`kvinnor`, data),
    men: extractGenderSpecificData(`män`, data),
    lastName: extractLastName(data)
  }
}

export default search
