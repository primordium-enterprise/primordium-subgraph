import { store } from "@graphprotocol/graph-ts";
import {
  BalanceSharesManagerUpdate as BalanceSharesManagerUpdateEvent,
  CallExecuted as CallExecutedEvent,
  ChangedGuard as ChangedGuardEvent,
  DepositRegistered as DepositRegisteredEvent,
  DisabledModule as DisabledModuleEvent,
  DistributorUpdate,
  EnabledModule as EnabledModuleEvent,
  MinDelayUpdate as MinDelayUpdateEvent,
  OperationCanceled as OperationCanceledEvent,
  OperationExecuted as OperationExecutedEvent,
  OperationScheduled as OperationScheduledEvent,
  SharesOnboarderUpdate as SharesOnboarderUpdateEvent,
  WithdrawalAssetProcessed as WithdrawalAssetProcessedEvent,
  WithdrawalProcessed as WithdrawalProcessedEvent,
} from "../generated/PrimordiumExecutorV1/PrimordiumExecutorV1";
import { ExecutorCallExecutedEvent, ExecutorModule, ExecutorOperation } from "../generated/schema";
import { formatBigIntAsId, getExecutorData } from "./utils";

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

export function handleOperationScheduled(event: OperationScheduledEvent): void {
  let entity = new ExecutorOperation(formatBigIntAsId(event.params.opNonce));
  entity.module = event.params.module
  entity.to = event.params.to
  entity.value = event.params.txValue
  entity.calldata = event.params.data
  entity.operation = event.params.operation
  entity.delay = event.params.delay
  entity.scheduledAtBlock = event.block.number
  entity.scheduledAtTimestamp = event.block.timestamp

  entity.isCanceled = false;
  entity.isExecuted = false;

  entity.save()
}

export function handleOperationCanceled(event: OperationCanceledEvent): void {
  let entity = ExecutorOperation.load(formatBigIntAsId(event.params.opNonce)) as ExecutorOperation;
  entity.isCanceled = true;
  entity.canceledAtBlock = event.block.number;
  entity.canceledAtTimestamp = event.block.timestamp;
  entity.save();
}

export function handleOperationExecuted(event: OperationExecutedEvent): void {
  let entity = ExecutorOperation.load(formatBigIntAsId(event.params.opNonce)) as ExecutorOperation;
  entity.isExecuted = true;
  entity.executedAtBlock = event.block.number;
  entity.executedAtTimestamp = event.block.timestamp;
  entity.save()
}

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
