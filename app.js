(() => {
  "use strict";

  const landingView = document.querySelector("#landing-view");
  const productView = document.querySelector("#product-view");
  const pages = [...document.querySelectorAll(".page")];
  const navButtons = [...document.querySelectorAll("[data-page-target]")];
  const toast = document.querySelector("#toast");
  const startForm = document.querySelector("#start-form");
  const username = document.querySelector("#username");
  const consent = document.querySelector("#consent");
  let toastTimer;
  let searchTimer;

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
  }

  function setPage(pageName) {
    pages.forEach((page) => page.classList.toggle("active", page.id === `${pageName}-page`));
    const activeNav = pageName === "room" ? "groups" : pageName;
    navButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.pageTarget === activeNav);
    });
    if (pageName !== "messages") {
      document.querySelector("#messages-page").classList.remove("thread-open");
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function openProduct() {
    landingView.hidden = true;
    productView.hidden = false;
    setPage("chat");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function openLanding() {
    productView.hidden = true;
    landingView.hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function updateDisplayName(name) {
    const safeName = name.trim().slice(0, 24) || "moonlight";
    document.querySelectorAll(".display-name").forEach((element) => {
      element.textContent = safeName;
    });
    document.querySelector("#settings-name").value = safeName;
  }

  function setTheme(theme) {
    const root = document.documentElement;
    if (theme === "system") {
      root.dataset.theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      root.dataset.theme = theme;
    }
    document.querySelectorAll(".theme-card").forEach((card) => {
      card.classList.toggle("selected", card.dataset.theme === theme);
    });
  }

  function modalElement(selector) {
    return document.querySelector(selector);
  }

  function showModal(selector) {
    const modal = modalElement(selector);
    modal.hidden = false;
    const firstFocusable = modal.querySelector("button, input");
    firstFocusable?.focus();
  }

  function hideModal(modal) {
    modal.hidden = true;
    clearTimeout(searchTimer);
  }

  function getTime() {
    const date = new Date();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  function appendMessage(containerId, message) {
    const container = document.querySelector(`#${containerId}`);
    if (!container || !message.trim()) return;
    const bubble = document.createElement("div");
    bubble.className = "bubble outgoing";
    bubble.append(document.createTextNode(message.trim()));
    const time = document.createElement("small");
    time.textContent = `${getTime()} `;
    const delivered = document.createElement("span");
    delivered.textContent = "✓✓";
    time.append(delivered);
    bubble.append(time);
    const typing = container.querySelector(".typing");
    if (typing) container.insertBefore(bubble, typing);
    else container.append(bubble);
    container.scrollTop = container.scrollHeight;
  }

  function setRoom(groupCard) {
    const name = groupCard.dataset.group;
    const members = groupCard.dataset.members;
    const online = groupCard.dataset.online;
    document.querySelector("#room-name").textContent = name;
    document.querySelector("#room-members").textContent = members;
    document.querySelector("#room-online").textContent = online;
    document.querySelector("#members-online").textContent = online;
    const use = document.querySelector("#room-icon use");
    use.setAttribute("href", `#icon-${groupCard.dataset.icon}`);
  }

  function setActiveChoice(selector, selected) {
    document.querySelectorAll(selector).forEach((item) => item.classList.toggle("selected", item === selected));
  }

  startForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const hasUsername = username.value.trim().length >= 2;
    const hasConsent = consent.checked;
    document.querySelector("#username-error").textContent = hasUsername ? "" : "Choose a username with at least 2 characters.";
    document.querySelector("#consent-error").textContent = hasConsent ? "" : "Please confirm that you are 18 or older to continue.";
    if (!hasUsername) {
      username.focus();
      return;
    }
    if (!hasConsent) {
      consent.focus();
      return;
    }
    updateDisplayName(username.value);
    openProduct();
    showToast(`Welcome, ${username.value.trim()}! You are connected anonymously.`);
  });

  username.addEventListener("input", () => {
    if (username.value.trim().length >= 2) document.querySelector("#username-error").textContent = "";
  });
  consent.addEventListener("change", () => {
    if (consent.checked) document.querySelector("#consent-error").textContent = "";
  });

  document.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-page-target]");
    if (pageButton) {
      setPage(pageButton.dataset.pageTarget);
      return;
    }

    const home = event.target.closest("[data-action='home']");
    if (home) {
      openLanding();
      return;
    }

    const toastButton = event.target.closest("[data-toast]");
    if (toastButton) {
      showToast(toastButton.dataset.toast);
      return;
    }

    const report = event.target.closest(".report-trigger");
    if (report) {
      showModal("#report-modal");
      return;
    }

    const stop = event.target.closest(".stop-button");
    if (stop) {
      showModal("#search-modal");
      return;
    }

    const next = event.target.closest(".next-button");
    if (next) {
      showModal("#search-modal");
      searchTimer = window.setTimeout(() => {
        const modal = modalElement("#search-modal");
        modal.hidden = true;
        showToast("You’re connected with someone new.");
      }, 1100);
      return;
    }

    const join = event.target.closest(".join-group");
    if (join) {
      const groupCard = join.closest(".group-card");
      setRoom(groupCard);
      setPage("room");
      return;
    }

    if (event.target.closest(".back-groups")) {
      setPage("groups");
      return;
    }

    const person = event.target.closest(".person-row");
    if (person) {
      setActiveChoice(".person-row", person);
      document.querySelector("#person-name").textContent = person.querySelector("b").textContent;
      document.querySelector("#person-detail").textContent = person.dataset.detail;
      document.querySelector(".person-avatar").textContent = person.dataset.person.slice(0, 1);
      document.querySelector("#messages-page").classList.add("thread-open");
      return;
    }

    if (event.target.closest(".back-to-list")) {
      document.querySelector("#messages-page").classList.remove("thread-open");
      return;
    }

    const switchButton = event.target.closest(".switch");
    if (switchButton) {
      const isOn = switchButton.classList.toggle("is-on");
      switchButton.setAttribute("aria-checked", String(isOn));
      return;
    }

    const theme = event.target.closest(".theme-card");
    if (theme) {
      setTheme(theme.dataset.theme);
      return;
    }

    if (event.target.closest(".moon-toggle")) {
      const currentTheme = document.documentElement.dataset.theme;
      setTheme(currentTheme === "dark" ? "light" : "dark");
      return;
    }

    const segment = event.target.closest(".segmented button, .group-tabs button, .interest-chips button");
    if (segment) {
      setActiveChoice(`.${segment.parentElement.className.split(" ")[0]} button`, segment);
      return;
    }

    const reportChoice = event.target.closest(".report-choice");
    if (reportChoice) {
      setActiveChoice(".report-choice", reportChoice);
      const radio = reportChoice.querySelector("input");
      radio.checked = true;
      return;
    }

    if (event.target.closest(".save-name")) {
      const name = document.querySelector("#settings-name").value;
      if (name.trim().length < 2) {
        showToast("Your display name needs at least 2 characters.");
        return;
      }
      updateDisplayName(name);
      showToast("Your display name was saved.");
      return;
    }

    const closeButton = event.target.closest(".modal-close, .modal-cancel");
    if (closeButton) {
      hideModal(closeButton.closest(".modal"));
    }
  });

  document.querySelectorAll(".composer").forEach((composer) => {
    const input = composer.querySelector("input");
    const send = composer.querySelector(".send-button");
    const sendMessage = () => {
      if (!input.value.trim()) return;
      appendMessage(composer.dataset.composer, input.value);
      input.value = "";
      input.focus();
    };
    send.addEventListener("click", sendMessage);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    });
  });

  document.querySelector("#report-modal form").addEventListener("submit", (event) => {
    event.preventDefault();
    hideModal(event.currentTarget.closest(".modal"));
    showToast("Thanks — the user has been reported and blocked.");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const visibleModal = document.querySelector(".modal:not([hidden])");
      if (visibleModal) hideModal(visibleModal);
    }
  });

  setTheme("light");
})();
