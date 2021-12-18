// eslint-disable-next-line no-undef
const {Button, Container, Form, InputGroup, FormControl, Table} = ReactBootstrap

// eslint-disable-next-line no-undef
const {Redirect} = ReactRouterDOM

import Base from './Base'
import Loading from './lib/Loading'
import auth from '../utils/Auth'

class Admin extends Base {

  constructor(props) {
    super(props)

    this.state = {
      claimNow: false,
      discordMember: '',
      errors: {},
      newCodes: {}
    }

    this.bindMany([
      'getRedeemed',
      'getNewCode',
      'handleChange',
      'showResults',
      'showCodes'
    ])

  }

  componentDidMount() {
    this.checkIfOperator()
  }

  handleChange(event) {
    const name = event.target.name
    let value = event.target.value
    let tmp
    switch (name) {
      case 'discordMember':
        tmp = value.split('#')
        this.setState({
          discordMember: value,
          errors: {},
          discordMemberIsValid: !/[^\w.]/g.test(tmp[0]) && /^\d{4}$/.test(tmp[1])
        })
        break
    }
  }

  async getRedeemed(typeIndex) {

    this.setState({
      success: null,
      typeIndex
    })

    const {msgParams, signature} = await auth.getSignedAuthToken(
      this.Store.chainId,
      this.Store.connectedWallet, {
        typeIndex
      }
    )

    const res = await this.request('all-codes', 'post', {
      msgParams,
      signature
    })
    if (res.success) {
      this.setState({
        redeemed: res.redeemed
      })
    } else {
      this.setState({
        error: res.error
      })
    }
  }

  async getNewCode() {
    const {discordMember, discordMemberIsValid} = this.state
    if (discordMemberIsValid) {
      const {msgParams, signature} = await auth.getSignedAuthToken(
        this.Store.chainId,
        this.Store.connectedWallet, {
          discordMember
        }
      )
      const res = await this.request('new-code-for', 'post', {
        msgParams,
        signature
      })
      if (res.success) {
        const {newCodes} = this.state
        newCodes[discordMember] = res.code
        this.setState({
          success: true,
          newCodes
        })
      } else {
        this.setState({
          errors: {discordMember: res.error}
        })
      }
    }
  }

  niceDate(d) {
    if (!d) {
      return ''
    }
    d = d.split('Z')[0].split('T')
    const a = d[0].split('-')
    const b = d[1].split(':')
    return (a[1] === '11' ? 'Nov ' : 'Dec ') + a[2] + ', ' +
      b[0] + ':' + b[1]
  }

  showResults() {
    const {redeemed, typeIndex} = this.state
    let completedDiv
    let startedDiv
    let initiatedDiv
    if (typeof typeIndex !== 'number') {
      return
    }

    if (redeemed && Object.keys(redeemed).length) {
      let completed = []
      let started = []
      let initialized = []

      for (let row of redeemed) {
        if (row.redeemed) {
          completed.push(row)
        } else if (row.redeemCode) {
          started.push(row)
        } else {
          initialized.push(row)
        }
      }

      completedDiv = this.getTable(completed, 'Minted tokens')
      startedDiv = this.getTable(started, 'Redeem code obtained')
      initiatedDiv = this.getTable(initialized, 'Process started')
    }

    return <div className={'mt20'}>
      <h4>{
        typeIndex === 4 ? 'Community events codes'
          : `ARG#${typeIndex + 1} codes`

      }</h4>
      {
        completedDiv || startedDiv || initiatedDiv
          ? <div>
            {completedDiv}
            {startedDiv}
            {initiatedDiv}
          </div>
          : 'Nothing in this category yet'
      }
    </div>

  }

  getTable(records, title) {
    if (records.length) {
      const rows = []
      let i = 0
      for (let r of records) {
        rows.push(<tr key={'tr' + Math.random()}>
          <td>{++i}</td>
          <td>{r.full_username}</td>
          <td>{r.auth_code}</td>
          <td>{this.niceDate(r.created_at)}</td>
          <td>{r.redeem_code || ''}</td>
          <td>{this.niceDate(r.redeem_code_set_at) || ''}</td>
          <td>{this.niceDate(r.redeem_code_used_at) || ''}</td>
          <td>{r.redeemer ? this.ellipseAddress(r.redeemer) : ''}</td>
        </tr>)
      }
      return <div>
        <h5>{title}</h5>
        <Table striped bordered hover size="sm">
          <thead>
          <tr>
            <th></th>
            <th>full_username</th>
            <th>auth_code</th>
            <th>created_at</th>
            <th>redeem_code</th>
            <th>redeem_code_set_at</th>
            <th>redeem_code_used_at</th>
            <th>redeemer</th>
          </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    }
  }

  showCodes() {
    const {newCodes} = this.state
    const rows = []
    let i = 0
    if (Object.keys(newCodes).length) {
      for (let code in newCodes) {
        rows.push(<div key={'codes' + i++}>
          <div className={'memberName'}>{code}</div>
          <div className={'memberCode'}>{newCodes[code]}</div>
        </div>)
      }
    }
    return (rows.length
        ? <div className={'newCodes'}><h3>New codes:</h3>
          {rows}
        </div>
        : null
    )
  }

  render() {

    const {isOperator} = this.state

    if (typeof isOperator === 'undefined') {
      return <Container style={{marginTop: 100}}><Loading/></Container>
    }

    if (!isOperator) {
      return <Container style={{marginTop: 100}}>
        <div className={'noTokens m0Auto'}>
          <p>404, page not found :-(</p>
        </div>
      </Container>
    }


    return <Container style={{marginTop: 100}}>
      {
        this.state.error
          ? <p className="big error">
            {this.state.error}
          </p>
          : null
      }
      <div>{' '}</div>
      {
        this.showCodes()
      }
      <h2>Get a new code for</h2>
      <InputGroup className="mb-3" size={'lg'}>
        <InputGroup.Text id="basic-addon3">
          Discord user
        </InputGroup.Text>
        <FormControl id="basic-url" aria-describedby="basic-addon3"
                     name={'discordMember'}
                     value={this.state.discordMember}
                     onChange={this.handleChange}
        />
        {this.state.errors.discordMember && (
          <div className="input-error">{this.state.errors.discordMember}
          </div>
        )}
      </InputGroup>
      <Button size={'lg'}
              disabled={!this.state.discordMemberIsValid}
              onClick={this.getNewCode}>Get code!</Button>
      <div className={'centered'}>
        <hr className={'crimson'}/>
      </div>
      <div>Load previous data about
        {' '} <Button variant="primary" onClick={() => this.getRedeemed(0)}>ARG#1</Button>
        {' '} <Button variant="primary" onClick={() => this.getRedeemed(1)}>ARG#2</Button>
        {' '} <Button variant="primary" onClick={() => this.getRedeemed(2)}>ARG#3</Button>
        {' '} <Button variant="primary" onClick={() => this.getRedeemed(3)}>ARG#4</Button>
        {' '} <Button variant="primary" onClick={() => this.getRedeemed(4)}>Community Events</Button>
      </div>
      {
        this.showResults()
      }

    </Container>

  }
}


module.exports = Admin
