
import jwt from "jsonwebtoken";
import autenticarToken from "./autenticacao.js";

export default function Chat(app) {
    /**
     * @openapi
     * /chat:
     *   post:
     *     summary: Enviar mensagem para o ChatGPT
     *     description: Recebe uma mensagem e retorna a resposta gerada pela IA.
     *     tags:
     *       - ChatGPT
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - mensagem
     *             properties:
     *               mensagem:
     *                 type: string
     *                 description: Mensagem enviada para o ChatGPT
     *                 example: "Olá, ChatGPT!"
     *     responses:
     *       200:
     *         description: Resposta gerada pelo ChatGPT
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 resposta:
     *                   type: string
     *                   example: "Olá! Como posso ajudar você hoje?"
     *       400:
     *         description: Campo mensagem não informado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 erro:
     *                   type: string
     *                   example: "Campo 'mensagem' é obrigatório"
     *       500:
     *         description: Erro interno
     * 
     *  */
    app.post("/chat", autenticarToken, async (req, res) => {
        try {
            const { mensagem } = req.body;

            if (!mensagem) {
                return res.status(400).json({
                    erro: "Campo 'mensagem' é obrigatório"
                });
            }

            const resposta = await client.responses.create({
                model: "gpt-4o",
                input: mensagem
            });

            res.json({ resposta: resposta.output_text });

        } catch (err) {
            console.error(err);
            res.status(500).json({
                erro: "Erro ao acessar o ChatGPT"
            });
        }
    });

}