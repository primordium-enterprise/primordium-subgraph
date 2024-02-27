import { newMockEvent } from "matchstick-as";
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  BalanceSharesManagerUpdate,
  CallExecuted,
  ChangedGuard,
  DepositRegistered,
  DisabledModule,
  DistributorUpdate,
  EnabledModule,
  MinDelayUpdate,
  OperationCanceled,
  OperationExecuted,
  OperationScheduled,
  SharesOnboarderUpdate,
  WithdrawalAssetProcessed,
  WithdrawalProcessed,
} from "../generated/PrimordiumExecutorV1/PrimordiumExecutorV1";

export function createBalanceSharesManagerUpdateEvent(
  oldBalanceSharesManager: Address,
  newBalanceSharesManager: Address
): BalanceSharesManagerUpdate {
  let balanceSharesManagerUpdateEvent = changetype<BalanceSharesManagerUpdate>(
    newMockEvent()
  );

  balanceSharesManagerUpdateEvent.parameters = new Array();

  balanceSharesManagerUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "oldBalanceSharesManager",
      ethereum.Value.fromAddress(oldBalanceSharesManager)
    )
  );
  balanceSharesManagerUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "newBalanceSharesManager",
      ethereum.Value.fromAddress(newBalanceSharesManager)
    )
  );

  return balanceSharesManagerUpdateEvent;
}

export function createCallExecutedEvent(
  target: Address,
  value: BigInt,
  data: Bytes,
  operation: i32
): CallExecuted {
  let callExecutedEvent = changetype<CallExecuted>(newMockEvent());

  callExecutedEvent.parameters = new Array();

  callExecutedEvent.parameters.push(
    new ethereum.EventParam("target", ethereum.Value.fromAddress(target))
  );
  callExecutedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  );
  callExecutedEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  );
  callExecutedEvent.parameters.push(
    new ethereum.EventParam(
      "operation",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(operation))
    )
  );

  return callExecutedEvent;
}

export function createChangedGuardEvent(guard: Address): ChangedGuard {
  let changedGuardEvent = changetype<ChangedGuard>(newMockEvent());

  changedGuardEvent.parameters = new Array();

  changedGuardEvent.parameters.push(
    new ethereum.EventParam("guard", ethereum.Value.fromAddress(guard))
  );

  return changedGuardEvent;
}

export function createDepositRegisteredEvent(
  account: Address,
  quoteAsset: Address,
  depositAmount: BigInt,
  mintAmount: BigInt
): DepositRegistered {
  let depositRegisteredEvent = changetype<DepositRegistered>(newMockEvent());

  depositRegisteredEvent.parameters = new Array();

  depositRegisteredEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  );
  depositRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "quoteAsset",
      ethereum.Value.fromAddress(quoteAsset)
    )
  );
  depositRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "depositAmount",
      ethereum.Value.fromUnsignedBigInt(depositAmount)
    )
  );
  depositRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "mintAmount",
      ethereum.Value.fromUnsignedBigInt(mintAmount)
    )
  );

  return depositRegisteredEvent;
}

export function createDistributorUpdateEvent(
  oldDistributor: Address,
  newDistributor: Address
): DistributorUpdate {
  let distributorUpdate = changetype<DistributorUpdate>(newMockEvent());

  distributorUpdate.parameters = new Array();

  distributorUpdate.parameters.push(
    new ethereum.EventParam(
      "oldDistributor",
      ethereum.Value.fromAddress(oldDistributor)
    )
  );

  distributorUpdate.parameters.push(
    new ethereum.EventParam(
      "newDistributor",
      ethereum.Value.fromAddress(newDistributor)
    )
  );

  return distributorUpdate;
}

export function createEnabledModuleEvent(module: Address): EnabledModule {
  let enabledModuleEvent = changetype<EnabledModule>(newMockEvent());

  enabledModuleEvent.parameters = new Array();

  enabledModuleEvent.parameters.push(
    new ethereum.EventParam("module", ethereum.Value.fromAddress(module))
  );

  return enabledModuleEvent;
}

export function createDisabledModuleEvent(module: Address): DisabledModule {
  let disabledModuleEvent = changetype<DisabledModule>(newMockEvent());

  disabledModuleEvent.parameters = new Array();

  disabledModuleEvent.parameters.push(
    new ethereum.EventParam("module", ethereum.Value.fromAddress(module))
  );

  return disabledModuleEvent;
}

export function createMinDelayUpdateEvent(
  oldMinDelay: BigInt,
  newMinDelay: BigInt
): MinDelayUpdate {
  let minDelayUpdateEvent = changetype<MinDelayUpdate>(newMockEvent());

  minDelayUpdateEvent.parameters = new Array();

  minDelayUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "oldMinDelay",
      ethereum.Value.fromUnsignedBigInt(oldMinDelay)
    )
  );
  minDelayUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "newMinDelay",
      ethereum.Value.fromUnsignedBigInt(newMinDelay)
    )
  );

  return minDelayUpdateEvent;
}

export function createOperationScheduledEvent(
  opNonce: BigInt,
  module: Address,
  to: Address,
  value: BigInt,
  data: Bytes,
  operation: i32,
  delay: BigInt
): OperationScheduled {
  let operationScheduledEvent = changetype<OperationScheduled>(newMockEvent());

  operationScheduledEvent.parameters = new Array();

  operationScheduledEvent.parameters.push(
    new ethereum.EventParam(
      "opNonce",
      ethereum.Value.fromUnsignedBigInt(opNonce)
    )
  );
  operationScheduledEvent.parameters.push(
    new ethereum.EventParam("module", ethereum.Value.fromAddress(module))
  );
  operationScheduledEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  );
  operationScheduledEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  );
  operationScheduledEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  );
  operationScheduledEvent.parameters.push(
    new ethereum.EventParam(
      "operation",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(operation))
    )
  );
  operationScheduledEvent.parameters.push(
    new ethereum.EventParam("delay", ethereum.Value.fromUnsignedBigInt(delay))
  );

  return operationScheduledEvent;
}

export function createOperationCanceledEvent(
  opNonce: BigInt,
  module: Address
): OperationCanceled {
  let operationCanceledEvent = changetype<OperationCanceled>(newMockEvent());

  operationCanceledEvent.parameters = new Array();

  operationCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "opNonce",
      ethereum.Value.fromUnsignedBigInt(opNonce)
    )
  );
  operationCanceledEvent.parameters.push(
    new ethereum.EventParam("module", ethereum.Value.fromAddress(module))
  );

  return operationCanceledEvent;
}

export function createOperationExecutedEvent(
  opNonce: BigInt,
  module: Address
): OperationExecuted {
  let operationExecutedEvent = changetype<OperationExecuted>(newMockEvent());

  operationExecutedEvent.parameters = new Array();

  operationExecutedEvent.parameters.push(
    new ethereum.EventParam(
      "opNonce",
      ethereum.Value.fromUnsignedBigInt(opNonce)
    )
  );
  operationExecutedEvent.parameters.push(
    new ethereum.EventParam("module", ethereum.Value.fromAddress(module))
  );

  return operationExecutedEvent;
}

export function createSharesOnboarderUpdateEvent(
  oldSharesOnboarder: Address,
  newSharesOnboarder: Address
): SharesOnboarderUpdate {
  let sharesOnboarderUpdateEvent = changetype<SharesOnboarderUpdate>(
    newMockEvent()
  );

  sharesOnboarderUpdateEvent.parameters = new Array();

  sharesOnboarderUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "oldSharesOnboarder",
      ethereum.Value.fromAddress(oldSharesOnboarder)
    )
  );
  sharesOnboarderUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "newSharesOnboarder",
      ethereum.Value.fromAddress(newSharesOnboarder)
    )
  );

  return sharesOnboarderUpdateEvent;
}

export function createWithdrawalAssetProcessedEvent(
  account: Address,
  receiver: Address,
  asset: Address,
  payout: BigInt
): WithdrawalAssetProcessed {
  let withdrawalAssetProcessedEvent = changetype<WithdrawalAssetProcessed>(
    newMockEvent()
  );

  withdrawalAssetProcessedEvent.parameters = new Array();

  withdrawalAssetProcessedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  );
  withdrawalAssetProcessedEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  );
  withdrawalAssetProcessedEvent.parameters.push(
    new ethereum.EventParam("asset", ethereum.Value.fromAddress(asset))
  );
  withdrawalAssetProcessedEvent.parameters.push(
    new ethereum.EventParam("payout", ethereum.Value.fromUnsignedBigInt(payout))
  );

  return withdrawalAssetProcessedEvent;
}

export function createWithdrawalProcessedEvent(
  account: Address,
  receiver: Address,
  sharesBurned: BigInt,
  totalSharesSupply: BigInt,
  assets: Array<Address>
): WithdrawalProcessed {
  let withdrawalProcessedEvent = changetype<WithdrawalProcessed>(
    newMockEvent()
  );

  withdrawalProcessedEvent.parameters = new Array();

  withdrawalProcessedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  );
  withdrawalProcessedEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  );
  withdrawalProcessedEvent.parameters.push(
    new ethereum.EventParam(
      "sharesBurned",
      ethereum.Value.fromUnsignedBigInt(sharesBurned)
    )
  );
  withdrawalProcessedEvent.parameters.push(
    new ethereum.EventParam(
      "totalSharesSupply",
      ethereum.Value.fromUnsignedBigInt(totalSharesSupply)
    )
  );
  withdrawalProcessedEvent.parameters.push(
    new ethereum.EventParam("assets", ethereum.Value.fromAddressArray(assets))
  );

  return withdrawalProcessedEvent;
}
