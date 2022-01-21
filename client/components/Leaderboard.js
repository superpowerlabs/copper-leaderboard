// eslint-disable-next-line no-undef
const { Row, Col, Badge } = ReactBootstrap;
import Base from "./Base";
import MyProgressbar from "./MyProgressBar";
import Button from "./BuySynbtn";
import Address from "../utils/Address";

const superagent = require("superagent");
import config from "../config/index";

function copperlaunch() {
  window.open(config.auctionUrl);
}

const addSomeDecimals = (s, c = 2) => {
  s = s.toString().split(".");
  s[1] = (s[1] || "").substring(0, c);
  s[1] = s[1] + "0".repeat(c - s[1].length);
  return s.join(".");
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

/**
 * @class Leaderboard
 * @desc Compares the score property of each user object
 * @param {Prop} users-an array of objects with address and score properties
 * @param {Prop} paginate-integer to determine how many users to display on each page
 */
export default class Leaderboard extends Base {
  constructor(props) {
    super(props);

    this.state = {
      ranking: [],
      asc: false,
      alph: false,
      page: 1,
      pageMax: 1,
      users: [],
      address: "",
      progress_now: 0,
      paginate: 300,
      myPosition: undefined,
    };

    this.bindMany([
      "getInvestments",
      "rankingSorter",
      // "newleaderboard",
      // "getNewEvents",
      "getPosition",
    ]);
  }

  componentDidMount() {
    this.getInvestments();
  }

  async getPosition() {
    const position = this.state.users.map(({ address }) => address);
    for (let j = 0; j < position.length; j++) {
      if (Address.equal(position[j], this.Store.connectedWallet)) {
        const myPosition = this.state.users[j].rank;
        this.setState({
          myPosition,
        });
        if (myPosition === 1) {
          this.setState({ progress_now: 100 });
        } else {
          let progress = Math.abs(myPosition / 3 - 100);
          this.setState({ progress_now: progress });
        }
        break;
      }
    }
    this.setState({
      previousConnectedAddress: this.Store.connectedWallet,
    });
    await this.sleep(500);
    this.getInvestments();
  }

  async getInvestments() {
    await this.waitForWeb3();
    const state_user = [];
    let dict = {};
    let total = 0;
    let buys = 0;
    let sells = 0;
    let poolId = "";
    if (this.Store.chainId === 42) {
      poolId = config.kovanPoolId;
    }
    if (this.Store.chainId === 1) {
      poolId = config.mainnetPoolId;
    }
    const query = {
      query: ` {
      swaps( where: {poolId: "${poolId}" }, orderBy: timestamp) {
        userAddress {
          id
        }
        tokenInSym
        tokenAmountIn
        tokenOutSym
        tokenAmountOut
        tx
      }
    }
    `,
    };
    let url = config.kovanUrl;
    if (this.Store.chainId === 42) {
      url = config.kovanUrl;
    }
    if (this.Store.chainId === 1) {
      url = config.mainnet;
    }
    const res = await superagent.post(url).send(query);
    const wallets = res.body.data.swaps.map(({ userAddress }) => userAddress);
    let address = wallets.map(({ id }) => id);
    address = address.filter(onlyUnique);
    for (var x = 0; x < address.length; x++) {
      for (var y = 0; y < res.body.data.swaps.length; y++) {
        if (address[x] === res.body.data.swaps[y].userAddress.id) {
          if (res.body.data.swaps[y].tokenInSym === "USDC") {
            buys += Number(res.body.data.swaps[y].tokenAmountOut);
          } else {
            sells += Number(res.body.data.swaps[y].tokenAmountIn);
          }
        }
      }
      total = buys - sells;
      if (total > 0) {
        dict = { address: address[x], score: total };
        state_user.push(dict);
      }
      total = 0;
      buys = 0;
      sells = 0;
    }

    this.setState({ users: state_user });
    for (var u = 0; u < state_user.length; u++) {
      this.state.users[u].score = addSomeDecimals(this.state.users[u].score);
    }
    this.rankingSorter();
    this.getPosition();
  }

  /**
   * @function componentDidMount
   * @desc Sorts users by score then adds a ranking key to each user object when the component loads. Then sets the ranking state
   */

  rankingSorter() {
    const ranking = this.state.users;
    const paginate = this.state.paginate;
    for (var x = 0; x < ranking.length; x++) {
      for (var y = 0; y < ranking.length; y++) {
        if (Number(ranking[x].score) > Number(ranking[y].score)) {
          let a = ranking[x];
          ranking[x] = ranking[y];
          ranking[y] = a;
        }
      }
    }
    ranking.map((user, index) => (user.rank = index + 1));
    ranking.map(
      (user, index) => (user.page = Math.ceil((index + 1) / paginate))
    );
    this.setState({ pageMax: ranking[ranking.length - 1].page });
    this.setState({ ranking: ranking });
  }

  /*
  <Col xs={2} lg={2} className="rank-header sortScore">Rank</Col>
  <Col xs={7} lg={7} className="rank-header sortAlpha">Address</Col>
  <Col xs={3} lg={3} className="rank-header sortTotal">Amount invested</Col>
  */

  renderRows() {
    const { ranking } = this.state;
    return ranking.map((user, index) => {
      return user.page === this.state.page ? (
        <Row
          key={"statsrow" + index}
          className={
            "noMargin" +
            (index === this.state.myPosition - 1 ? " highlight" : "")
          }
        >
          <Col xs={1} lg={2} className={"digit centered"} key={index}>
            #{user.rank}
          </Col>
          <Col xs={8} lg={7} className={"digit centered"}>
            {this.isMobile()
              ? this.ellipseAddress(user.address, 14)
              : user.address}
          </Col>
          <Col xs={3} lg={3} className={"digit alignRight"}>
            {user.score}
          </Col>
        </Row>
      ) : null;
    });
  }

  render() {
    const { connectedWallet, chainId } = this.Store;
    if (!connectedWallet) {
      return (
        <div className="notConnectedTxt">
          Please Connect your Wallet to access the leaderboard
        </div>
      );
    } else if (chainId !== 1 && this.Store.chainId !== 42) {
      return (
        <div className="notConnectedTxt">Please switch to Ethereum Mainnet</div>
      );
    } else {
      return (
        <div>
          {connectedWallet && this.state.users.length > 0 ? (
            <div className={"myPosition"}>
              {this.state.myPosition ? (
                <div>
                  Your ranking is{" "}
                  <Badge bg="warning" text="dark">
                    {this.state.myPosition}
                  </Badge>
                  <br />
                  <span style={{ fontSize: "80%" }}>
                    {this.state.myPosition === 1
                      ? "Get more $SYNR to consolidate your position"
                      : "Get more $SYNR to improve your position"}
                  </span>
                </div>
              ) : (
                "You are not in the leaderboard. Get $SYNR to get your NFT rewards"
              )}
            </div>
          ) : null}
          <div className="App">
            <div className="progressBarComplete">
              <div>
                <div className="progressBar1">
                  <div className="progressBar2">
                    <MyProgressbar
                      bgcolor="yellow"
                      progress={this.state.progress_now}
                      height={30}
                    />
                  </div>
                  <div className="buySYNbtn2">
                    <Button
                      classname="buySYNbtn"
                      text="Get $SYNR"
                      onClick={copperlaunch}
                    />
                  </div>
                  {/*</div>*/}
                  {/*<div className="bars1">*/}
                  {/*  <div className="Top200">*/}
                  {/*    <div className="Top200bar"></div>*/}
                  {/*    Top 200*/}
                  {/*  </div>*/}
                  {/*  <div className="Top100">*/}
                  {/*    <div className="Top100bar"></div>*/}
                  {/*    Top 100*/}
                  {/*  </div>*/}
                  {/*  <div className="Top50">*/}
                  {/*    <div className="Top50bar"></div>*/}
                  {/*    Top 50*/}
                  {/*  </div>*/}
                </div>
              </div>
            </div>
          </div>
          {this.state.users.length === 0 ? (
            <div className={"myPosition"}>
              The Copper Auction has not yet started
            </div>
          ) : (
            <div className="width100pc">
              <Row id="lBoard" className={"noMargin"}>
                <Col xs={1} lg={2} className="rank-header centered">
                  Rank
                </Col>
                <Col xs={8} lg={7} className="rank-header centered">
                  Address
                </Col>
                <Col xs={3} lg={3} className="rank-header alignRight">
                  Amount
                </Col>
              </Row>
              <div className="stats">{this.renderRows()}</div>
            </div>
          )}
        </div>
      );
    }
  }
}
