import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'; //
import { assert, beforeEach, clearStore, describe, test, createMockedFunction } from 'matchstick-as/assembly/index';
import { handleSwap } from '../src/UniswapV3Pool';
import { createSwapEvent } from './utils';

createMockedFunction(Address.zero(), "feeGrowthGlobal0X128", "feeGrowthGlobal0X128():(uint256)")
  .returns([
    ethereum.Value.fromUnsignedBigInt(BigInt.zero())
  ]);

createMockedFunction(Address.zero(), "feeGrowthGlobal1X128", "feeGrowthGlobal1X128():(uint256)")
  .returns([
    ethereum.Value.fromUnsignedBigInt(BigInt.zero())
  ]);

beforeEach(() => {
  clearStore() // <-- clear the store before each test in the file
})

describe("handleSwap", () => {
  test('store UniFeeGrowthHourly entity', () => {
    const swapEvent = createSwapEvent()

    handleSwap(swapEvent)

    assert.entityCount('UniFeeGrowthHourly', 1)
  })
})
