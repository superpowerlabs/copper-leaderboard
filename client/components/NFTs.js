import React from "react";
// eslint-disable-next-line no-undef
import { Row, Col } from "react-bootstrap";
import Base from "./Base";

import top200 from "../../public/videos/top200_2.gif";
import top100 from "../../public/videos/top100_2.gif";
import top50 from "../../public/videos/top50_2.gif";

// eslint-disable-next-line no-undef
export default class NFTs extends Base {
  render() {
    return (
      <Row className={"nftLogos bold"}>
        <Col xs={12} lg={4}>
          <div className={"videoContainer"}>
            <img
              src={top200}
              width={this.Store.blockDiv}
              height={this.Store.blockDiv}
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
            <img
              src={top100}
              width={this.Store.blockDiv}
              height={this.Store.blockDiv}
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
            <img
              src={top50}
              width={this.Store.blockDiv}
              height={this.Store.blockDiv}
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
