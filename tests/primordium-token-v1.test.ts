import {
  afterEach,
  assert,
  beforeAll,
  beforeEach,
  clearStore,
  describe,
  test,
} from "matchstick-as/assembly/index";
import { createTransferEvent } from "./primordium-token-v1-utils";
import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { handleTransfer } from "../src/primordium-token-v1";
import { GovernanceData, Member } from "../generated/schema";
import { ADDRESS_ONE, ADDRESS_TWO } from "./test-utils";
import { getGovernanceData } from "../src/utils";

describe("handleDelegateChanged()", () => {
  test("Create de", () => {
    log.info("test message", []);
  });
});

const mintTo = Address.fromString(ADDRESS_ONE);
const mintAmount = BigInt.fromI32(100);

describe("handleTransfer()", () => {
  afterEach(() => {
    clearStore();
  });

  test("Create Member on mint", () => {
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
      handleTransfer(
        createTransferEvent(Address.zero(), mintTo, mintAmount)
      );
    });
    afterEach(clearStore);

    test("Send from address 1 to address 2", () => {
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
    });

    test("Burn some tokens", () => {
      const burnAmount = mintAmount.div(BigInt.fromI32(2));
      handleTransfer(createTransferEvent(mintTo, Address.zero(), burnAmount));

      let member: Member = Member.load(mintTo) as Member;
      assert.bigIntEquals(member.tokenBalance, mintAmount.minus(burnAmount));

      let governanceData: GovernanceData = getGovernanceData();
      assert.bigIntEquals(governanceData.totalSupply, mintAmount.minus(burnAmount));
    });

    test("Burn all tokens", () => {
      handleTransfer(createTransferEvent(mintTo, Address.zero(), mintAmount));

      let member: Member = Member.load(mintTo) as Member;
      assert.bigIntEquals(member.tokenBalance, BigInt.zero());

      let governanceData: GovernanceData = getGovernanceData();
      assert.bigIntEquals(governanceData.totalSupply, BigInt.zero());
    });
  });
});
