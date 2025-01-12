const formats = require("./formats");

console.log(
  Object.entries(formats).reduce((acc, [formatId, formatData]) => {
    acc.push({
      name: formatData.name + " " + formatData.description,
      value: formatId,
    });
    return acc;
  }, [])
);
