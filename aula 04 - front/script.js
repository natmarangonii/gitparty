const listaEventos = document.getElementById("listaEventos");
const modal = document.getElementById("modalEvento");
const form = document.getElementById("cadEvento");

const tituloEvento = document.getElementById("tituloEvento");
const dataEvento = document.getElementById("dataEvento");
const localEvento = document.getElementById("localEvento");
const descricaoEvento = document.getElementById("descricaoEvento");
const listaImagens = document.getElementById("listaImagens");

function getEventos() {
    return JSON.parse(localStorage.getItem("eventos")) || [];
}

function salvarEventos(eventos) {
    localStorage.setItem("eventos", JSON.stringify(eventos));
}

function abrirModal() {
    modal.style.display = "block";
}

function fecharModal() {
    modal.style.display = "none";
}

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const dados = new FormData(form);

        const novoEvento = {
            id: Date.now(),
            titulo: dados.get("titulo"),
            data: dados.get("data"),
            local: dados.get("local"),
            descricao: dados.get("descricao"),
            imagens: []
        };

        const eventos = getEventos();
        eventos.push(novoEvento);
        salvarEventos(eventos);

        form.reset();
        fecharModal();
        listarEventos();
    });
}

function listarEventos() {
    if (!listaEventos) return;

    listaEventos.innerHTML = "";
    const eventos = getEventos();

    eventos.forEach(evento => {
        const card = document.createElement("div");

        card.innerHTML = `
            <h3>${evento.titulo}</h3>
            <p>${evento.data}</p>
            <p>${evento.local}</p>

            <button onclick="verDetalhes(${evento.id})">Ver</button>
            <button onclick="excluirEvento(${evento.id})">Excluir</button>
        `;

        listaEventos.appendChild(card);
    });
}

function excluirEvento(id) {
    let eventos = getEventos();
    eventos = eventos.filter(e => e.id !== id);
    salvarEventos(eventos);
    listarEventos();
}

function verDetalhes(id) {
    localStorage.setItem("eventoSelecionado", id);
    window.location.href = "index2.html";
}

function voltar() {
    window.location.href = "index.html";
}

function carregarDetalhes() {
    const id = localStorage.getItem("eventoSelecionado");
    if (!id) return;

    const eventos = getEventos();
    const evento = eventos.find(e => e.id == id);

    if (!evento) return;

    if (tituloEvento) {
        tituloEvento.textContent = evento.titulo;
        dataEvento.textContent = evento.data;
        localEvento.textContent = evento.local;
        descricaoEvento.textContent = evento.descricao;

        carregarImagens(evento);
    }
}

function uploadImagem() {
    const input = document.getElementById("inputImagem");
    const file = input.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
        const id = localStorage.getItem("eventoSelecionado");
        const eventos = getEventos();

        const evento = eventos.find(e => e.id == id);
        if (!evento) return;

        evento.imagens.push(reader.result);
        salvarEventos(eventos);

        carregarImagens(evento);
    };

    reader.readAsDataURL(file);
}

function carregarImagens(evento) {
    if (!listaImagens) return;

    listaImagens.innerHTML = "";

    evento.imagens.forEach(img => {
        const imagem = document.createElement("img");
        imagem.src = img;
        imagem.width = 150;

        listaImagens.appendChild(imagem);
    });
}

listarEventos();
carregarDetalhes();