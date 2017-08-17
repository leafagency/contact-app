import React from 'react'
import config from '../../config'
import request from 'superagent'

const ONE_SECOND = 1000

class SnippetGenerator extends React.Component {
  constructor() {
    super()

    this.state = {
      email: null,
      processingState: null,
      token: null
    }

    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleEmailBlur = this.handleEmailBlur.bind(this)
  }

  handleEmailChange(e) {
    const email = e.currentTarget.value
    this.setState({ email })
  }

  handleEmailBlur(e) {
    const email = e.currentTarget.value
    mixpanel.identify(email);
    mixpanel.people.set({'$email': email});
    mixpanel.track('Entered email in snippet generator')
  }

  handleButtonClick(e) {
    const { email } = this.state

    mixpanel.track('Clicked generate snippet button on snippet generator')

    if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
      this.setState({ processingState: 'error' })
      // Remove the error state after the animation has had time to complete:
      setTimeout(() => this.setState({ processingState: null }), ONE_SECOND)
      return;
    }

    request.post(config.createAccountUrl)
      .send({ email })
      .end(function(err, response) {
        if (err) return
        window.location.href = `/snippet.html?token=${window.btoa(email)}`
      })
  }

  render() {
    const { className } = this.props
    const { processingState } = this.state

    return (
      <div className={`callout ${className || ''} ${processingState || ''}`}>
        <div className="callout__inner">
          <p className="callout__intro">Enter an account email address to start your <strong>free 2 week trial</strong></p>
          <div className="callout__form">
            <div className="callout__form__input-group input-group">
              <label className="sr-only" for="email">Email addresss</label>
              <input className="callout__form__input-group__input input-group__input" type="email" name="email" placeholder="you@email.com" onChange={this.handleEmailChange} onBlur={this.handleEmailBlur} />
              <button className="callout__form__input-group__button input-group__button button" onClick={this.handleButtonClick}>Generate my snippet</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = SnippetGenerator
