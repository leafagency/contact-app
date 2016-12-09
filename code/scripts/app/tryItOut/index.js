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
        email: '',
        subject: '',
        coolnessRating: 'Absolute zero',
        message: "This is a interactive demo of Howdy's ability to sensibly format your contact form messages for email. Try adjusting fields and see how the email reacts!",
      }
    }

    this.handleValueChange = this.handleValueChange.bind(this)
  }

  handleValueChange(valueKey, newValue) {
    const nextFormData = JSON.parse(JSON.stringify(this.state.formData))
    nextFormData[valueKey] = newValue
    this.setState({ formData: nextFormData })
  }

  render() {
    const { firstName, lastName, email, subject, message, coolnessRating } = this.state.formData

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
        />
      <FakeEmail data={this.state.formData} />
      </div>
    )
  }
}

module.exports = {
  render() {
    return ReactDOM.render(<TryItOut />, document.getElementById('try-it-out'))
  }
}
