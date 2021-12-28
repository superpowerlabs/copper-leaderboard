
// eslint-disable-next-line no-undef
export default class NFTs extends React.Component {
  render() {
    return (
      <div>
        <div>
          <div className={"nftLogos bold"}>
            <div className={"centered "}>
              <img src={"/images/NFTleft.png"} alt={"logo"} />
              <div className={"topRow centered"}>
                <span className={"nftTextGold"}>Top 50 </span>
                <spam className={"nftText"}>reward:</spam>
              </div>
              <b className={"boldNFT centered"}>ORIGINAL SYNNER CEO</b>
            </div>
            <div className={"centered"}>
              <img src={"/images/NFTcenter.png"} alt={"logo"} />
              <div className={"topRow centered"}>
                <span className={"nftTextSilver"}>Top 51-100 </span>
                <span className={"nftText"}>reward:</span>
              </div>
              <b className={"boldNFT centered"}>ORIGINAL SYNNER GUNMAN</b>
            </div>
            <div className={"centered"}>
              <img src={"/images/NFTright.png"} alt={"logo"} />
              <div className={"topRow centered"}>
                <span className={"nftTextBronze"}>Top 101-200 </span>
                <span className={"nftText"}>reward:</span>
              </div>
              <b className={"boldNFT centered"}>ORIGINAL SYNNER WEAPON</b>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
