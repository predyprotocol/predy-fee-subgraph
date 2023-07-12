import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { AggregatedUniswapPriceEntity } from '../generated/schema'

export function aggregatedPriceId(
  address: Bytes,
  interval: string,
  open: BigInt,
  strategyId: BigInt,
): string {
  if (strategyId.gt(BigInt.zero())) {
    return address.toHex() + '-' + strategyId.toString() + '-' + interval + '-' + open.toString()
  } else {
    return address.toHex() + '-' + interval + '-' + open.toString()
  }
}

export function createAggregatedPrice(
  id: string,
  address: Bytes,
  interval: string,
  sqrtPrice: BigInt,
  open: BigInt,
  close: BigInt,
  strategyId: BigInt,
): AggregatedUniswapPriceEntity {
  let price = new AggregatedUniswapPriceEntity(id)
  price.address = address
  if (strategyId.gt(BigInt.zero())) {
    price.strategyId = strategyId
  }
  price.interval = interval
  price.openTimestamp = open
  price.closeTimestamp = close
  price.openPrice = sqrtPrice
  price.closePrice = sqrtPrice

  price.save()

  return price
}

export function updateAggregatedPrice(
  type: string,
  interval: BigInt,
  adjustment: BigInt,
  address: Bytes,
  sqrtPrice: BigInt,
  timestamp: BigInt,
  strategyId: BigInt
): boolean {
  let excess = timestamp.minus(adjustment).mod(interval)
  let open = timestamp.minus(excess)
  let close = open.plus(interval)

  let id = aggregatedPriceId(address, type, open, strategyId)
  let aggregatedPrice = AggregatedUniswapPriceEntity.load(id)

  if (!aggregatedPrice) {
    aggregatedPrice = createAggregatedPrice(
      id,
      address,
      type,
      sqrtPrice,
      open,
      close,
      strategyId
    )

    return true
  } else {
    aggregatedPrice.closePrice = sqrtPrice
    aggregatedPrice.save()

    return false
  }
}
