const isLocal = process.platform === 'darwin'
const env = process.env

let pgConf
let pgConfMaster


const isProduction = env.NODE_ENV === 'production'



module.exports = {
  isLocal,
  isProduction
}
