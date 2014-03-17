stats-lite
=====

[![NPM](https://nodei.co/npm/stats-lite.png)](https://nodei.co/npm/stats-lite/)

A fairly light statistical package for Node.js. Works with numeric arrays, and will automatically filter out non-numeric values and attempt to convert string numeric values.

Example
---

[Live Demo using Browserify!](http://requirebin.com/embed?gist=brycebaril/9591291)

```javascript
var stats = require("stats-lite")

var dice = require("dice")

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

/* Your exact numbers may vary, but they should be pretty similar:
sum: 21006
mean: 7.002
median: 7
mode: 7
variance: 5.907329333333325
standard deviation: 2.430499811424252
85th percentile: 10
*/

```

API
===

All of the exported functions take `vals` which is an array of numeric values. Non-numeric values will be removed, and string numbers will be converted to Numbers.

**NOTE**: This will impact some operations, e.g. `mean([null, 1, 2, 3])` will be calculated as `mean([1, 2, 3])`, (e.g. `6 / 3 = 2`, NOT `6 / 4 = 1.5`)

`numbers(vals)`
---

Accepts an array of values and returns an array consisting of only numeric values from the source array. Converts what it can and filters out anything else. e.g.

```js
numbers(["cat", 1, "22.9", 9])
// [1, 22.9, 9]
```

`sum(vals)`
---

[Sum](http://en.wikipedia.org/wiki/Summation) the values in the array.

`mean(vals)`
---

Calculate the [mean](http://en.wikipedia.org/wiki/Mean) average value of vals.

`median(vals)`
---

Calculate the [median](http://en.wikipedia.org/wiki/Median) average value of vals.

`mode(vals)`
---

Calculate the [mode](http://en.wikipedia.org/wiki/Mode_statistics) average value of vals.

`variance(vals)`
---

Calculate the [variance](http://en.wikipedia.org/wiki/Variance) from the mean.

`stdev(vals)`
---

Calculate the [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation) of the values from the mean.

`percentile(vals, ptile)`
---

Calculate the value reprecenting the desired [percentile](http://en.wikipedia.org/wiki/Percentile) `(0 < ptile <= 1)`. Uses the Estimation method to interpolate non-member percentiles.

LICENSE
=======

MIT
