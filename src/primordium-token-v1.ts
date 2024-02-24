import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
  DelegateChanged as DelegateChangedEvent,
  DelegateVotesChanged as DelegateVotesChangedEvent,
  SnapshotCreated as SnapshotCreatedEvent,
  Transfer as TransferEvent,
} from "../generated/PrimordiumTokenV1/PrimordiumTokenV1";
import { Member, Delegate } from "../generated/schema";
import { getGovernanceData, getOrCreateMember } from "./utils";

export function handleDelegateChanged(event: DelegateChangedEvent): void {
  let member = getOrCreateMember(event.params.delegator);
  member.delegate =
    event.params.toDelegate === Address.zero()
      ? null
      : changetype<Bytes>(event.params.toDelegate);
  member.save();
}

export function handleDelegateVotesChanged(
  event: DelegateVotesChangedEvent
): void {}

export function handleSnapshotCreated(event: SnapshotCreatedEvent): void {}

export function handleTransfer(event: TransferEvent): void {
  if (event.params.from.equals(Address.zero())) {
    const governanceData = getGovernanceData();
    governanceData.totalSupply = governanceData.totalSupply.plus(
      event.params.value
    );
    governanceData.save();
  } else {
    const fromMember = getOrCreateMember(event.params.from);
    fromMember.tokenBalance = fromMember.tokenBalance.minus(event.params.value);
    fromMember.save();
  }

  if (event.params.to.equals(Address.zero())) {
    const governanceData = getGovernanceData();
    governanceData.totalSupply = governanceData.totalSupply.minus(
      event.params.value
    );
    governanceData.save();
  } else {
    const toMember = getOrCreateMember(event.params.to);
    toMember.tokenBalance = toMember.tokenBalance.plus(event.params.value);
    toMember.save();
  }
}
