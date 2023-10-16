import React, { useEffect, useState } from 'react';
import './App.css';

// function Square(props) {
//   return (
//     <button className="square" onClick={props.onClick}>
//       {props.value}
//     </button>
//   );
// }
function Square(props) {
  return (
    <button className={`square ${props.isWinnerSquare ? 'winner' : ''}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props) {
  return (
    <div>
      {props.squares.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((col, colIndex) => (
            <Square
              key={colIndex}
              value={col}
              onClick={() => props.onClick(rowIndex, colIndex)}
              isWinnerSquare={props.winLine && props.winLine.includes(rowIndex * 3 + colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [history, setHistory] = useState([
    { squares: Array(3).fill(Array(3).fill(null)), stepOf: null, row: null, col: null },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const [win, setWin] = useState(null);
  const handleClick = (row, col) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.map((row) => [...row]);
    // console.log(row, col, squares[row][col]);
    if (squares[row][col] == null && win == null) {
      squares[row][col] = xIsNext ? 'X' : 'O';
      setHistory(newHistory.concat([{ squares: squares, stepOf: squares[row][col], row, col }]));
      setStepNumber(newHistory.length);
      setXIsNext(!xIsNext);
    }
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
    setWin(null);
  };

  const moves = history.map((step, move) => {
    const desc = move ? `Go to move #${move} is [${step.row}, ${step.col}] ` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  if (!sortAsc) {
    moves.reverse();
  }

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);
  useEffect(() => {
    console.log('a:', winner);
    if (winner) {
      setWin(winner);
      return;
    }
  }, [stepNumber]);

  let status;

  if (winner) {
    status = `Winner: ${winner.winner}`;
  } else if (stepNumber === 9) {
    status = 'Draw! No winner.';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={handleClick} winLine={win?.line} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <div>Bạn đang ở nước đi thứ #{stepNumber}</div>
        <button onClick={() => setSortAsc(!sortAsc)}>Sort {sortAsc ? 'Descending' : 'Ascending'}</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    const [rowA, colA] = [Math.floor(a / 3), a % 3];
    const [rowB, colB] = [Math.floor(b / 3), b % 3];
    const [rowC, colC] = [Math.floor(c / 3), c % 3];

    if (
      squares[rowA][colA] &&
      squares[rowA][colA] === squares[rowB][colB] &&
      squares[rowA][colA] === squares[rowC][colC]
    ) {
      return { winner: squares[rowA][colA], line: lines[i] };
    }
  }

  return null;
}

export default App;
