// eslint-disable-next-line no-undef
const {Container, Row, Col} = ReactBootstrap
import * as Scroll from 'react-scroll'
import Markdown from 'react-markdown-it'

import Base from '../Base'
import Ab from '../lib/Ab'

export default class FAQ extends Base {

  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    }

    this.bindMany([
      'faq'
    ])
  }

  isMobile() {
    return window.innerWidth < 800
  }

  faq() {
    const faqs = [
      ['How can I get a redeem code?', <span>Do this</span>],
    ]
    const rows = []

    function faqRow(faq) {
      return <Col xs={12} lg={4} key={'faq' + Math.random()}>{
        faq ? <div className={'textBlock'}>
            <div className={'faqTitle'}>{faq[0]}</div>
            <div className={'faqBody'}>{faq[1]}</div>
          </div>
          : null
      }
      </Col>
    }

    for (let i = 0; i < faqs.length; i += 3) {
      rows.push(<Row key={'faqrow' + Math.random()}>
        {faqRow(faqs[i])}
        {faqRow(faqs[i + 1])}
        {faqRow(faqs[i + 2])}
      </Row>)
    }
    return rows
  }

  render() {

    return (
      <div className={'home-section'}>
        <Scroll.Element name='faq'><h1>FAQ</h1></Scroll.Element>
        {this.faq()}
      </div>
    )
  }
}
