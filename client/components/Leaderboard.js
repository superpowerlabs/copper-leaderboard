// eslint-disable-next-line no-undef
// const { ProgressBar } = ReactBootstrap;
import { ethers } from "ethers";
import ERC20abi from "../config/ERC20abi.json";
import Base from "./Base";
import MyProgressbar from "./MyProgressBar";
import Button from "./BuySynbtn";

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

    this.bindMany([
      "getInvestments",
      "rankingsorter",
      // "newsorter",
      "newleaderboard",
      "getNewEvents",
    ]);
    this.state = {
      ranking: [],
      asc: false,
      alph: false,
      page: 1,
      pageMax: 1,
      users: [],
      address: "",
      progress_now: 27,
      paginate: 200,
      metamask: true,
    };
  }

  componentDidMount() {
    this.getInvestments();
    this.getwallet();
    this.getNewEvents();
  }

  async getposition() {
    const position = this.state.users.map(({ name }) => name);
    for (var j = 0; j < position.length; j++) {
      if (position[j].toLowerCase() === this.state.address.toLowerCase()) {
        if (this.state.users[j].rank === 1) {
          this.setState({ progress_now: 100 });
          {
            break;
          }
        } else {
          const ranking = this.state.users[j].rank;
          let progress = Math.abs(ranking / 2 - 100);
          this.setState({ progress_now: progress });
          {
            break;
          }
        }
      }
    }
  }

  async getwallet() {
    /* eslint-disable */
    const wallet = await ethereum.request({ method: "eth_requestAccounts" });
    this.setState({ address: wallet[0] });
    this.getposition();
  }

  async getInvestments() {
    const state_user = [];
    let dict = {};
    let total = 0;
    const res = await this.request("investments");
    const wallets = res.investments.map(({ wallet }) => wallet);

    const address = wallets.filter(onlyUnique);
    for (var z = 0; z <= address.length; z++) {
      for (var x = 0; x < res.investments.length; x++) {
        if (address[z] === res.investments[x].wallet) {
          total += res.investments[x].amount;
        }
        if (x + 1 === res.investments.length) {
          if (total <= 0) {
            total = 0;
            {
              break;
            }
          }
          dict = { name: address[z], score: total };
          state_user.push(dict);
          total = 0;
          {
            break;
          }
        }
      }
    }
    this.setState({ users: state_user });
    for (var u = 0; u < state_user.length; u++) {
      this.state.users[u].score = addSomeDecimals(this.state.users[u].score);
    }
    this.rankingsorter();

    // for (var i = 0; i < res.investments.length; i++) {
    //   dict = { name: wallets[i], score: amounts[i] };
    //   state_user.push(dict);
    // }

    // this.setState({ users: state_user });
    // this.rankingsorter();
  }

  /**
   * @function componentDidMount
   * @desc Sorts users by score then adds a ranking key to each user object when the component loads. Then sets the ranking state
   */

  rankingsorter() {
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
    console.log(ranking);
    ranking.map((user, index) => (user.rank = index + 1));
    ranking.map(
      (user, index) => (user.page = Math.ceil((index + 1) / paginate))
    );
    this.setState({ pageMax: ranking[ranking.length - 1].page });
    this.setState({ ranking: ranking });
  }

  async getNewEvents() {
    //await this.waitForWeb3();
    if (typeof window.ethereum !== "undefined") {
      this.setState({ metamask: true });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("Starting Listener");
      const CONTRACT_ADDRESS = "0x0f65a9629ae856a6fe3e8292fba577f478b944e0";

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ERC20abi,
        //this.Store.provider
        provider
      );

      contract.on([contract.filters.Swap()], async (event) => {
        if (event.topics.length === 4) {
          let syn = ethers.utils.formatEther(event.data);
          let wallet = ethers.utils.defaultAbiCoder.decode(
            ["address"],
            event.topics[event.topics.length - 1]
          )[0];
          if (event.topics[1] === event.topics[3]) {
            console.log("sell");
            wallet = ethers.utils.defaultAbiCoder.decode(
              ["address"],
              event.topics[event.topics.length - 2]
            )[0];
            syn = -syn;
          }
          const hash = event.transactionHash;
          //console.log(event)
          const stateUser = this.state.users;
          let dict = { name: wallet, score: syn };
          this.newleaderboard(dict);
        }
      });
    } else {
      console.log("please Connect to meta mask");
      this.setState({ metamask: false });
    }
  }

  newleaderboard(u) {
    let state_user = this.state.users;
    for (var j = 0; j < state_user.length; j++) {
      if (u["name"] === state_user[j].name) {
        state_user[j].score = Number(u["score"]) + Number(state_user[j].score);
      }
    }
    this.setState({ users: state_user });
    this.rankingsorter();
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
                  <td className="rank-header sortScore"> Rank </td>
                  <td className="rank-header sortAlpha"> Address </td>
                  <td className="rank-header sortTotal"> Amount </td>
                </tr>
                <tr>
                  <td colSpan="4">
                    <div className="stats">
                      <table>
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
