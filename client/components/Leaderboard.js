// eslint-disable-next-line no-undef
// const { ProgressBar } = ReactBootstrap;

import Base from "./Base";

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
      "sortUsersByScore",
      "sortUsersByName",
      "filterRank",
      "getInvestments",
    ]);

    this.state = {
      ranking: [],
      asc: false,
      alph: false,
      page: 1,
      pageMax: 1,
      users: [
        { name: "Tj", score: 1 },
        { name: "Chris", score: 69 },
        { name: "Dave", score: 17 },
        { name: "Ben", score: 11 },
        { name: "Caty", score: 21 },
        { name: "Miller", score: 33 },
        { name: "Zack", score: 88 },
        { name: "Sam", score: 42 },
        { name: "Nicky", score: 22 },
        { name: "Cheyenne", score: 55 },
        { name: "Adela", score: 72 },
        { name: "Wongo", score: 35 },
        { name: "Brett", score: 98 },
        { name: "Gina", score: 4 },
        { name: "Allen", score: 7 },
        { name: "Matt", score: 46 },
        { name: "Amanda", score: 31 },
        { name: "Jamie", score: 100 },
        { name: "Sarah", score: 56 },
        { name: "Owen", score: 45 },
      ],
      paginate: 100,
    };
  }

  componentDidMount() {
    this.rankingsorter();
    this.getInvestments();
  }

  async getInvestments() {
    const res = await this.request("investments");

    console.log(res);

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
   * @function compareName
   * @desc Compares the name property of each user object alphabetically
   * @param {Object, Object} user
   */
  compareName(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  }

  /**
   * @function sortUsersByScore
   * @desc Sorts the ranking by score either ascending or descending
   */
  sortUsersByScore() {
    const ranking = this.state.ranking;
    const paginate = this.state.paginate;
    if (this.state.asc === true) {
      ranking.sort(this.compareScore).reverse();
      ranking.map(
        (user, index) => (user.page = Math.ceil((index + 1) / paginate))
      );
      this.setState({ ranking: ranking });
      this.setState({ asc: false });
      this.setState({ alph: false });
    } else {
      ranking.sort(this.compareScore);
      ranking.map(
        (user, index) => (user.page = Math.ceil((index + 1) / paginate))
      );
      this.setState({ ranking: ranking });
      this.setState({ asc: true });
      this.setState({ alph: false });
    }
  }

  /**
   * @function sortUsersByName
   * @desc Sorts the ranking by name alphabetically either ascending or descending
   */
  sortUsersByName() {
    const ranking = this.state.ranking;
    const paginate = this.state.paginate;
    if (this.state.alph === true) {
      ranking.sort(this.compareName).reverse();
      ranking.map(
        (user, index) => (user.page = Math.ceil((index + 1) / paginate))
      );
      this.setState({ ranking: ranking });
      this.setState({ alph: false });
      this.setState({ asc: true });
    } else {
      ranking.sort(this.compareName);
      ranking.map(
        (user, index) => (user.page = Math.ceil((index + 1) / paginate))
      );
      this.setState({ ranking: ranking });
      this.setState({ alph: true });
      this.setState({ asc: true });
    }
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
                <h1>Leaderboard</h1>
              </td>
            </tr>
            <tr>
              <td
                className="rank-header sortScore"
                onClick={this.sortUsersByScore}
              >
                {" "}
                Rank{" "}
              </td>
              <td
                className="rank-header sortAlpha"
                onClick={this.sortUsersByName}
              >
                {" "}
                Name{" "}
              </td>
              <td className="rank-header" onClick={this.sortUsersByScore}>
                {" "}
                Score{" "}
              </td>
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
