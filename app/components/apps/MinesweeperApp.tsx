"use client";

import React, { useState, useEffect, useRef } from "react";

interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export default function MinesweeperApp() {
  const ROWS = 9;
  const COLS = 9;
  const MINES = 10;

  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [minesRemaining, setMinesRemaining] = useState(MINES);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize the board
  const initBoard = () => {
    // Clear timer
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(0);
    setGameStarted(false);
    setGameOver(false);
    setHasWon(false);
    setMinesRemaining(MINES);

    const newBoard: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          r,
          c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
  };

  useEffect(() => {
    initBoard();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Start timer
  const startTimer = () => {
    setGameStarted(true);
    timerRef.current = setInterval(() => {
      setTimer((prev) => Math.min(prev + 1, 999));
    }, 1000);
  };

  // Generate mines after the first click to ensure the first click is ALWAYS safe
  const generateMines = (clickedRow: number, clickedCol: number, currentBoard: Cell[][]) => {
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);

      // Don't place on already placed mine, or within a 1-cell radius of clicked cell
      if (
        !currentBoard[r][c].isMine &&
        !(Math.abs(r - clickedRow) <= 1 && Math.abs(c - clickedCol) <= 1)
      ) {
        currentBoard[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors count
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!currentBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                if (currentBoard[nr][nc].isMine) count++;
              }
            }
          }
          currentBoard[r][c].neighborMines = count;
        }
      }
    }
  };

  // Reveal cell recursively
  const revealCell = (r: number, c: number, currentBoard: Cell[][]) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    const cell = currentBoard[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;

    if (cell.isMine) {
      // Explode!
      handleGameOver(false, currentBoard);
      return;
    }

    if (cell.neighborMines === 0) {
      // Recursively reveal neighbors
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          revealCell(r + dr, c + dc, currentBoard);
        }
      }
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameOver || hasWon || board[r][c].isFlagged || board[r][c].isRevealed) return;

    const boardCopy = board.map((row) => row.map((cell) => ({ ...cell })));

    if (!gameStarted) {
      startTimer();
      generateMines(r, c, boardCopy);
    }

    revealCell(r, c, boardCopy);
    checkWinCondition(boardCopy);
    setBoard(boardCopy);
  };

  const handleCellRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || hasWon || board[r][c].isRevealed) return;

    const boardCopy = board.map((row) => row.map((cell) => ({ ...cell })));
    const cell = boardCopy[r][c];

    cell.isFlagged = !cell.isFlagged;
    setMinesRemaining((prev) => prev + (cell.isFlagged ? -1 : 1));
    setBoard(boardCopy);
  };

  const checkWinCondition = (currentBoard: Cell[][]) => {
    let unrevealedSafeCells = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!currentBoard[r][c].isMine && !currentBoard[r][c].isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }

    if (unrevealedSafeCells === 0) {
      handleGameOver(true, currentBoard);
    }
  };

  const handleGameOver = (won: boolean, currentBoard: Cell[][]) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameOver(true);
    setHasWon(won);

    // Reveal all mines
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (currentBoard[r][c].isMine) {
          if (won) {
            currentBoard[r][c].isFlagged = true;
          } else if (!currentBoard[r][c].isRevealed) {
            currentBoard[r][c].isRevealed = true;
          }
        }
      }
    }
    if (won) setMinesRemaining(0);
  };

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) return "🚩";
    if (!cell.isRevealed) return "";
    if (cell.isMine) return "💣";
    if (cell.neighborMines > 0) return cell.neighborMines.toString();
    return "";
  };

  const getCellColor = (val: string) => {
    switch (val) {
      case "1": return "text-[#0000ff]"; // Blue
      case "2": return "text-[#008000]"; // Green
      case "3": return "text-[#ff0000]"; // Red
      case "4": return "text-[#000080]"; // Dark Blue
      case "5": return "text-[#800000]"; // Maroon
      case "6": return "text-[#008080]"; // Teal
      case "7": return "text-[#000000]"; // Black
      case "8": return "text-[#808080]"; // Grey
      default: return "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-[#c0c0c0] font-win-sans border-win-out w-fit mx-auto select-none">
      {/* Game Header (Mines counter, smiley face, timer) */}
      <div className="flex justify-between items-center w-full bg-[#c0c0c0] border-win-in p-2 mb-3">
        {/* Mines count display */}
        <div className="bg-black text-red-500 font-win-mono font-bold text-xl px-2 py-0.5 min-w-[50px] text-center border border-win-in-thin select-none">
          {String(Math.max(minesRemaining, -99)).padStart(3, "0")}
        </div>

        {/* Restart Smiley Face */}
        <button
          onClick={initBoard}
          className="border-win-button w-[32px] h-[32px] flex items-center justify-center text-xl select-none outline-none active:border-win-button-depressed"
        >
          {hasWon ? "😎" : gameOver ? "😵" : "🙂"}
        </button>

        {/* Timer display */}
        <div className="bg-black text-red-500 font-win-mono font-bold text-xl px-2 py-0.5 min-w-[50px] text-center border border-win-in-thin select-none">
          {String(timer).padStart(3, "0")}
        </div>
      </div>

      {/* Grid Board */}
      <div className="border-win-in p-1 bg-[#808080]">
        <div className="grid grid-cols-9 gap-0">
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const val = getCellContent(cell);
              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => handleCellClick(rIdx, cIdx)}
                  onContextMenu={(e) => handleCellRightClick(e, rIdx, cIdx)}
                  className={`w-[26px] h-[26px] flex items-center justify-center font-bold text-sm outline-none border transition-all ${
                    cell.isRevealed
                      ? "bg-[#c0c0c0] border-zinc-400"
                      : "bg-[#c0c0c0] border-win-button"
                  }`}
                  style={{
                    borderStyle: cell.isRevealed ? "solid" : undefined,
                    borderWidth: cell.isRevealed ? "1px" : undefined,
                  }}
                >
                  {val && (
                    <span className={`${getCellColor(val)} select-none`}>
                      {val}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-3 text-[10px] text-zinc-600 text-center w-full leading-snug">
        Left-click: Reveal | Right-click: Flag Mine
      </div>
    </div>
  );
}
