const messageHelper = module.exports

messageHelper.inferEmailAddress = message => message.email || message.emailAddress || message.email_address

messageHelper.buildSubject = message => {
  var subject = message.subject || message.topic || message.about

  if (subject && subject.length <= 255) {
    return subject
  }

  subject = 'You have a new message'

  var fullName = messageHelper.inferFullName(message)
  var emailAddress = messageHelper.inferEmailAddress(message)

  if (fullName) {
    subject += ' from ' + fullName
  } else if (emailAddress) {
    subject += ' from ' + emailAddress
  }

  return subject
}

messageHelper.buildMessage = (messageObject) => {
  var messageBody = messageObject.body || messageObject.message
  var messageAttributeString = ''
  var message = ''

  for (var key in messageObject) {
    if (key === 'body' || key === 'message') {
      continue
    }
    var value = messageObject[key]

    messageAttributeString += `<b>${key}</b>: ${(value || 'n/a')}<br/>`
  }

  message += messageAttributeString + '<br/>'

  if (messageBody) {
    message += messageBody + '<br/>'
  }

  return message
}

messageHelper.buildFromText = (messageObject) => {
  return messageHelper.inferFullName(messageObject) || 'Your Contact Form'
}

messageHelper.inferFullName = (message) => {
  if (message.name) {
    return message.name
  }

  var name = message.firstName || message.first_name || ''
  var lastName = message.last_name || message.lastName

  if (lastName) {
    name += ' ' + lastName
  }

  return name
}
