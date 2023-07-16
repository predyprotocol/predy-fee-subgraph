import { BigInt } from '@graphprotocol/graph-ts'
import {
  Swap,
  UniswapV3Pool
} from '../generated/UniswapV3Pool/UniswapV3Pool'
import { updateAggregatedPrice } from './AggregatedPrice'
import { GammaShortStrategyContract, StrategyStartBlocks } from './contracts'
import { ensureUniFeeGrowthHourly } from './helper'
import { day, dayAdjustment, hour, hourAdjustment } from './time'

export function handleSwap(event: Swap): void {
  const entity = ensureUniFeeGrowthHourly(event.address, event.block.timestamp)

  entity.address = event.address

  const pool = UniswapV3Pool.bind(event.address)

  entity.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128()
  entity.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128()
  entity.updatedAt = event.block.timestamp

  entity.save()

  for (let i = 0; i < 2; i++) {
    const intervalName = ['HOURLY', 'DAILY'][i]
    const intervalLength = [hour, day][i]
    const intervalAdjustment = [hourAdjustment, dayAdjustment][i]

    const isNewlyCreated = updateAggregatedPrice(
      intervalName,
      intervalLength,
      intervalAdjustment,
      event.address,
      event.params.sqrtPriceX96,
      event.block.timestamp,
      BigInt.zero()
    )

    if (
      isNewlyCreated
    ) {
      for (let strategyId = 1; strategyId < StrategyStartBlocks.length; strategyId++) {
        if (event.block.number.gt(BigInt.fromU64(StrategyStartBlocks[strategyId]))) {
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
  }
}
