const R = require('ramda');
const { X, map, State, chain } = require('../x/X');
const math = require('mathjs');

/**
 * select :: X [Number] -> X Number
 */
const select = R.pipe(
    map(R.map(R.multiply(100))),
    map(a => a.reduce((w, n) => [...w, R.pipe(R.flatten, a => a.length === 0 ? 0 : R.last(a), N => R.range(N + 1, N + n))(w)], [])),
    map(wheele => R.pipe(
        _ => math.random(1, R.last(R.flatten(wheele)) + 1),
        n => R.findIndex(R.any(R.equals(Math.floor(n))), wheele)
    )())
);

// const p = X.of([0.35, 0, 0, 0.14, 0]);
// console.log(select(p))

/**
 * rankFitness :: X [X Number] -> X [Number]
 */
const rankFitness = R.pipe(
    map(R.map(chain(R.identity))),
    chain(p => State.put(p)),
    chain(_ => State.gets(p => p.map((a, i) => ({v: a, index: i})))),
    map(R.sort((a, b) => a.v - b.v)),
    map(a => R.pipe(
        _ => R.pipe(R.add(1), R.range(1), R.sum)(a.length),
        n => a.map((o, i) => ({v: (i + 1) / n, index: o.index}))
    )()),
    map(R.map(o => ({[o.index]: o.v}))),
    map(a => Object.assign({}, ...a)),
    chain(index => State.gets(p => p.map((_, i) => index[i]))),
    s => X.of(s.eval())
);

/**
 * normalFitness :: X [X Number] -> X [Number]
 */
const normalFitness = R.pipe(
    map(R.map(chain(R.identity))),
    chain(p => State.put(p)),
    chain(_ => State.gets(R.sum)),
    chain(sum => State.gets(R.map(v => v / sum))),
    s => X.of(s.eval())
);

/**
 * fitPopulation :: ([a] -> Number) -> X [X [a]] -> X [X Number]
 */
const fitPopulation = f => map(R.map(map(f)));

/**
 * chooseMostFit :: [Number] -> Number -> X [Number] -> X [Number]
 */
const chooseMostFit = R.curry((acc, n, fP) =>
    n === 0 ? X.of(acc) :
        select(fP)
        .chain(i => chooseMostFit([...acc, i], n - 1, fP.map(R.update(i, 0)))));


// const fp = rankFitness(p);

/**
 * evaluate :: (X [X Number] -> X [Number]) -> ([a] -> Number) -> Number -> X [X [a]] -> X [X [a]]
 */
const evaluate = R.curry((fp, f, n, pop) =>
    R.pipe(
        fitPopulation(f),
        fp,
        chooseMostFit([], n),
        indexes => X.of(pop => indexes => pop.filter((_, i) => R.contains(i, indexes)))
                    .ap(pop)
                    .ap(indexes)
    )(pop));

//const p = X.of([X.of(345), X.of(234), X.of(600)]);

module.exports = {
    rankFitness,
    normalFitness,
    evaluate
};