const handelDuplicationError = (err, res) => {
  const field = Object.keys(err.keyValue);
  const code = 409;
  const error = `An account with that ${field} already exists.`;
  res.status(code).send({ messages: error, fields: field });
};

const handleValidationError = (err, res) => {
  let errors = Object.values(err.errors).map((el) => el.message);
  let fields = Object.values(err.errors).map((el) => el.path);
  let code = 400;
  if (errors.length > 1) {
    const formattedErrors = errors.join(' ');
    res.status(code).send({ messages: formattedErrors, fields: fields });
  } else {
    res.status(code).send({ messages: errors, fields: fields });
  }
};

exports.errorHandler = (err, req, res, next) => {
  try {
    if (err.name === 'ValidationError') return handleValidationError(err, res);
    if (err.code && err.code == 11000) return handelDuplicationError(err, res);
    // if (err.name && err.message) return res.json({ name: err.name, message: err.message });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'An unknown error occurred.' });
  }
};
