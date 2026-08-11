"use strict";
const MANCHESTER_CONFIG = {
    red: { rotulo: "Emergência", tempo: "Imediato", badgeClass: "badge-red" },
    orange: {
        rotulo: "Muito Urgente",
        tempo: "10 min",
        badgeClass: "badge-orange",
    },
    yellow: { rotulo: "Urgente", tempo: "60 min", badgeClass: "badge-yellow" },
    green: {
        rotulo: "Pouco Urgente",
        tempo: "120 min",
        badgeClass: "badge-green",
    },
    blue: { rotulo: "Não Urgente", tempo: "240 min", badgeClass: "badge-blue" },
};
const filaPacientes = [];
const formTriagem = document.getElementById("triagem-form");
const queueList = document.getElementById("queue-list");
if (formTriagem && queueList) {
    formTriagem.addEventListener("submit", (event) => {
        event.preventDefault();
        const nomeInput = document.getElementById("nome");
        const cpfInput = document.getElementById("cpf");
        const pressaoInput = document.getElementById("pressao");
        const tempInput = document.getElementById("temp");
        const satInput = document.getElementById("sat");
        const freqInput = document.getElementById("frequencia");
        const queixaInput = document.getElementById("queixa");
        const urgenciaSelecionada = document.querySelector('input[name="urgencia"]:checked');
        const nivelUrgencia = urgenciaSelecionada?.value || "yellow";
        const novoPaciente = {
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
            nome: nomeInput.value.trim(),
            cpf: cpfInput.value.trim(),
            pressao: pressaoInput.value.trim(),
            temperatura: tempInput.value ? parseFloat(tempInput.value) : null,
            saturacao: satInput.value ? parseInt(satInput.value, 10) : null,
            frequencia: freqInput.value ? parseInt(freqInput.value, 10) : null,
            queixa: queixaInput.value.trim(),
            urgencia: nivelUrgencia,
            horario: new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
        filaPacientes.unshift(novoPaciente);
        renderizarFila();
        formTriagem.reset();
        const defaultRadio = document.getElementById("u3");
        if (defaultRadio)
            defaultRadio.checked = true;
    });
}
function renderizarFila() {
    if (!queueList)
        return;
    queueList.innerHTML = "";
    if (filaPacientes.length === 0) {
        queueList.innerHTML =
            '<p class="empty-queue">Nenhum paciente na fila de espera.</p>';
        return;
    }
    filaPacientes.forEach((paciente) => {
        const config = MANCHESTER_CONFIG[paciente.urgencia];
        const item = document.createElement("div");
        item.className = `queue-item ${paciente.urgencia}`;
        item.innerHTML = `
      <div class="patient-details">
        <strong class="patient-name">${escapeHTML(paciente.nome)}</strong>
        <span class="patient-time">Triagem realizada às ${paciente.horario}</span>
      </div>
      <span class="badge ${config.badgeClass}">${config.rotulo}</span>
    `;
        queueList.appendChild(item);
    });
}
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, (tag) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[tag] || tag);
}
