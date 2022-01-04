// eslint-disable-next-line no-undef
import NFTs from "./NFTs";
import Leaderboard from "./Leaderboard";
import MyProgressbar from "./MyProgressBar";
import Button from "./BuySynbtn";
import Base from "./Base";

// eslint-disable-next-line no-undef
const { Container } = ReactBootstrap;
// const progress_now = 25;

// eslint-disable-next-line no-undef

export default class LandingPage extends Base {
  componentDidMount() {
    // window.location = 'https://syn.city'
    // this.getwallet();
  }

  // async getwallet() {
  //   const wallet = await ethereum.request({ method: "eth_requestAccounts" });
  //   this.setState({ address: wallet[0] });
  // }

  links() {
    const baseUri =
      "https://syn-city-nfts.s3.us-east-2.amazonaws.com/arg2-images/";
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
        <Container>
          <div className={"centered"}>
            <div className={"inside"}>
              <div className={"yellowLogo"}>
                <img src={"/images/yellowLogo.png"} />
              </div>
              <div className={"topsynnersLogo"}>
                <img src={"/images/topSinners.png"} />
              </div>
              <div className={"home-section centered"}>
                <div className={"landingpageText"}>
                  We believe in rewarding our community, especially the early
                  supporters, which is why we have decided to reward our early
                  supporters with exclusive "Original SYNNER" NFTs to the top
                  contributors during our launch auction!
                </div>
              </div>

              <NFTs />
              <div className="App">
                <div className="progressBarComplete">
                  <div className="progressBarAddress">
                    You:address placeholder
                  </div>
                </div>
              </div>

              <br style={{ clear: "both" }} />

              <Leaderboard Store={this.Store} setStore={this.setStore} />
              <div className="foot">
                <img src={"/images/yellowLogo.png"} alt={"footer"} />
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}
