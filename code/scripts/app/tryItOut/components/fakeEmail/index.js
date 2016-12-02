import React from 'react';
import messageHelper from '../../helpers/messageHelper';

class FakeEmail extends React.Component {
  render() {
    const subject = messageHelper.buildSubject(this.props.emailData)
    const fromText = messageHelper.buildFromText(this.props.emailData)
    const message = messageHelper.buildMessage(this.props.emailData)
    const replyTo = this.props.email || 'no-reply@howdyform.com'

    return (
      <div className='fake-email-container'>
        <div className='fake-email'>
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
