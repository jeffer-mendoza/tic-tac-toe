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
         key={i}
         value={this.props.squares[i]}
         onClick={() => this.props.onClick(i)}
         isLastMove={this.props.lastMove === i} />
    );
  }

  render() {
    const rows = [];
    for(let i = 0; i < 3; i++) {
      let items = [];
      for(let j = i * 3 ; j < (i + 1) * 3; j++) {
        items.push(this.renderSquare(j));
      }
      rows.push(
        <div className="board-row" key={i}>
          {items}
        </div>
      );
    }
   
    return (
      <div>
        {rows}
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
      stepNumber: 0,
      isAsc: true
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
      stepNumber: history.length
    });
  }

  handleChange() {
    console.log('entro');
    this.setState({
      isAsc: !this.state.isAsc
    });
  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status; 
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    if(!this.state.isAsc) {
      history =  history.slice().reverse();
      console.log(history)
    } 
    const moves = history.map((step, index) => {
      console.log(step);
      const description = step.lastMove ? 'Go to'  : 'Go to Game Start';
      const noMove = this.state.isAsc ? index : (history.length - 1) - index;
      return (
          <div
            key={index}
            className={this.state.stepNumber === noMove ?
                      "collection-item row teal lighten-5" :
                      "collection-item row"}
          >
            <div className="col s6 m6 l6 xl6">
              <h6>Move #{noMove} </h6>
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
                {/* Switch for order move's list */}
                <div className="switch">
                  <label>
                    Asc
                    <input type="checkbox" onChange={() => this.handleChange()}/>
                    <span className="lever"></span>
                    Desc
                  </label>
                </div>
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