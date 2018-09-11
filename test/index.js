"use strict";

var test = require("tape").test

var stats = require("../stats")
var dice = require('dice')

test("numbers", function (t) {
  var numbers = stats.numbers
  t.equals(typeof numbers, "function", "numbers is a function")

  t.deepEquals(numbers(), [], "undefined returns empty array")

  t.deepEquals(numbers([]), [], "empty array")

  t.deepEquals(numbers([1, 2, 3]), [1, 2, 3], "only numbers")

  t.deepEquals(numbers(["cat", 1, 23.9, "33.2"]), [1, 23.9, 33.2], "removes non-nums, converts str numbers to numers")

  t.end()
})

test("sum", function (t) {
  var sum = stats.sum

  t.equals(typeof sum, "function", "sum is a function")

  t.deepEquals(sum(), 0, "sum of nothing is 0")

  t.deepEquals(sum([]), 0, "sum of nothing is 0")

  t.deepEquals(sum([1, 2, 3]), 6, "sum works")

  t.deepEquals(sum([1, 23.9, "33.2"]), 58.1, "works with type conversion")

  t.end()
})

test("mean", function (t) {
  var mean = stats.mean

  t.equals(typeof mean, "function", "mean is a function")

  t.ok(isNaN(mean()), "mean of nothing is NaN")

  t.ok(isNaN(mean([])), "mean of nothing is NaN")

  t.deepEquals(mean([1, 2, 3]), 2, "mean works")

  t.deepEquals(mean([1, 23.9, "33.3"]), 19.4, "works with type conversion")

  t.end()
})

test("median", function (t) {
  var median = stats.median

  t.equals(typeof median, "function", "median is a function")

  t.ok(isNaN(median()), "median of nothing is NaN")

  t.ok(isNaN(median([])), "median of nothing is NaN")

  t.deepEquals(median([1, 2, 2, 2, 3, 14]), 2, "median works")

  t.deepEquals(median([1, 2, 7, 8, 5]), 5, "median works")

  t.deepEquals(median([1, "6", 2, 8, 7, 2]), 4, "median works (even) number")

  t.end()
})

test("mode", function (t) {
  var mode = stats.mode

  t.equals(typeof mode, "function", "mode is a function")

  t.ok(isNaN(mode()), "mode of nothing is NaN")

  t.ok(isNaN(mode([])), "mode of nothing is NaN")

  t.deepEquals(mode([1, 2, 2, 2, 3, 14]), 2, "mode works")

  t.deepEquals(mode([1, 1, 7, 5, 5, 8, 7]), new Set([1, 5, 7]), "multi-modal works")

  t.deepEquals(mode([1, 1, 7, 5, 5, 8, 7]), new Set([1, 7, 5]), "multi-modal works and order doesn't matter (yay Set)")

  t.deepEquals(mode([1, "6", 2, 8, 7, 2]), 2, "mode works with stringification")

  t.end()
})

test("variance", function (t) {
  var variance = stats.variance

  t.equals(typeof variance, "function", "variance is a function")

  t.ok(isNaN(variance()), "variance of nothing is NaN")

  t.ok(isNaN(variance([])), "variance of nothing is NaN")

  t.deepEquals(variance([2, 4, 4, 4, 5, 5, 7, 9]), 4, "variance works")

  t.deepEquals(variance([600, "470", 170, 430, 300]), 21704, "variance works")

  t.end()
})

test("sampleVariance", function (t) {
  var variance = stats.sampleVariance

  t.equals(typeof variance, "function", "sampleVariance is a function")

  t.ok(isNaN(variance()), "sampleVariance of nothing is NaN")

  t.ok(isNaN(variance([])), "sampleVariance of nothing is NaN")

  t.ok(isNaN(variance([42.4242])), "sampleVariance of one thing is NaN")

  t.deepEquals(variance([2, 4, 4, 4, 5, 5, 7, 9]), 4.571428571428571, "sampleVariance works")

  t.deepEquals(variance([600, "470", 170, 430, 300]), 27130, "sampleVariance works")

  t.end()
})

test("stdev", function (t) {
  var stdev = stats.stdev

  t.equals(typeof stdev, "function", "stdev is a function")

  t.ok(isNaN(stdev()), "stdev of nothing is NaN")

  t.ok(isNaN(stdev([])), "stdev of nothing is NaN")

  t.deepEquals(stdev([42.4242]), 0, "stdev of one thing is zero")

  t.deepEquals(stdev([2, 4, 4, 4, 5, 5, 7, 9]), 2, "stdev works")

  t.deepEquals(stdev([600, "470", 170, 430, 300]), 147.32277488562318, "stdev works")

  t.end()
})


test("sampleStdev", function (t) {
  var stdev = stats.sampleStdev

  t.equals(typeof stdev, "function", "sampleStdev is a function")

  t.ok(isNaN(stdev()), "sampleStdev of nothing is NaN")

  t.ok(isNaN(stdev([])), "sampleStdev of nothing is NaN")

  t.ok(isNaN(stdev([42.4242])), "sampleStdev of 1 thing is NaN")

  t.deepEquals(stdev([2, 4, 4, 4, 5, 5, 7, 9]), 2.138089935299395, "sampleStdev works")

  t.deepEquals(stdev([600, "470", 170, 430, 300]), 164.7118696390761, "sampleStdev works")

  t.deepEquals(stdev([710, 660.474666666667, 337.83, 600, 550, 710]), 140.6576424153763, "sampleStdev works")

  t.end()
})

test("percentile", function (t) {
  var percentile = stats.percentile

  t.equals(typeof percentile, "function", "percentile is a function")

  t.ok(isNaN(percentile()), "percentile of nothing is NaN")

  t.ok(isNaN(percentile([])), "percentile of nothing is NaN")

  var scores = [4,4,5,5,5,5,6,6,6,7,7,7,8,8,9,9,9,10,10,10]

  t.ok(isNaN(percentile(scores)), "percentile requires a target percentile")


  t.deepEquals(percentile(scores, 0.50), stats.median(scores), "50th percentile equals median")

  t.deepEquals(percentile(scores, 0.25), 5, "percentile works")

  t.deepEquals(percentile(scores, 0.85), 9.5, "percentile works")

  t.deepEquals(percentile([3, 5, 7, 8, 9, 11, 13, 15], 0.25), 6, "percentile works")

  t.deepEquals(percentile([15, 20, 35, 40, 50], 0.4), 27.5, "perentile works")

  t.deepEquals(percentile([100, 200], 0.9), 200, "percentiles above data work")

  t.end()
})

test('histogram', (t) => {
  var histogram = stats.histogram

  t.equals(typeof histogram, 'function', 'histogram is a function')

  t.notOk(histogram(), 'histogram of nothing is null')

  t.notOk(histogram([]), 'histogram of nothing is null')

  // With preset bin count
  var expect = {
    values: [ 1, 0, 0, 0, 1 ],
    bins: 5,
    binWidth: 2.94,
    binLimits: [ 1.6500000000000004, 16.35 ]
  }
  t.deepEquals(histogram([2, 16], 5), expect)

  expect = {
    values: [ 1, 0, 0, 0, 0, 1 ],
    bins: 6,
    binWidth: 2.4499999999999997,
    binLimits: [ 1.6500000000000004, 16.35 ]
  }
  t.deepEquals(histogram([2, 16], 6), expect)

  expect = {
    values: [ 1 ],
    bins: 1,
    binWidth: 1.05,
    binLimits: [ 99.475, 100.52499999999999 ]
  }
  t.deepEquals(histogram([100], 1), expect, "Single entry")

  expect = {
    binLimits: [ -105, 105 ],
    binWidth: 10.5,
    bins: 20,
    values: [ 1, 0, 0, 0, 1, 0, 0, 1, 0, 2, 3, 0, 0, 0, 1, 0, 0, 0, 0, 1 ]
  }
  t.deepEquals(histogram([-100, -53, 10, 100, -22, 0, 0, 1, 3, 44], 20), expect, 'range goes from negative to positive')

  function diceTest (n, dieString) {
    var rolls = []
    for (var i = 0; i < n; i++) {
      rolls.push(dice.sum(dice.roll(dieString)))
    }
    var hist = histogram(rolls)
    t.equals(stats.sum(hist.values), n, 'right number of values')
    // t.ok(hist.values[0] > 0, 'first bin is full')
    // t.ok(hist.values[hist.values.length - 1] > 0, 'last bin is full')
    t.ok(hist.bins > 1, 'more than one bin')
  }
  diceTest(1000, '2d10')
  diceTest(100, '3d100')
  diceTest(2000, '30d5')
  diceTest(2000, '1d1000')
  diceTest(2000, '2d-5')
  t.end()
})
