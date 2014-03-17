stats-lite
=====

[![NPM](https://nodei.co/npm/stats-lite.png)](https://nodei.co/npm/stats-lite/)

A fairly light statistical package for Node.js. Works with numeric arrays, and will automatically filter out non-numeric values and attempt to convert string numeric values.

Example
---

<iframe src="http://requirebin.com/embed?gist=brycebaril/9591291" frameborder="0" height="50%" width="100%"></iframe>


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
