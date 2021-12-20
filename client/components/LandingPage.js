// eslint-disable-next-line no-undef
import Loading from './lib/Loading'
import NFTs from './NFTs'
<<<<<<< HEAD
import Progressbar from './ProgressBar'
import Button from './BuySynbtn'

const progress_now = 25

=======
import leader from "./leaderboard"
import Leaderboard from './leaderboard'
import { render } from 'react-dom';
>>>>>>> d1c6498da049b7775a5c6ae7075772e5d07f7948
const {Container} = ReactBootstrap
// eslint-disable-next-line no-undef
const {Redirect} = ReactRouterDOM
// eslint-disable-next-line no-undef
export default class LandingPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [{name: "Tj", score: 1},
              {name: "Chris", score: 69},
              {name: "Dave", score: 17},
              {name: "Ben", score: 11},
              {name: "Caty", score: 21},
              {name: "Miller", score: 33},
              {name: "Zack", score: 88},
              {name: "Sam", score: 42},
              {name: "Nicky", score: 22},
              {name: "Cheyenne", score: 55},
              {name: "Adela", score: 72},
              {name: "Wongo", score: 35},
              {name: "Brett", score: 98},
              {name: "Gina", score: 4},
              {name: "Allen", score: 7},
              {name: "Matt", score: 46},
              {name: "Amanda", score: 31},
              {name: "Jamie", score: 100},
              {name: "Sarah", score: 56},
              {name: "Owen", score: 45}],
      paginate: 100
    };
  }

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


    return (<div>
<<<<<<< HEAD
        <Container className={'topContainer'}>
          <div className={'yellowLogo'}><img src={'/images/yellowLogo.png'} alt={'logo'}/></div>
          {//<div className={'centered imgLogo'}><img src={'/images/syn-city-large.png'} alt={'Syn City logo'}/></div>
          }
            <NFTs/>
            <div className="App">
              <p>
                <div classname="progressBarComplete">
              <h4 className="progressBarAddress">You:address placeholder</h4>
            <div className="progressBar">
                <Progressbar bgcolor="yellow" progress={progress_now} height={40} />
                <Button classname="buySYNbtn" text="BUY $SYN"/>
                </div>
            </div>
            </p>
            </div>

          <br style={{clear: 'both'}} />
          <div className={'haveFun'}><h1 className={'centered'}>Have fun!</h1></div>
        </Container>
=======
      <Container className={'topContainer'}>
        <div className={'yellowLogo'}><img src={'/images/yellowLogo.png'} alt={'logo'} /></div>
        {//<div className={'centered imgLogo'}><img src={'/images/syn-city-large.png'} alt={'Syn City logo'}/></div>
        }
        <NFTs />

        <br style={{ clear: 'both' }} />
        <div className={'haveFun'}><h1 className={'centered'}>Have fun!</h1></div>

        <div className="leaderboard">
        <Leaderboard users={this.state.users} paginate={this.state.paginate}/>
>>>>>>> d1c6498da049b7775a5c6ae7075772e5d07f7948
      </div>
      </Container>
    </div>
    )
  }
}
