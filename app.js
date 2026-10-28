(() => {
  "use strict";

  const STORAGE_KEY = "sala-certa-cna-turmas-v1";
  const $ = (id) => document.getElementById(id);
  const form = $("classForm");

  const fields = {
    id: $("classId"),
    floor: $("floor"),
    room: $("room"),
    students: $("students"),
    teacher: $("teacher"),
    className: $("className"),
    startTime: $("startTime"),
    endTime: $("endTime"),
  };

  const floorOrder = [
    "Térreo",
    "1º andar",
    "2º andar",
    "3º andar",
    "4º andar",
    "5º andar",
    "Outro",
  ];

  let classes = loadClasses();

  function loadClasses() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

      return Array.isArray(stored)
        ? stored.filter((item) => item && typeof item.id === "string")
        : [];
    } catch {
      return [];
    }
  }

  function escapeHtml(value) {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return String(value).replace(/[&<>"']/g, (character) => entities[character]);
  }

  function compareClasses(a, b) {
    const floorA = floorOrder.indexOf(a.floor);
    const floorB = floorOrder.indexOf(b.floor);
    const orderA = floorA < 0 ? 99 : floorA;
    const orderB = floorB < 0 ? 99 : floorB;

    return (
      orderA - orderB ||
      a.floor.localeCompare(b.floor, "pt-BR") ||
      a.room.localeCompare(b.room, "pt-BR", { numeric: true })
    );
  }

  function persistClasses() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
    render();
  }

  function renderStats() {
    $("totalClasses").textContent = classes.length;
    $("totalRooms").textContent = new Set(
      classes.map((item) => item.floor + "|" + item.room.toLowerCase()),
    ).size;
    $("totalStudents").textContent = classes.reduce(
      (total, item) => total + Number(item.students || 0),
      0,
    );
    $("listCount").textContent =
      classes.length + " " + (classes.length === 1 ? "turma" : "turmas");
  }

  function renderFloorFilter() {
    const select = $("floorFilter");
    const previousValue = select.value;
    const floors = [...new Set(classes.map((item) => item.floor))].sort(
      (a, b) => floorOrder.indexOf(a) - floorOrder.indexOf(b),
    );

    select.innerHTML =
      '<option value="">Todos os andares</option>' +
      floors.map((floor) => "<option>" + escapeHtml(floor) + "</option>").join("");

    if (floors.includes(previousValue)) {
      select.value = previousValue;
    }
  }

  function renderClassList() {
    const query = $("searchInput").value.trim().toLocaleLowerCase("pt-BR");
    const selectedFloor = $("floorFilter").value;

    const filteredClasses = [...classes]
      .sort(compareClasses)
      .filter((item) => {
        const matchesFloor = !selectedFloor || item.floor === selectedFloor;
        const searchableText = [
          item.floor,
          item.room,
          item.teacher,
          item.className,
          item.startTime || "",
          item.endTime || "",
        ]
          .join(" ")
          .toLocaleLowerCase("pt-BR");

        return matchesFloor && searchableText.includes(query);
      });

    $("classList").innerHTML = filteredClasses
      .map(
        (item) => `
          <article class="class-item">
            <div class="room-number">${escapeHtml(item.room)}</div>
            <div class="class-info">
              <strong>${escapeHtml(item.className)}</strong>
              <span>
                ${escapeHtml(item.floor)} · Sala ${escapeHtml(item.room)}
                · Prof. ${escapeHtml(item.teacher)}
                · ${escapeHtml(item.startTime || "--:--")}–${escapeHtml(item.endTime || "--:--")}
              </span>
            </div>
            <span class="student-count">${Number(item.students || 0)} alunos</span>
            <div class="item-actions">
              <button
                class="icon-button"
                data-action="edit"
                data-id="${escapeHtml(item.id)}"
                aria-label="Editar turma"
                title="Editar"
              >✎</button>
              <button
                class="icon-button delete"
                data-action="delete"
                data-id="${escapeHtml(item.id)}"
                aria-label="Excluir turma"
                title="Excluir"
              >×</button>
            </div>
          </article>
        `,
      )
      .join("");

    const emptyState = $("emptyState");
    const isEmpty = filteredClasses.length === 0;

    emptyState.classList.toggle("visible", isEmpty);
    emptyState.querySelector("strong").textContent = classes.length
      ? isEmpty
        ? "Nenhum resultado encontrado"
        : ""
      : "Nenhuma turma por aqui";

    emptyState.querySelector("p").textContent = classes.length
      ? "Tente mudar a busca ou o filtro de andar."
      : "Cadastre a primeira turma usando o formulário ao lado.";
  }

  function renderTv() {
    const root = $("tvContent");

    if (!classes.length) {
      root.innerHTML = `
        <div class="tv-empty">
          <strong>Nenhuma turma cadastrada</strong>
          Cadastre as turmas no painel administrativo para exibi-las aqui.
        </div>
      `;
      $("tvUpdated").textContent = "Aguardando cadastro";
      return;
    }

    const groups = new Map();

    [...classes].sort(compareClasses).forEach((item) => {
      if (!groups.has(item.floor)) {
        groups.set(item.floor, []);
      }

      groups.get(item.floor).push(item);
    });

    root.innerHTML = [...groups]
      .map(
        ([floor, items]) => `
          <section class="floor-section">
            <h2 class="floor-title">${escapeHtml(floor)}</h2>
            <div class="tv-class-list">
              ${items
                .map(
                  (item) => `
                    <article class="tv-class">
                      <div class="tv-room">Sala ${escapeHtml(item.room)}</div>
                      <div>
                        <h3>${escapeHtml(item.className)}</h3>
                        <p>Prof. ${escapeHtml(item.teacher)}</p>
                        <small>
                          ${escapeHtml(item.startTime || "--:--")}–${escapeHtml(item.endTime || "--:--")}
                          · ${Number(item.students || 0)}
                          ${Number(item.students || 0) === 1 ? "aluno" : "alunos"}
                        </small>
                      </div>
                    </article>
                  `,
                )
                .join("")}
            </div>
          </section>
        `,
      )
      .join("");

    $("tvUpdated").textContent =
      "Atualizado às " +
      new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
  }

  function render() {
    renderStats();
    renderFloorFilter();
    renderClassList();
    renderTv();
  }

  function resetForm() {
    form.reset();
    fields.id.value = "";
    fields.students.value = "0";
    $("formTitle").textContent = "Adicionar turma";
    $("saveButton").textContent = "＋ Salvar turma";
    $("cancelEdit").hidden = true;
    $("formError").hidden = true;
  }

  function editClass(id) {
    const item = classes.find((entry) => entry.id === id);

    if (!item) {
      return;
    }

    Object.keys(fields).forEach((key) => {
      fields[key].value = item[key] ?? "";
    });

    $("formTitle").textContent = "Editar turma";
    $("saveButton").textContent = "Salvar alterações";
    $("cancelEdit").hidden = false;
    $("formError").hidden = true;

    if (innerWidth < 900) {
      form.scrollIntoView({ behavior: "smooth" });
    }
  }

  function getFormClass() {
    return {
      id:
        fields.id.value ||
        (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      floor: fields.floor.value.trim(),
      room: fields.room.value.trim(),
      students: Number(fields.students.value),
      teacher: fields.teacher.value.trim(),
      className: fields.className.value.trim(),
      startTime: fields.startTime.value,
      endTime: fields.endTime.value,
    };
  }

  function isValidClass(item) {
    return (
      item.floor &&
      item.room &&
      item.teacher &&
      item.className &&
      item.startTime &&
      item.endTime &&
      item.endTime > item.startTime &&
      Number.isInteger(item.students) &&
      item.students >= 0 &&
      item.students <= 999
    );
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const item = getFormClass();
    const error = $("formError");

    if (!isValidClass(item)) {
      error.textContent =
        "Preencha todos os campos e informe de 0 a 999 alunos.";
      error.hidden = false;
      return;
    }

    const duplicate = classes.find(
      (entry) =>
        entry.id !== item.id &&
        entry.floor === item.floor &&
        entry.room.toLowerCase() === item.room.toLowerCase(),
    );

    if (
      duplicate &&
      !confirm("Já existe uma turma nesta sala. Deseja cadastrar mesmo assim?")
    ) {
      return;
    }

    const existingIndex = classes.findIndex((entry) => entry.id === item.id);

    if (existingIndex < 0) {
      classes.push(item);
    } else {
      classes[existingIndex] = item;
    }

    persistClasses();
    resetForm();
  });

  $("cancelEdit").addEventListener("click", resetForm);
  $("searchInput").addEventListener("input", renderClassList);
  $("floorFilter").addEventListener("change", renderClassList);

  $("classList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
      return;
    }

    const item = classes.find((entry) => entry.id === button.dataset.id);

    if (!item) {
      return;
    }

    if (button.dataset.action === "edit") {
      editClass(item.id);
    }

    if (
      button.dataset.action === "delete" &&
      confirm('Excluir a turma "' + item.className + '"?')
    ) {
      classes = classes.filter((entry) => entry.id !== item.id);

      if (fields.id.value === item.id) {
        resetForm();
      }

      persistClasses();
    }
  });

  function updateClock() {
    const now = new Date();

    $("clock").textContent = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    $("dateLabel").textContent = now.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
  }

  function route() {
    const isTvPage =
      location.pathname.includes("/view") || location.hash === "#tv";

    $("adminView").hidden = isTvPage;
    $("tvView").hidden = !isTvPage;
    $("adminLink").classList.toggle("active", !isTvPage);
    $("tvLink").classList.toggle("active", isTvPage);

    document.title = isTvPage
      ? "Sala Certa CNA | Quadro de Turmas"
      : "Sala Certa CNA | Gerenciamento de Turmas";

    if (isTvPage) {
      updateClock();
      renderTv();
    }
  }

  const fullscreenButton = $("fullscreenButton");

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.warn("Não foi possível alternar tela cheia:", error);
    }
  }

  function updateFullscreenButton() {
    if (!fullscreenButton) {
      return;
    }

    const isFullscreen = Boolean(document.fullscreenElement);

    fullscreenButton.innerHTML = isFullscreen
      ? '<span aria-hidden="true">⤢</span>'
      : '<span aria-hidden="true">⛶</span>';
    fullscreenButton.setAttribute(
      "aria-label",
      isFullscreen ? "Sair da tela cheia" : "Entrar em tela cheia",
    );
    fullscreenButton.title = isFullscreen
      ? "Sair da tela cheia (Esc)"
      : "Tela cheia (Esc para sair)";
  }

  if (fullscreenButton) {
    fullscreenButton.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", updateFullscreenButton);
    updateFullscreenButton();
  }

  addEventListener("hashchange", route);
  addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      classes = loadClasses();
      render();
    }
  });

  setInterval(() => {
    if (location.hash === "#tv" || location.pathname.includes("/view")) {
      updateClock();
      const latestClasses = loadClasses();

      if (JSON.stringify(latestClasses) !== JSON.stringify(classes)) {
        classes = latestClasses;
        render();
      }
    }
  }, 3000);

  render();
  route();
  updateClock();
  setInterval(updateClock, 15000);
})();
