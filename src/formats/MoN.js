const { centi, display } = require("../helpers");
const emojis = require("../emojis.json");

class MoN {
  constructor(r) {
    if (r) {
      this.id = r.result_id;
      this.userId = r.user_id;
      this.username = r.user_name;
      this.eventName = r.event_name;
      this.attempts = r.event_attempts;
      this.average = r.result_average;
      this.best = r.result_best;
      this.isDnf = this.best <= 0;
    }
  }

  calculateStats(solves) {
    this.solves = solves.slice().map((solve) => centi(solve));

    const orderedFilteredSolves = this.solves
      .slice()
      .sort((a, b) => a - b)
      .filter((item) => item > 0);

    this.best =
      orderedFilteredSolves.length === 0 ? -1 : orderedFilteredSolves[0];
    const isDnfAvg = solves.length > orderedFilteredSolves.length;

    this.average = isDnfAvg
      ? -1
      : Math.round(
          orderedFilteredSolves.reduce((acc, curr) => acc + curr, 0) /
            orderedFilteredSolves.length
        );
  }

  getStats() {
    return { average: this.average, best: this.best };
  }

  getResponse() {
    return `(${this.solves
      .map((solve) => display(solve))
      .join(", ")}) = ${display(this.average)} mo${this.solves.length}`;
  }

  compare(behind) {
    if (this.average <= 0 && behind.average > 0) return 1; // this should be worse
    if (this.average > 0 && behind.average <= 0) return -1; // this stays in front

    if (this.average === behind.average) {
      if (this.best <= 0 && behind.best > 0) return 1; // this should be worse
      if (this.best > 0 && behind.best <= 0) return -1; // this is better
      return this.best - behind.best;
    }
    return this.average - behind.average;
  }

  setRank(rank) {
    this.rank = rank;
  }

  getRank() {
    return this.rank;
  }

  toCr() {
    return `#${this.rank} ${this.username} ${display(this.average)}`;
  }

  toView() {
    return `avg: ${display(this.average)}\nbest: ${display(this.best)}`;
  }

  toPodiumString() {
    return `${emojis.medals[this.rank - 1]} <@${this.userId}> ${display(
      this.average
    )} mo${this.attempts}`;
  }
}

module.exports = { MoN };
