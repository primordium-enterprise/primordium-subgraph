import { newMockEvent } from "matchstick-as";
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import {
  BaseDeadlineExtensionUpdate,
  ExtensionDecayPeriodUpdate,
  ExtensionPercentDecayUpdate,
  GovernorBaseInitialized,
  GovernorFounded,
  MaxDeadlineExtensionUpdate,
  PercentMajorityUpdate,
  ProposalCanceled,
  ProposalCreated,
  ProposalDeadlineExtended,
  ProposalExecuted,
  ProposalGracePeriodUpdate,
  ProposalQueued,
  ProposalThresholdBPSUpdate,
  QuorumBPSUpdate,
  RoleGranted,
  RoleRevoked,
  VoteCast,
  VoteCastWithParams,
  VotingDelayUpdate,
  VotingPeriodUpdate,
} from "../generated/PrimordiumGovernorV1/PrimordiumGovernorV1";

export function createProposalCanceledEvent(
  proposalId: BigInt,
  canceler: Address
): ProposalCanceled {
  let proposalCanceledEvent = changetype<ProposalCanceled>(newMockEvent());

  proposalCanceledEvent.parameters = new Array();

  proposalCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  );

  proposalCanceledEvent.parameters.push(
    new ethereum.EventParam("canceler", ethereum.Value.fromAddress(canceler))
  );

  return proposalCanceledEvent;
}

export function createProposalCreatedEvent(
  proposalId: BigInt,
  proposer: Address,
  targets: Array<Address>,
  values: Array<BigInt>,
  calldatas: Array<Bytes>,
  signatures: Array<string>,
  voteStart: BigInt,
  voteEnd: BigInt,
  description: string
): ProposalCreated {
  let proposalCreatedEvent = changetype<ProposalCreated>(newMockEvent());

  proposalCreatedEvent.parameters = new Array();

  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  );
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam("proposer", ethereum.Value.fromAddress(proposer))
  );
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam("targets", ethereum.Value.fromAddressArray(targets))
  );
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "values",
      ethereum.Value.fromUnsignedBigIntArray(values)
    )
  );
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "calldatas",
      ethereum.Value.fromBytesArray(calldatas)
    )
  );
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "signatures",
      ethereum.Value.fromStringArray(signatures)
    )
  );
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "voteStart",
      ethereum.Value.fromUnsignedBigInt(voteStart)
    )
  );
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "voteEnd",
      ethereum.Value.fromUnsignedBigInt(voteEnd)
    )
  );
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  );

  return proposalCreatedEvent;
}

export function createProposalDeadlineExtendedEvent(
  proposalId: BigInt,
  extendedDeadline: BigInt
): ProposalDeadlineExtended {
  let proposalDeadlineExtendedEvent = changetype<ProposalDeadlineExtended>(
    newMockEvent()
  );

  proposalDeadlineExtendedEvent.parameters = new Array();

  proposalDeadlineExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  );
  proposalDeadlineExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "extendedDeadline",
      ethereum.Value.fromUnsignedBigInt(extendedDeadline)
    )
  );

  return proposalDeadlineExtendedEvent;
}

export function createProposalExecutedEvent(
  proposalId: BigInt
): ProposalExecuted {
  let proposalExecutedEvent = changetype<ProposalExecuted>(newMockEvent());

  proposalExecutedEvent.parameters = new Array();

  proposalExecutedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  );

  return proposalExecutedEvent;
}

export function createProposalQueuedEvent(
  proposalId: BigInt,
  eta: BigInt
): ProposalQueued {
  let proposalQueuedEvent = changetype<ProposalQueued>(newMockEvent());

  proposalQueuedEvent.parameters = new Array();

  proposalQueuedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  );
  proposalQueuedEvent.parameters.push(
    new ethereum.EventParam("eta", ethereum.Value.fromUnsignedBigInt(eta))
  );

  return proposalQueuedEvent;
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  expiresAt: BigInt
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent());

  roleGrantedEvent.parameters = new Array();

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  );
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  );
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam(
      "expiresAt",
      ethereum.Value.fromUnsignedBigInt(expiresAt)
    )
  );

  return roleGrantedEvent;
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent());

  roleRevokedEvent.parameters = new Array();

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  );
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  );

  return roleRevokedEvent;
}

export function createVoteCastEvent(
  voter: Address,
  proposalId: BigInt,
  support: i32,
  weight: BigInt,
  reason: string
): VoteCast {
  let voteCastEvent = changetype<VoteCast>(newMockEvent());

  voteCastEvent.parameters = new Array();

  voteCastEvent.parameters.push(
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
  );
  voteCastEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  );
  voteCastEvent.parameters.push(
    new ethereum.EventParam(
      "support",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(support))
    )
  );
  voteCastEvent.parameters.push(
    new ethereum.EventParam("weight", ethereum.Value.fromUnsignedBigInt(weight))
  );
  voteCastEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  );

  return voteCastEvent;
}

export function createVoteCastWithParamsEvent(
  voter: Address,
  proposalId: BigInt,
  support: i32,
  weight: BigInt,
  reason: string,
  params: Bytes
): VoteCastWithParams {
  let voteCastWithParamsEvent = changetype<VoteCastWithParams>(newMockEvent());

  voteCastWithParamsEvent.parameters = new Array();

  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
  );
  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  );
  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam(
      "support",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(support))
    )
  );
  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam("weight", ethereum.Value.fromUnsignedBigInt(weight))
  );
  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  );
  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam("params", ethereum.Value.fromBytes(params))
  );

  return voteCastWithParamsEvent;
}

export function createProposalThresholdBPSUpdateEvent(
  oldProposalThresholdBps: BigInt,
  newProposalThresholdBps: BigInt
): ProposalThresholdBPSUpdate {
  let proposalThresholdBpsUpdate = changetype<ProposalThresholdBPSUpdate>(
    newMockEvent()
  );

  proposalThresholdBpsUpdate.parameters = new Array();

  proposalThresholdBpsUpdate.parameters.push(
    new ethereum.EventParam(
      "oldProposalThresholdBps",
      ethereum.Value.fromUnsignedBigInt(oldProposalThresholdBps)
    )
  );

  proposalThresholdBpsUpdate.parameters.push(
    new ethereum.EventParam(
      "newProposalThresholdBps",
      ethereum.Value.fromUnsignedBigInt(newProposalThresholdBps)
    )
  );

  return proposalThresholdBpsUpdate;
}

export function createQuorumBPSUpdateEvent(
  oldQuorumBps: BigInt,
  newQuorumBps: BigInt
): QuorumBPSUpdate {
  let quorumBpsUpdate = changetype<QuorumBPSUpdate>(newMockEvent());

  quorumBpsUpdate.parameters = new Array();

  quorumBpsUpdate.parameters.push(
    new ethereum.EventParam(
      "oldQuorumBps",
      ethereum.Value.fromUnsignedBigInt(oldQuorumBps)
    )
  );

  quorumBpsUpdate.parameters.push(
    new ethereum.EventParam(
      "newQuorumBps",
      ethereum.Value.fromUnsignedBigInt(newQuorumBps)
    )
  );

  return quorumBpsUpdate;
}

export function createProposalGracePeriodUpdateEvent(
  oldGracePeriod: BigInt,
  newGracePeriod: BigInt
): ProposalGracePeriodUpdate {
  let proposalGracePeriodUpdate = changetype<ProposalGracePeriodUpdate>(
    newMockEvent()
  );

  proposalGracePeriodUpdate.parameters = new Array();

  proposalGracePeriodUpdate.parameters.push(
    new ethereum.EventParam(
      "oldGracePeriod",
      ethereum.Value.fromUnsignedBigInt(oldGracePeriod)
    )
  );

  proposalGracePeriodUpdate.parameters.push(
    new ethereum.EventParam(
      "newGracePeriod",
      ethereum.Value.fromUnsignedBigInt(newGracePeriod)
    )
  );

  return proposalGracePeriodUpdate;
}

export function createGovernorBaseInitializedEvent(
  executor: Address,
  token: Address,
  governanceCanBeginAt: BigInt,
  governanceThresholdBps: BigInt,
  isFounded: boolean
): GovernorBaseInitialized {
  let governorBaseInitializedEvent = changetype<GovernorBaseInitialized>(
    newMockEvent()
  );

  governorBaseInitializedEvent.parameters = new Array();

  governorBaseInitializedEvent.parameters.push(
    new ethereum.EventParam("executor", ethereum.Value.fromAddress(executor))
  );

  governorBaseInitializedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  );

  governorBaseInitializedEvent.parameters.push(
    new ethereum.EventParam(
      "governanceCanBeginAt",
      ethereum.Value.fromUnsignedBigInt(governanceCanBeginAt)
    )
  );

  governorBaseInitializedEvent.parameters.push(
    new ethereum.EventParam(
      "governanceThresholdBps",
      ethereum.Value.fromUnsignedBigInt(governanceThresholdBps)
    )
  );

  governorBaseInitializedEvent.parameters.push(
    new ethereum.EventParam("isFounded", ethereum.Value.fromBoolean(isFounded))
  );

  return governorBaseInitializedEvent;
}

export function createGovernorFoundedEvent(
  proposalId: BigInt
): GovernorFounded {
  let governorFoundedEvent = changetype<GovernorFounded>(newMockEvent());

  governorFoundedEvent.parameters = new Array();

  governorFoundedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  );

  return governorFoundedEvent;
}

export function createVotingDelayUpdateEvent(
  oldVotingDelay: BigInt,
  newVotingDelay: BigInt
): VotingDelayUpdate {
  let votingDelayUpdate = changetype<VotingDelayUpdate>(newMockEvent());

  votingDelayUpdate.parameters = new Array();

  votingDelayUpdate.parameters.push(
    new ethereum.EventParam(
      "oldVotingDelay",
      ethereum.Value.fromUnsignedBigInt(oldVotingDelay)
    )
  );

  votingDelayUpdate.parameters.push(
    new ethereum.EventParam(
      "newVotingDelay",
      ethereum.Value.fromUnsignedBigInt(newVotingDelay)
    )
  );

  return votingDelayUpdate;
}

export function createVotingPeriodUpdateEvent(
  oldVotingPeriod: BigInt,
  newVotingPeriod: BigInt
): VotingPeriodUpdate {
  let votingPeriodUpdate = changetype<VotingPeriodUpdate>(newMockEvent());

  votingPeriodUpdate.parameters = new Array();

  votingPeriodUpdate.parameters.push(
    new ethereum.EventParam(
      "oldVotingPeriod",
      ethereum.Value.fromUnsignedBigInt(oldVotingPeriod)
    )
  );

  votingPeriodUpdate.parameters.push(
    new ethereum.EventParam(
      "newVotingPeriod",
      ethereum.Value.fromUnsignedBigInt(newVotingPeriod)
    )
  );

  return votingPeriodUpdate;
}

export function createPercentMajorityUpdateEvent(
  oldPercentMajority: BigInt,
  newPercentMajority: BigInt
): PercentMajorityUpdate {
  let percentMajorityUpdate = changetype<PercentMajorityUpdate>(newMockEvent());

  percentMajorityUpdate.parameters = new Array();

  percentMajorityUpdate.parameters.push(
    new ethereum.EventParam(
      "oldPercentMajority",
      ethereum.Value.fromUnsignedBigInt(oldPercentMajority)
    )
  );

  percentMajorityUpdate.parameters.push(
    new ethereum.EventParam(
      "newPercentMajority",
      ethereum.Value.fromUnsignedBigInt(newPercentMajority)
    )
  );

  return percentMajorityUpdate;
}

export function createMaxDeadlineExtensionUpdateEvent(
  oldMaxDeadlineExtension: BigInt,
  newMaxDeadlineExtension: BigInt
): MaxDeadlineExtensionUpdate {
  let maxDeadlineExtensionUpdate = changetype<MaxDeadlineExtensionUpdate>(
    newMockEvent()
  );

  maxDeadlineExtensionUpdate.parameters = new Array();

  maxDeadlineExtensionUpdate.parameters.push(
    new ethereum.EventParam(
      "oldMaxDeadlineExtension",
      ethereum.Value.fromUnsignedBigInt(oldMaxDeadlineExtension)
    )
  );

  maxDeadlineExtensionUpdate.parameters.push(
    new ethereum.EventParam(
      "newMaxDeadlineExtension",
      ethereum.Value.fromUnsignedBigInt(newMaxDeadlineExtension)
    )
  );

  return maxDeadlineExtensionUpdate;
}

export function createBaseDeadlineExtensionUpdateEvent(
  oldBaseDeadlineExtension: BigInt,
  newBaseDeadlineExtension: BigInt
): BaseDeadlineExtensionUpdate {
  let baseDeadlineExtensionUpdate = changetype<BaseDeadlineExtensionUpdate>(
    newMockEvent()
  );

  baseDeadlineExtensionUpdate.parameters = new Array();

  baseDeadlineExtensionUpdate.parameters.push(
    new ethereum.EventParam(
      "oldBaseDeadlineExtension",
      ethereum.Value.fromUnsignedBigInt(oldBaseDeadlineExtension)
    )
  );

  baseDeadlineExtensionUpdate.parameters.push(
    new ethereum.EventParam(
      "newBaseDeadlineExtension",
      ethereum.Value.fromUnsignedBigInt(newBaseDeadlineExtension)
    )
  );

  return baseDeadlineExtensionUpdate;
}

export function createExtensionDecayPeriodUpdateEvent(
  oldDecayPeriod: BigInt,
  newDecayPeriod: BigInt
): ExtensionDecayPeriodUpdate {
  let extensionDecayPeriodUpdate = changetype<ExtensionDecayPeriodUpdate>(
    newMockEvent()
  );

  extensionDecayPeriodUpdate.parameters = new Array();

  extensionDecayPeriodUpdate.parameters.push(
    new ethereum.EventParam(
      "oldDecayPeriod",
      ethereum.Value.fromUnsignedBigInt(oldDecayPeriod)
    )
  );

  extensionDecayPeriodUpdate.parameters.push(
    new ethereum.EventParam(
      "newDecayPeriod",
      ethereum.Value.fromUnsignedBigInt(newDecayPeriod)
    )
  );

  return extensionDecayPeriodUpdate;
}

export function createExtensionPercentDecayUpdateEvent(
  oldPercentDecay: BigInt,
  newPercentDecay: BigInt
): ExtensionPercentDecayUpdate {
  let extensionPercentDecayUpdate = changetype<ExtensionPercentDecayUpdate>(
    newMockEvent()
  );

  extensionPercentDecayUpdate.parameters = new Array();

  extensionPercentDecayUpdate.parameters.push(
    new ethereum.EventParam(
      "oldPercentDecay",
      ethereum.Value.fromUnsignedBigInt(oldPercentDecay)
    )
  );

  extensionPercentDecayUpdate.parameters.push(
    new ethereum.EventParam(
      "newPercentDecay",
      ethereum.Value.fromUnsignedBigInt(newPercentDecay)
    )
  );

  return extensionPercentDecayUpdate;
}
