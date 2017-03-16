import React from 'react'
import FakeForm from './components/fakeForm'
import FakeEmail from './components/fakeEmail'

class Demo extends React.Component {
  constructor() {
    super()

    this.state = {
      showForm: true,
      formData: {
        name: 'Sarah Jessica Parker',
        email: 'sazzie.parker@gmail.com',
        subject: '',
        message: "This is a interactive demo of Howdy's ability to sensibly format your contact form messages for email. Try adjusting fields and see how the email reacts!",
      }
    }

    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleToggleChange = this.handleToggleChange.bind(this)
  }

  handleValueChange(valueKey, newValue) {
    const nextFormData = JSON.parse(JSON.stringify(this.state.formData))
    nextFormData[valueKey] = newValue
    this.setState({ formData: nextFormData })
  }

  handleToggleChange(e) {
    const showForm = !e.currentTarget.checked
    this.setState({ showForm })
  }

  render() {
    const { showForm, formData } = this.state
    const { name, email, subject, message } = formData

    return (
      <div>
        <div className="demo__toggle toggle">
          <input className="toggle__input" type="checkbox" id="demoSwitch" onChange={this.handleToggleChange}></input>
          <label className="toggle__label" htmlFor="demoSwitch"></label>
        </div>
        <div className="demo">
          <FakeForm
            className={showForm ? '' : 'hidden'}
            name={name}
            email={email}
            subject={subject}
            message={message}
            onValueChange={this.handleValueChange}
          />
          <FakeEmail className={showForm ? 'hidden' : ''} data={this.state.formData} />
        </div>
      </div>
    )
  }
}

module.exports = Demo
