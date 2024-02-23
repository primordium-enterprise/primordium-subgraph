import {
  DelegateChanged as DelegateChangedEvent,
  DelegateVotesChanged as DelegateVotesChangedEvent,
  SnapshotCreated as SnapshotCreatedEvent,
  Transfer as TransferEvent,
} from "../generated/PrimordiumTokenV1/PrimordiumTokenV1"
import {
  Member,
  Delegate,
} from "../generated/schema"

export function handleDelegateChanged(event: DelegateChangedEvent): void {

}

export function handleDelegateVotesChanged(
  event: DelegateVotesChangedEvent,
): void {

}

export function handleSnapshotCreated(event: SnapshotCreatedEvent): void {

}

export function handleTransfer(event: TransferEvent): void {

}
