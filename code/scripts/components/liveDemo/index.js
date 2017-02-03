import React from 'react'
import FakeForm from './components/fakeForm'
import FakeEmail from './components/fakeEmail'

class Demo extends React.Component {
  constructor() {
    super()

    this.state = {
      formData: {
        name: '',
        email: '',
        subject: '',
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
    const { name, email, subject, message } = this.state.formData

    return (
      <div className="demo">
        <FakeForm
          name={name}
          email={email}
          subject={subject}
          message={message}
          onValueChange={this.handleValueChange}
        />
        <FakeEmail data={this.state.formData} />
      </div>
    )
  }
}

module.exports = Demo
