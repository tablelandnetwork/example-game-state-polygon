import React, { useState } from "react";
import "./App.css";

function getTable() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("table") || "game_store_80001_4440";
}

function getToken() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("token") || "1";
}

// Returns all the files/dirs with a shared parent
async function getGame() {
  const table = getTable();
  const tokenId = getToken();
  const root = `SELECT * FROM ${table}`;
  const where = `WHERE id = '${tokenId}'`;
  const statement = `${root} ${where}`;
  const url = `https://testnet.tableland.network/query?s=${statement}`;
  console.log("Requesting:", statement, "View:", url);
  console.log("");
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  });
  const data = await response.json(); // parses JSON response into native JavaScript objects
  return data;
}

export default function App() {
  // const windowRef = React.useRef<HTMLElement | null>(null);
  const [level, setLevel] = useState(0);
  const [dead, setDead] = useState(false);
  const [won, setWon] = useState(false);
  const [word, setWord] = useState("_");
  getGame().then((data) => {
    setWord(data[0].word.split("").join(" "));
    setWon(data[0].winner != null);
    setDead(data[0].remaining == 0);
    setLevel(6 - data[0].remaining);
    if (won) {
      document.body.style.backgroundColor = "green";
    } else if (data[0].remaining == 0) {
      document.body.style.backgroundColor = "black";
    } else {
      document.body.style.backgroundColor = "white";
    }
  })

  const lines = [
    ["____________", "|          |", "|", "|", "|", "|", "|", "|"],
    ["____________", "|          |", "|          0", "|", "|", "|", "|", "|"],
    [
      "____________",
      "|          |",
      "|          0",
      "|          |",
      "|          |",
      "|",
      "|",
      "|",
    ],
    [
      "____________",
      "|          |",
      "|          0",
      "|         /|",
      "|          |",
      "|",
      "|",
      "|",
    ],
    [
      "____________",
      "|          |",
      "|          0",
      "|         /|\\",
      "|          |",
      "|",
      "|",
      "|",
    ],
    [
      "____________",
      "|          |",
      "|          0",
      "|         /|\\",
      "|          |",
      "|         /",
      "|",
      "|",
    ],
    [
      "____________",
      "|          |",
      "|          0",
      "|         /|\\",
      "|          |",
      "|         / \\",
      "|",
      "|",
    ],
  ];

  return (
    <div className={`nft ${won && "wonb"} ${dead && "lostb"}`}>
      {lines[level].map((line, i) => (
        <div className={`line ${won && "wonf"} ${dead && "lostf"}`}>{line}</div>
      ))}
      <div className={`word ${won && "wonf"} ${dead && "lostf"}`}>{word}</div>
    </div>
  );
}
