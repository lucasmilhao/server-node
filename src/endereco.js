import { Router } from "express";
import autenticarToken from "./autenticacao.js";

export default function Endereco(app, db) {

    const router = Router();

    /**
     * @swagger
     * /Endereco/{idEndereco}:
     *   get:
     *     summary: Busca um endereço pelo ID
     *     tags:
     *       - Endereço
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idEndereco
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do endereço
     *     responses:
     *       200:
     *         description: Endereço encontrado
     *       404:
     *         description: Endereço não encontrado
     *       500:
     *         description: Erro interno do servidor
     */
    router.get("/Endereco/:idEndereco", autenticarToken, async (req, res) => {
        try {
            const { idEndereco } = req.params;
            const sql = 'SELECT * FROM Endereco WHERE idEndereco = ?';
            const [rows] = await db.query(sql, [idEndereco]);

            if (rows.length === 0) {
                return res.status(404).json({ erro: "Endereço não encontrado" });
            }

            res.status(200).json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: 'Erro na consulta ao banco de dados' });
        }
    });

    /**
     * @swagger
     * /ListaEnderecos:
     *   get:
     *     summary: Lista todos os endereços cadastrados
     *     tags:
     *       - Endereço
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de endereços retornada com sucesso
     *       500:
     *         description: Erro interno do servidor
     */
    router.get("/ListaEnderecos", autenticarToken, async (req, res) => {
        try {
            const sql = 'SELECT * FROM Endereco';
            const [rows] = await db.query(sql);

            res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: 'Erro na consulta ao banco de dados' });
        }
    });

    /**
     * @swagger
     * /ListaEnderecos/{idPessoa}:
     *   get:
     *     summary: Lista os endereços de uma pessoa
     *     tags:
     *       - Endereço
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idPessoa
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID da pessoa
     *     responses:
     *       200:
     *         description: Lista de endereços retornada com sucesso
     *       500:
     *         description: Erro interno do servidor
     */
    router.get("/ListaEnderecos/:idPessoa", autenticarToken, async (req, res) => {
        try {
            const { idPessoa } = req.params;
            const sql = 'SELECT * FROM Endereco WHERE idPessoa = ?';
            const [rows] = await db.query(sql, [idPessoa]);

            res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: 'Erro na consulta ao banco de dados' });
        }
    });

    /**
     * @swagger
     * /IncluirEndereco:
     *   post:
     *     summary: Cadastra um novo endereço
     *     tags:
     *       - Endereço
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - Endereco
     *               - Cidade
     *               - Numero
     *               - idPessoa
     *             properties:
     *               Endereco:
     *                 type: string
     *                 example: Rua das Flores
     *               Cidade:
     *                 type: string
     *                 example: Porto Alegre
     *               Complemento:
     *                 type: string
     *                 example: Apartamento 101
     *               Numero:
     *                 type: string
     *                 example: "123"
     *               idPessoa:
     *                 type: integer
     *                 example: 1
     *     responses:
     *       201:
     *         description: Endereço cadastrado com sucesso
     *       500:
     *         description: Erro interno do servidor
     */
    router.post("/IncluirEndereco", autenticarToken, async (req, res) => {
        try {
            const { Endereco, Cidade, Complemento, Numero, idPessoa } = req.body;

            const sql = `
                INSERT INTO Endereco
                (Endereco, Cidade, Complemento, Numero, idPessoa)
                VALUES (?, ?, ?, ?, ?)
            `;

            const [result] = await db.query(sql, [
                Endereco,
                Cidade,
                Complemento,
                Numero,
                idPessoa
            ]);

            res.status(201).json({ idEndereco: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                erro: 'Erro ao incluir endereço no banco de dados'
            });
        }
    });

    /**
     * @swagger
     * /ExcluirEndereco/{idEndereco}:
     *   delete:
     *     summary: Exclui um endereço pelo ID
     *     tags:
     *       - Endereço
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idEndereco
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do endereço a ser excluído
     *     responses:
     *       200:
     *         description: Endereço excluído com sucesso
     *       404:
     *         description: Endereço não encontrado
     *       500:
     *         description: Erro na exclusão do endereço no banco de dados
     */
    router.delete("/ExcluirEndereco/:idEndereco", autenticarToken, async (req, res) => {
        try {
            const { idEndereco } = req.params;
            const sql = 'DELETE FROM Endereco WHERE idEndereco = ?';
            const [result] = await db.query(sql, [idEndereco]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ erro: 'Endereço não encontrado - favor verificar' });
            }

            res.status(200).json({ mensagem: 'Endereço excluído com sucesso' });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                erro: 'Erro ao excluir endereço do banco de dados'
            });
        }
    });

    /**
     * @swagger
     * /AlterarEndereco/{idEndereco}:
     *   put:
     *     summary: Altera os dados de um endereço pelo ID
     *     tags:
     *       - Endereço
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idEndereco
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do endereço a ser alterado
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               Endereco:
     *                 type: string
     *                 example: Rua das Flores
     *               Cidade:
     *                 type: string
     *                 example: Porto Alegre
     *               Complemento:
     *                 type: string
     *                 example: Apartamento 101
     *               Numero:
     *                 type: integer
     *                 example: 123
     *               idPessoa:
     *                 type: integer
     *                 example: 1
     *           example:
     *             Endereco: Rua das Flores
     *             Cidade: Porto Alegre
     *             Complemento: Apartamento 101
     *             Numero: 123
     *             idPessoa: 1
     *     responses:
     *       200:
     *         description: Endereço alterado com sucesso
     *       400:
     *         description: Nenhum campo fornecido para atualização
     *       404:
     *         description: Endereço não encontrado
     *       500:
     *         description: Erro ao alterar endereço no banco de dados
     */
    router.put("/AlterarEndereco/:idEndereco", autenticarToken, async (req, res) => {
        try {
            const { idEndereco } = req.params;
            const { Endereco, Cidade, Complemento, Numero, idPessoa } = req.body;

            const campos = [];
            const valores = [];

            if (Endereco !== undefined) {
                campos.push("Endereco = ?");
                valores.push(Endereco);
            }
            if (Cidade !== undefined) {
                campos.push("Cidade = ?");
                valores.push(Cidade);
            }
            if (Complemento !== undefined) {
                campos.push("Complemento = ?");
                valores.push(Complemento);
            }
            if (Numero !== undefined) {
                campos.push("Numero = ?");
                valores.push(Numero);
            }
            if (idPessoa !== undefined) {
                campos.push("idPessoa = ?");
                valores.push(idPessoa);
            }

            if (campos.length === 0) {
                return res.status(400).json({ erro: 'Nenhum campo fornecido para atualização' });
            }

            const sql = `
                UPDATE Endereco
                SET ${campos.join(", ")}
                WHERE idEndereco = ?
            `;

            const [result] = await db.query(sql, [...valores, idEndereco]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ erro: 'Endereço não encontrado - favor verificar' });
            }

            res.status(200).json({ mensagem: 'Endereço alterado com sucesso' });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                erro: 'Erro ao alterar endereço no banco de dados'
            });
        }
    });

    app.use("/", router);
}
