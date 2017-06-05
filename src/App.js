import React, { Component } from 'react';
import './App.css';
import Linechart from './components/linechart'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Linechart></Linechart>
      </div>
    );
  }
}

export default App;
