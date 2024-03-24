import { PrismaClient } from "@prisma/client";
import { Buffer } from "buffer";
import { Match } from "../types/rest-api.types.js";

// already a singleton due to nodejs module import cacheing
const prisma = new PrismaClient();

export const getAllPlayers = async () => {
  const rawPlayers = await prisma.match_player.groupBy({
    by: ["player_address"],
  });
  const players = rawPlayers.map((player) =>
    Buffer.from(player.player_address).toString("hex")
  );
  return players;
};

export const filterMatchesByPlayer = async (playerAddress: string) => {
  const rawMatches = await prisma.match_player.findMany({
    where: {
      player_address: {
        equals: Buffer.from(playerAddress, "hex"),
      },
    },
  });
  const matches: Match[] = rawMatches.map(
    (match) => bufferToHex(match) as Match
  );
  return matches;
};

function bufferToHex(obj: Record<string, any>) {
  const transformed: Record<string, any> = {};
  for (let key in obj) {
    if (Buffer.isBuffer(obj[key])) {
      transformed[key] = Buffer.from(obj[key]).toString("hex");
    } else {
      transformed[key] = obj[key];
    }
  }
  return transformed;
}

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

export default prisma;
