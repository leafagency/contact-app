import React from 'react'
import ReactDOM from 'react-dom'
import FakeForm from './components/fakeForm'
import FakeEmail from './components/fakeEmail'

const formData = {
  firstName: 'Joe',
  lastName: 'Bloggs',
  email: 'joe@schmoe.com',
  subject: 'Howdy interactive demo',
  message: "This is a interactive demo of Howdy's ability to sensibly format your contact form messages for email. Try clearing out fields and see how the email on the right reacts!",
}

const tryItOut = module.exports = {
  handleValueChange(valueKey, newValue) {
    if (formData.hasOwnProperty(valueKey)) {
      formData[valueKey] = newValue
      tryItOut.render()
    }
  },

  render() {
    ReactDOM.render(
      <div className="try-it-out-container">
        <FakeForm
          firstName={formData.firstName}
          lastName={formData.lastName}
          email={formData.email}
          subject={formData.subject}
          message={formData.message}
          onValueChange={tryItOut.handleValueChange}
        />
        <FakeEmail
          firstName={formData.firstName}
          lastName={formData.lastName}
          email={formData.email}
          subject={formData.subject}
          message={formData.message}
        />
      </div>,
      document.getElementById('try-it-out')
    )
  }
}
