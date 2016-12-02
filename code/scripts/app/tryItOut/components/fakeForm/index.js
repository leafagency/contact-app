import React from 'react'
import { validateForm } from '../../lib/errors'

class FakeForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: {}
    }

    this.onInputChange = this.onInputChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
  }

  onInputFocus(e) {
    const valueKey = e.target.name

    const nextErrors = JSON.parse(JSON.stringify(this.state.errors))
    delete nextErrors[valueKey]

    this.setState({errors: nextErrors})
  }

  onInputChange(e) {
    const valueKey = e.target.name
    const newValue = e.target.value

    this.props.onValueChange(valueKey, newValue)
  }

  onSubmit(e) {
    e.preventDefault()
    const form = document.getElementById('fake-form')
    const errors = validateForm(form)

    if (!Object.keys(errors).length) {
      this.props.onSubmit()
    } else {
      this.setState({ errors })
    }
  }

  renderTextInput(label, key, skipValidation) {
    const value = this.props[key]
    const { errors } = this.state

    const inputProps = {
      type: 'text',
      name: key,
      className: errors[key] ? 'erroneous' : null,
      value,
      onChange: this.onInputChange,
      onFocus: this.onInputFocus
    }

    if (skipValidation) {
      inputProps['data-howdy-validate'] = 'none'
    }

    return (
      <div className="fake-form__fieldset">
        <label>{label}</label>
        <input {...inputProps} />
        { errors[key] &&
          <span className="error">{errors[key]}</span>
        }
      </div>
    )
  }

  renderTextArea(label, key) {
    const value = this.props[key]
    const { errors } = this.state

    const textareaProps = {
      type: 'text',
      name: key,
      className: errors[key] ? 'erroneous' : null,
      value,
      onChange: this.onInputChange,
      onFocus: this.onInputFocus
    }

    return (
      <div className="fake-form__fieldset">
        <label>{label}</label>
        <textarea {...textareaProps} />
        { errors[key] &&
          <span className="error">{errors[key]}</span>
        }
      </div>
    )
  }

  render() {
    const { firstName, lastName, email, subject, coolnessRating, message } = this.props
    const { errors } = this.state
    return (
      <div className="fake-form-container">
        <form className="fake-form" id="fake-form">
          <h3>My first contact form</h3>

          {this.renderTextInput('First', 'firstName', true)}
          {this.renderTextInput('Last', 'lastName', true)}
          {this.renderTextInput('Email', 'email')}
          {this.renderTextInput('Subject', 'subject', true)}

          <div className="fake-form__fieldset">
            <label>Coolness</label>
            <select name="coolnessRating" className={errors.coolnessRating ? 'erroneous' : null} value={coolnessRating} onChange={this.onInputChange} onFocus={this.onInputFocus}>
              <option>Absolute zero</option>
              <option>Arctic</option>
              <option>Frosty</option>
              <option>Tepid</option>
              <option>Lukewarm</option>
              <option>Quite warm</option>
              <option>Hot</option>
            </select>
            { errors.coolnessRating &&
              <span className="error">{errors.coolnessRating}</span>
            }
          </div>

          {this.renderTextArea('Message', 'message')}

          <input type="submit" value="Submit" onClick={this.onSubmit} />
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
