import React from 'react';
import messageHelper from '../../helpers/messageHelper';

class FakeEmail extends React.Component {
  componentDidUpdate() {
    const classList = document.getElementById('fake-email').classList
    classList.add('shake-vertical')
    setTimeout(() => classList.remove('shake-vertical'), 1000)
  }

  render() {
    const { data } = this.props
    const subject = messageHelper.buildSubject(data)
    const fromText = messageHelper.buildFromText(data)
    const message = messageHelper.buildMessage(data)
    const replyTo = data.email || 'no-reply@howdyform.com'

    return (
      <div className='fake-email-container'>
        <div className='fake-email animated--short' id="fake-email">
          <div className="fake-email__from">
            {fromText}
          </div>
          <div className="fake-email__header-field">
            <span className="fake-email__header-field__label">To:</span> your@email.com
          </div>
          <div className="fake-email__header-field">
            <span className="fake-email__header-field__label">Reply-To:</span> {replyTo}
          </div>
          <div className="fake-email__header-subject">
            {subject}
          </div>
          <div className="fake-email__body" dangerouslySetInnerHTML={{ __html: message }}></div>
        </div>
      </div>
    )
  }
}

FakeEmail.propTypes = {
  emailData: React.PropTypes.object.isRequired
}

module.exports = FakeEmail
