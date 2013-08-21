module.exports.numbers = numbers
module.exports.sum = sum
module.exports.mean = mean
module.exports.median = median
module.exports.mode = mode
module.exports.variance = variance
module.exports.stdev = stdev
module.exports.percentile = percentile

var isNumber = require("isnumber")

function numbers(vals) {
  if (vals == null) return []
  return vals.reduce(function (nums, v) {
    if (isNumber(v)) nums.push(+v)
    return nums
  }, [])
}

function nsort(vals) {
  return vals.sort(function (a, b) { return a - b })
}

function sum(vals) {
  vals = numbers(vals)
  return vals.reduce(function (total, val) { return total + val }, 0)
}

function mean(vals) {
  vals = numbers(vals)
  if (vals.length === 0) return NaN
  return (sum(vals) / vals.length)
}

function median(vals) {
  vals = numbers(vals)
  if (vals.length === 0) return NaN

  var half = (vals.length / 2) | 0

  vals = nsort(vals)
  if (vals.length % 2) {
    // Odd length, true middle element
    return vals[half]
  }
  else {
    // Even length, average middle two elements
    return (vals[half-1] + vals[half]) / 2.0
  }
}

// Returns the mode of a unimodal dataset -- NaN for multi-modal or empty datasets.
function mode(vals) {
  vals = numbers(vals)
  if (vals.length === 0) return NaN
  var mode = NaN
  var dist = {}
  vals.forEach(function (n) {
    var me = dist[n] || 0
    me++
    dist[n] = me
  })
  var rank = Object.keys(dist).sort(function (a, b) { return dist[b] - dist[a] })
  mode = rank[0]
  if (dist[rank[1]] == dist[mode]) {
    // Multiple modes found, abort
    return NaN
  }
  return mode
}

// Variance = average squared deviation from mean
function variance(vals) {
  vals = numbers(vals)
  var avg = mean(vals)
  diff = vals.map(function (v) { return Math.pow((v - avg), 2) })
  return mean(diff)
}

// Standard Deviation = sqrt of variance
function stdev(vals) {
  return Math.sqrt(variance(vals))
}

function percentile(vals, ptile) {
  vals = numbers(vals)
  if (vals.length === 0 || ptile == null || ptile < 0) return NaN

  // Fudge anything over 100 to 1.0
  if (ptile > 1) ptile = 1
  vals = nsort(vals)
  var i = (vals.length * ptile) - 0.5
  if ((i | 0) === i) return vals[i]
  // interpolated percentile -- using Estimation method
  var int_part = i | 0
  var fract = i - int_part
  return (1 - fract) * vals[int_part] + fract * vals[int_part + 1]
}