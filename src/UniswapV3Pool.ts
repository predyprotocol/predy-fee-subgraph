import { BigInt } from '@graphprotocol/graph-ts'
import {
  Swap,
  UniswapV3Pool
} from '../generated/UniswapV3Pool/UniswapV3Pool'
import { updateAggregatedPrice } from './AggregatedPrice'
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

    updateAggregatedPrice(
      intervalName,
      intervalLength,
      intervalAdjustment,
      event.address,
      event.params.sqrtPriceX96,
      event.block.timestamp,
      BigInt.zero()
    )
  }
}
