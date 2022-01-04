// eslint-disable-next-line no-undef
// const { ProgressBar } = ReactBootstrap;
//import * as Web3 from "web3";
//const Web3 = require("web3");
import Web3 from "web3";
import ERC20abi from "../config/ERC20abi.json";
import Base from "./Base";
import MyProgressbar from "./MyProgressBar";
import Button from "./BuySynbtn";

/**
 * @class Leaderboard
 * @desc Compares the score property of each user object
 * @param {Prop} users-an array of objects with name and score properties
 * @param {Prop} paginate-integer to determine how many users to display on each page
 */
export default class Leaderboard extends Base {
  constructor(props) {
    super(props);

    this.bindMany(["getInvestments", "filterRank", "rankingsorter"]);
    this.state = {
      ranking: [],
      asc: false,
      alph: false,
      page: 1,
      pageMax: 1,
      users: [],
      address: "",
      progress_now: 0,
      paginate: 200,
    };
  }

  componentDidMount() {
    this.getInvestments();
    this.getwallet();
  }

  async getposition() {
    const position = this.state.users.map(({ name }) => name);
    for (var j = 0; j < position.length; j++) {
      if (position[j] === this.state.users[j].rank) {
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
    let z = 0;
    let total = 0;
    const res = await this.request("investments");
    const wallets = res.investments.map(({ wallet }) => wallet);
    const amounts = res.investments.map(({ amount }) => amount);

    wallets.sort();
    console.log(wallets);

    for (var x = 0; x < res.investments.length; x++) {
      z = x;
      total += amounts[x];
      while (wallets[z] === wallets[z + 1]) {
        total += amounts[z + 1];
        z++;
      }
      dict = { name: wallets[x], score: total };
      state_user.push(dict);
      total = 0;
      x = z + 1;
    }
    this.setState({ users: state_user });
    this.rankingsorter();

    // for (var i = 0; i < res.investments.length; i++) {
    //   dict = { name: wallets[i], score: amounts[i] };
    //   state_user.push(dict);
    // }

    // this.setState({ users: state_user });
    // this.rankingsorter();

    if (res.success) {
      this.setStore({
        investments: res.investments,
      });
    }
    return wallets;
  }

  /**
   * @function componentDidMount
   * @desc Sorts users by score then adds a ranking key to each user object when the component loads. Then sets the ranking state
   */

  rankingsorter() {
    const ranking = this.state.users;
    const paginate = this.state.paginate;
    ranking.sort(this.compareScore).reverse();
    ranking.map((user, index) => (user.rank = index + 1));
    ranking.map(
      (user, index) => (user.page = Math.ceil((index + 1) / paginate))
    );
    this.setState({ pageMax: ranking[ranking.length - 1].page });
    this.setState({ ranking: ranking });
  }

  /**
   * @function compareScore
   * @desc Compares the score property of each user object
   * @param {Object, Object} user
   */
  compareScore(a, b) {
    if (a.score < b.score) return -1;
    if (a.score > b.score) return 1;
    return 0;
  }

  getNewEvents() {
    console.log("Starting Listener");
    const web3 = new Web3(
      "wss://mainnet.infura.io/ws/v3/" + "a5d8ae5cf48e49269d71a5cf25289c0d"
    );
    //const web3 = new Web3(window.ethereum);
    //console.log(Web3.givenProvider);
    //console.log(web3);
    const CONTRACT_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const contract = new web3.eth.Contract(ERC20abi, CONTRACT_ADDRESS);
    contract.events
      .Transfer()
      .on("data", async (event) => {
        console.log(event);
        const hash = event.transactionHash;
        const wallet = event.returnValues.from;
        const etherValue = Web3.utils.fromWei(
          event.returnValues.value,
          "ether"
        );
        const state_user = this.state.users;
        let dict = { name: wallet, score: etherValue };
        state_user.push(dict);
        this.setState({ users: state_user });
        this.rankingsorter();
      })
      .on("error", console.error);
  }

  /**
   * @function filterRank
   * @desc Filters through the ranking to find matches and sorts all matches by score
   * @param {String} search input
   */
  filterRank(e) {
    const ranking = this.state.users;
    const paginate = this.state.paginate;
    const newRanking = [];
    const inputLength = e.target.value.length;
    for (var i = 0; i < ranking.length; i++) {
      const str = ranking[i].name.slice(0, inputLength).toLowerCase();
      if (str === e.target.value.toLowerCase()) {
        newRanking.push(ranking[i]);
      }
    }
    newRanking.sort(this.compareScore).reverse();
    newRanking.map(
      (user, index) => (user.page = Math.ceil((index + 1) / paginate))
    );
    this.setState({ ranking: newRanking });
    this.setState({ page: 1 });
    this.setState({ pageMax: newRanking[newRanking.length - 1].page });
  }

  /**
   * @function render
   * @desc renders jsx
   */
  render() {
    return (
      <div>
        <div className="App">
          <p>
            <div className="progressBarComplete">
              <h4 className="progressBarAddress">You: {this.state.address}</h4>
              <div className="progressBar">
                <div className="progressBar2">
                  <MyProgressbar
                    bgcolor="yellow"
                    progress={this.state.progress_now}
                    height={55}
                  />
                </div>
                <div className="buySYNbtn2">
                  <Button classname="buySYNbtn" text="BUY $SYN" />
                </div>
              </div>
            </div>
          </p>
        </div>
        <div className="parent">
          <table id="lBoard">
            <tbody className="ranking">
              <tr>
                <td colSpan="10000">
                  <h1>Auction</h1>
                </td>
              </tr>
              <tr>
                <td className="rank-header sortScore"> Rank </td>
                <td className="rank-header sortAlpha"> Address </td>
                <td className="rank-header"> Amount </td>
              </tr>
              {this.state.ranking.map((user, index) => (
                <tr className="ranking" key={index}>
                  {user.page === this.state.page ? (
                    <td className="data">{user.rank}</td>
                  ) : null}
                  {user.page === this.state.page ? (
                    <td className="data">{user.name}</td>
                  ) : null}
                  {user.page === this.state.page ? (
                    <td className="data">{user.score}</td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
