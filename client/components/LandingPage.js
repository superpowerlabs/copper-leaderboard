// eslint-disable-next-line no-undef
import Loading from "./lib/Loading";
import NFTs from "./NFTs";
import Leaderboard from "./Leaderboard";
import Progressbar from "./ProgressBar";
import Button from "./BuySynbtn";

const { Container } = ReactBootstrap;
// eslint-disable-next-line no-undef
const { Redirect } = ReactRouterDOM;
const progress_now = 25;
// eslint-disable-next-line no-undef
export default class LandingPage extends React.Component {
  componentDidMount() {
    // window.location = 'https://syn.city'
  }

  links() {
    const baseUri = `https://syn-city-nfts.s3.us-east-2.amazonaws.com/arg2-images/`;
    const images =
      "step1-hqimage.png,step2-royimage.png,step3-devanshimage.png,step4-zhiminimage.png,step5-sullofimage.png".split(
        ","
      );
    const rows = [];
    for (let i = 0; i < 5; i++) {
      rows.push(
        <div>
          <br style={{ clear: "both" }} />
          <div key={"key" + Math.random()} className={"thumbs"}>
            <img src={baseUri + images[i]} />
          </div>
          <div className={"thumbsLabel"}>Image #{i + 1}</div>
        </div>
      );
    }
    return rows;
  }

  render() {
    return (
      <div>
        <Container className={"topContainer"}>
          <div className={"yellowLogo"}>
            <img src={"/images/yellowLogo.png"} alt={"logo"} />
          </div>
          {
            //<div className={'centered imgLogo'}><img src={'/images/syn-city-large.png'} alt={'Syn City logo'}/></div>
          }
          <NFTs />
          <div className="App">
            <p>
              <div classname="progressBarComplete">
                <h4 className="progressBarAddress">You:address placeholder</h4>
                <div className="progressBar">
                  <div className="progressBar2">
                    <Progressbar
                      bgcolor="yellow"
                      progress={progress_now}
                      height={40}
                    />
                  </div>
                  <div className="buySYNbtn2">
                    <Button classname="buySYNbtn" text="BUY $SYN" />
                  </div>
                </div>
              </div>
            </p>
          </div>

          <br style={{ clear: "both" }} />
        </Container>
        <Leaderboard />
      </div>
    );
  }
}
