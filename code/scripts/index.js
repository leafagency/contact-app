import ReactDOM from 'react-dom'
import React from 'react'
import LiveDemo from './components/liveDemo'

window.onload = function() {
  return ReactDOM.render(<LiveDemo />, document.getElementsByClassName('demo__container')[0])
}