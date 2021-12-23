// eslint-disable-next-line no-undef
const { Container } = ReactBootstrap;

// eslint-disable-next-line no-undef
export default class NFTs extends React.Component {
  render() {
    return (
      <div>
        <Container className={"topContainer"}>
          <div className={"topsynnersLogo"}>
            <img src={"/images/topSinners.png"} alt={"logo"} />
          </div>
          <div className={"home-section centered"}>
            <h1 className={"landingpageText"}>
              We believe in rewarding our community, especially the early
              supporters, which is why we have decided to reward our early
              supporters with exclusive "Original SYNNER" NFTs to the top
              contributors during our launch auction!
            </h1>
          </div>
          <div>
            <div className={"nftLogos"}>
              <div className={"nftLogo1"}>
                <img src={"/images/NFT01.png"} alt={"logo"} />
                <div className={"nftTextFlex"}>
                  <h1 className={"nftTextGold"}>Top 50 </h1>
                  <h1 className={"nftText"}>reward:</h1>
                </div>
                <b className={"boldNFT"}>ORIGINAL SYNNER CEO</b>
              </div>
              <div className={"nftLogo2"}>
                <img src={"/images/NFT02.png"} alt={"logo"} />
                <div className={"nftTextFlex"}>
                  <h1 className={"nftTextSilver"}>Top 51-100 </h1>
                  <h1 className={"nftText"}>reward:</h1>
                </div>
                <b className={"boldNFT"}>ORIGINAL SYNNER GUNMAN</b>
              </div>
              <div className={"nftLogo3"}>
                <img src={"/images/NFT03.png"} alt={"logo"} />
                <div className={"nftTextFlex"}>
                  <h1 className={"nftTextBronze"}>Top 101-200 </h1>
                  <h1 className={"nftText"}>reward:</h1>
                </div>
                <b className={"boldNFT"}>ORIGINAL SYNNER WEAPON</b>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}
