import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  assert,
  beforeAll,
  beforeEach,
  clearStore,
  describe,
  test,
} from "matchstick-as";
import { ADDRESS_1 } from "./test-utils";
import {
  handleRoleGranted,
  handleRoleRevoked,
} from "../src/primordium-governor-v1";
import {
  createRoleGrantedEvent,
  createRoleRevokedEvent,
} from "./primordium-governor-v1-utils";
import {
  CANCELER_ROLE,
  PROPOSER_ROLE,
  getOrCreateDelegate,
} from "../src/utils";
import { Delegate } from "../generated/schema";

const account = Address.fromString(ADDRESS_1);
const expiresAt = BigInt.fromI32(2);

describe("handleRoleGranted()", () => {
  beforeAll(clearStore);

  test("proposer role", () => {
    handleRoleGranted(
      createRoleGrantedEvent(PROPOSER_ROLE, account, expiresAt)
    );
    let delegate = Delegate.load(account) as Delegate;
    assert.bigIntEquals(delegate.proposerRoleExpiresAt, expiresAt);
  });

  test("canceler role", () => {
    handleRoleGranted(
      createRoleGrantedEvent(CANCELER_ROLE, account, expiresAt)
    );
    let delegate = Delegate.load(account) as Delegate;
    assert.bigIntEquals(delegate.cancelerRoleExpiresAt, expiresAt);
  });
});

describe("handleRoleRevoked()", () => {
  beforeAll(() => {
    clearStore();

    let delegate = getOrCreateDelegate(account);
    delegate.proposerRoleExpiresAt = expiresAt;
    delegate.cancelerRoleExpiresAt = expiresAt;
    delegate.save();
  });

  test("proposer role", () => {
    handleRoleRevoked(createRoleRevokedEvent(PROPOSER_ROLE, account));
    let delegate = Delegate.load(account) as Delegate;
    assert.bigIntEquals(BigInt.zero(), delegate.proposerRoleExpiresAt);
  });

  test("canceler role", () => {
    handleRoleRevoked(createRoleRevokedEvent(CANCELER_ROLE, account));
    let delegate = Delegate.load(account) as Delegate;
    assert.bigIntEquals(BigInt.zero(), delegate.cancelerRoleExpiresAt);
  });
});
