import React from 'react'
import { parse } from 'qs'

class SnippetDisplay extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  getEmailFromToken(token) {
    try {
      return window.atob(token)
    } catch(err) {
      return null
    }
  }

  render() {
    let { token } = parse(window.document.location.search.substr(1))
    token = token || 'not~a~real~token'
    const email = this.getEmailFromToken(token) || 'test@test.com'

    return (
      <div>&lt;script src="https://static.howdyform.com/howdyClient.js?token={token}" data-howdy-recipient="{email}"&gt;&lt;/script&gt;</div>
    )
  }
}

module.exports = SnippetDisplay
