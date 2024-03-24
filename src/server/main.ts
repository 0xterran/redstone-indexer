import express, { Request, Response } from "express";
import ViteExpress from "vite-express";
import { filterMatchesByPlayer, getAllPlayers } from "./database.js";

const app = express();
app.use(express.json());

app.get("/ping", (_, res) => {
  res.status(200).json({ success: true, data: "success" });
});

type ExpressError = Error | any;

app.get("/players", async (_, res) => {
  try {
    const players = await getAllPlayers();
    res.status(200).json({
      success: true,
      data: players,
    });
  } catch (e: ExpressError) {
    res
      .status(500)
      .json({ success: false, message: e.message || "Failed to get players" });
  }
});

interface MatchRequest {
  playerAddress: string;
}
app.post("/matches", async (req: Request<{}, {}, MatchRequest>, res) => {
  try {
    console.log("Received match request");
    console.log(req.body);
    const matches = await filterMatchesByPlayer(req.body.playerAddress);
    res.status(200).json({ success: true, data: matches });
  } catch (e: ExpressError) {
    res.status(500).json({
      success: false,
      message: e.message || `Failed to get matches for player`,
    });
  }
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
