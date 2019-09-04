import React from 'react';
import './index.css';

function Square(props) {
  return (
    <button 
      className={props.isLastMove ? "square teal lighten-2" : "square" }
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
         value={this.props.squares[i]}
         onClick={() => this.props.onClick(i)}
         isLastMove={this.props.lastMove === i} />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastMove: null
      }],
      xIsNext: true,
      stepNumber: 0
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); 
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastMove: i
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status; 
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    const moves = history.map((step, index) => {
      const description = index ? 'Go to'  : 'Go to Game Start';
      return (
          <div
            key={index}
            className={this.state.stepNumber === index ?
                      "collection-item row active" :
                      "collection-item row"}
          >
            <div className="col s6 m6 l6 xl6">
              <h6>Move #{index}</h6>
            </div>
            <div className="col s6 m6 l6 xl6">
              <button
              className="waves-effect waves-light btn"
              onClick={() => this.jumpTo(index)}
              >
                {description}
              </button>
            </div>
          </div>
      );
    });

    return (
      <div>
        <div className="row">
          <div className="col l12 xl12">
            <h1>{status}</h1>
          </div>
        </div>
        <div className="row">
          <div className="col l6 xl6">
            <div className="game-board">
              <Board
                squares={current.squares}
                lastMove={current.lastMove}
                onClick={(i) => this.handleClick(i)} />
            </div>
          </div>

          <div className="col s12 m12 l4 xl4">
            <div className="collection">
              <div className="collection-item center">
                <h4>History</h4>
              </div>
              {moves}
            </div>
          </div>        
        </div>
      </div>
    );
  }
}

export default Game;

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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}