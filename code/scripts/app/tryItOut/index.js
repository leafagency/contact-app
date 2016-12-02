import React from 'react'
import ReactDOM from 'react-dom'
import FakeForm from './components/fakeForm'
import FakeEmail from './components/fakeEmail'

const emailData = {
  firstName: 'Change',
  lastName: 'Me',
  email: 'changeme@test.com',
  subject: '',
  coolnessRating: 'Absolute zero',
  message: "This is a interactive demo of Howdy's ability to sensibly format your contact form messages for email. Try clearing out fields and see how the email reacts!"
}

const formData = {};
Object.keys(emailData).forEach((key) => formData[key] = emailData[key]);

const tryItOut = module.exports = {
  handleValueChange(valueKey, newValue) {
    formData[valueKey] = newValue
    tryItOut.render()
  },

  handleSubmit(e) {
    e.preventDefault();
    Object.keys(formData).forEach((key) => emailData[key] = formData[key]);
    tryItOut.render();
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
          coolnessRating={formData.coolnessRating}
          onValueChange={tryItOut.handleValueChange}
          onSubmit={tryItOut.handleSubmit}
        />
        <FakeEmail data={emailData} />
      </div>,
      document.getElementById('try-it-out')
    )
  }
}
