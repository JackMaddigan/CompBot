const { centi, display } = require("../helpers");

class AoN {
  average;
  best;
  solves;

  calculateStats(solves) {
    solves = solves.slice().map((solve) => centi(solve));

    this.solves = solves
      .slice()
      .sort((a, b) => a - b)
      .filter((item) => item > 0);

    this.best = this.solves.length === 0 ? -1 : this.solves[0];
    const trim = Math.ceil(0.05 * solves.length);
    const isDnfAvg = solves.length - this.solves.length > trim;
    const countingSolves = this.solves
      .concat(Array(solves.length - this.solves.length).fill(-1))
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
}

module.exports = { AoN };
