
import jwt from "jsonwebtoken";

export default function Login(app) {

    /**
     * @openapi
     * /login:
     *   post:
     *     summary: Autenticação de usuário
     *     description: Valida usuário e senha e retorna um token JWT para acesso aos endpoints protegidos.
     *     tags:
     *       - Autenticação
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - usuario
     *               - senha
     *             properties:
     *               usuario:
     *                 type: string
     *                 example: "usuario"
     *               senha:
     *                 type: string
     *                 example: "senha"
     *     responses:
     *       200:
     *         description: Login realizado com sucesso.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     *       401:
     *         description: Usuário ou senha inválidos.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 erro:
     *                   type: string
     *                   example: "Usuário ou senha inválidos"
     *       500:
     *         description: Erro interno do servidor.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 erro:
     *                   type: string
     *                   example: "Erro interno do servidor"
     */
  app.post("/login", async (req, res) => {

    const { usuario, senha } = req.body;

    if (usuario !== "ti27" || senha !== "fundatec2026") {
      return res.status(401).json({
        erro: "Usuário ou senha inválidos"
      });
    }

    const token = jwt.sign(
      { usuario },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });

}