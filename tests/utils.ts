import { ethereum, BigInt, Address, Bytes, ByteArray } from "@graphprotocol/graph-ts"
import { newMockEvent } from "matchstick-as/assembly/index"
import { Swap } from "../generated/UniswapV3Pool/UniswapV3Pool"

export function createSwapEvent(): Swap {
  let swapEvent = changetype<Swap>(newMockEvent())
  swapEvent.address = Address.zero()
  swapEvent.parameters = new Array()

  let senderParam = new ethereum.EventParam("sender", ethereum.Value.fromAddress(Address.zero()))
  let recipientParam = new ethereum.EventParam("recipient", ethereum.Value.fromAddress(Address.zero()))
  let amount0Param = new ethereum.EventParam("amount0", ethereum.Value.fromSignedBigInt(BigInt.zero()))
  let amount1Param = new ethereum.EventParam("amount1", ethereum.Value.fromSignedBigInt(BigInt.zero()))
  let sqrtPriceParam = new ethereum.EventParam("sqrtPriceX96", ethereum.Value.fromUnsignedBigInt(BigInt.zero()))
  let liquidityParam = new ethereum.EventParam("liquidity", ethereum.Value.fromUnsignedBigInt(BigInt.zero()))
  let tickParam = new ethereum.EventParam("tick", ethereum.Value.fromSignedBigInt(BigInt.zero()))

  swapEvent.parameters.push(senderParam)
  swapEvent.parameters.push(recipientParam)
  swapEvent.parameters.push(amount0Param)
  swapEvent.parameters.push(amount1Param)
  swapEvent.parameters.push(sqrtPriceParam)
  swapEvent.parameters.push(liquidityParam)
  swapEvent.parameters.push(tickParam)

  return swapEvent
}

