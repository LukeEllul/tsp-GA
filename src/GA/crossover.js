const R = require('ramda');
const { X, Tuple, Either, chain, map } = require('../x/X');
const math = require('mathjs');

/**
 * crossover :: (Number -> Number -> [a] -> [a] -> [a]) -> [Number] -> [Number] -> [a] -> [a] -> [[a], [a]]
 */
const crossover = R.curry((f, cutoff, prop, p1, p2) =>
    prop.length === 0 ? [p1, p2] :
        R.head(prop) < 0.5 ? crossover(f, cutoff.slice(2), R.tail(prop), p1, p2) :
            crossover(
                f,
                cutoff.slice(2),
                R.tail(prop),
                f(cutoff[0], cutoff[1], p1, p2),
                f(cutoff[0], cutoff[1], p2, p1)
            ));

/**
 * mate :: Number -> Number -> [a] -> [a] -> [a]
 */
const mate = R.curry((c1, c2, p1, p2) =>
    [
        ...p2.slice(0, c1),
        ...p1.slice(c1, c2 + 1),
        ...p2.slice(c2 + 1)
    ]);

/**
 * partialMate :: Number -> Number -> [a] -> [a] -> [a]
 */
const partialMate = R.curry((c1, c2, p1, p2) =>
    R.pipe(
        _ => p1.slice(c1, c2 + 1),
        a => [
            ...R.pipe(t => p2.slice(0, c1).map(v => R.contains(v, a) ? t[R.findIndex(R.equals(v), a)] : v))(p2.slice(c1, c2 + 1)),
            ...a,
            ...R.pipe(t => p2.slice(c2 + 1).map(v => R.contains(v, a) ? t[R.findIndex(R.equals(v), a)] : v))(p2.slice(c1, c2 + 1))
        ]
    )());

/**
 * takeRandom :: [a] -> a
 */
const takeRandom = a => a[Math.floor(math.random(0, a.length))];

/**
 * takeRandomTwo :: [a] -> [a, a]
 */
const takeRandomTwo = a =>
    R.pipe(
        _ => takeRandom(a),
        v => [v, takeRandom(R.remove(R.findIndex(R.equals(v), a), 1, a))]
    )();

/**
 * chooseParents :: [[a, a]] -> [[a]] -> [[a, a]]
 */
const chooseParents = R.curry((acc, pop) =>
    pop.length === 0 ? acc : R.pipe(
        takeRandomTwo,
        parents => chooseParents([...acc, parents], R.difference(pop, parents))
    )(pop));

/**
 * createOffspring :: [Number] -> [Number] -> (Number -> Number -> [a] -> [a] -> [a]) -> [[a]] -> [[a]]
 */
const createOffspring = R.curry((cutoff, prop, f, pop) =>
    R.pipe(
        chooseParents([]),
        R.map(parents => crossover(f, cutoff, prop, parents[0], parents[1])),
        p => p.reduce((gen, offs) => [...gen, ...offs], [])
    )(pop));