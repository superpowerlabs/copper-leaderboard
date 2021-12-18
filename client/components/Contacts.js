// eslint-disable-next-line no-undef
const {InputGroup, FormControl, Row, Col, Button, Container} = ReactBootstrap
// eslint-disable-next-line no-undef
const {Redirect, Link} = ReactRouterDOM
const ethers = require('ethers')
import {supportedId} from '../config'
import Base from './Base'
import Loading from './lib/Loading'
import mintedById from '../config/minted.json'
const mintedByAddress = _.invert(mintedById)

export default class Contacts extends Base {

  constructor(props) {
    super(props)

    this.state = {
      targetPage: window.location.pathname.split('/')[1],
      error: undefined,
      answer1: '',
      answer2: '',
      answer3: ''
    }

    this.bindMany([
      'isItOk',
      'handleChange',
      'countDown'
    ])

  }

  componentDidMount() {
    if (window.location.hostname === 'nft.syn.city') {
      this.state({
        redirectTo: '/'
      })
    }
    this.checkUser()
  }

  async checkUser() {
    const {accessToken, discordUser, powerTimestamp} = this.Store
    if (!accessToken || !discordUser || !powerTimestamp) {
      this.setStore({
        poder: true
      }, true)
      this.setState({
        redirectTo: `/welcome/${this.state.targetPage}`
      })
    } else {
      this.setStore({
        poder: null
      }, true)
    }
  }

  handleChange(event) {
    let {name, value} = event.target
    switch (name) {
      case 'answer1':
        this.setState({
          answer1: value,
          error: false
        })
        break
      case 'answer2':
        this.setState({
          answer2: value,
          error: false
        })
        break
      case 'answer3':
        this.setState({
          answer3: value,
          error: false
        })
        break
    }
  }

  countDown(c = 5) {
    this.setState({
      countDownStep: c
    })
    if (c > 1) {
      this.setTimeout(() => this.countDown(--c), 1000)
    }
  }

  async isItOk() {
    if (mintedById[_.trim(this.Store.discordUser.id)] || mintedByAddress[this.Store.connectedWallet]) {
      return this.setState({
        fatalError: `${this.Store.discordUser.username}, it looks like you have already minted a Syn Pass`
      })
    }
    this.setState({
      submitting: true
    })
    this.countDown()
    let now = Date.now()
    this.lastCall = Date.now()
    const {accessToken, discordUser} = this.Store
    const {answer1, answer2, answer3} = this.state
    const digits = Math.random().toString().substring(2, 6)
    const res = await this.request('validate-solution', 'get', undefined, {
      accessToken,
      userId: discordUser.id,
      answer1: _.trim(answer1),
      answer2: _.trim(answer2),
      answer3: _.trim(answer3),
      digits,
      discriminator: discordUser.discriminator
    })
    if (res.success) {
      this.setStore({
        digits
      })
      this.setState({
        redirectTo: '/tetris'
      })
    } else {
      if (res.errorCode === 403) {
        this.setStore({
          accessToken: null
        }, true)
      }
      if (res.error) {
        this.setState({
          error: res.error || 'Nope, that is not the right solution'
        })
      } else if (res.fatalError) {
        return this.setState({
          fatalError: res.fatalError
        })
      }
    }
    if (Date.now() - now < 5000) {
      await this.sleep(5000 - (Date.now() - now))
    }
    this.setState({
      submitting: false,
      error: ''
    })
  }

  getInput(index) {
    const field = 'answer' + index
    return <InputGroup key={'input' + index} className="mb-3" size={'lg'}>
      <InputGroup.Text id="basic-addon3">
        Answer #{index}
      </InputGroup.Text>
      <FormControl
        name={field}
        value={this.state[field]}
        onChange={this.handleChange}
      />
    </InputGroup>
  }

  render() {

    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo}/>
    }

    let net
    for (let k in supportedId) {
      if (k !== '1337') {
        net = supportedId[k]
        break
      }
    }

    if (this.state.fatalError) {
      return <div>
        <Container className={'topContainer'}>
          <div className={'largeError'}>{this.state.fatalError}</div>
        </Container>
      </div>
    }

    return (
      <div>
        <Container className={'topContainer'}>
          <div className={'centered imgLogo'}><img src={'/images/syn-city-large.png'} alt={'Syn City logo'}/></div>
          <div className={'home-section'}>
            <Row>
              <Col>
                <div className={'textBlock'}>{
                  this.Store.connectedNetwork
                    ?
                    <div>
                      {
                        this.state.redeemCode
                          ? <h3 className={'centered crimson'}>Congratulation, the solution is correct. Press the button
                            to redeem
                            your Syn City Genesis Pass</h3>
                          : <h3 className={'centered crimson'}>Hi {this.Store.discordUser.username}, if you know the
                            solution, type
                            the three answers</h3>
                      }
                      {
                        this.state.redeemCode
                          ? <div>
                            <Button as={Link} to={'/claim/' + this.state.redeemCode}>Jump to the redeem
                              page</Button>
                          </div>
                          : <div>
                            {this.getInput(1)}
                            {this.getInput(2)}
                            {this.getInput(3)}

                            <Button size={'lg'}
                                    disabled={this.state.submitting}
                                    onClick={this.isItOk}>{
                              this.state.submitting
                                ? <div>
                                  <div className={'floatLeft'}>{this.state.countDownStep}</div>
                                  <Loading/>

                                </div>
                                : 'Verify your solution!'

                            }</Button>

                            {
                              this.state.error
                                ? <div className={'error mb22'}>{this.state.error}</div>
                                : null
                            }
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
