const R = require('ramda');
const { X } = require('../x/X');
const math = require('mathjs');

/**
 * createPopulation :: (_ -> [a]) -> Number -> X [X [a]]
 */
const createPopulation = f => R.pipe(
    R.range(0),
    R.map(f),
    R.map(X.of),
    X.of
);

/**
 * generatePermuation :: ([a] -> Number -> Number) -> [a] -> [a] -> [a]
 */
const generatePermuation = R.curry((f, chromo, acc) =>
    chromo.length === 0 ? acc :
        f(acc, R.head(chromo)) > 0.5 ?
            generatePermuation(f, R.tail(chromo), [...acc, R.head(chromo)]) :
            generatePermuation(f, [...R.tail(chromo), R.head(chromo)], acc));

/**
 * permuationEncoding :: ([a] -> Number -> Number) -> Number -> (_ -> [a])
 */
const permuationEncoding = f => R.pipe(
    n => n + 1,
    R.range(1),
    a => _ => generatePermuation(f, a, [])
);

/**
 * weightedPermuation :: Number -> Number -> (_ -> [a])
 */
const weightedPermuation = p =>
    permuationEncoding((acc, head) => math.random() < p ? 0 : 1);

/**
 * unbiasedPermutation :: Number -> (_ -> [a])
 */
const unbiasedPermutation = weightedPermuation(0.85);

module.exports = {
    createPopulation,
    unbiasedPermutation,
    weightedPermuation,
    permuationEncoding
};