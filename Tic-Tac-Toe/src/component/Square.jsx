import { useState } from "react"

export default function Square(props){
    const {value, onSquareClick} = props

    return(
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    )
}