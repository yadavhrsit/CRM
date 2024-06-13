const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message:
      err.message.split(":", 0)[2] ||
      err.message.split(":", 1)[3] ||
      err.message.split(":", 1)[4] ||
      err.message.split(":", 1)[5] ||
      err.message ||
      "Internal Server Error",
  });
};

module.exports = errorHandler;
