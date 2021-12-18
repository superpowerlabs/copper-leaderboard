// const {Link} = ReactRouterDOM
import Base from './Base'
import Ab from './lib/Ab'

// eslint-disable-next-line no-undef
const {Navbar, Button} = ReactBootstrap

class Footer extends Base {

  render() {
    return (
      <Navbar
        fixed="bottom"
              bg="dark" expand="lg" className="d-flex justify-content-between navbar navbar-expand-lg navbar-light px-0 sticky">
        <div id={'footer'} className={'centered'} style={{width: '100%'}}>
          <div className={'centered'}>
              (c) 2021 <Ab label={`'ndujaLabs`} link={'https://ndujalabs.com'}/>{' | '}
              <a className="item" target="_blank" href="https://twitter.com/offficiallly" rel="noreferrer">
                <i className="fab fa-twitter" /> <span className="roboto300">Twitter</span>
              </a>
              <a className="item"
                 href={'https://discord.gg/tSVtRkppnp'}
                 rel="noreferrer">
                <i className="fab fa-discord" /> <span className="roboto300">Discord</span>
              </a>
              {' '}
              <span className={'noMobile'}>| This website uses 🍺s not 🍪s</span>
          </div>

        </div>
      </Navbar>
    )
  }
}

module.exports = Footer
