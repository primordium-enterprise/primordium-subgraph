import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Proposal } from "../generated/schema";

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
        if (
          split.length > 1 &&
          split.every((item) => item.length === 0)
        ) {
          title = line;
          break;
        }
      }
    }

    // Remove markdown bold and italics
    return title.replaceAll("**", "").replaceAll("__", "");
  }

  /**
 * Gets a proposal by ID. Creates one if none exists. Can pass a BigInt or Bytes value to the ID.
 */
export function getOrCreateProposal<T>(
  id: T,
): Proposal {
  let _id: Bytes = id instanceof BigInt ? Bytes.fromHexString(id.toHex()) : id as Bytes;

  let proposal = Proposal.load(_id);

  if (proposal === null) {
    proposal = new Proposal(_id);
  }

  return proposal;
}