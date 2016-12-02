import React from 'react';

class FakeForm extends React.Component {
  constructor(props) {
    super(props)

    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(e) {
    const valueKey = e.target.name
    const newValue = e.target.value

    this.props.onValueChange(valueKey, newValue)
  }

  render() {
    const { firstName, lastName, email, subject, coolnessRating, message } = this.props
    return (
      <div className="fake-form-container">
        <form className="fake-form">
          <h3>My first contact form</h3>
          <div className="fake-form__fieldset">
            <label>First</label>
            <input type="text" name="firstName" value={firstName} onChange={this.onInputChange} />
          </div>

          <div className="fake-form__fieldset">
            <label>Last</label>
            <input type="text" name="lastName" value={lastName} onChange={this.onInputChange} />
          </div>

          <div className="fake-form__fieldset">
            <label>Email</label>
            <input type="text" name="email" value={email} onChange={this.onInputChange} />
          </div>

          <div className="fake-form__fieldset">
            <label>Subject</label>
            <input type="text" name="subject" value={subject} onChange={this.onInputChange} />
          </div>

          <div className="fake-form__fieldset">
            <label>Coolness</label>
            <select name="coolnessRating" value={coolnessRating} onChange={this.onInputChange}>
              <option>Absolute zero</option>
              <option>Arctic</option>
              <option>Frosty</option>
              <option>Tepid</option>
              <option>Lukewarm</option>
              <option>Quite warm</option>
              <option>Hot</option>
            </select>
          </div>

          <div className="fake-form__fieldset">
            <label>Message</label>
            <textarea type="text" name="message" value={message} onChange={this.onInputChange} />
          </div>

          <input type="submit" value="Submit" onClick={this.props.onSubmit} />
        </form>
      </div>
    )
  }
}

FakeForm.propTypes = {
  firstName: React.PropTypes.string.isRequired,
  lastName: React.PropTypes.string.isRequired,
  email: React.PropTypes.string.isRequired,
  subject: React.PropTypes.string.isRequired,
  message: React.PropTypes.string.isRequired,
  coolnessRating: React.PropTypes.string.isRequired,
  onValueChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

module.exports = FakeForm
