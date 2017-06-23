import React, { Component } from 'react';
import './App.css';
import Linechart from './components/linechart'
import Scatterchart from './components/scatterchart'
import Barchart from './components/barchart'
import Piechart from './components/piechart'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Linechart></Linechart>
        <Scatterchart></Scatterchart>
        <Barchart></Barchart>
        <Piechart></Piechart>
      </div>
    );
  }
}

export default App;
