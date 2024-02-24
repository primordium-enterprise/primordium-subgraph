import {
  afterEach,
  assert,
  beforeAll,
  beforeEach,
  clearStore,
  describe,
  test,
} from "matchstick-as/assembly/index";
import {
  createDelegateChangedEvent,
  createTransferEvent,
} from "./primordium-token-v1-utils";
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import {
  handleTransfer,
  handleDelegateChanged,
} from "../src/primordium-token-v1";
import { GovernanceData, Member } from "../generated/schema";
import { ADDRESS_ONE, ADDRESS_THREE, ADDRESS_TWO } from "./test-utils";
import { getGovernanceData, getOrCreateMember } from "../src/utils";

const delegator = Address.fromString(ADDRESS_ONE);

describe("handleDelegateChanged()", () => {
  test("delegate for first time", () => {
    const fromDelegate = Address.zero();
    const toDelegate = Address.fromString(ADDRESS_TWO);

    let member = getOrCreateMember(delegator);
    assert.assertTrue(!member.delegate); // null

    handleDelegateChanged(
      createDelegateChangedEvent(delegator, fromDelegate, toDelegate)
    );

    member = Member.load(delegator) as Member;
    assert.assertTrue(!!member.delegate); // not null
    assert.bytesEquals(member.delegate as Bytes, toDelegate);
  });

  test("delegate to self", () => {
    handleDelegateChanged(
      createDelegateChangedEvent(delegator, Address.fromString(ADDRESS_TWO), delegator)
    );

    let member = Member.load(delegator) as Member;
    assert.bytesEquals(member.delegate as Bytes, delegator);
  });

  test("remove delegate", () => {
    let member = Member.load(delegator) as Member;
    handleDelegateChanged(
      createDelegateChangedEvent(
        delegator,
        Address.fromBytes(member.delegate as Bytes),
        Address.zero()
      )
    );

    member = Member.load(delegator) as Member;
    assert.assertTrue(!member.delegate); // null
  });
});

const mintTo = Address.fromString(ADDRESS_ONE);
const mintAmount = BigInt.fromI32(100);

describe("handleTransfer()", () => {
  afterEach(() => {
    clearStore();
  });

  test("create Member on mint", () => {
    const mintEvent = createTransferEvent(Address.zero(), mintTo, mintAmount);

    handleTransfer(mintEvent);

    let member: Member = Member.load(changetype<Bytes>(mintTo)) as Member;
    assert.assertNotNull(member);
    assert.bytesEquals(member.id, changetype<Bytes>(mintTo));
    assert.bigIntEquals(member.tokenBalance, mintAmount);

    let governanceData: GovernanceData = getGovernanceData();
    assert.assertNotNull(governanceData);
    assert.bigIntEquals(governanceData.totalSupply, mintAmount);
  });

  describe("transfers and burns...", () => {
    beforeEach(() => {
      handleTransfer(createTransferEvent(Address.zero(), mintTo, mintAmount));
    });
    afterEach(clearStore);

    test("send from address 1 to address 2", () => {
      const transferredTo = Address.fromString(ADDRESS_TWO);
      const transferredAmount = mintAmount.div(BigInt.fromI32(2));
      handleTransfer(
        createTransferEvent(mintTo, transferredTo, transferredAmount)
      );

      let fromMember: Member = Member.load(mintTo) as Member;
      assert.bigIntEquals(fromMember.tokenBalance, transferredAmount);

      let toMember: Member = Member.load(transferredTo) as Member;
      assert.assertNotNull(toMember);
      assert.addressEquals(transferredTo, Address.fromBytes(toMember.id));
      assert.bigIntEquals(toMember.tokenBalance, transferredAmount);

      let governanceData: GovernanceData = getGovernanceData();
      assert.bigIntEquals(governanceData.totalSupply, mintAmount);
    });

    test("burn some tokens", () => {
      const burnAmount = mintAmount.div(BigInt.fromI32(2));
      handleTransfer(createTransferEvent(mintTo, Address.zero(), burnAmount));

      let member: Member = Member.load(mintTo) as Member;
      assert.bigIntEquals(member.tokenBalance, mintAmount.minus(burnAmount));

      let governanceData: GovernanceData = getGovernanceData();
      assert.bigIntEquals(
        governanceData.totalSupply,
        mintAmount.minus(burnAmount)
      );
    });

    test("burn all tokens", () => {
      handleTransfer(createTransferEvent(mintTo, Address.zero(), mintAmount));

      let member: Member = Member.load(mintTo) as Member;
      assert.bigIntEquals(member.tokenBalance, BigInt.zero());

      let governanceData: GovernanceData = getGovernanceData();
      assert.bigIntEquals(governanceData.totalSupply, BigInt.zero());
    });
  });
});
