import React, { Component } from 'react';
import './App.css';
import Linechart from './components/linechart'
import Scatterchart from './components/scatterchart'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Linechart></Linechart>
        <Scatterchart></Scatterchart>
      </div>
    );
  }
}

export default App;
