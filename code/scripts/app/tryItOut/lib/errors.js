import utils from './utils'
import validations from './validations'
import validationMapping from './validationMapping'

const _validateInput = (domEl) => {
  let message = null
  let customValidation = null

  if (domEl.dataset == undefined) {
    customValidation = domEl.getAttribute('data-howdy-validate') // Old IE
  } else {
    customValidation = domEl.dataset.howdyValidate // New hotness.
  }

  if (Object.keys(validations).indexOf(customValidation) !== -1) {
    message = validations[customValidation](domEl)
  } else if (Object.keys(validationMapping).indexOf(domEl.name) !== -1) {
    message = validationMapping[domEl.name](domEl)
  }

  if (!message) {
    return null
  }

  return {
    name: domEl.name,
    message
  }
}

export const validateForm = (form) => {
  const errorsArray = utils.forEachChild(form, _validateInput)
  const errorsObject = {}
  errorsArray.forEach((error) => {
    if (error !== null) {
      errorsObject[error.name] = error.message
    }
  })
  return errorsObject
}
