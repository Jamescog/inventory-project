exports.error404 = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "requested resource is not found!",
  });
  next();
};
