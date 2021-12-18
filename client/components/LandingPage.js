// eslint-disable-next-line no-undef
import Loading from './lib/Loading'

const {Container} = ReactBootstrap
// eslint-disable-next-line no-undef
const {Redirect} = ReactRouterDOM
// eslint-disable-next-line no-undef
export default class LandingPage extends React.Component {

  componentDidMount() {
    // window.location = 'https://syn.city'
  }

  links() {
    const baseUri = `https://syn-city-nfts.s3.us-east-2.amazonaws.com/arg2-images/`
    const images = 'step1-hqimage.png,step2-royimage.png,step3-devanshimage.png,step4-zhiminimage.png,step5-sullofimage.png'.split(',')
    const rows = []
    for (let i = 0; i < 5; i++) {
      rows.push(<div>
        <br style={{clear: 'both'}} />
        <div key={'key' + Math.random()} className={'thumbs'}>
          <img src={baseUri + images[i]}/>
        </div>
        <div className={'thumbsLabel'}>Image #{i + 1}</div>
      </div>)
    }
    return rows
  }

  render() {

    // if (window.location.hostname === 'nft.syn.city') {


      return (<div>
        <Container className={'topContainer'}>
          <Loading/>
          {/*<div className={'centered imgLogo'}><img src={'/images/syn-city-large.png'} alt={'Syn City logo'}/></div>*/}
          {/*<div className={'home-section centered'}>*/}
          {/*  <h3 className={'notTooLarge'}>This website is for service only.<br/>The ARG components have been moved to <Ab label={'arg.syn.city'} link={'https://arg.syn.city'}/></h3></div>*/}
        </Container>
      </div>)

    // }

    // return (<div>
    //     <Container className={'topContainer'}>
    //       <div className={'centered imgLogo'}><img src={'/images/syn-city-large.png'} alt={'Syn City logo'}/></div>
    //       <div className={'home-section centered'}>
    //         <h1 className={'notTooLarge'}>You were told once before,<br/>now we repeat and pay attention</h1>
    //         <div>
    //           {this.links()}
    //         </div>
    //       </div>
    //       <br style={{clear: 'both'}} />
    //       <div className={'haveFun'}><h1 className={'centered'}>Have fun!</h1></div>
    //     </Container>
    //   </div>
    // )
  }
}
