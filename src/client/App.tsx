import "./App.css";

import { useEffect, useState } from "react";
import { Button } from "@carbon/react";
import reactLogo from "./assets/react.svg";
import { Match } from "../types/rest-api.types.js";
import useIsMobile from "./hooks/isMobile.js";

interface MatchesResponse {
  success: boolean;
  data: Match[];
}

function App() {
  const [searchString, setSearchString] = useState<string>("");
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");

  const [isPlayersLoading, setIsPlayersLoading] = useState(true);
  const [players, setPlayers] = useState<string[]>([]);
  const [playersError, setPlayersError] = useState<string>("");

  const [isMatchesLoading, setIsMatchesLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesError, setMatchesError] = useState<string>("");

  const isMobile = useIsMobile();
  const [showMobileSidebar, setShowMobileSidebar] = useState(!isMobile);
  const showShowSidebar = isMobile ? showMobileSidebar : true;

  useEffect(() => {
    console.log("App mounted");
    const fetchPlayers = async () => {
      try {
        const response = await fetch("/players");
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }
        const data = await response.json();
        console.log(data);
        setPlayers(data.data);
      } catch (error: any) {
        setPlayersError(error.message);
      } finally {
        setIsPlayersLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const queryMatchesByPlayer = async (player: string) => {
    setIsMatchesLoading(true);
    try {
      const response = await fetch("/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer demo_only_this_is_not_authenticated`, // If needed: Authorization header, Bearer token
        },
        body: JSON.stringify({
          playerAddress: player,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      const data = (await response.json()) as MatchesResponse;
      console.log(data);
      setMatches(data.data);
    } catch (error: any) {
      setMatchesError(error.message);
    } finally {
      setIsMatchesLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="flex h-screen">
        <div
          className={`${
            showShowSidebar ? "min-w-128 w-128 max-w-128 p-1" : "max-w-0 w-0"
          } bg-gray-800 text-white max-h-screen overflow-y-scroll`}
          style={{ minWidth: showShowSidebar ? "430px" : "0px" }}
        >
          <h3 className="p-5 text-xl text-center">SkyStrife ⚔️ Redstone</h3>
          <input
            type="text"
            className="form-input px-4 py-2 border rounded border-gray-300 w-full text-gray-600 mb-2"
            placeholder="Filter by Player Address"
            onChange={(e) => setSearchString(e.target.value)}
            value={searchString}
          />
          {playersError && <b className="text-red-500">{playersError}</b>}
          {isPlayersLoading ? (
            <p>Loading players...</p>
          ) : (
            <ul className="list-none m-0 p-0">
              {players
                .filter(
                  (p) => `0x${p}`.indexOf(searchString.toLowerCase()) > -1
                )
                .map((player) => (
                  <li key={player} className="block mb-2">
                    <button
                      onClick={() => {
                        queryMatchesByPlayer(player);
                        setSelectedPlayer(player);
                        setShowMobileSidebar(false);
                      }}
                      className="w-full text-left py-2 px-4 bg-blue-500/5 text-white rounded hover:bg-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 text-white/50 focus:text-white/100"
                    >
                      {`0x${player}`}
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div className="flex-1 bg-gray max-h-screen overflow-y-scroll">
          {isMobile && (
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="text-gray bg-black/5 bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-white p-2 rounded-lg"
            >{`⬅`}</button>
          )}
          <h1 className="p-5 text-xl text-center font-bold mb-6">
            {selectedPlayer ? `Player 0x${selectedPlayer}` : "Select Player"}
          </h1>
          {matchesError && <b className="text-red-500">{matchesError}</b>}
          {selectedPlayer && (
            <>
              {isMatchesLoading ? (
                <p>Loading matches...</p>
              ) : (
                <ul className="list-none m-0 p-0">
                  {matches.map((match) => (
                    <li key={match.match_entity} className="block mb-2">
                      <div className="bg-white p-4 rounded">
                        <h4 className="text-md font-semibold w-64 truncate">
                          Match {match.match_entity}
                        </h4>
                        <p>Match Entity: {match.match_entity}</p>
                        <p>Player Address: {`0x${match.player_address}`}</p>
                        <p>Player Entity: {match.player_entity}</p>
                        <p>Key Bytes: {match.key_bytes}</p>
                        <p>
                          Last Updated Block: {match.last_updated_block_number}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
