// eslint-disable-next-line no-undef
import * as Scroll from 'react-scroll'
import queryString from 'query-string'

const {Container, Row, Col} = ReactBootstrap

import Base from './Base'
import Mint from './Mint'
import FAQ from './sections/FAQ'

export default class Home extends Base {


  constructor(props) {
    super(props)
    const qs = queryString.parse(window.location.search)
    this.state = {
      qs
    }
  }


  componentDidMount() {
    Scroll.animateScroll.scrollToTop()
  }

  render() {

    return (
      <div>
      <Container className={'topContainer'}>

        <div className={'centered imgLogo'}><img src={'/images/syn-city-large.png'} alt={'Syn City logo'}/></div>

        <Mint
          Store={this.Store}
          setStore={this.setStore}
        />

        {/*<FAQ*/}
        {/*  Store={this.Store}*/}
        {/*  setStore={this.setStore}*/}
        {/*/>*/}
      </Container>
      </div>
    )
  }
}
