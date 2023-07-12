import { BigInt, Bytes } from '@graphprotocol/graph-ts'

import {
  UniFeeGrowthHourly
} from '../generated/schema'

export function ensureUniFeeGrowthHourly(
  address: Bytes,
  eventTime: BigInt
): UniFeeGrowthHourly {
  const id = address.toHex() + '-' + toHourlyId(eventTime)
  let entity = UniFeeGrowthHourly.load(id)

  if (entity == null) {
    entity = new UniFeeGrowthHourly(id)
    entity.feeGrowthGlobal0X128 = BigInt.fromI32(0)
    entity.feeGrowthGlobal1X128 = BigInt.fromI32(0)
    entity.createdAt = eventTime
    entity.updatedAt = eventTime
  }

  return entity
}

function toHourlyId(timestamp: BigInt): string {
  let excess = timestamp.mod(BigInt.fromU32(60 * 60))
  let open = timestamp.minus(excess)

  return open.toString()
}

function toISODateString(timestamp: BigInt): string {
  const date = new Date(timestamp.toI64() * 1000).toISOString()
  return date.substring(0, date.indexOf('T'))
}
