import React from 'react';
import './index.css';

function Square(props) {
  return (
    <button 
      className={props.isHighlight ? "square teal lighten-2" : "square white" }
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
         isHighlight={this.props.lastMove === i || this.props.lineWinner.indexOf(i) !== -1} />
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

class History extends React.Component {
  render() {
    let history = this.props.history.slice();
    if(!this.props.isAsc) {
      history =  history.reverse();
    } 
    const moves = history.map((step, index) => {
      const description = step.lastMove !== null ? 'Go to'  : 'Go to Game Start';
      /* Identify the movement number, according to the order (ASC/DESC) */
      const noMove = this.props.isAsc ? index : (history.length - 1) - index;
      const rowColor = this.props.stepNumber === noMove ? 'teal lighten-5' : 'white';
      return (
        <div
          key={index}
          className={`collection-item row ${rowColor}`}
        >
        <div className="col s6 m6 l6 xl6">
          <h6>Move #{noMove} </h6>
        </div>
        <div className="col s6 m6 l6 xl6">
          <button
          className="waves-effect waves-light btn"
          onClick={() => this.props.onJumpTo(index)}
          >
            {description}
          </button>
        </div>
        </div>
      );
    });    
    return (
      <div className="col s12 m12 l4 xl4">
        <div className="collection">
          <div className="collection-item center">
            <h4>History</h4>
            {/* Switch for order move's list */}
            <div className="switch">
              <label>
                Asc
                <input type="checkbox" onChange={() => this.props.onChange}/>
                <span className="lever"></span>
                Desc
              </label>
            </div>
          </div>
          {moves}
        </div>
      </div> 
    ); 
  }
}

const initialState = {
  history: [{
    squares: Array(9).fill(null),
    lastMove: null
  }],
  xIsNext: true,
  stepNumber: 0,
  isAsc: true
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  resetState() {
    this.setState(initialState);
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
    if (calculateWinner(squares).winner || squares[i]) {
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
    this.setState({
      isAsc: !this.state.isAsc
    });
  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const finalMove = calculateWinner(current.squares); 
    const winner = finalMove.winner;
    let status; 
    let finished = false;
    if (winner) {
      status = 'Winner: ' + winner;
      finished = true;
    } else {
      if (calculateBoardFill(current.squares)) {
        status = "It's a tied game";
        finished = true;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');        
      }
    }

    let reset = null;
    if (finished) {
      reset = (
        <button className="waves-effect waves-light btn" onClick={() => this.resetState()}>
          Reset Game
        </button>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="col l12 xl12">
            <h1>{status}</h1>
            {reset}
          </div>
        </div>
        <div className="row">
          <div className="col l6 xl6">
            <div className="game-board">
              <Board
                squares={current.squares}
                lastMove={current.lastMove}
                lineWinner={finalMove.line}
                onClick={(i) => this.handleClick(i)} />
            </div>
          </div>
          <History
            history={history}
            isAsc={this.state.isAsc}
            stepNumber={this.stepNumber}
            onJumpTo={(step) => this.jumpTo(step)} 
            onChangeOrder={() => this.handleChange()}
          />       
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
      return {
        winner: squares[a],
        line: lines[i]
      }
    } 
  }
  return {
    winner: null,
    line: []
  }
}

function calculateBoardFill(squares) {
  for(let i = 0; i < 9; i ++) {
    if (squares[i] === null) {
      return false;
    }
  }
  return true;
}
