import validations from './validations.js'

const validationMapping = {
  none: validations.none,
  email: validations.email,
  emailAddress: validations.email,
  email_address: validations.email,
  name: validations.required,
  first_name: validations.required,
  last_name: validations.required,
  firstName: validations.required,
  lastName: validations.required,
  subject: validations.required,
  topic: validations.required,
  about: validations.required,
  body: validations.required,
  message: validations.required,
  address: validations.required,
  postcode: validations.required,
  post_code: validations.required,
  postCode: validations.required,
  zipcode: validations.required,
  zip_code: validations.required,
  zipCode: validations.required,
  tel: validations.tel,
  telephone: validations.tel,
  mobile: validations.tel,
  mob: validations.tel,
  age: validations.number,
  dob: validations.date,
  date_of_birth:validations.date,
  dateOfBirth: validations.date
}

export default validationMapping