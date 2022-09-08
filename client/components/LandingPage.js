import React from "react";
// eslint-disable-next-line no-undef
import NFTs from "./NFTs";
import Leaderboard from "./Leaderboard";
// import MyProgressbar from "./MyProgressBar";
// import Button from "./BuySynbtn";
import Base from "./Base";
import Ab from "./lib/Ab";
import Logo from "./lib/Logo";
import { isSynCity } from "../config";

// eslint-disable-next-line no-undef
import { Container, Row, Col } from "react-bootstrap";
// const progress_now = 25;

// eslint-disable-next-line no-undef

export default class LandingPage extends Base {
  constructor(props) {
    super(props);

    // eslint-disable-next-line no-undef
    this.blockdiv = React.createRef();
  }

  componentDidMount() {
    this.setStore({
      blockDiv: this.blockdiv.current.offsetWidth - 24 + "px",
    });

    // console.log(this.Store.blockDiv);
  }

  // async getWallet() {
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
        <Container style={{ marginTop: 80 }}>
          <div className={"centered"}>
            <div className={"inside"}>
              <div className={"topsynnersLogo"}>
                <img src={"/images/topSinners.png"} />
              </div>
              <div className={"home-section centered"}></div>

              <Row className={"instructions"}>
                <Col xs={12} lg={2} ref={this.blockdiv}></Col>
                <Col xs={12} lg={8}>
                  <div className={"inInstructions"}>
                    <div className={"bold"}> How to get more info</div>
                    Visit {isSynCity ? "Syn City" : "Mobland"} Official Blog:
                    <br />
                    <Ab
                      label={"How to get $SYNR guide here"}
                      link={
                        "https://medium.com/@syncityhq/the-how-to-guide-for-syn-city-token-launch-auction-7d193c7bffce"
                      }
                    />
                  </div>
                </Col>

                <Col xs={12} lg={2}>
                  {/*<div className={"inInstructions"}>*/}
                  {/*  <div className={"bold"}> Campaign duration:</div>*/}
                  {/*  Starts on 21st Jan; 9 AM PST / 5 PM UTC*/}
                  {/*  <br />*/}
                  {/*  Ends on 24th Jan; 3 PM PST / 11 PM UTC*/}
                  {/*</div>*/}
                </Col>
              </Row>

              <NFTs Store={this.Store} setStore={this.setStore} />

              <br style={{ clear: "both" }} />
              <div className={"endResults"}>FINAL RESULTS</div>

              <Leaderboard Store={this.Store} setStore={this.setStore} />
              {this.isMobile() ? null : (
                <div className="foot">
                  <Logo />
                </div>
              )}

              <div className="CopyRight">
                {this.isMobile() ? (
                  <span>
                    <a
                      href={"https://discord.gg/tSVtRkppnp"}
                      style={{ color: "yellow" }}
                      rel="noreferrer"
                    >
                      <i
                        className="fab fa-discord"
                        style={{ color: "yellow" }}
                      />
                    </a>
                    <a
                      href="https://t.me/MobLandAnnouncements"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-telegram" />
                    </a>
                    <a
                      href="https://twitter.com/MobLandHQ"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-twitter" />
                    </a>
                  </span>
                ) : null}
                (c) 2022, {isSynCity ? "Syn City" : "Mobland"}
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}
