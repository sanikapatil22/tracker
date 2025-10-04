"use client";

import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState("LeetCode");
  const [solvedCount, setSolvedCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    setError("");
    setSolvedCount(null);

    if (!username) {
      setError("Please enter a username");
      return;
    }

    try {
      const res = await fetch(
        `/api/solved-count?username=${username}&platform=${platform}`
      );
      const data = await res.json();

      if (res.ok) {
        setSolvedCount(data.solvedCount);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">Problem Tracker</h1>

      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-4 rounded w-64"
      />

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        className="border p-2 mb-4 rounded w-64"
      >
        <option value="LeetCode">LeetCode</option>
        <option value="Codeforces">Codeforces</option>
        <option value="AtCoder">AtCoder</option>
      </select>

      <button
        onClick={handleFetch}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Get Solved Count
      </button>

      {solvedCount !== null && (
        <p className="text-lg">
          {username} has solved {solvedCount} problems on {platform}.
        </p>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
