/* eslint-disable react/prop-types */
import React from 'react';

function Square(props) {
  const { value, isHighlight, onClick } = props;
  return (
    <button
      type="button"
      className={isHighlight ? 'square teal lighten-2' : 'square white'}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const {
      squares, onClick, lastMove, lineWinner,
    } = this.props;
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onClick(i)}
        isHighlight={lastMove === i || lineWinner.indexOf(i) !== -1}
      />
    );
  }

  render() {
    const rows = [];
    for (let i = 0; i < 3; i += 1) {
      const items = [];
      for (let j = i * 3; j < (i + 1) * 3; j += 1) {
        items.push(this.renderSquare(j));
      }
      rows.push(
        <div className="board-row" key={i}>
          {items}
        </div>,
      );
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

export default Board;
