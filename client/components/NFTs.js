

const {Container} = ReactBootstrap
// eslint-disable-next-line no-undef
const {Redirect} = ReactRouterDOM
// eslint-disable-next-line no-undef
export default class NFTs extends React.Component {

  render() {
    return (<div>
        <Container className={'topContainer'}>
        <div className={'topsynnersLogo'}><img src={'/images/topSinners.png'} alt={'logo'}/></div>
          <div className={'home-section centered'}>
            <h1 className={'landingpageText'}>We believe in rewarding our community, especially the early supporters, which is why we have decided to reward our early supporters with exclusive "Original SYNNER" NFTs to the top contributors during our launch auction!</h1>
          </div>
          <div>
          <div className={'nftLogo'}>
              <div>
              <img src={'/images/NFT01.png'} alt={'logo'}/>
              <h1 className={'nftText'}>Top 50 reward:</h1>

              </div>
              <img src={'/images/NFT02.png'} alt={'logo'}/>
              <img src={'/images/NFT03.png'} alt={'logo'}/>
              </div>
          </div>
        </Container>
      </div>
    )
  }
}
