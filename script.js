// 🌗 Theme Toggle
const themeToggleBtn = document.getElementById("themeToggleBtn");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggleBtn.innerHTML = '<i class="fa fa-sun"></i> theme';
}

themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeToggleBtn.innerHTML = '<i class="fa fa-sun"></i> theme';
  } else {
    localStorage.setItem("theme", "light");
    themeToggleBtn.innerHTML = '<i class="fa fa-moon"></i> theme';
  }
});

// 📝 Notes App Logic

// DOM Elements
const addNoteBtn = document.getElementById("addNoteBtn");
const addNoteModal = document.getElementById("addNoteModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const noteForm = document.getElementById("noteForm");
const notesContainer = document.getElementById("notesContainer");
const emptyState = document.getElementById("emptyState");

// Load notes safely from localStorage
let notes;
let editIndex = null;

try {
  notes = JSON.parse(localStorage.getItem("notes")) || [];
} catch (e) {
  notes = [];
}

// Save notes function
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
  
}

// 🚪 Open Modal
addNoteBtn.addEventListener("click", () => {
  noteForm.reset();
  addNoteModal.classList.add("active");
});

// 🚪 Close Modal
closeModalBtn.addEventListener("click", () => {
  addNoteModal.classList.remove("active");
});

// Submit Note
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;
  const tag = document.querySelector("input[name='noteTag']:checked").value;

  // notes.push({ title, content, tag });
  // saveNotes();
  // renderNotes();
  if (editIndex !== null) {
  notes[editIndex] = { title, content, tag }; // 🛠️ Put back in same spot
  editIndex = null; // Reset after editing
} else {
  notes.push({ title, content, tag }); // New note → push
}

saveNotes();
renderNotes();


  noteForm.reset();
  addNoteModal.classList.remove("active");
});

//  Render Notes
function renderNotes() {
  notesContainer.innerHTML = "";

  if (notes.length === 0) {
    emptyState.style.display = "block";
    return;
  } else {
    emptyState.style.display = "none";
  }

  notes.forEach((note, index) => {
    const noteCard = document.createElement("div");
    noteCard.classList.add("note-card");

    noteCard.innerHTML = `
      <div class="note-content">
        <div class="note-header">
          <h3 class="note-title">${note.title}</h3>
          <div class="note-actions">
            <button class="view-btn" data-index="${index}"><i class="fa fa-eye"></i> View</button>
            <button class="edit-btn" data-index="${index}"><i class="fa fa-edit"></i> Edit</button>
            <button class="delete-btn" data-index="${index}"><i class="fa fa-trash"></i></button>
          </div>
        </div>
        <p class="note-text">${note.content}</p>
        <span class="note-tag tag-${note.tag}">${note.tag}</span>
      </div>
    `;

    notesContainer.appendChild(noteCard);
  });

  attachNoteEvents();
}

//  Attach Actions
function attachNoteEvents() {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      notes.splice(btn.dataset.index, 1);
      saveNotes();
      renderNotes();
    });
  });

  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const note = notes[btn.dataset.index];
      document.getElementById("viewTitle").textContent = note.title;
      document.getElementById("viewText").textContent = note.content;
      document.getElementById("viewTag").textContent = note.tag;
      document.getElementById("viewModal").style.display = "flex";
    });
  });

  document.getElementById("closeViewModal").addEventListener("click", () => {
    document.getElementById("viewModal").style.display = "none";
  });

  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {


      const index = btn.dataset.index;
         editIndex = index; 
      const note = notes[index];

      document.getElementById("noteTitle").value = note.title;
      document.getElementById("noteContent").value = note.content;
      document.querySelector(`input[name="noteTag"][value="${note.tag}"]`).checked = true;

      addNoteModal.classList.add("active");
editIndex = index; //new

      // notes.splice(index, 1);
      // saveNotes();
    });
  });
}

//  Search Notes
document.getElementById("searchInput").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  const noteCards = document.querySelectorAll(".note-card");

  noteCards.forEach(card => {
    const title = card.querySelector(".note-title").textContent.toLowerCase();
    const content = card.querySelector(".note-text").textContent.toLowerCase();

    card.style.display = (title.includes(searchTerm) || content.includes(searchTerm)) ? "block" : "none";
  });
});

//  Initial Render
renderNotes();
