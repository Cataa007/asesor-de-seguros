const sidebarMobileQuery = window.matchMedia("(max-width: 700px)");

function syncSidebar() {
  const sidebar = document.getElementById("sidebarFixed");

  if (!sidebar || sidebarMobileQuery.matches) {
    return;
  }

  const spacer = document.getElementById("sidebarSpacer");

  if (!spacer) {
    return;
  }

  const rect = spacer.getBoundingClientRect();
  const fixedTop = rect.top + window.scrollY;
  const fixedLeft = rect.left + window.scrollX;
  const bottomMargin = 18;

  sidebar.style.top = fixedTop + "px";
  sidebar.style.left = fixedLeft + "px";
  sidebar.style.width = rect.width + "px";
  sidebar.style.height = `${window.innerHeight - fixedTop - bottomMargin}px`;
}

function syncSidebarNotesHeight() {
  const list = document.getElementById("sidebarNotesList");

  if (!list) {
    return;
  }

  if (sidebarMobileQuery.matches) {
    list.style.maxHeight = "";
    return;
  }

  const bottom = document.querySelector(".sidebar-bottom");

  if (!bottom) {
    return;
  }

  const gap = 14;
  const available = bottom.getBoundingClientRect().top - list.getBoundingClientRect().top - gap;
  const cap = Math.max(40, Math.min(260, available));

  list.style.maxHeight = cap + "px";
}

function applySidebarLayoutMode() {
  const sidebar = document.getElementById("sidebarFixed");
  const spacer = document.getElementById("sidebarSpacer");

  if (!sidebar || !spacer) {
    return;
  }

  if (sidebarMobileQuery.matches) {
    sidebar.classList.add("sidebar-inline");
    sidebar.style.top = "";
    sidebar.style.left = "";
    sidebar.style.width = "";
    sidebar.style.height = "";

    if (!spacer.contains(sidebar) && sidebar.previousElementSibling !== spacer) {
      spacer.insertAdjacentElement("afterend", sidebar);
    }
  } else {
    sidebar.classList.remove("sidebar-inline");
    syncSidebar();
  }

  syncSidebarNotesHeight();
}

window.addEventListener("resize", () => {
  applySidebarLayoutMode();
  syncSidebar();
  syncSidebarNotesHeight();
});

applySidebarLayoutMode();
syncSidebar();
syncSidebarNotesHeight();

let newsItems = [
  { text: "Nueva campaña: 20% dcto. en seguros de vida hasta fin de mes.", imageUrl: "img/noticia-ejemplo.svg" },
  { text: "Actualización normativa: cambios en pólizas de salud desde julio.", imageUrl: null },
];

function renderNewsList() {
  const sidebarList = document.getElementById("sidebarNotesList");
  const adminList = document.getElementById("adminNewsList");
  const badge = document.getElementById("sidebarNotesBadge");

  if (!sidebarList || !adminList) {
    return;
  }

  if (badge) {
    badge.textContent = newsItems.length;
    badge.classList.toggle("has-count", newsItems.length > 0);
  }

  sidebarList.innerHTML = "";
  adminList.innerHTML = "";

  if (newsItems.length === 0) {
    const empty = document.createElement("div");
    empty.className = "sidebar-notes-empty";
    empty.textContent = "Sin noticias publicadas todavía.";
    sidebarList.appendChild(empty);
    syncSidebarNotesHeight();
    return;
  }

  newsItems.forEach((news, index) => {
    const sidebarItem = document.createElement("div");
    sidebarItem.className = news.imageUrl ? "sidebar-note-item has-image" : "sidebar-note-item";

    if (news.imageUrl) {
      const sidebarImage = document.createElement("img");
      sidebarImage.className = "sidebar-note-image";
      sidebarImage.src = news.imageUrl;
      sidebarImage.alt = "";
      sidebarImage.style.cursor = "zoom-in";
      sidebarImage.onclick = () => openImageLightbox(news.imageUrl);
      sidebarItem.appendChild(sidebarImage);
    }

    const sidebarText = document.createElement("span");
    sidebarText.textContent = news.text;
    sidebarItem.appendChild(sidebarText);
    sidebarList.appendChild(sidebarItem);

    const adminItem = document.createElement("div");
    adminItem.className = "admin-news-item";

    if (news.imageUrl) {
      const adminImage = document.createElement("img");
      adminImage.className = "admin-news-image";
      adminImage.src = news.imageUrl;
      adminImage.alt = "";
      adminItem.appendChild(adminImage);
    }

    const label = document.createElement("span");
    label.textContent = news.text;
    adminItem.appendChild(label);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "×";
    removeButton.setAttribute("aria-label", "Eliminar noticia");
    removeButton.onclick = () => {
      newsItems.splice(index, 1);
      renderNewsList();
    };
    adminItem.appendChild(removeButton);

    adminList.appendChild(adminItem);
  });

  syncSidebarNotesHeight();
}

function updateNewsPhotoLabel(input) {
  const label = document.getElementById("adminNewsPhotoLabel");

  if (label) {
    label.textContent = input.files && input.files[0] ? input.files[0].name : "Subir foto";
  }
}

function addNewsItem(event) {
  event.preventDefault();

  const input = document.getElementById("adminNewsInput");
  const imageInput = document.getElementById("adminNewsImageInput");
  const photoLabel = document.getElementById("adminNewsPhotoLabel");
  const text = input.value.trim();
  const file = imageInput.files && imageInput.files[0];

  if (!text) {
    return;
  }

  const finalize = (imageUrl) => {
    newsItems.push({ text, imageUrl });
    input.value = "";
    imageInput.value = "";

    if (photoLabel) {
      photoLabel.textContent = "Subir foto";
    }

    renderNewsList();
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = () => finalize(reader.result);
    reader.readAsDataURL(file);
  } else {
    finalize(null);
  }
}

function toggleCard(header) {
  const selectedCard = header.closest('.product-card');
  const allCards = document.querySelectorAll('.product-card');

  allCards.forEach((card) => {
    const chevron = card.querySelector('.chevron');

    if (card === selectedCard) {
      const isOpen = card.classList.contains('open');

      if (isOpen) {
        card.classList.remove('open');
        chevron.textContent = '⌄';
      } else {
        card.classList.add('open');
        chevron.textContent = '⌃';
      }
    } else {
      card.classList.remove('open');
      chevron.textContent = '⌄';
    }
  });
}

function showModal(id) {
  document.getElementById(id).style.display = "flex";
}

function hideModal(id) {
  document.getElementById(id).style.display = "none";
}

function openImageLightbox(src) {
  const img = document.getElementById("imageLightboxImg");
  img.src = src;
  showModal("imageLightbox");
}

function closeImageLightbox() {
  hideModal("imageLightbox");
}

function openModal() {
  showModal("modalOverlay");
}

function closeModal() {
  hideModal("modalOverlay");
}

function openModal_pp() {
  showModal("modalOverlay_protper");
}

function closeModal_pp() {
  hideModal("modalOverlay_protper");
}

function openModal_vo() {
  showModal("modalOverlay_vidaonc");
}

function closeModal_ov() {
  hideModal("modalOverlay_vidaonc");
}

function openModal_hi() {
  showModal("modalOverlay_hogarinhab");
}

function closeModal_hi() {
  hideModal("modalOverlay_hogarinhab");
}

function openModal_cp() {
  showModal("modalOverlay_cuentaprotegida");
}

function closeModal_cp() {
  hideModal("modalOverlay_cuentaprotegida");
}

function openModal_ref(productName) {
  const productSelect = document.getElementById("referralProduct");
  const observationInput = document.getElementById("referralObservation");

  if (productSelect) {
    const matchedOption = productName
      ? Array.from(productSelect.options).find(
          (option) => option.value.toLowerCase() === productName.toLowerCase()
        )
      : null;

    productSelect.value = matchedOption ? matchedOption.value : "";
  }

  if (observationInput) {
    observationInput.value = "";
  }

  showModal("modalOverlay_ref");
}

function closeModal_ref() {
  hideModal("modalOverlay_ref");
}

function submitReferral() {
  const productSelect = document.getElementById("referralProduct");

  if (productSelect && !productSelect.reportValidity()) {
    return;
  }

  closeModal_ref();
}

function toggleFiveStarsSimulation(isEnabled) {
  const expressSection = document.querySelector(".express-section");
  const vidaStars = document.getElementById("vidaStars");

  if (expressSection) {
    expressSection.classList.toggle("express-section-hidden", isEnabled);
  }

  if (vidaStars) {
    vidaStars.innerHTML = isEnabled ? "★★★★★" : '★★★<span class="star-empty">☆☆</span>';
  }
}

function updateExpressControls() {
  const expressButtons = document.querySelectorAll("[data-express-id]");

  expressButtons.forEach((button) => {
    const expressId = button.dataset.expressId;
    const toggle = document.querySelector(`[data-express-toggle="${expressId}"]`);
    const order = document.querySelector(`[data-express-order="${expressId}"]`);

    button.classList.toggle("express-button-hidden", toggle && !toggle.checked);
    button.style.order = order ? order.value : "";
  });
}

function formatTravelDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function setDefaultTravelDates() {
  const startInput = document.getElementById("travelStartDate");
  const endInput = document.getElementById("travelEndDate");

  if (!startInput || !endInput) {
    return;
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 7);

  startInput.value = formatTravelDate(startDate);
  endInput.value = formatTravelDate(endDate);
}

function changeTravelerCount(elementId, amount, minimum) {
  const counter = document.getElementById(elementId);

  if (!counter) {
    return;
  }

  const currentValue = Number(counter.textContent);
  const nextValue = Math.max(minimum, currentValue + amount);

  counter.textContent = nextValue;
}

setDefaultTravelDates();
renderNewsList();
