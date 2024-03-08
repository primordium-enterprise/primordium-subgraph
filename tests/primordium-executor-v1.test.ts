import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  beforeEach,
} from "matchstick-as/assembly/index";
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  createBalanceSharesManagerUpdateEvent,
  createCallExecutedEvent,
  createChangedGuardEvent,
  createDepositRegisteredEvent,
  createDisabledModuleEvent,
  createDistributorUpdateEvent,
  createEnabledModuleEvent,
  createMinDelayUpdateEvent,
  createOperationCanceledEvent,
  createOperationExecutedEvent,
  createOperationScheduledEvent,
  createSharesOnboarderUpdateEvent,
  createWithdrawalProcessedEvent,
} from "./primordium-executor-v1-utils";
import { address1, address2, address3 } from "./test-utils";
import {
  handleBalanceSharesManagerUpdate,
  handleCallExecuted,
  handleChangedGuard,
  handleDepositRegistered,
  handleDisabledModule,
  handleDistributorUpdate,
  handleEnabledModule,
  handleMinDelayUpdate,
  handleOperationCanceled,
  handleOperationExecuted,
  handleOperationScheduled,
  handleSharesOnboarderUpdate,
  handleWithdrawalProcessed,
} from "../src/primordium-executor-v1";
import { formatBigIntAsId, getGovernanceData } from "../src/utils";
import {
  DepositRegistered,
  ExecutorCallExecutedEvent,
  ExecutorModule,
  ExecutorOperation,
  WithdrawalProcessed,
} from "../generated/schema";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("executor data updates...", () => {
  beforeEach(clearStore);

  test("handleBalanceSharesManagerUpdate()", () => {
    const event = createBalanceSharesManagerUpdateEvent(
      Address.zero(),
      address1
    );
    handleBalanceSharesManagerUpdate(event);

    let governanceData = getGovernanceData();
    assert.bytesEquals(
      event.params.newBalanceSharesManager,
      governanceData.balanceSharesManager
    );
  });

  test("handleSharesOnboarderUpdate()", () => {
    const event = createSharesOnboarderUpdateEvent(Address.zero(), address1);
    handleSharesOnboarderUpdate(event);

    let governanceData = getGovernanceData();
    assert.bytesEquals(
      event.params.newSharesOnboarder,
      governanceData.sharesOnboarder
    );
  });

  test("handleDistributorUpdate()", () => {
    const event = createDistributorUpdateEvent(Address.zero(), address1);
    handleDistributorUpdate(event);

    let governanceData = getGovernanceData();
    assert.bytesEquals(event.params.newDistributor, governanceData.distributor);
  });

  test("handleChangedGuard()", () => {
    const event = createChangedGuardEvent(address1);
    handleChangedGuard(event);

    let governanceData = getGovernanceData();
    assert.bytesEquals(event.params.guard, governanceData.guard);
  });

  test("handleMinDelayUpdate()", () => {
    const event = createMinDelayUpdateEvent(BigInt.zero(), BigInt.fromI32(500));
    handleMinDelayUpdate(event);

    let governanceData = getGovernanceData();
    assert.bigIntEquals(event.params.newMinDelay, governanceData.executorMinDelay);
  });
});

describe("executor module updates...", () => {
  beforeAll(clearStore);

  test("handleEnabledModule()", () => {
    const event = createEnabledModuleEvent(address1);
    handleEnabledModule(event);

    let module = ExecutorModule.load(address1) as ExecutorModule;
    assert.booleanEquals(true, module.enabled);
    assert.bigIntEquals(event.block.number, module.enabledAtBlock);
    assert.bigIntEquals(event.block.timestamp, module.enabledAtTimestamp);
  });

  test("handleDisabledModule()", () => {
    const event = createDisabledModuleEvent(address1);
    handleDisabledModule(event);

    let module = ExecutorModule.load(address1);
    assert.assertTrue(!module);

    const reenableEvent = createEnabledModuleEvent(address1);
    reenableEvent.block.number = event.block.number.plus(BigInt.fromI32(1));
    handleEnabledModule(reenableEvent);

    module = ExecutorModule.load(address1) as ExecutorModule;
    assert.booleanEquals(true, module.enabled);
    assert.bigIntEquals(reenableEvent.block.number, module.enabledAtBlock);
  });
});

test("handleCallExecuted()", () => {
  const event = createCallExecutedEvent(
    address1,
    BigInt.fromI32(1),
    Bytes.fromUTF8("random calldata bytes"),
    0
  );
  handleCallExecuted(event);

  let entity = ExecutorCallExecutedEvent.load(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  ) as ExecutorCallExecutedEvent;
  assert.bytesEquals(event.params.target, entity.target);
  assert.bigIntEquals(event.params.txValue, entity.value);
  assert.bytesEquals(event.params.data, entity.calldata);
  assert.i32Equals(event.params.operation, entity.operation);
  assert.bigIntEquals(event.block.number, entity.blockNumber);
  assert.bigIntEquals(event.block.timestamp, entity.blockTimestamp);
});

const opNonce = BigInt.fromI32(1);
describe("executor operations...", () => {
  beforeAll(clearStore);

  test("handleOperationScheduled()", () => {
    const event = createOperationScheduledEvent(
      opNonce,
      address1,
      address2,
      BigInt.fromI32(1),
      Bytes.fromUTF8("random calldata bytes"),
      1,
      BigInt.fromI32(100)
    );
    handleOperationScheduled(event);

    let entity = ExecutorOperation.load(
      formatBigIntAsId(event.params.opNonce)
    ) as ExecutorOperation;
    assert.bytesEquals(event.params.module, entity.module);
    assert.bytesEquals(event.params.to, entity.to);
    assert.bigIntEquals(event.params.txValue, entity.value);
    assert.bytesEquals(event.params.data, entity.calldata);
    assert.i32Equals(event.params.operation, entity.operation);
    assert.bigIntEquals(event.block.number, entity.scheduledAtBlock);
    assert.bigIntEquals(event.block.timestamp, entity.scheduledAtTimestamp);
    assert.booleanEquals(false, entity.isCanceled);
    assert.booleanEquals(false, entity.isExecuted);
  });

  test("handleOperationCanceled()", () => {
    const event = createOperationCanceledEvent(opNonce, address1);
    handleOperationCanceled(event);

    let entity = ExecutorOperation.load(
      formatBigIntAsId(event.params.opNonce)
    ) as ExecutorOperation;
    assert.booleanEquals(true, entity.isCanceled);
    assert.bigIntEquals(event.block.number, entity.canceledAtBlock as BigInt);
    assert.bigIntEquals(
      event.block.timestamp,
      entity.canceledAtTimestamp as BigInt
    );
  });

  test("handleOperationExecuted()", () => {
    const event = createOperationExecutedEvent(opNonce, address1);
    handleOperationExecuted(event);

    let entity = ExecutorOperation.load(
      formatBigIntAsId(event.params.opNonce)
    ) as ExecutorOperation;
    assert.booleanEquals(true, entity.isExecuted);
    assert.bigIntEquals(event.block.number, entity.executedAtBlock as BigInt);
    assert.bigIntEquals(
      event.block.timestamp,
      entity.executedAtTimestamp as BigInt
    );
  });
});

describe("deposits and withdrawals...", () => {
  beforeAll(clearStore)

  test("handleDepositRegistered()", () => {
    const event = createDepositRegisteredEvent(address1, Address.zero(), BigInt.fromI32(1), BigInt.fromI32(200));
    handleDepositRegistered(event);

    let entity = DepositRegistered.load(event.transaction.hash.concatI32(event.logIndex.toI32())) as DepositRegistered;
    assert.bytesEquals(event.params.account, entity.account);
    assert.bytesEquals(event.params.quoteAsset, entity.quoteAsset);
    assert.bigIntEquals(event.params.depositAmount, entity.depositAmount);
    assert.bigIntEquals(event.params.mintAmount, entity.mintAmount);
    assert.bigIntEquals(event.block.number, entity.blockNumber);
    assert.bigIntEquals(event.block.timestamp, entity.blockTimestamp);
    assert.bytesEquals(event.transaction.hash, entity.transactionHash);
  })

  test("handleWithdrawalProcessed()", () => {
    const event = createWithdrawalProcessedEvent(address1, address2, BigInt.fromI32(200), BigInt.fromI32(10000), [Address.zero()], [BigInt.fromI32(1)]);
    handleWithdrawalProcessed(event);

    let entity = WithdrawalProcessed.load(event.transaction.hash.concatI32(event.logIndex.toI32())) as WithdrawalProcessed;
    assert.bytesEquals(event.params.account, entity.account);
    assert.bytesEquals(event.params.receiver, entity.receiver);
    assert.bigIntEquals(event.params.sharesBurned, entity.sharesBurned);
    assert.bigIntEquals(event.params.totalSharesSupply, entity.totalSharesSupply);
    assert.i32Equals(event.params.assets.length, entity.assets.length);
    assert.i32Equals(entity.assets.length, entity.payouts.length);
    for (let i = 0; i < event.params.assets.length; i++) {
      assert.bytesEquals(event.params.assets[i], entity.assets[i]);
      assert.bigIntEquals(event.params.payouts[i], entity.payouts[i]);
    }
    assert.bigIntEquals(event.block.number, entity.blockNumber);
    assert.bigIntEquals(event.block.timestamp, entity.blockTimestamp);
    assert.bytesEquals(event.transaction.hash, entity.transactionHash);
  })
})
