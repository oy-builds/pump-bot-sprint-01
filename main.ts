// FreshRunner: a fresh-curve momentum bot for the pump.fun bonding-curve replay
// (agent-fun/replay/v2). The grader runs `node /bot/main.ts`; the strategy lives in
// strategy.ts and the SDK shim is the kit's sdk/ts/makefun-bot.ts, vendored byte for
// byte in vendor/.
//
// The bot buys a curve once, in one small fixed stake, only when its recent tape
// shows dispersed buy pressure (several distinct buyers, net SOL flowing in, price
// rising and holding near its short-window high), then exits whole on the first of
// a take-profit, a stop-loss, a trailing stop, a large single sell, or a time limit.
// See strategy.ts for the full description and parameters.

import { runBot } from './vendor/makefun-bot.ts';
import { createStrategy, DEFAULT_PARAMS } from './strategy.ts';

await runBot(createStrategy(DEFAULT_PARAMS));
