import { Address } from '@graphprotocol/graph-ts'
import { GammaShortStrategy } from '../generated/GammaShortStrategy/GammaShortStrategy'

export const GammaShortStrategyAddress: Address = Address.fromString(
  '{{GammaShortStrategy}}'
)

export const GammaShortStrategyContract = GammaShortStrategy.bind(
  GammaShortStrategyAddress
)
