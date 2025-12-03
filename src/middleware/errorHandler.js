export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 400;
  res.status(status).json({
    message: err.message || "Erro inesperado"
  });
}
