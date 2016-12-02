import React from 'react'
import ReactDOM from 'react-dom'
import FakeForm from './components/fakeForm'
import FakeEmail from './components/fakeEmail'

class TryItOut extends React.Component {
  constructor() {
    super()

    this.state = {
      formData: {
        firstName: '',
        lastName: '',
        email: 'changeme@test.com',
        subject: '',
        coolnessRating: 'Absolute zero',
        message: "This is a interactive demo of Howdy's ability to sensibly format your contact form messages for email. Try adjusting fields and see how the email reacts!",
      }
    }
    this.state.emailData = JSON.parse(JSON.stringify(this.state.formData))

    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleValueChange(valueKey, newValue) {
    const nextFormData = JSON.parse(JSON.stringify(this.state.formData))
    nextFormData[valueKey] = newValue
    this.setState({ formData: nextFormData })
  }

  handleSubmit() {
    this.setState({ emailData: JSON.parse(JSON.stringify(this.state.formData))})
  }

  render() {
    const { firstName, lastName, email, subject, message, coolnessRating } = this.state.formData
    const { emailData } = this.state

    return (
      <div className="try-it-out-container">
        <FakeForm
          firstName={firstName}
          lastName={lastName}
          email={email}
          subject={subject}
          message={message}
          coolnessRating={coolnessRating}
          onValueChange={this.handleValueChange}
          onSubmit={this.handleSubmit}
        />
        <FakeEmail data={emailData} />
      </div>
    )
  }
}

module.exports = {
  render() {
    return ReactDOM.render(<TryItOut />, document.getElementById('try-it-out'))
  }
}


