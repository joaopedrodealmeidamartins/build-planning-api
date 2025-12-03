import jwt from "jsonwebtoken";

export function auth(requiredRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token não informado" });
    }

    const [, token] = authHeader.split(" ");

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;

      if (requiredRoles.length && !requiredRoles.includes(payload.role)) {
        return res.status(403).json({ message: "Acesso negado" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Token inválido" });
    }
  };
}
