const prisma = require("../data/prisma");
const { encerrarEvento, podeExcluirEvento } = require("../services/inscricoes.services");

const cadastrar = async (req, res) => {
    try {
        const data = req.body;

        data.data_evento = new Date(data.data_evento);

        const item = await prisma.eventos.create({ data });

        res.status(201).json(item);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const listar = async (req, res) => {
    const lista = await prisma.eventos.findMany();
    res.status(200).json(lista);
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.eventos.findUnique({
        where: { id: Number(id) }
    });

    res.status(200).json(item);
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;

    try {
        const item = await prisma.eventos.update({
            where: { id: Number(id) },
            data: dados
        });

        if (item.status === "ENCERRADO") {
            await encerrarEvento(Number(id));
        }

        res.status(200).json(item);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const excluir = async (req, res) => {
    const { id } = req.params;

    try {
        await podeExcluirEvento(Number(id));

        const item = await prisma.eventos.delete({
            where: { id: Number(id) }
        });

        res.status(200).json(item);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
};