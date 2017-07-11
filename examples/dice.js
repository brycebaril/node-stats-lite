var dice = require("dice")

var stats = require("../stats")

var rolls = []
for (var i = 0; i < 3000; i++) {
  rolls.push(dice.sum(dice.roll("2d6")))
}

console.log("sum: %s", stats.sum(rolls))
console.log("mean: %s", stats.mean(rolls))
console.log("median: %s", stats.median(rolls))
console.log("mode: %s", stats.mode(rolls))
console.log("variance: %s", stats.variance(rolls))
console.log("standard deviation: %s", stats.stdev(rolls))
console.log("85th percentile: %s", stats.percentile(rolls, 0.85))
console.log("histogram", stats.histogram(rolls, 10))
