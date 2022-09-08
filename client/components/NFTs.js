import React from "react";
import VideoLooper from "react-video-looper";
// eslint-disable-next-line no-undef
import { Row, Col } from "react-bootstrap";
import Base from "./Base";

// eslint-disable-next-line no-undef
export default class NFTs extends Base {
  render() {
    return (
      <Row className={"nftLogos bold"}>
        <Col xs={12} lg={4}>
          <div className={"videoContainer"}>
            <VideoLooper
              source={"https://data.mob.land/assets/top200_2.mp4"}
              start={0}
              end={25}
              width={this.Store.blockDiv}
              height={this.Store.blockDiv}
              autoPlay={true}
              loopCount={100}
            />
          </div>
          <div className={"topRow centered"}>
            <span className={"nftTextBronze"}>Top 101-200 </span>
            <span className={"nftText"}>reward:</span>
          </div>
          <b className={"boldNFT centered"}>ORIGINAL SYNNER BRONZE</b>
        </Col>

        <Col xs={12} lg={4}>
          <div className={"videoContainer"}>
            <VideoLooper
              source={"https://data.mob.land/assets/top100_2.mp4"}
              start={0}
              end={25}
              width={this.Store.blockDiv}
              height={this.Store.blockDiv}
              autoPlay={true}
              loopCount={100}
            />
          </div>
          <div className={"topRow centered"}>
            <span className={"nftTextSilver"}>Top 51-100 </span>
            <span className={"nftText"}>reward:</span>
          </div>
          <b className={"boldNFT centered"}>ORIGINAL SYNNER SILVER</b>
        </Col>
        <Col xs={12} lg={4}>
          <div className={"videoContainer"}>
            <VideoLooper
              source={"https://data.mob.land/assets/top50_2.mp4"}
              start={0}
              end={25}
              width={this.Store.blockDiv}
              height={this.Store.blockDiv}
              autoPlay={true}
              loopCount={100}
            />
          </div>
          <div className={"topRow centered"}>
            <span className={"nftTextGold"}>Top 50 </span>
            <span className={"nftText"}>reward:</span>
          </div>
          <b className={"boldNFT centered"}>ORIGINAL SYNNER GOLD</b>
        </Col>
      </Row>
    );
  }
}
