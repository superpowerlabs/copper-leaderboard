

const {Container} = ReactBootstrap
// eslint-disable-next-line no-undef
const {Redirect} = ReactRouterDOM
// eslint-disable-next-line no-undef
export default class NFTs extends React.Component {

  render() {
    return (<div>
        <Container className={'topContainer'}>
        <div className={'yellowLogo'}><img src={'/images/yellowLogo.png'} alt={'logo'}/></div>
          <div className={'home-section centered'}>
            <h1 className={'notTooLarge'}>CACAPOPO</h1>
          </div>
        </Container>
      </div>
    )
  }
}
