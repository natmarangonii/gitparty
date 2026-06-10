const prisma = require("../data/prisma"); 

const limiteInscricoes = async (eventoId) => {
    const evento = await prisma.eventos.findUnique({
        where: { id: eventoId },
        include: { inscricoes: true }
    });

    if (!evento) throw new Error("Evento não encontrado");

    const confirmadas = evento.inscricoes.filter(
        i => i.status === "CONFIRMADA"
    ).length;

    if (confirmadas >= evento.capacidade_maxima) {
        return "LISTA_ESPERA";
    }

    return "CONFIRMADA";
};

const inscricaoDuplicada = async (usuarioId, eventoId) => {
    const existente = await prisma.inscricoes.findFirst({
        where: {
            usuariosId: usuarioId,
            eventosId: eventoId
        }
    });

    if (existente) {
        throw new Error("Usuário já inscrito no evento");
    }
};

const validarPrazoCancelamento = async (inscricaoId) => {
    const inscricao = await prisma.inscricoes.findUnique({
        where: { id: inscricaoId },
        include: { eventos: true } 
    });

    if (!inscricao) throw new Error("Inscrição não encontrada");

    let hoje = new Date();
    let dataEvento = new Date(inscricao.eventos.data_evento);

    let intervalo = dataEvento - hoje; 

    let horas = intervalo / (1000 * 60 * 60);

    if (horas < 24) {
        throw new Error("Cancelamento não permitido em menos de 24h para o evento");
    }
};

const promoverListaEspera = async (eventoId) => {
    const proximo = await prisma.inscricoes.findFirst({
        where: {
            eventosId: eventoId,
            status: "LISTA_ESPERA"
        },
        orderBy: {
            id: "asc"
        }
    });

    if (proximo) {
        await prisma.inscricoes.update({
            where: { id: proximo.id },
            data: { status: "CONFIRMADA" }
        });
    }
};

const podeExcluirEvento = async (eventoId) => { 
    const evento = await prisma.eventos.findUnique({
        where: { id: eventoId },
        include: { inscricoes: true }
    });

    if (!evento) throw new Error("Evento não encontrado");

    const hoje = new Date();
    if (new Date(evento.data_evento) < hoje) {
        throw new Error("Evento já aconteceu e não pode ser excluído");
    }

    const possuiInscricoes = evento.inscricoes.length > 0;

    if (possuiInscricoes) {
        throw new Error("Evento possui participantes e não pode ser excluído");
    }
};


const encerrarEvento = async (eventoId) => { 
    return await prisma.inscricoes.updateMany({
        where: {
            eventosId: eventoId,
            status: "LISTA_ESPERA"
        },
        data: {
            status: "CANCELADA"
        }
    });
};


module.exports = {
    limiteInscricoes,
    inscricaoDuplicada,
    validarPrazoCancelamento,
    promoverListaEspera,
    podeExcluirEvento,
    encerrarEvento
};