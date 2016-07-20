"use strict";

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
  var nums = []
  if (vals == null)
    return nums

  for (var i = 0; i < vals.length; i++) {
    if (isNumber(vals[i]))
      nums.push(+vals[i])
  }
  return nums
}

function nsort(vals) {
  return vals.sort(function numericSort(a, b) { return a - b })
}

function sum(vals) {
  vals = numbers(vals)
  var total = 0
  for (var i = 0; i < vals.length; i++) {
    total += vals[i]
  }
  return total
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

// Returns the mode of a unimodal dataset
// If the dataset is multi-modal, returns a Set containing the modes
function mode(vals) {
  vals = numbers(vals)
  if (vals.length === 0) return NaN
  var mode = NaN
  var dist = {}

  for (var i = 0; i < vals.length; i++) {
    var value = vals[i]
    var me = dist[value] || 0
    me++
    dist[value] = me
  }

  var rank = numbers(Object.keys(dist).sort(function sortMembers(a, b) { return dist[b] - dist[a] }))
  mode = rank[0]
  if (dist[rank[1]] == dist[mode]) {
    // multi-modal
    if (rank.length == vals.length) {
      // all values are modes
      return vals
    }
    var modes = new Set([mode])
    var modeCount = dist[mode]
    for (var i = 1; i < rank.length; i++) {
      if (dist[rank[i]] == modeCount) {
        modes.add(rank[i])
      }
      else {
        break
      }
    }
    return modes
  }
  return mode
}

// Variance = average squared deviation from mean
function variance(vals) {
  vals = numbers(vals)
  var avg = mean(vals)
  var diffs = []
  for (var i = 0; i < vals.length; i++) {
    diffs.push(Math.pow((vals[i] - avg), 2))
  }
  return mean(diffs)
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
  return (1 - fract) * vals[int_part] + fract * vals[Math.min(int_part + 1, vals.length - 1)]
}
