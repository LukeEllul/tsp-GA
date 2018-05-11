const R = require('ramda');
const math = require('mathjs');

/**
 * randomIndex :: [a] -> Number
 */
const randomIndex = a => Math.floor(math.random(0, a.length));

/**
 * mutate :: ([a] -> [a]) -> [a] -> [a]
 */
const mutate = R.curry((f, a) => f(a));

/**
 * randomGene :: [a] -> Number
 */
const randomGene = a => a[randomIndex(a)];

/**
 * simple :: [a] -> [a]
 */
const simple = a => R.update(randomIndex(a), randomGene(a))(a);

/**
 * swap :: [a] -> [a]
 */
const swap = a =>
    R.pipe(
        a => [randomIndex(a), randomIndex(a)],
        ([index1, index2]) => R.pipe(R.update(index1, a[index2]), R.update(index2, a[index1]))(a)
    )(a);

/**
 * swapMutation :: [a] -> [a]
 */
const swapMutation = mutate(swap);