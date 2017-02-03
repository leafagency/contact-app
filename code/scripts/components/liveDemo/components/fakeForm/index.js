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
      className: errors[key] ? 'erroneous demo__form__input' : 'demo__form__input',
      value,
      onChange: this.onInputChange
    }

    if (skipValidation) {
      inputProps['data-howdy-validate'] = 'none'
    }

    return (
      <div className="form-group">
        <label className="demo__form__label">{label}</label>
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
      className: errors[key] ? 'erroneous demo__form__input' : 'demo__form__input',
      value,
      onChange: this.onInputChange
    }

    return (
      <div className="form-group">
        <label className="demo__form__label">{label}</label>
        <textarea {...textareaProps} />
        { errors[key] &&
          <span className="error">{errors[key]}</span>
        }
      </div>
    )
  }

  render() {
    const { name, email, subject, message } = this.props
    const { errors } = this.state
    return (
      <form className="demo__form" id="fake-form">
        {this.renderTextInput('Name', 'name', true)}
        {this.renderTextInput('Email', 'email')}
        {this.renderTextInput('Subject', 'subject', true)}
        {this.renderTextArea('Message', 'message')}
      </form>
    )
  }
}

FakeForm.propTypes = {
  onValueChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired
}

module.exports = FakeForm
