const convert = (value, type) => {
  switch (type) {
    case Boolean: {
      return Boolean((value || '').replace(/\s*(false|null|undefined|0)\s*/i, ''));
    }
    default:
      break;
  }
};

exports.queryParser = (param) => {
  return (req, res, next) => {
    param.forEach(({ name, type }) => {
      if (name in req.query) req.query[name] = convert(req.query[name], type);
    });
    console.log(req.query);
    next();
  };
};
