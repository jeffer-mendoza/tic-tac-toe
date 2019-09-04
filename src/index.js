import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game.js'

class App extends React.Component {

  render() {
    const logo = 'https://s3.amazonaws.com/files.thegamecrafter.com/3457b02337c15a1faea108fc599273ebb3d47f67';
    return (
      <div>
        <nav>
          <div className="nav-wrapper teal lighten-1">
            <a href="sass.html" className="brand-logo">
              <img width="150" alt="imagen del logo del juego" src={logo}/>
            </a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a href="sass.html">About</a></li>
            </ul>
          </div>
        </nav>
        <Game />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
