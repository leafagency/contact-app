import React from 'react';
import messageHelper from '../../helpers/messageHelper';
import md5 from 'md5';

class FakeEmail extends React.Component {
  shouldComponentUpdate(nextProps) {
    const keys = Object.keys(this.props.data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (this.props.data[key] !== nextProps.data[key]) return true
    }
    return false
  }

  calculateThumbnailUrl() {
    const { email } = this.props.data

    if (!email) {
      return '/images/thumb.svg'
    }

    const gravatarHash = md5(this.props.data.email.replace(/\s/g, '').toLowerCase())
    return `https://www.gravatar.com/avatar/${gravatarHash}?s=32`
  }

  render() {
    const { data } = this.props
    const subject = messageHelper.buildSubject(data)
    const fromText = messageHelper.buildFromText(data)
    const message = messageHelper.buildMessage(data)
    const replyTo = data.email || 'no-reply@howdyform.com'

    return (
      <div className='demo__email'>
        <span className="demo__email__header">{subject}</span>
        <div className="demo__email__body">
          <img className="demo__email__body__thumb" src={this.calculateThumbnailUrl()} />
          <div className="demo__email__body__content">
            <span className="demo__email__body__name">{fromText}&nbsp;</span>
            <span className="demo__email__body__from">&lt;{replyTo}&gt;</span>
            <span className="demo__email__body__to">to hello</span>
            <div className="demo__email__body__message" dangerouslySetInnerHTML={{__html: message}}></div>
          </div>
        </div>
        <div className="demo__email__footer">
          <img className="demo__email__footer__thumb" src="/images/thumb.svg"/>
          <div className="demo__email__footer__textarea">Click here to <span className="demo__email__footer__textarea__link">Reply</span>, <span className="demo__email__footer__textarea__link">Reply to all</span>, or <span className="demo__email__footer__textarea__link">Forward</span></div>
        </div>
      </div>
    )
  }
}

FakeEmail.propTypes = {
  emailData: React.PropTypes.object.isRequired
}

module.exports = FakeEmail
