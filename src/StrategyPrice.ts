import { BigInt } from '@graphprotocol/graph-ts'
import { updateAggregatedPrice } from './AggregatedPrice'
import { GammaShortStrategyContract } from './contracts'
import { day, dayAdjustment, hour, hourAdjustment } from './time'
import { AnswerUpdated } from '../generated/AggregatorInterface/AggregatorInterface'

export function handleAnswerUpdated(event: AnswerUpdated): void {
  for (let i = 0; i < 2; i++) {
    const intervalName = ['HOURLY', 'DAILY'][i]
    const intervalLength = [hour, day][i]
    const intervalAdjustment = [hourAdjustment, dayAdjustment][i]
    const strategyCount = GammaShortStrategyContract.strategyCount()

    for (let strategyId = 1; strategyId < (strategyCount.toI32() as number); strategyId++) {
      const strategyPrice = GammaShortStrategyContract.try_getPrice(BigInt.fromU32(strategyId))

      if (!strategyPrice.reverted) {
        updateAggregatedPrice(
          intervalName,
          intervalLength,
          intervalAdjustment,
          GammaShortStrategyContract._address,
          strategyPrice.value,
          event.block.timestamp,
          BigInt.fromU32(strategyId)
        )
      }
    }
  }
}
