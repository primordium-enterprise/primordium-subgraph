import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
  DelegateChanged as DelegateChangedEvent,
  DelegateVotesChanged as DelegateVotesChangedEvent,
  SnapshotCreated as SnapshotCreatedEvent,
  Transfer as TransferEvent,
} from "../generated/PrimordiumTokenV1/PrimordiumTokenV1";
import { Member, Delegate } from "../generated/schema";
import { getGovernanceData, getOrCreateMember } from "./utils";
import { log } from "matchstick-as";

export function handleDelegateChanged(event: DelegateChangedEvent): void {
  let member = getOrCreateMember(event.params.delegator);

  if (
    event.params.fromDelegate.notEqual(
      !!member.delegate ? member.delegate as Bytes : Address.zero()
    )
  ) {
    log.warning(
      "Current member 'delegate' field does not match the event 'fromDelegate' param.\ndelegate: {}\nfromDelegate: {}\nevent transaction hash: {}",
      [
        !!member.delegate ? (member.delegate as Bytes).toHex() : "null",
        event.params.fromDelegate.toHex(),
        event.transaction.hash.toHex(),
      ]
    );
  }

  // Set to new delegate (or null if address(0))
  member.delegate = event.params.toDelegate.equals(Address.zero())
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
