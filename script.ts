type NivelUrgencia = "red" | "orange" | "yellow" | "green" | "blue";

interface Paciente {
  nome: string;
  urgencia: NivelUrgencia;
  horario: string;
}

const MAPA_URGENCIA: Record<
  NivelUrgencia,
  { texto: string; classeBadge: string }
> = {
  red: { texto: "Emergência", classeBadge: "badge-red" },
  orange: { texto: "Muito Urgente", classeBadge: "badge-orange" },
  yellow: { texto: "Urgente", classeBadge: "badge-yellow" },
  green: { texto: "Pouco Urgente", classeBadge: "badge-green" },
  blue: { texto: "Não Urgente", classeBadge: "badge-blue" },
};

const formTriagem = document.getElementById(
  "triagem-form",
) as HTMLFormElement | null;
const queueList = document.getElementById(
  "queue-list",
) as HTMLDivElement | null;

if (formTriagem && queueList) {
  formTriagem.addEventListener("submit", (event: Event) => {
    event.preventDefault();

    const nomeInput = document.getElementById("nome") as HTMLInputElement;
    const nomePaciente = nomeInput.value.trim();

    const urgenciaSelecionada = document.querySelector<HTMLInputElement>(
      'input[name="urgencia"]:checked',
    );
    const nivelUrgencia =
      (urgenciaSelecionada?.value as NivelUrgencia) || "yellow";

    const horarioAtual = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const novoPaciente: Paciente = {
      nome: nomePaciente,
      urgencia: nivelUrgencia,
      horario: horarioAtual,
    };

    adicionarPacienteNaFila(novoPaciente);

    formTriagem.reset();
    const radioPadrao = document.getElementById(
      "u3",
    ) as HTMLInputElement | null;
    if (radioPadrao) {
      radioPadrao.checked = true;
    }
  });
}

function adicionarPacienteNaFila(paciente: Paciente): void {
  if (!queueList) return;

  const infoUrgencia = MAPA_URGENCIA[paciente.urgencia];

  const queueItem = document.createElement("div");
  queueItem.className = `queue-item ${paciente.urgencia}`;

  queueItem.innerHTML = `
    <div class="patient-details">
      <span class="patient-name">${sanitizarTexto(paciente.nome)}</span>
      <span class="patient-time">Triagem às ${paciente.horario}</span>
    </div>
    <span class="badge ${infoUrgencia.classeBadge}">${infoUrgencia.texto}</span>
  `;

  queueList.prepend(queueItem);
}

function sanitizarTexto(texto: string): string {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}
