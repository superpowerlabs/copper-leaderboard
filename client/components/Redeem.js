// eslint-disable-next-line no-undef
const {InputGroup, FormControl, Row, Col, Button, Container} = ReactBootstrap

const ethers = require('ethers')
import superagent from 'superagent'
import {supportedId} from '../config'
import Address from '../utils/Address'

import Base from './Base'
import Loading from './lib/Loading'
import Ab from './lib/Ab'

import auth from './lib/Auth'

import VideoLooper from 'react-video-looper'

export default class Redeem extends Base {

  constructor(props) {
    super(props)

    this.state = {
      redeemCode: window.location.pathname.split('/')[2],
      errors: {}
    }

    this.bindMany([
      'verifyRedeemCode',
      'mintYourToken',
      'checkIfAlreadyMinted',
      'getTokenUri'
    ])

  }

  componentDidMount() {
    this.checkIfAlreadyMinted()
  }

  async checkIfAlreadyMinted() {
    await this.waitForContracts()
    const {SynCityPasses} = this.Store.contracts || {}
    if (SynCityPasses) {
      for (let i=9;i<209;i++) {
        const [uri] = await this.getTokenUri()
        // const balanceOf = await SynCityPasses.balanceOf(this.Store.connectedWallet)
        if (uri) {
          this.setState({
            congratulations: true,
            uri,
            checked: true
          })
        }
      }
    }
  }

  async verifyRedeemCode() {
    if (!this.Store.connectedWallet) {
      return alert('Please, connect your metamask to redeem your nft')
    }
    const {redeemCode} = this.state
    const {msgParams, signature} = await auth.getSignedAuthToken(
      this.Store.chainId,
      this.Store.connectedWallet, {
        redeemCode
      }
    )
    const res = await this.request('verify-redeem-code', 'post', {
      msgParams,
      signature
    })
    if (res.success) {
      const {authCode, signature, member} = res
      this.setState({
        redeemCodeIsVerified: true,
        authCode,
        signature,
        member
      })
    } else {
      this.setState({
        errors: {redeemCode: res.error}
      })
    }
  }

  decodeError(message) {
    let i = 0
    return this.decodeMetamaskError(message).map(e => {
      return <div key={'key' + i++}>{e}</div>
    })
  }

  decodeMetamaskError(message) {
    try {
      if (/denied transaction signature/.test(message)) {
        return ['You denied transaction signature :-(']
      }
      let tmp = message.split('{"code":')[1].split(',')
      // let code = tmp[0]
      let res = tmp[1].split('"message":"')[1].split('"')[0].split(/: */)
      let reason = res.slice(1).join(': ')
      reason = reason.substring(0, 1).toUpperCase() + reason.substring(1)
      return [res[0] + '.', reason]
    } catch (e) {
      return ['VM Exception while processing transaction :-(']
    }
  }

  async mintYourToken() {
    this.setState({
      error: undefined
    })
    if (this.Store.connectedNetwork) {
      const {signature, authCode, redeemCode} = this.state
      const {SynCityPasses} = this.Store.contracts
      if (SynCityPasses && authCode && signature) {
        try {
          let nextTokenId = (await SynCityPasses.nextTokenId()).toNumber()
          if (nextTokenId >= 208) {
            return this.setState({
              error: 'Whoops, it looks like all the Syn Pass for this stage have been minted'
            })
          }
          this.setState({
            nextTokenId
          })
          this.setState({
            minting: true
          })
          const typeIndex = ethers.BigNumber.from(redeemCode.substring(2, 3))
          const transaction = await SynCityPasses.connect(this.Store.signer).claimFreeToken(authCode, typeIndex, signature, {
            gasLimit: 300000
          })
          await transaction.wait()
          let [uri, tokenId] = await this.getTokenUri()
          if (uri) {
            this.request('set-used-redeem-code/' + redeemCode, 'post', {
              tokenId
            })
            this.setState({
              congratulations: true,
              minting: false,
              uri,
              tokenId
            })
          } else {
            this.setState({
              error: 'It looks like something went wrong'
            })
          }
        } catch (e) {
          this.setState({
            error: this.decodeError(e.message),
            minting: false
          })
        }
      }
    } else {
      alert('You must be connected to Ethereum Mainnet')
    }
  }

  async getTokenUri(tokenId) {
    const {SynCityPasses} = this.Store.contracts
    if (!tokenId) {
      const {nextTokenId} = this.state
      if (nextTokenId) {
        let currentNextTokenId = (await SynCityPasses.nextTokenId()).toNumber()
        for (let i = nextTokenId; i < currentNextTokenId; i++) {
          try {
            let owner = await SynCityPasses.ownerOf(i)
            if (Address.equal(owner, this.Store.connectedWallet)) {
              tokenId = i
              break
            }
          } catch (e) {
            console.error(e.message)
          }
        }
      }
    }
    if (tokenId) {
      let meta = await SynCityPasses.tokenURI(tokenId)
      const res = await superagent.get(meta)
      return [res.body.animation_url, tokenId]
    }
    return []
  }

  render() {

    let net
    for (let k in supportedId) {
      if (k !== '1337') {
        net = supportedId[k]
        break
      }
    }

    return (
      <div>
        <Container className={'topContainer'}>
          {
            this.state.congratulations
              ? null
              :
              <div className={'centered imgLogo'}><img src={'/images/syn-city-large.png'} alt={'Syn City logo'}/></div>
          }
          <div className={'home-section'}>
            {
              this.state.congratulations
                ? null
                : <h3 className={'centered crimson'}>MINTING PAGE</h3>
            }
            <Row>
              <Col>
                <div className={'textBlock'}>{
                  this.Store.connectedNetwork
                    ? <div>
                      <div className={'label'}>{
                        this.state.congratulations
                          ? <div>
                            {
                              this.state.member
                                ? <h2>Hi <b>{this.state.member}</b>, congratulations!</h2>
                                : <h2>Congratulations!</h2>
                            }
                            <h2>You got a mysterious Syn City Pass</h2>

                            <div className={'token centered'}>
                              <VideoLooper
                                source={this.state.uri}
                                start={0}
                                end={4}
                                objectFit={'cover'}
                              />
                            </div>

                            <div className={'centered'}>Check it on <Ab label={'Etherscan'}
                                                                        link={`https://${this.Store.chainId === 4 ? 'rinkeby.' : ''}etherscan.io/address/${this.Store.connectedWallet}#tokentxnsErc721`}/>
                            </div>
                          </div>
                          : this.state.member
                            ? (
                              this.state.minting
                                ? <span>
                                  Hi <b>{this.state.member}</b>, you are minting your Syn City Genesis Pass.<br/>
                                  Please, wait till the transaction is confirmed...
                              </span>
                                :
                                <span>Hi <b>{this.state.member}</b>, you are ready to mint your SynCity Blueprint NFT</span>
                            )
                            : 'Please, click the button to verify your redeem code'
                      }</div>
                      {
                        this.state.congratulations
                          ? null
                          : this.state.redeemCodeIsVerified
                            ? <div>
                              {
                                this.state.minting ? <Loading
                                    variant={'light'}
                                  />
                                  : <Button size={'lg'}
                                            onClick={this.mintYourToken}>Mint your token!</Button>
                              }
                              {
                                this.state.error
                                  ? <div className={'error digit'}>{this.state.error}</div>
                                  : null
                              }
                            </div>

                            : <div><InputGroup className="mb-3" size={'lg'}>
                              <InputGroup.Text id="basic-addon3">
                                Redeem code
                              </InputGroup.Text>
                              <FormControl id="basic-url" aria-describedby="basic-addon3"
                                           name={'redeemCode'}
                                           value={this.state.redeemCode}
                                // onChange={this.handleChange}
                                           readOnly={true}
                              />
                              {this.state.errors.redeemCode && (
                                <div className="input-error">{this.state.errors.redeemCode}
                                </div>
                              )}
                            </InputGroup>
                              <Button size={'lg'}
                                      onClick={this.verifyRedeemCode}>Verify your code!</Button>
                            </div>
                      }
                    </div>
                    : <div>
                      <h2>Please connect your wallet to the {net} testnet.</h2>
                    </div>

                }</div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    )
  }
}
