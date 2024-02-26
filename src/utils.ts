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
 * Formats the BigInt proposalId into a Bytes value (formatted as a 32 byte array in big-endian order).
 */
export function formatProposalId(proposalId: BigInt): Bytes {
  let formattedProposalId = new Bytes(32);
  let iterationCount = Math.min(proposalId.byteLength, 32);
  for (let i = 0; i < iterationCount; i++) {
    formattedProposalId[31 - i] = proposalId[i];
  }
  return formattedProposalId;
}

/**
 * Converts the formatted 32 byte big-endian proposalId back into a native BigInt value.
 */
export function unformatProposalId(proposalId: Bytes): BigInt {
  // Formatted proposalId is big-endian, so need to reverse before converting to BigInt
  return BigInt.fromByteArray(changetype<ByteArray>(proposalId.reverse()));
}

/**
 * Gets a proposal by ID. Creates one if none exists. Can pass a BigInt or Bytes value to the ID.
 */
export function getOrCreateProposal<T>(id: T): Proposal {
  let _id: Bytes =
    id instanceof BigInt ? formatProposalId(id) : (id as Bytes);

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
  let id: Bytes = formatProposalId(proposalId).concat(delegateId);

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

// Role hashes, set manually in accordance with PrimordiumGovernorV1 contract roles
export const PROPOSER_ROLE: Bytes = Bytes.fromByteArray(
  crypto.keccak256(ByteArray.fromUTF8("PROPOSER"))
);
export const CANCELER_ROLE: Bytes = Bytes.fromByteArray(
  crypto.keccak256(ByteArray.fromUTF8("CANCELER"))
);
