// eslint-disable-next-line no-undef
// const { ProgressBar } = ReactBootstrap;
import { ethers } from "ethers";
import Base from "./Base";
import MyProgressbar from "./MyProgressBar";
import Button from "./BuySynbtn";
import Address from "../utils/Address";
import { contracts, abi } from "../config";
import { add } from "lodash";
const superagent = require('superagent');

function copperlaunch() {
  window.open(
    "https://kovan.copperlaunch.com/auctions/0xfCD2895e8702CCa5bd69b2df300D78ab5717514E"
  );
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
 * @param {Prop} users-an array of objects with name and score properties
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
      metamask: true,
    };

    this.bindMany([
      "getInvestments",
      "rankingSorter",
      // "newsorter",
      "newleaderboard",
      "getNewEvents",
      "getPosition",
    ]);
  }

  componentDidMount() {
    this.getInvestments();
    this.setTimeout(this.getPosition, 3000);
    // this.new_query();
  }

  async getPosition() {
    const position = this.state.users.map(({ name }) => name);
    for (let j = 0; j < position.length; j++) {
      if (Address.equal(position[j], this.Store.connectedWallet)) {
        if (this.state.users[j].rank === 1) {
          this.setState({ progress_now: 100 });
        } else {
          const ranking = this.state.users[j].rank;
          let progress = Math.abs(ranking / 3 - 100);
          this.setState({ progress_now: progress });
        }
        break;
      }
    }
    this.setState({
      previousConnectedAddress: this.Store.connectedWallet,
    });
  }

  //
  // async getWallet() {
  //   /* eslint-disable */
  //   // const wallet = await ethereum.request({ method: "eth_requestAccounts" });
  //   // this.setState({ address: wallet[0] });
  //   this.getPosition();
  // }

//   async new_query() {
//     const query = 
//     { query : ` {
//       buys: swaps( where: {tokenOutSym: "SYN"})  {
//        userAddress {
//          id
//        }
//         tokenAmountOut
//         tx
//       }
//         sells: swaps( where: {tokenInSym: "SYN"} ) {
//        userAddress {
//          id
//        }
//         tokenAmountIn
//         tx
//       }
//     }`
//     }
// const url = 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-kovan-v2'
// const res = await superagent.post(url).send(query)
// for(let i = 0 ; i < res.body.data.buys.length; i++)
// {
//   console.log(res.body.data.buys[i])
//   const amount = res.body.data.buys[i].tokenAmountOut;
//   const name = res.body.data.buys[i].userAddress.id;
// }
//   }

  async getInvestments() {
    const state_user = [];
    let dict = {};
    let total = 0;
    let buys = 0;
    let sells = 0;
    const query = 
    { query : ` {
      swaps( where: {poolId: "0x6a8c729c9db35c9c5b4ffcbc533aae265c37d8820002000000000000000005c7"}, orderBy: timestamp) {
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
    `
    }
const url = 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-kovan-v2'
const res = await superagent.post(url).send(query)
      const wallets = res.body.data.swaps.map(({ userAddress }) => userAddress);
      let address = wallets.map(({ id }) => id);
      address = address.filter(onlyUnique);
      for (var x = 0; x < address.length; x++) {
        for (var y = 0; y < res.body.data.swaps.length; y++) {
          if (address[x] === res.body.data.swaps[y].userAddress.id) {
            if (res.body.data.swaps[y].tokenInSym === "USDC") {
            buys += Number(res.body.data.swaps[y].tokenAmountOut);
            }
           else {
            sells += Number(res.body.data.swaps[y].tokenAmountIn);
            }
          }
        }
        total = buys - sells;
        if (total > 0) {
        dict = {name: address[x], score: total}
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
      // console.log(this.Store.chainId);
      this.rankingSorter();
      this.getPosition();
      this.getNewEvents();

      // for (var i = 0; i < res.investments.length; i++) {
      //   dict = { name: wallets[i], score: amounts[i] };
      //   state_user.push(dict);
      // }

      // this.setState({ users: state_user });
      // this.rankingSorter();
      var intervalID = setInterval(this.getInvestments, 3000);
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
    // console.log(ranking);
    ranking.map((user, index) => (user.rank = index + 1));
    ranking.map(
      (user, index) => (user.page = Math.ceil((index + 1) / paginate))
    );
    this.setState({ pageMax: ranking[ranking.length - 1].page });
    this.setState({ ranking: ranking });
  }

  async getNewEvents() {
    await this.waitForWeb3();
    this.setState({ metamask: true });
    if (!contracts[this.Store.chainId]) {
      return false;
    }
    const contract = new ethers.Contract(
      contracts[this.Store.chainId],
      abi,
      this.Store.provider
    );
    contract.on([contract.filters.Swap()], async (event) => {
      if (event.topics.length === 4) {
        let syn = ethers.utils.formatEther(event.data);
        let wallet = ethers.utils.defaultAbiCoder.decode(
          ["address"],
          event.topics[event.topics.length - 1]
        )[0];
        if (event.topics[1] === event.topics[3]) {
          // console.log("sell");
          wallet = ethers.utils.defaultAbiCoder.decode(
            ["address"],
            event.topics[event.topics.length - 2]
          )[0];
          syn = -syn;
        }
        // const hash = event.transactionHash;
        //console.log(event)
        // const stateUser = this.state.users;
        let dict = { name: wallet, score: syn };
        this.newleaderboard(dict);
      }
    });
  }

  newleaderboard(u) {
    let state_user = this.state.users;
    for (var j = 0; j < state_user.length; j++) {
      if (u["name"] === state_user[j].name) {
        state_user[j].score = Number(u["score"]) + Number(state_user[j].score);
      }
    }
    this.setState({ users: state_user });
    this.rankingSorter();
  }

  /**
   * @function render
   * @desc renders jsx
   */
  render() {
    if (!this.state.metamask) {
      return <div className="notConnectedTxt">Please Connect to Metamask</div>;
    } else {
      return (
        <div>
          <div className="App">
            <div className="progressBarComplete">
              <div>
                <div className="progressBar">
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
                      text="BUY $SYN"
                      onClick={copperlaunch}
                    />
                  </div>
                </div>
                <div className="bars1">
                  <div className="Top200">
                    <div className="Top200bar"></div>
                    Top 200
                  </div>
                  <div className="Top100">
                    <div className="Top100bar"></div>
                    Top 100
                  </div>
                  <div className="Top50">
                    <div className="Top50bar"></div>
                    Top 50
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="parent">
            <table id="lBoard">
              <tbody className="ranking">
                <tr>
                  <td className="rank-header sortScore"> Rank</td>
                  <td className="rank-header sortAlpha"> Address</td>
                  <td className="rank-header sortTotal"> Amount</td>
                </tr>
                <tr>
                  <td colSpan="4">
                    <div className="stats">
                      <table>
                        <tbody>
                          {this.state.ranking.map((user, index) => (
                            <tr className="ranking" key={index}>
                              {user.page === this.state.page ? (
                                <td className="data">{user.rank}</td>
                              ) : null}
                              {user.page === this.state.page ? (
                                <td className="data">{user.name}</td>
                              ) : null}
                              {user.page === this.state.page ? (
                                <td className="data lastData">{user.score}</td>
                              ) : null}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
}
