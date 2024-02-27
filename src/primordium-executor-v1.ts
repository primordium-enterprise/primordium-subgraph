import { store } from "@graphprotocol/graph-ts";
import {
  BalanceSharesManagerUpdate as BalanceSharesManagerUpdateEvent,
  CallExecuted as CallExecutedEvent,
  ChangedGuard as ChangedGuardEvent,
  DepositRegistered as DepositRegisteredEvent,
  DisabledModule as DisabledModuleEvent,
  DistributorUpdate,
  EnabledModule as EnabledModuleEvent,
  ExecutionFromModuleFailure as ExecutionFromModuleFailureEvent,
  ExecutionFromModuleSuccess as ExecutionFromModuleSuccessEvent,
  MinDelayUpdate as MinDelayUpdateEvent,
  OperationCanceled as OperationCanceledEvent,
  OperationExecuted as OperationExecutedEvent,
  OperationScheduled as OperationScheduledEvent,
  SharesOnboarderUpdate as SharesOnboarderUpdateEvent,
  WithdrawalAssetProcessed as WithdrawalAssetProcessedEvent,
  WithdrawalProcessed as WithdrawalProcessedEvent,
} from "../generated/PrimordiumExecutorV1/PrimordiumExecutorV1";
import { ExecutorCallExecutedEvent, ExecutorData, ExecutorModule } from "../generated/schema";
import { getExecutorData, getExecutorModule } from "./utils";

export function handleBalanceSharesManagerUpdate(
  event: BalanceSharesManagerUpdateEvent
): void {
  let executorData = getExecutorData();
  executorData.balanceSharesManager = event.params.newBalanceSharesManager;
  executorData.save();
}

export function handleSharesOnboarderUpdate(
  event: SharesOnboarderUpdateEvent
): void {
  let executorData = getExecutorData();
  executorData.sharesOnboarder = event.params.newSharesOnboarder;
  executorData.save();
}

export function handleDistributorUpdate(event: DistributorUpdate): void {
  let executorData = getExecutorData();
  executorData.distributor = event.params.newDistributor;
  executorData.save();
}

export function handleChangedGuard(event: ChangedGuardEvent): void {
  let executorData = getExecutorData();
  executorData.guard = event.params.guard;
  executorData.save();
}

export function handleMinDelayUpdate(event: MinDelayUpdateEvent): void {
  let executorData = getExecutorData();
  executorData.minDelay = event.params.newMinDelay;
  executorData.save();
}

export function handleEnabledModule(event: EnabledModuleEvent): void {
  let executorModule = new ExecutorModule(event.params.module);
  executorModule.enabled = true;
  executorModule.enabledAtBlock = event.block.number;
  executorModule.enabledAtTimestamp = event.block.timestamp;
  executorModule.save();
}

export function handleDisabledModule(event: DisabledModuleEvent): void {
  store.remove("ExecutorModule", event.params.module.toHex());
  // executorModule.enabled = false;
  // executorModule.enabledAtBlock = null;
  // executorModule.enabledAtTimestamp = null;
  // executorModule.save();
}

export function handleCallExecuted(event: CallExecutedEvent): void {
  let entity = new ExecutorCallExecutedEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.target = event.params.target;
  entity.value = event.params.txValue;
  entity.calldata = event.params.data;
  entity.operation = event.params.operation;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

// export function handleOperationScheduled(event: OperationScheduledEvent): void {
//   let entity = new OperationScheduled(
//     event.transaction.hash.concatI32(event.logIndex.toI32()),
//   )
//   entity.opNonce = event.params.opNonce
//   entity.module = event.params.module
//   entity.to = event.params.to
//   entity.value = event.params.value
//   entity.data = event.params.data
//   entity.operation = event.params.operation
//   entity.delay = event.params.delay

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleOperationCanceled(event: OperationCanceledEvent): void {
//   let entity = new OperationCanceled(
//     event.transaction.hash.concatI32(event.logIndex.toI32()),
//   )
//   entity.opNonce = event.params.opNonce
//   entity.module = event.params.module

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleOperationExecuted(event: OperationExecutedEvent): void {
//   let entity = new OperationExecuted(
//     event.transaction.hash.concatI32(event.logIndex.toI32()),
//   )
//   entity.opNonce = event.params.opNonce
//   entity.module = event.params.module

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleDepositRegistered(event: DepositRegisteredEvent): void {
//   let entity = new DepositRegistered(
//     event.transaction.hash.concatI32(event.logIndex.toI32()),
//   )
//   entity.account = event.params.account
//   entity.quoteAsset = event.params.quoteAsset
//   entity.depositAmount = event.params.depositAmount
//   entity.mintAmount = event.params.mintAmount

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleWithdrawalAssetProcessed(
//   event: WithdrawalAssetProcessedEvent,
// ): void {
//   let entity = new WithdrawalAssetProcessed(
//     event.transaction.hash.concatI32(event.logIndex.toI32()),
//   )
//   entity.account = event.params.account
//   entity.receiver = event.params.receiver
//   entity.asset = event.params.asset
//   entity.payout = event.params.payout

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

// export function handleWithdrawalProcessed(
//   event: WithdrawalProcessedEvent,
// ): void {
//   let entity = new WithdrawalProcessed(
//     event.transaction.hash.concatI32(event.logIndex.toI32()),
//   )
//   entity.account = event.params.account
//   entity.receiver = event.params.receiver
//   entity.sharesBurned = event.params.sharesBurned
//   entity.totalSharesSupply = event.params.totalSharesSupply
//   entity.assets = event.params.assets

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }
