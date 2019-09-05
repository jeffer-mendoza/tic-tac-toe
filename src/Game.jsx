/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React from 'react';
import './index.css';
import Board from './Board';


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
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
      };
    }
  }
  return {
    winner: null,
    line: [],
  };
}

function calculateBoardFill(squares) {
  for (let i = 0; i < 9; i += 1) {
    if (squares[i] === null) {
      return false;
    }
  }
  return true;
}

function History(props) {
  // eslint-disable-next-line react/destructuring-assignment
  let history = props.history.slice();
  const { isAsc, onChangeOrder, onJumpTo } = props;
  if (!isAsc) {
    history = history.reverse();
  }
  const moves = history.map((step, index) => {
    const description = step.lastMove !== null ? 'Go to' : 'Go to Game Start';
    /* Identify the movement number, according to the order (ASC/DESC) */
    const noMove = props.isAsc ? index : (history.length - 1) - index;
    const rowColor = props.stepNumber === noMove ? 'teal lighten-5' : 'white';
    return (
      <div
        key={index}
        className={`collection-item row ${rowColor}`}
      >
        <div className="col s6 m6 l6 xl6">
          <h6>{`Move # ${noMove}`}</h6>
        </div>
        <div className="col s6 m6 l6 xl6">
          <button
            type="button"
            className="waves-effect waves-light btn"
            onClick={() => onJumpTo(index)}
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
            <label htmlFor="switch">
              Asc
              <input id="switch" type="checkbox" onChange={() => onChangeOrder()} />
              <span className="lever" />
              Desc
            </label>
          </div>
        </div>
        {moves}
      </div>
    </div>
  );
}


const initialState = {
  history: [{
    squares: Array(9).fill(null),
    lastMove: null,
  }],
  xIsNext: true,
  stepNumber: 0,
  isAsc: true,
};

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
    const { xIsNext, stepNumber } = this.state;
    let { history } = this.state;
    history = history.slice(0, stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares,
        lastMove: i,
      }]),
      xIsNext: !xIsNext,
      stepNumber: history.length,
    });
  }

  handleChange() {
    this.setState((prevState) => ({ isAsc: !prevState.isAsc }));
  }

  render() {
    const {
      history, stepNumber, isAsc, xIsNext,
    } = this.state;
    const current = history[stepNumber];
    const { winner, line } = calculateWinner(current.squares);
    let status;
    let finished = false;
    if (winner) {
      status = `Winner: ${winner}`;
      finished = true;
    } else if (calculateBoardFill(current.squares)) {
      status = "It's a tied game";
      finished = true;
    } else {
      status = `Next player: ${(xIsNext ? 'X' : 'O')}`;
    }
    let reset = null;
    if (finished) {
      reset = (
        <button
          type="button"
          className="waves-effect waves-light btn"
          onClick={() => this.resetState()}
        >
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
                lineWinner={line}
                onClick={(i) => this.handleClick(i)}
              />
            </div>
          </div>
          <History
            history={history}
            isAsc={isAsc}
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
