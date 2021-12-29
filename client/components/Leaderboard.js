// eslint-disable-next-line no-undef
// const { ProgressBar } = ReactBootstrap;

import Base from "./Base";
import { StrictMode, useState } from "react";

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
      paginate: 100,
    };
  }

  componentDidMount() {
    this.getInvestments();
  }

  async getInvestments() {
    const state_user = [];
    let dict = {};
    const res = await this.request("investments");
    const wallets = res.investments.map(({ wallet }) => wallet);
    const amounts = res.investments.map(({ amount }) => amount);

    for (var i = 0; i < res.investments.length; i++) {
      dict = { name: wallets[i], score: amounts[i] };
      state_user.push(dict);
    }

    this.setState({ users: state_user });
    this.rankingsorter();

    if (res.success) {
      this.setStore({
        investments: res.investments,
      });
    }
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
    );
  }
}
