module.exports = (err, req, res, next) => {
  console.error("❌ Error Logger:", err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro interno no servidor.";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
