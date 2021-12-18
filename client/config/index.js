
let isDev
if (typeof window !== 'undefined') {
  isDev = /localhost/.test(window.location.host) || /\.local/.test(window.location.host)
} else if (typeof process !== undefined && process.env) {
  isDev = process.env.NODE_ENV === 'development'
}

const supportedId = {
  1: 'Ethereum'
}

if (isDev) {
  supportedId[1337] = 'Local EVM',
  supportedId[4] = 'Rinkeby'
}

const address = Object.assign(
  require('./deployed.json'),
  require('./deployedProduction.json')
)

const config = {
  supportedId,
  address,
  abi: require('./ABIs.json').contracts,
  key: 'dcfb1f21611543539204b8757bf24809',
  season: 2
}

module.exports = config
