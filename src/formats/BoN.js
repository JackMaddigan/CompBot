const { centi, display } = require("../helpers");
const emojis = require("../emojis.json");

class BoN {
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

    console.log(orderedFilteredSolves);

    this.best =
      orderedFilteredSolves.length === 0 ? -1 : orderedFilteredSolves[0];
    const isDnfAvg = solves.length > orderedFilteredSolves.length;

    this.average =
      solves.length === 1
        ? 0
        : isDnfAvg
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
      .join(", ")}) = ${display(this.best)} best single`;
  }

  compare(behind) {
    if (this.best <= 0 && behind.best > 0) {
      return 1; // should be after behind
    }
    if (this.best > 0 && behind.best <= 0) {
      return -1; // should stay in front
    }
    return this.best - behind.best;
  }

  setRank(rank) {
    this.rank = rank;
  }

  getRank() {
    return this.rank;
  }

  toCr() {
    return `#${this.rank} ${this.username} ${display(this.best)}`;
  }

  toView() {
    return `best: ${display(this.best)}\n${
      this.attempts !== 0 ? `avg: ${display(this.average)}` : ""
    }`;
  }

  toPodiumString() {
    return `${emojis.medals[this.rank - 1]} <@${this.userId}> ${display(
      this.best
    )}`;
  }
}

module.exports = { BoN };
