import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Spin, Alert, Pagination } from "antd";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const LeaderboardPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const token = localStorage.getItem("token");
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (gameId) {
      fetchLeaderboard(pageNo);
    }
  }, [gameId, pageNo]);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe(`/topic/leaderboard`, (message) => {
          const updatedScore = JSON.parse(message.body);
          setLeaderboard((prevLeaderboard) => {
            const updatedLeaderboard = prevLeaderboard.map((entry) =>
              entry.username === updatedScore.username
                ? { ...entry, score: updatedScore.score }
                : entry
            );

            if (!updatedLeaderboard.some((entry) => entry.username === updatedScore.username)) {
              updatedLeaderboard.push({
                username: updatedScore.username,
                score: updatedScore.score,
                rank: updatedScore.rank,
              });
            }

            updatedLeaderboard.sort((a, b) => b.score - a.score);

            return updatedLeaderboard.map((entry, index) => ({
              ...entry,
              rank: index + 1,
            }));
          });
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [gameId]);

  const fetchLeaderboard = async (page) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/leaderboard/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameId: gameId,
          pageNo: page,
          pageSize: 10,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data.");
      }

      const result = await response.json();
      if (result.success) {
        setLeaderboard(result.data.scores);
        setTotalRecords(result.data.totalRecords);
      } else {
        throw new Error(result.message || "Failed to fetch leaderboard data.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
  ];

  const handlePaginationChange = (page) => {
    setPageNo(page - 1);
  };

  if (!token) {
    navigate("/login");
    return null;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Leaderboard - {gameId}</h1>
      {loading && <Spin tip="Loading leaderboard..." size="large" />}
      {error && <Alert message="Error" description={error} type="error" showIcon />}
      {!loading && !error && leaderboard.length === 0 && (
        <Alert message="No leaderboard data available." type="info" showIcon />
      )}
      <Table
        dataSource={leaderboard}
        columns={columns}
        rowKey="rank"
        pagination={false}
        loading={loading}
        style={{ marginTop: "16px" }}
      />
      <Pagination
        current={pageNo + 1}
        total={totalRecords}
        pageSize={10}
        onChange={handlePaginationChange}
        style={{ marginTop: "16px" }}
      />
    </div>
  );
};

export default LeaderboardPage;
