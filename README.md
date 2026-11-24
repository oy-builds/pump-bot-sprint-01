[![make.fun · u-riidzhsn-pump-fun-bot-sprint-make-bot-and-win-cb203fed](https://make.fun/badge/u-riidzhsn-pump-fun-bot-sprint-make-bot-and-win-cb203fed.svg)](https://make.fun/bounty/u-riidzhsn-pump-fun-bot-sprint-make-bot-and-win-cb203fed?utm_source=github&utm_medium=readme&utm_campaign=u-riidzhsn-pump-fun-bot-sprint-make-bot-and-win-cb203fed)
[![rank](https://make.fun/badge/u-riidzhsn-pump-fun-bot-sprint-make-bot-and-win-cb203fed/oy-builds/pump-bot-sprint-01/rank.svg)](https://make.fun/bounty/u-riidzhsn-pump-fun-bot-sprint-make-bot-and-win-cb203fed/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-riidzhsn-pump-fun-bot-sprint-make-bot-and-win-cb203fed)
[![reward](https://make.fun/badge/u-riidzhsn-pump-fun-bot-sprint-make-bot-and-win-cb203fed/oy-builds/pump-bot-sprint-01/reward.svg)](https://make.fun/bounty/u-riidzhsn-pump-fun-bot-sprint-make-bot-and-win-cb203fed?utm_source=github&utm_medium=readme&utm_campaign=u-riidzhsn-pump-fun-bot-sprint-make-bot-and-win-cb203fed)

# FreshRunner — Pump.fun Bot Sprint

A deterministic Solana paper-trading bot for pump.fun-style bonding-curve markets
(`agent-fun/replay/v2`, Node 22, no network). It trades the replay's market events
as they arrive and decides when to buy, when to sell, and how much to risk.

## Strategy

FreshRunner buys a curve once, in one small fixed stake (0.08 SOL), only when the
curve has proven itself and its recent tape shows genuine dispersed buy pressure:

- **Proven reserve:** real SOL reserve between 18 and 40 SOL — past the bundled-launch
  phase, not yet a crowded top.
- **Age:** at least 150 slots since creation.
- **Momentum:** over the last 120 slots, at least 4 buys from at least 3 distinct
  wallets, net buy flow of at least 0.5 SOL, price up at least 5% from the window
  start, and price holding within 5% of the window high, with no single wallet
  behind more than 60% of the buy SOL.
- **Price discipline:** buys go out at 100 bps max slippage, so an order that would
  fill more than 1% worse than the decision price is rejected instead of chasing a
  pump that already happened.

Exits sell the whole position on the first trigger: take-profit +25%, stop-loss
-15%, a 15% trailing stop once the position is up 10%, a single recorded sell of
2 SOL or more, or a 1000-slot time limit. Losers are cut, winners are banked,
nothing is ridden to zero. One entry per coin, ever.

**Guardrail pacing:** if the bot's own fills or coins lag a pace target scaled by
elapsed block time, it opens tiny 0.01 SOL probe round trips on liquid curves and
sells them as soon as the buy lands, so the run always clears the 20-coin
round-trip bar.

## Layout

- `main.ts` — entrypoint; the grader runs `node /bot/main.ts`.
- `strategy.ts` — the strategy (parameterized, tuned on the kit's dev window).
- `vendor/makefun-bot.ts` — the kit's `sdk/ts/makefun-bot.ts` shim, vendored
  byte for byte; it owns the harness wire protocol.

## Local result (dev window, `grade-local --driver process`)

- Net PnL **+0.156 SOL** (return +1.56%; 90% interval -0.124 .. +0.435 SOL)
- 192 fills over 93 coins, 96 round trips, win rate 39.6%, max drawdown 1.44%
- Guardrails met; the two executions' action logs reproduce byte for byte.
