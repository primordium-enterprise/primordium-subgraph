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

export function createApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return approvalEvent
}

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

export function createEIP712DomainChangedEvent(): EIP712DomainChanged {
  let eip712DomainChangedEvent = changetype<EIP712DomainChanged>(newMockEvent())

  eip712DomainChangedEvent.parameters = new Array()

  return eip712DomainChangedEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
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

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createSharesOnboarderUpdateEvent(
  oldSharesOnboarder: Address,
  newSharesOnboarder: Address
): SharesOnboarderUpdate {
  let sharesOnboarderUpdateEvent = changetype<SharesOnboarderUpdate>(
    newMockEvent()
  )

  sharesOnboarderUpdateEvent.parameters = new Array()

  sharesOnboarderUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "oldSharesOnboarder",
      ethereum.Value.fromAddress(oldSharesOnboarder)
    )
  )
  sharesOnboarderUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "newSharesOnboarder",
      ethereum.Value.fromAddress(newSharesOnboarder)
    )
  )

  return sharesOnboarderUpdateEvent
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

export function createTreasuryChangeEvent(
  oldTreasury: Address,
  newTreasury: Address
): TreasuryChange {
  let treasuryChangeEvent = changetype<TreasuryChange>(newMockEvent())

  treasuryChangeEvent.parameters = new Array()

  treasuryChangeEvent.parameters.push(
    new ethereum.EventParam(
      "oldTreasury",
      ethereum.Value.fromAddress(oldTreasury)
    )
  )
  treasuryChangeEvent.parameters.push(
    new ethereum.EventParam(
      "newTreasury",
      ethereum.Value.fromAddress(newTreasury)
    )
  )

  return treasuryChangeEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}
