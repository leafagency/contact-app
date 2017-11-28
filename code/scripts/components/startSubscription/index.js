import React from 'react'
import config from '../../config'
import request from 'superagent'

const ONE_SECOND = 1000

class StartSubscription extends React.Component {
  constructor() {
    super()

    this.state = {
      email: null,
      processingState: null
    }

    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }

  handleEmailChange(e) {
    const email = e.currentTarget.value
    this.setState({ email })
  }

  handleButtonClick(e) {
    const { email } = this.state

    if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
      this.setState({ processingState: 'error' })
      // Remove the error state after the animation has had time to complete:
      setTimeout(() => this.setState({ processingState: null }), ONE_SECOND)
      return;
    }


    request.get(config.getAccountUrl)
      .query({ email })
      .end(function(err, response) {
        if (err) {
          document.querySelector('.envelope--errors').innerHTML = JSON.parse(response.text).error.message
          return
        }
        window.location.href = JSON.parse(response.text).startSubscriptionUrl
      })
  }

  render() {
    const { processingState } = this.state

    return (
      <div className={`callout ${processingState || ''}`}>
        <div className="callout__inner">
          <p className="callout__intro">Enter an account email address to start your subscription</p>
          <div className="callout__form">
            <div className="callout__form__input-group input-group">
              <label className="sr-only" for="email">Email addresss</label>
              <input className="callout__form__input-group__input input-group__input" type="email" name="email" placeholder="you@email.com" onChange={this.handleEmailChange} />
              <button className="callout__form__input-group__button input-group__button button" onClick={this.handleButtonClick}>Start subscription</button>
            </div>
          </div>
          <div className="envelope--errors"></div>
        </div>
      </div>
    )
  }
}

module.exports = StartSubscription
