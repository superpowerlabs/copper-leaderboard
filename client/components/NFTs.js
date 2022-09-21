import React from "react";
// eslint-disable-next-line no-undef
import { Row, Col } from "react-bootstrap";
import Base from "./Base";

const top200 = "https://data.mob.land/assets/top200_2.gif";
const top100 = "https://data.mob.land/assets/top100_2.gif";
const top50 = "https://data.mob.land/assets/top50_2.gif";

// eslint-disable-next-line no-undef
export default class NFTs extends Base {
  render() {
    return (
      <Row className={"nftLogos bold"}>
        <Col xs={12} lg={4}>
          <div className={"videoContainer"}>
            <img src={top200} />
          </div>
          <div className={"topRow centered"}>
            <span className={"nftTextBronze"}>Top 101-200 </span>
            <span className={"nftText"}>reward:</span>
          </div>
          <b className={"boldNFT centered"}>ORIGINAL SYNNER BRONZE</b>
        </Col>

        <Col xs={12} lg={4}>
          <div className={"videoContainer"}>
            <img src={top100} />
          </div>
          <div className={"topRow centered"}>
            <span className={"nftTextSilver"}>Top 51-100 </span>
            <span className={"nftText"}>reward:</span>
          </div>
          <b className={"boldNFT centered"}>ORIGINAL SYNNER SILVER</b>
        </Col>
        <Col xs={12} lg={4}>
          <div className={"videoContainer"}>
            <img src={top50} />
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
