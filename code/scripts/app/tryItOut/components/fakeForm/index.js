import React from 'react'
import { validateForm } from '../../lib/errors'

class FakeForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: {},
      erroneousValues: {}
    }

    this.onInputChange = this.onInputChange.bind(this)
  }

  onInputChange(e) {
    e.preventDefault()
    const valueKey = e.target.name
    const newValue = e.target.value
    const allErrors = validateForm(document.getElementById('fake-form'))
    const nextState = {
      errors: {},
      erroneousValues: {}
    }

    if (allErrors && allErrors[valueKey]) {
      nextState.errors[valueKey] = allErrors[valueKey]
      nextState.erroneousValues[valueKey] = newValue
    } else {
      this.props.onValueChange(valueKey, newValue)
    }

    this.setState(nextState)
  }

  renderTextInput(label, key, skipValidation) {
    const { errors, erroneousValues } = this.state
    const value = errors[key] ? erroneousValues[key] : this.props[key]

    const inputProps = {
      type: 'text',
      name: key,
      className: errors[key] ? 'erroneous' : null,
      value,
      onChange: this.onInputChange
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
    const { errors, erroneousValues } = this.state
    const value = errors[key] ? erroneousValues[key] : this.props[key]

    const textareaProps = {
      type: 'text',
      name: key,
      className: errors[key] ? 'erroneous' : null,
      value,
      onChange: this.onInputChange
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
        </form>
      </div>
    )
  }
}

FakeForm.propTypes = {
  onValueChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

module.exports = FakeForm
