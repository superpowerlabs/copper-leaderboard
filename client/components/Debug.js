// eslint-disable-next-line no-undef
const {InputGroup, FormControl, Row, Col, Button, Container} = ReactBootstrap
import ls from 'local-storage'
const ethers = require('ethers')
import superagent from 'superagent'
import {supportedId} from '../config'
import Address from '../utils/Address'

import Base from './Base'
import Loading from './lib/Loading'
import Ab from './lib/Ab'

import auth from './lib/Auth'

import VideoLooper from 'react-video-looper'

const data = require('../config/maybe-minted.json')

export default class Redeem extends Base {

  constructor(props) {
    super(props)

    this.state = {
      redeemCode: window.location.pathname.split('/')[2],
      errors: {}
    }

    this.bindMany([
      'checkAlreadyMinted',
    ])

  }

  componentDidMount() {
    this.checkAlreadyMinted()
  }

  async checkAlreadyMinted() {
    await this.waitForContracts()
    const {SynCityPasses} = this.Store.contracts || {}
    const minted = {}
    if (SynCityPasses) {
      for (let i=0;i<data.length;i++) {
        let address = await SynCityPasses.usedCodes(data[i][1])
        if (/000000000000/.test(address)) {
          continue
        }
        minted[data[i][0]] = address
        console.log(address)
        await this.sleep(200)
      }
    }
    ls('minted', JSON.stringify(minted))
  }


  render() {

    return (
      <div>
        <Container className={'topContainer'}>
          Enjoy!!
        </Container>
      </div>
    )
  }
}
