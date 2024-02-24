import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  DelegateChanged,
  DelegateVotesChanged,
  EIP712DomainChanged,
  Initialized,
  MaxSupplyChange,
  OwnershipTransferred,
  SharesOnboarderUpdate,
  SnapshotCreated,
  Transfer,
  TreasuryChange,
  Upgraded
} from "../generated/PrimordiumTokenV1/PrimordiumTokenV1"

export function createDelegateChangedEvent(
  delegator: Address,
  fromDelegate: Address,
  toDelegate: Address
): DelegateChanged {
  let delegateChangedEvent = changetype<DelegateChanged>(newMockEvent())

  delegateChangedEvent.parameters = new Array()

  delegateChangedEvent.parameters.push(
    new ethereum.EventParam("delegator", ethereum.Value.fromAddress(delegator))
  )
  delegateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "fromDelegate",
      ethereum.Value.fromAddress(fromDelegate)
    )
  )
  delegateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "toDelegate",
      ethereum.Value.fromAddress(toDelegate)
    )
  )

  return delegateChangedEvent
}

export function createDelegateVotesChangedEvent(
  delegate: Address,
  previousVotes: BigInt,
  newVotes: BigInt
): DelegateVotesChanged {
  let delegateVotesChangedEvent = changetype<DelegateVotesChanged>(
    newMockEvent()
  )

  delegateVotesChangedEvent.parameters = new Array()

  delegateVotesChangedEvent.parameters.push(
    new ethereum.EventParam("delegate", ethereum.Value.fromAddress(delegate))
  )
  delegateVotesChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousVotes",
      ethereum.Value.fromUnsignedBigInt(previousVotes)
    )
  )
  delegateVotesChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newVotes",
      ethereum.Value.fromUnsignedBigInt(newVotes)
    )
  )

  return delegateVotesChangedEvent
}

export function createMaxSupplyChangeEvent(
  oldMaxSupply: BigInt,
  newMaxSupply: BigInt
): MaxSupplyChange {
  let maxSupplyChangeEvent = changetype<MaxSupplyChange>(newMockEvent())

  maxSupplyChangeEvent.parameters = new Array()

  maxSupplyChangeEvent.parameters.push(
    new ethereum.EventParam(
      "oldMaxSupply",
      ethereum.Value.fromUnsignedBigInt(oldMaxSupply)
    )
  )
  maxSupplyChangeEvent.parameters.push(
    new ethereum.EventParam(
      "newMaxSupply",
      ethereum.Value.fromUnsignedBigInt(newMaxSupply)
    )
  )

  return maxSupplyChangeEvent
}

export function createSnapshotCreatedEvent(
  snapshotId: BigInt,
  snapshotClock: BigInt
): SnapshotCreated {
  let snapshotCreatedEvent = changetype<SnapshotCreated>(newMockEvent())

  snapshotCreatedEvent.parameters = new Array()

  snapshotCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "snapshotId",
      ethereum.Value.fromUnsignedBigInt(snapshotId)
    )
  )
  snapshotCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "snapshotClock",
      ethereum.Value.fromUnsignedBigInt(snapshotClock)
    )
  )

  return snapshotCreatedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  value: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferEvent
}
