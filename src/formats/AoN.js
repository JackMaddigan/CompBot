const { centi, display } = require("../helpers");

class AoN {
  constructor(r) {
    if (r) {
      this.id = r.result_id;
      this.userId = r.user_id;
      this.username = r.user_name;
      this.average = r.result_average;
      this.best = r.result_best;
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
    const trim = Math.ceil(0.05 * solves.length);
    const isDnfAvg = solves.length - orderedFilteredSolves.length > trim;
    const countingSolves = orderedFilteredSolves
      .concat(Array(solves.length - orderedFilteredSolves.length).fill(-1))
      .splice(trim, solves.length - 1 - trim);

    this.average = isDnfAvg
      ? -1
      : Math.round(
          countingSolves.reduce((acc, curr) => acc + curr, 0) /
            countingSolves.length
        );
  }

  getStats() {
    return { average: this.average, best: this.best };
  }

  getResponse() {
    return `(${this.solves
      .map((solve) => display(solve))
      .join(", ")}) = ${display(this.average)} ao${this.solves.length}`;
  }

  compare(behind) {
    if (this.best <= 0 && behind.best > 0) {
      return 1; // should be after behind
    }
    if (this.best > 0 && behind.best <= 0) {
      return -1; // should stay in front
    }
    if (this.average === behind.average) {
      return this.best - behind.best; // tiebreak on single
    }
    return this.average - behind.average; // sort by average
  }
}

module.exports = { AoN };
