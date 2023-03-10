import { isAddress } from '../../utils'
import { Pair, Token } from 'dex-sdk'

export function filterTokens(tokens: Token[], search: string): Token[] {
  if (search.length === 0) return tokens

  const searchingAddress = isAddress(search)

  if (searchingAddress) {
    return tokens.filter(token => token.address === searchingAddress)
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter(s => s.length > 0)

  if (lowerSearchParts.length === 0) {
    return tokens
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)

    return lowerSearchParts.every(p => p.length === 0 || sParts.some(sp => sp.startsWith(p) || sp.endsWith(p)))
  }

  return tokens.filter(token => {
    const { symbol, name } = token

    return (symbol && matchesSearch(symbol)) || (name && matchesSearch(name))
  })
}

export function filterPairs(pairs: Pair[], search: string): Pair[] {
  if (search.length === 0) return pairs

  const searchingAddress = isAddress(search)

  if (searchingAddress) {
    return pairs.filter(pair => Pair.getAddress(pair.token0, pair.token1) === searchingAddress)
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter(s => s.length > 0)

  if (lowerSearchParts.length === 0) {
    return pairs
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)

    return lowerSearchParts.every(p => p.length === 0 || sParts.some(sp => sp.startsWith(p) || sp.endsWith(p)))
  }

  return pairs.filter(pair => {
    const { token0, token1 } = pair

    return (
      (token0.symbol && matchesSearch(token0.symbol)) ||
      (token1.symbol && matchesSearch(token1.symbol)) ||
      (token0.name && matchesSearch(token0.name)) ||
      (token1.name && matchesSearch(token1.name)) ||
      (token0.symbol &&
        token1.symbol &&
        (matchesSearch(token0.symbol + token1.symbol) || matchesSearch(`${token0.symbol}/${token1.symbol}`)))
    )
  })
}
