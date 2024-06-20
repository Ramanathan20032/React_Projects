import { useState } from "react";
import Board from "./Board";

export default function Game(){
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0)
    const xIsNext = currentMove % 2 == 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquare){
        // creates new array that contains all the items in history using [spread syntax] and followed by nextSquares 
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquare];
        setHistory(nextHistory)
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove){
        setCurrentMove(nextMove);
    }

    const moves = history.map((square, move) => {
        let description;
        if(move > 0){
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        )
    })

    return(
        <div className="game">
            <div className="game-board">
                <Board xIsNext = {xIsNext} square = {currentSquares} onplay = {handlePlay}/>
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    )
}