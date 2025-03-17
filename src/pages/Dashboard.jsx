import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
    const [games, setGames] = useState([]);
    const [error, setError] = useState(null);
    const [selectedGameId, setSelectedGameId] = useState(null); // Store selected game id
    const [gameDetails, setGameDetails] = useState(null); // Store game details fetched on click
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch("http://localhost:8080/game/all", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch games.");
                }

                const result = await response.json();
                if (result.success) {
                    setGames(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch games.");
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchGames();
    }, [token]);

    // Function to fetch game details by ID when clicked
    const fetchGameDetails = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/game/find/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch game details.");
            }

            const result = await response.json();
            if (result.success) {
                setGameDetails(result.data); // Set the fetched game details
            } else {
                throw new Error(result.message || "Failed to fetch game details.");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    // Handle game click
    const handleGameClick = (gameId) => {
        // setSelectedGameId(gameId); // Save selected game ID to state
        // fetchGameDetails(gameId); // Call another API to fetch game details
        navigate(`/leaderboard/${gameId}`);
    };

    if (!token) {
        navigate("/login");
        return null;
    }

    return (
        <div>
            <h1>Available Games</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div>
                {games.length === 0 ? (
                    <p>No games available.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {games.map((game) => (
                            <li
                                key={game.id}
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    padding: "16px",
                                    marginBottom: "16px",
                                    cursor: "pointer", // Make it clickable
                                }}
                                onClick={() => handleGameClick(game.id)} // On click, fetch details
                            >
                                <h2>{game.name}</h2>
                                <p>
                                    <strong>Rating:</strong> {game.gameRating}/5
                                </p>
                                <p>
                                    <strong>Description:</strong> {game.description}
                                </p>
                                <p>
                                    <strong>Created At:</strong>{" "}
                                    {new Date(game.createdAt).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Display selected game details */}
                {gameDetails && selectedGameId && (
                    <div style={{ marginTop: "30px" }}>
                        <h2>Game Details</h2>
                        <p><strong>Name:</strong> {gameDetails.name}</p>
                        <p><strong>Rating:</strong> {gameDetails.gameRating}/5</p>
                        <p><strong>Description:</strong> {gameDetails.description}</p>
                        <p><strong>Created At:</strong> {new Date(gameDetails.createdAt).toLocaleString()}</p>
                        {/* Add more game details as needed */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
