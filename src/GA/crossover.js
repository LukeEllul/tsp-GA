const R = require('ramda');
const { X, Tuple, Either, chain, map } = require('../x/X');

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

const p1 = [1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0 ,1];
const p2 = [0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1 ,1];

const offspring = crossover(
    mate,
    [4, 8, 10, 11],
    [1, 1],
    p1,
    p2
);

console.log(offspring);