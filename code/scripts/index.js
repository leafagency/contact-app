import ReactDOM from 'react-dom'
import React from 'react'
import LiveDemo from './components/liveDemo'
import SnippetGenerator from './components/snippetGenerator'
import SnippetDisplay from './components/snippetDisplay'

document.addEventListener('DOMContentLoaded', function() {
  const topSnippetGeneratorContainer = document.getElementById('snippet-generator-top')
  const bottomSnippetGeneratorContainer = document.getElementById('snippet-generator-bottom')
  const snippetDisplayContainer = document.getElementById('snippet-display')
  const liveDemoContainer = document.getElementById('live-demo')

  if (topSnippetGeneratorContainer) {
    ReactDOM.render(<SnippetGenerator />, topSnippetGeneratorContainer)
  }

  if (bottomSnippetGeneratorContainer) {
    ReactDOM.render(<SnippetGenerator className="callout--dark" />, bottomSnippetGeneratorContainer)
  }

  if (snippetDisplayContainer) {
    ReactDOM.render(<SnippetDisplay />, snippetDisplayContainer)
  }

  if (liveDemoContainer) {
    ReactDOM.render(<LiveDemo />, liveDemoContainer)
  }
})