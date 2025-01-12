const { AoN } = require("./formats/AoN");
const { BoN } = require("./formats/BoN");
const { MoN } = require("./formats/MoN");

const formats = {
  aon: {
    name: "AoN",
    description: "[Standard Ao5, Ao12 etc.]",
    class: AoN,
  },
  mon: {
    name: "MoN",
    description: "[Mean of all the times. Tiebreak on single.]",
    class: MoN,
  },
  bon: {
    name: "BoN",
    description: "[Best solve out of all the solves. No second tiebreak.]",
    class: BoN,
  },
};

module.exports = { formats };
