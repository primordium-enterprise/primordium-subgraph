import {
  Address,
  BigInt,
  ByteArray,
  Bytes,
  crypto,
  ethereum,
} from "@graphprotocol/graph-ts";
import {
  Delegate,
  ExecutorData,
  ExecutorModule,
  GovernanceData,
  Member,
  Proposal,
  ProposalVote,
} from "../generated/schema";

/**
 * Extracts the title from a proposal markdown description. Looks for the first occurrence of a top-level heading to use
 * as the title (either `# Title` or `Title\n===`), or returns "Untitled" if none is found.
 */
export function extractTitleFromDescription(description: string): string {
  // Default to "Untitled"
  let title = "Untitled";

  // Check, line by line, for `# Title' or 'Title\n=='
  let lines = description.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line.startsWith("# ")) {
      title = line.substring(2).trimStart(); // Trim off the markdown "# "
      break;
    } else if (i < lines.length - 1) {
      let nextLine = lines[i + 1].trim();
      // If next line is exclusively 1 or more "=" characters, then this is a markdown title
      let split = nextLine.split("=");
      if (split.length > 1 && split.every((item) => item.length === 0)) {
        title = line;
        break;
      }
    }
  }

  // Remove markdown bold and italics
  return title.replaceAll("**", "").replaceAll("__", "");
}

export function getOrCreateMember(address: Address): Member {
  let id = changetype<Bytes>(address);
  let member = Member.load(id);

  if (member == null) {
    member = new Member(id);
    member.tokenBalance = BigInt.zero();
    member.save();
  }

  return member;
}

export function getOrCreateDelegate(address: Address): Delegate {
  let id = changetype<Bytes>(address);
  let delegate = Delegate.load(id);

  if (delegate == null) {
    delegate = new Delegate(id);
    delegate.delegatedVotesBalance = BigInt.zero();
    delegate.proposerRoleExpiresAt = BigInt.zero();
    delegate.cancelerRoleExpiresAt = BigInt.zero();
    delegate.save();
  }

  return delegate;
}

/**
 * Formats a BigInt into a Bytes value to be used for the `ID` field (formatted as a 32 byte array in big-endian order).
 */
export function formatBigIntAsId(id: BigInt): Bytes {
  let formattedId = new Bytes(32);
  let iterationCount = Math.min(id.byteLength, 32);
  for (let i = 0; i < iterationCount; i++) {
    formattedId[31 - i] = id[i];
  }
  return formattedId;
}

/**
 * Converts the formatted 32 byte big-endian ID back into a native BigInt value.
 */
export function unformatBigIntAsId(id: Bytes): BigInt {
  // Formatted id is big-endian, so need to reverse before converting to BigInt
  return BigInt.fromByteArray(changetype<ByteArray>(id.reverse()));
}

/**
 * Gets a proposal by ID. Creates one if none exists. Can pass a BigInt or Bytes value to the ID.
 */
export function getOrCreateProposal<T>(id: T): Proposal {
  let _id: Bytes =
    id instanceof BigInt ? formatBigIntAsId(id) : (id as Bytes);

  let proposal = Proposal.load(_id);

  if (proposal == null) {
    proposal = new Proposal(_id);
  }

  return proposal;
}

export function getCurrentClock(
  event: ethereum.Event,
  clockMode: string
): BigInt {
  if (clockMode == "timestamp") {
    return event.block.timestamp;
  } else {
    return event.block.number;
  }
}

export function getOrCreateProposalVote(
  proposalId: BigInt,
  delegateId: Bytes
): ProposalVote {
  let id: Bytes = formatBigIntAsId(proposalId).concat(delegateId);

  let proposalVote = ProposalVote.load(id);

  if (proposalVote == null) {
    proposalVote = new ProposalVote(id);
  }

  return proposalVote;
}

export const GOVERNANCE_DATA_ID: Bytes = Bytes.fromUTF8("GOVERNANCE_DATA");
export function getGovernanceData(): GovernanceData {
  let governanceData = GovernanceData.load(GOVERNANCE_DATA_ID);

  if (governanceData == null) {
    governanceData = new GovernanceData(GOVERNANCE_DATA_ID);
    governanceData.totalSupply = BigInt.zero();
    governanceData.maxSupply = BigInt.zero();
    governanceData.proposalCount = BigInt.zero();
    governanceData.proposalThresholdBps = 0;
    governanceData.quorumBps = 0;
    governanceData.proposalGracePeriod = BigInt.zero();
    governanceData.governanceCanBeginAt = BigInt.zero();
    governanceData.governanceThresholdBps = 0;
    governanceData.isFounded = false;
    governanceData.votingDelay = BigInt.zero();
    governanceData.votingPeriod = BigInt.zero();
    governanceData.percentMajority = 50;
    governanceData.maxDeadlineExtension = BigInt.zero();
    governanceData.baseDeadlineExtension = BigInt.zero();
    governanceData.extensionDecayPeriod = BigInt.zero();
    governanceData.extensionPercentDecay = 0;

    governanceData.save();
  }

  return governanceData;
}

export const EXECUTOR_DATA_ID: Bytes = Bytes.fromUTF8("EXECUTOR_DATA");
export function getExecutorData(): ExecutorData {
  let executorData = ExecutorData.load(EXECUTOR_DATA_ID);

  if (executorData == null) {
    executorData = new ExecutorData(EXECUTOR_DATA_ID);
    executorData.balanceSharesManager = Address.zero();
    executorData.sharesOnboarder = Address.zero();
    executorData.distributor = Address.zero();
    executorData.guard = Address.zero();
    executorData.minDelay = BigInt.zero();

    executorData.save();
  }

  return executorData;
}

export function getExecutorModule(module: Address): ExecutorModule {
  let executorModule = ExecutorModule.load(module);

  if (executorModule == null) {
    executorModule = new ExecutorModule(module);
    executorModule.enabled = false;
  }

  return executorModule;
}

// Role hashes, set manually in accordance with PrimordiumGovernorV1 contract roles
export const PROPOSER_ROLE: Bytes = Bytes.fromByteArray(
  crypto.keccak256(ByteArray.fromUTF8("PROPOSER"))
);
export const CANCELER_ROLE: Bytes = Bytes.fromByteArray(
  crypto.keccak256(ByteArray.fromUTF8("CANCELER"))
);
