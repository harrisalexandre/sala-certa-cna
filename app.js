(() => {
  "use strict";

<<<<<<< HEAD
  const STORAGE_KEY = "sala-certa-cna-turmas-v1";
  const $ = (id) => document.getElementById(id);
  const form = $("classForm");

=======
  const KEY = "sala-certa-cna-turmas-v1";
  const FLOOR_ORDER = ["Térreo", "1º andar", "2º andar", "3º andar", "4º andar", "5º andar", "Outro"];

  const $ = (id) => document.getElementById(id);

  const form = $("classForm");
>>>>>>> a064054 (refatoracao)
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
<<<<<<< HEAD

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
=======
  const fullscreenButton = $("fullscreenButton");

  let classes = load();

  /* ---------- Utils ---------- */

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(data) ? data.filter((c) => c && typeof c.id === "string") : [];
>>>>>>> a064054 (refatoracao)
    } catch {
      return [];
    }
  }

<<<<<<< HEAD
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
=======
  function persist() {
    localStorage.setItem(KEY, JSON.stringify(classes));
    render();
  }

  function esc(value) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(value).replace(/[&<>"']/g, (c) => map[c]);
  }

  function floorIndex(floor) {
    const i = FLOOR_ORDER.indexOf(floor);
    return i < 0 ? 99 : i;
  }

  function sortClasses(a, b) {
    return (
      floorIndex(a.floor) - floorIndex(b.floor) ||
>>>>>>> a064054 (refatoracao)
      a.floor.localeCompare(b.floor, "pt-BR") ||
      a.room.localeCompare(b.room, "pt-BR", { numeric: true })
    );
  }

<<<<<<< HEAD
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
=======
  function pluralStudents(n) {
    return `${n} ${n === 1 ? "aluno" : "alunos"}`;
  }

  function isTVMode() {
    return location.pathname.includes("/view") || location.hash === "#tv";
  }

  /* ---------- Render: Admin ---------- */

  function renderStats() {
    const rooms = new Set(classes.map((c) => `${c.floor}|${c.room.toLowerCase()}`));
    const totalStudents = classes.reduce((sum, c) => sum + Number(c.students || 0), 0);

    $("totalClasses").textContent = classes.length;
    $("totalRooms").textContent = rooms.size;
    $("totalStudents").textContent = totalStudents;
    $("listCount").textContent = `${classes.length} ${classes.length === 1 ? "turma" : "turmas"}`;
>>>>>>> a064054 (refatoracao)
  }

  function renderFloorFilter() {
    const select = $("floorFilter");
<<<<<<< HEAD
    const previousValue = select.value;
    const floors = [...new Set(classes.map((item) => item.floor))].sort(
      (a, b) => floorOrder.indexOf(a) - floorOrder.indexOf(b),
=======
    const previous = select.value;
    const floors = [...new Set(classes.map((c) => c.floor))].sort(
      (a, b) => FLOOR_ORDER.indexOf(a) - FLOOR_ORDER.indexOf(b)
>>>>>>> a064054 (refatoracao)
    );

    select.innerHTML =
      '<option value="">Todos os andares</option>' +
<<<<<<< HEAD
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
=======
      floors.map((f) => `<option>${esc(f)}</option>`).join("");

    if (floors.includes(previous)) select.value = previous;
  }

  function classItemHTML(c) {
    const start = esc(c.startTime || "--:--");
    const end = esc(c.endTime || "--:--");
    const id = esc(c.id);

    return `
      <article class="class-item">
        <div class="room-number">${esc(c.room)}</div>
        <div class="class-info">
          <strong>${esc(c.className)}</strong>
          <span>${esc(c.floor)} · Sala ${esc(c.room)} · Prof. ${esc(c.teacher)} · ${start}–${end}</span>
        </div>
        <span class="student-count">${Number(c.students || 0)} alunos</span>
        <div class="item-actions">
          <button class="icon-button" data-action="edit" data-id="${id}" aria-label="Editar turma" title="Editar">✎</button>
          <button class="icon-button delete" data-action="delete" data-id="${id}" aria-label="Excluir turma" title="Excluir">×</button>
        </div>
      </article>`;
  }

  function renderList() {
    const query = $("searchInput").value.trim().toLocaleLowerCase("pt-BR");
    const floor = $("floorFilter").value;

    const items = [...classes].sort(sortClasses).filter((c) => {
      if (floor && c.floor !== floor) return false;
      const haystack = [c.floor, c.room, c.teacher, c.className, c.startTime || "", c.endTime || ""]
        .join(" ")
        .toLocaleLowerCase("pt-BR");
      return haystack.includes(query);
    });

    $("classList").innerHTML = items.map(classItemHTML).join("");

    const empty = $("emptyState");
    empty.classList.toggle("visible", !items.length);
    empty.querySelector("strong").textContent = classes.length
      ? items.length ? "" : "Nenhum resultado encontrado"
      : "Nenhuma turma por aqui";
    empty.querySelector("p").textContent = classes.length
>>>>>>> a064054 (refatoracao)
      ? "Tente mudar a busca ou o filtro de andar."
      : "Cadastre a primeira turma usando o formulário ao lado.";
  }

<<<<<<< HEAD
  function renderTv() {
    const root = $("tvContent");

    if (!classes.length) {
      root.innerHTML = `
        <div class="tv-empty">
          <strong>Nenhuma turma cadastrada</strong>
          Cadastre as turmas no painel administrativo para exibi-las aqui.
        </div>
      `;
=======
  /* ---------- Render: TV ---------- */

  function tvClassHTML(c) {
    const count = Number(c.students || 0);
    return `
      <article class="tv-class">
        <div class="tv-room">Sala ${esc(c.room)}</div>
        <div>
          <h3>${esc(c.className)}</h3>
          <p>Prof. ${esc(c.teacher)}</p>
          <small>${esc(c.startTime || "--:--")}–${esc(c.endTime || "--:--")} · </small>
          <small>${pluralStudents(count)}</small>
        </div>
      </article>`;
  }

  function renderTV() {
    const root = $("tvContent");

    if (!classes.length) {
      root.innerHTML =
        '<div class="tv-empty"><strong>Nenhuma turma cadastrada</strong>Cadastre as turmas no painel administrativo para exibi-las aqui.</div>';
>>>>>>> a064054 (refatoracao)
      $("tvUpdated").textContent = "Aguardando cadastro";
      return;
    }

    const groups = new Map();
<<<<<<< HEAD

    [...classes].sort(compareClasses).forEach((item) => {
      if (!groups.has(item.floor)) {
        groups.set(item.floor, []);
      }

      groups.get(item.floor).push(item);
=======
    [...classes].sort(sortClasses).forEach((c) => {
      if (!groups.has(c.floor)) groups.set(c.floor, []);
      groups.get(c.floor).push(c);
>>>>>>> a064054 (refatoracao)
    });

    root.innerHTML = [...groups]
      .map(
        ([floor, items]) => `
<<<<<<< HEAD
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
=======
        <section class="floor-section">
          <h2 class="floor-title">${esc(floor)}</h2>
          <div class="tv-class-list">${items.map(tvClassHTML).join("")}</div>
        </section>`
>>>>>>> a064054 (refatoracao)
      )
      .join("");

    $("tvUpdated").textContent =
<<<<<<< HEAD
      "Atualizado às " +
      new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
=======
      "Atualizado às " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
>>>>>>> a064054 (refatoracao)
  }

  function render() {
    renderStats();
    renderFloorFilter();
<<<<<<< HEAD
    renderClassList();
    renderTv();
  }

=======
    renderList();
    renderTV();
  }

  /* ---------- Formulário ---------- */

>>>>>>> a064054 (refatoracao)
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
<<<<<<< HEAD
    const item = classes.find((entry) => entry.id === id);

    if (!item) {
      return;
    }

    Object.keys(fields).forEach((key) => {
      fields[key].value = item[key] ?? "";
    });

=======
    const c = classes.find((x) => x.id === id);
    if (!c) return;

    Object.keys(fields).forEach((k) => (fields[k].value = c[k] ?? ""));
>>>>>>> a064054 (refatoracao)
    $("formTitle").textContent = "Editar turma";
    $("saveButton").textContent = "Salvar alterações";
    $("cancelEdit").hidden = false;
    $("formError").hidden = true;

<<<<<<< HEAD
    if (innerWidth < 900) {
      form.scrollIntoView({ behavior: "smooth" });
    }
  }

  function getFormClass() {
    return {
      id:
        fields.id.value ||
        (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
=======
    if (innerWidth < 900) form.scrollIntoView({ behavior: "smooth" });
  }

  function readForm() {
    return {
      id: fields.id.value || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
>>>>>>> a064054 (refatoracao)
      floor: fields.floor.value.trim(),
      room: fields.room.value.trim(),
      students: Number(fields.students.value),
      teacher: fields.teacher.value.trim(),
      className: fields.className.value.trim(),
      startTime: fields.startTime.value,
      endTime: fields.endTime.value,
    };
  }

<<<<<<< HEAD
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
=======
  function isValid(c) {
    return (
      c.floor &&
      c.room &&
      c.teacher &&
      c.className &&
      c.startTime &&
      c.endTime &&
      c.endTime > c.startTime &&
      Number.isInteger(c.students) &&
      c.students >= 0 &&
      c.students <= 999
    );
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const c = readForm();
    const error = $("formError");

    if (!isValid(c)) {
      error.textContent = "Preencha todos os campos e informe de 0 a 999 alunos.";
>>>>>>> a064054 (refatoracao)
      error.hidden = false;
      return;
    }

    const duplicate = classes.find(
<<<<<<< HEAD
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
=======
      (x) => x.id !== c.id && x.floor === c.floor && x.room.toLowerCase() === c.room.toLowerCase()
    );
    if (duplicate && !confirm("Já existe uma turma nesta sala. Deseja cadastrar mesmo assim?")) return;

    const index = classes.findIndex((x) => x.id === c.id);
    if (index < 0) classes.push(c);
    else classes[index] = c;

    persist();
>>>>>>> a064054 (refatoracao)
    resetForm();
  });

  $("cancelEdit").addEventListener("click", resetForm);
<<<<<<< HEAD
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
=======
  $("searchInput").addEventListener("input", renderList);
  $("floorFilter").addEventListener("change", renderList);

  $("classList").addEventListener("click", (e) => {
    const button = e.target.closest("button[data-action]");
    if (!button) return;

    const c = classes.find((x) => x.id === button.dataset.id);
    if (!c) return;

    if (button.dataset.action === "edit") editClass(c.id);

    if (button.dataset.action === "delete" && confirm(`Excluir a turma "${c.className}"?`)) {
      classes = classes.filter((x) => x.id !== c.id);
      if (fields.id.value === c.id) resetForm();
      persist();
    }
  });

  /* ---------- Relógio e rotas ---------- */

  function updateClock() {
    const now = new Date();
    $("clock").textContent = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
>>>>>>> a064054 (refatoracao)
    $("dateLabel").textContent = now.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
  }

  function route() {
<<<<<<< HEAD
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
=======
    const tv = isTVMode();

    $("adminView").hidden = tv;
    $("tvView").hidden = !tv;
    $("adminLink").classList.toggle("active", !tv);
    $("tvLink").classList.toggle("active", tv);
    document.title = tv
      ? "Sala Certa CNA | Quadro de Turmas"
      : "Sala Certa CNA | Gerenciamento de Turmas";

    if (tv) {
      updateClock();
      renderTV();
    }
  }

  /* ---------- Tela cheia ---------- */

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
>>>>>>> a064054 (refatoracao)
    } catch (error) {
      console.warn("Não foi possível alternar tela cheia:", error);
    }
  }

  function updateFullscreenButton() {
<<<<<<< HEAD
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
=======
    if (!fullscreenButton) return;
    const active = Boolean(document.fullscreenElement);

    fullscreenButton.innerHTML = `<span aria-hidden="true">${active ? "⤢" : "⛶"}</span>`;
    fullscreenButton.setAttribute("aria-label", active ? "Sair da tela cheia" : "Entrar em tela cheia");
    fullscreenButton.title = active ? "Sair da tela cheia (Esc)" : "Tela cheia (Esc para sair)";
>>>>>>> a064054 (refatoracao)
  }

  if (fullscreenButton) {
    fullscreenButton.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", updateFullscreenButton);
    updateFullscreenButton();
  }

<<<<<<< HEAD
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
=======
  /* ---------- Sincronização e init ---------- */

  addEventListener("hashchange", route);

  addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    classes = load();
    render();
  });

  // Polling no modo TV: atualiza relógio e sincroniza mudanças do admin
  setInterval(() => {
    if (!isTVMode()) return;

    updateClock();
    const latest = load();
    if (JSON.stringify(latest) !== JSON.stringify(classes)) {
      classes = latest;
      render();
    }
  }, 3000);

  setInterval(updateClock, 15000);

  render();
  route();
  updateClock();
})();
>>>>>>> a064054 (refatoracao)
