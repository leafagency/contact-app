module.exports = {
  none: function() {
    // no-op
  },
  required: function(input) {
    if (!input.value) {
      return "Must be provided.";
    }
  },
  email: function(input) {
    if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(input.value)) {
      return "Must be a valid email.";
    }
  },
  tel: function(input) {
    if (!/^[^a-z^A-Z]+$/.test(input.value)) {
      return "Can not contain letters.";
    }
  },
  number: function(input) {
    if (!/^[0-9]+$/.test(input.value)) {
      return "Must be a number.";
    }
  },
  date: function(input) {
    if (!/(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/.test(input.value)) {
      return "Must be a YYYY-MM-DD formatted date.";
    }
  }
};