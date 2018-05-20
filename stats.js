'use strict';

module.exports.numbers = numbers;
module.exports.sum = sum;
module.exports.mean = mean;
module.exports.median = median;
module.exports.mode = mode;
module.exports.variance = variance;
module.exports.stdev = stdev;
module.exports.percentile = percentile;
module.exports.quartiles = quartiles;
module.exports.interquartile = interquartile;
module.exports.outliersBounds = outliersBounds;
module.exports.removeOutliers = removeOutliers;
module.exports.outliers = outliers;
module.exports.histogram = histogram;

var isNumber = require('isnumber');

function numbers(vals) {
  var nums = [];
  if (vals == null) return nums;

  for (var i = 0; i < vals.length; i++) {
    if (isNumber(vals[i])) nums.push(+vals[i]);
  }
  return nums;
}

function nsort(vals) {
  return vals.sort(function numericSort(a, b) {
    return a - b;
  });
}

function sum(vals) {
  vals = numbers(vals);
  var total = 0;
  for (var i = 0; i < vals.length; i++) {
    total += vals[i];
  }
  return total;
}

function mean(vals) {
  vals = numbers(vals);
  if (vals.length === 0) return NaN;
  return sum(vals) / vals.length;
}

function median(vals) {
  vals = numbers(vals);
  if (vals.length === 0) return NaN;

  var half = (vals.length / 2) | 0;

  vals = nsort(vals);
  if (vals.length % 2) {
    // Odd length, true middle element
    return vals[half];
  } else {
    // Even length, average middle two elements
    return (vals[half - 1] + vals[half]) / 2.0;
  }
}

// Returns the mode of a unimodal dataset
// If the dataset is multi-modal, returns a Set containing the modes
function mode(vals) {
  vals = numbers(vals);
  if (vals.length === 0) return NaN;
  var mode = NaN;
  var dist = {};

  for (var i = 0; i < vals.length; i++) {
    var value = vals[i];
    var me = dist[value] || 0;
    me++;
    dist[value] = me;
  }

  var rank = numbers(
    Object.keys(dist).sort(function sortMembers(a, b) {
      return dist[b] - dist[a];
    })
  );
  mode = rank[0];
  if (dist[rank[1]] == dist[mode]) {
    // multi-modal
    if (rank.length == vals.length) {
      // all values are modes
      return vals;
    }
    var modes = new Set([mode]);
    var modeCount = dist[mode];
    for (var i = 1; i < rank.length; i++) {
      if (dist[rank[i]] == modeCount) {
        modes.add(rank[i]);
      } else {
        break;
      }
    }
    return modes;
  }
  return mode;
}

// Variance = average squared deviation from mean
function variance(vals) {
  vals = numbers(vals);
  var avg = mean(vals);
  var diffs = [];
  for (var i = 0; i < vals.length; i++) {
    diffs.push(Math.pow(vals[i] - avg, 2));
  }
  return mean(diffs);
}

// Standard Deviation = sqrt of variance
function stdev(vals) {
  return Math.sqrt(variance(vals));
}

function interquartile(vals) {
  var qs = quartiles(vals);
  return qs[2] - qs[0];
}

function outliersBounds(vals) {
  var out = [];
  var iqr = interquartile(vals);
  var qs = quartiles(vals);
  var min = qs[0] - 1.5 * iqr;
  var max = qs[2] + 1.5 * iqr;

  return [min, max];
}

function removeOutliers(vals) {
  var minmax = outliersBounds(vals);
  return vals.filter(v => v >= minmax[0] && v <= minmax[1]);
}

function outliers(vals) {
  var minmax = outliersBounds(vals);
  return vals.filter(v => v < minmax[0] || v > minmax[1]);
}

function quartiles(vals) {
  return [
    percentile(vals, 0.25),
    percentile(vals, 0.5),
    percentile(vals, 0.75)
  ];
}

function percentile(vals, ptile) {
  vals = numbers(vals);
  if (vals.length === 0 || ptile == null || ptile < 0) return NaN;

  // Fudge anything over 100 to 1.0
  if (ptile > 1) ptile = 1;
  vals = nsort(vals);
  var i = vals.length * ptile - 0.5;
  if ((i | 0) === i) return vals[i];
  // interpolated percentile -- using Estimation method
  var int_part = i | 0;
  var fract = i - int_part;
  return (
    (1 - fract) * vals[int_part] +
    fract * vals[Math.min(int_part + 1, vals.length - 1)]
  );
}

function histogram(vals, bins) {
  if (vals == null) {
    return null;
  }
  vals = nsort(numbers(vals));
  if (vals.length === 0) {
    return null;
  }
  if (bins == null) {
    // pick bins by simple method: Math.sqrt(n)
    bins = Math.sqrt(vals.length);
  }
  bins = Math.round(bins);
  if (bins < 1) {
    bins = 1;
  }

  var min = vals[0];
  var max = vals[vals.length - 1];
  if (min === max) {
    // fudge for non-variant data
    min = min - 0.5;
    max = max + 0.5;
  }

  var range = max - min;
  // make the bins slightly larger by expanding the range about 10%
  // this helps with dumb floating point stuff
  var binWidth = (range + range * 0.05) / bins;
  var midpoint = (min + max) / 2;
  // even bin count, midpoint makes an edge
  var leftEdge = midpoint - binWidth * Math.floor(bins / 2);
  if (bins % 2 !== 0) {
    // odd bin count, center middle bin on midpoint
    var leftEdge = midpoint - binWidth / 2 - binWidth * Math.floor(bins / 2);
  }

  var hist = {
    values: Array(bins).fill(0),
    bins: bins,
    binWidth: binWidth,
    binLimits: [leftEdge, leftEdge + binWidth * bins]
  };

  var binIndex = 0;
  for (var i = 0; i < vals.length; i++) {
    while (vals[i] > (binIndex + 1) * binWidth + leftEdge) {
      binIndex++;
    }
    hist.values[binIndex]++;
  }

  return hist;
}
