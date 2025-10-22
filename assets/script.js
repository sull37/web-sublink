// 👑 Link Sub Generator — Ultimate Pro Glow v4.1R+PWA
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const overlay = document.getElementById("overlay");
  const content = document.getElementById("content");
  const themeSwitch = document.getElementById("themeSwitch");
  const themeColor = document.getElementById("themeColor");
  const clockEl = document.getElementById("clock");
  const splash = document.getElementById("splash");
  const spinner = document.getElementById("spinner");
  const toastWrap = document.getElementById("toast-wrap");

  // ⏳ Splash screen
  setTimeout(() => splash.remove(), 3300);

  // 🍔 Sidebar toggle
  const toggleSidebar = () => {
    const isOpen = sidebar.classList.toggle("open");
    overlay.classList.toggle("hidden", !isOpen);
  };
  hamburger.addEventListener("click", toggleSidebar);
  overlay.addEventListener("click", toggleSidebar);

  // 🕒 Clock (WITA)
  const updateClock = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const wita = new Date(utc + 8 * 3600000);
    clockEl.textContent = wita.toLocaleTimeString("id-ID", {
      hour12: false,
    });
  };
  setInterval(updateClock, 1000);
  updateClock();

  // 🌗 Dark Mode
  themeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark", themeSwitch.checked);
  });

  // 🎨 Theme color
  themeColor.addEventListener("change", (e) => {
    const color = e.target.value;
    document.documentElement.style.setProperty("--main-color", getColor(color));
    showToast(`🎨 Tema ${color} aktif!`);
  });

  function getColor(c) {
    const map = {
      red: "#ff4b4b",
      blue: "#007bff",
      purple: "#9b59b6",
      cyan: "#00bfff",
    };
    return map[c] || "#007bff";
  }

  // 🧭 SPA Router
  const menuButtons = document.querySelectorAll(".menu-item[data-view]");
  menuButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const view = btn.getAttribute("data-view");
      toggleSidebar();
      loadPage(view);
    });
  });

  async function loadPage(page) {
    spinner.classList.remove("hidden");
    try {
      const res = await fetch(`pages/${page}.html`);
      const html = await res.text();
      content.innerHTML = html;
      initPage(page);
    } catch {
      content.innerHTML = "<p>❌ Gagal memuat halaman.</p>";
    } finally {
      spinner.classList.add("hidden");
    }
  }

  // 🚀 Default: load Home
  loadPage("home");

  // 💬 Toast
  function showToast(text, duration = 3000) {
    const el = document.createElement("div");
    el.className = "toast show";
    el.textContent = text;
    toastWrap.appendChild(el);
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  // 🧠 Page Initializers
  function initPage(page) {
    if (page === "generator") initGenerator();
    if (page === "tools") initTools();
  }

  // ⚙️ Generator Page
  function initGenerator() {
    const generateBtn = document.getElementById("generateBtn");
    const resultCard = document.getElementById("resultCard");
    const resultText = document.getElementById("resultText");
    const copyBtn = document.getElementById("copyBtn");
    const openBtn = document.getElementById("openBtn");
    const previewBtn = document.getElementById("previewBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const qrBox = document.getElementById("qrBox");
    const yamlBtn = document.getElementById("yamlBtn");
    const yamlResult = document.getElementById("yamlResult");

    let currentLink = "";
    let qrCode = null;

    generateBtn.addEventListener("click", () => {
      const domain = document.getElementById("domain").value;
      const vpn = document.getElementById("vpn").value;
      const cc = document.getElementById("cc").value.trim();
      const bug = document.getElementById("bug").value;
      const limit = document.getElementById("limit").value.trim() || 10;
      const tls = document.getElementById("tls").value;

      if (!cc) return alert("Harap isi kode negara (contoh: ID,SG)");

      const port = tls === "true" ? 443 : 80;

      currentLink = `https://${domain}/api/v1/sub?vpn=${vpn}&port=${port}&cc=${cc}&domain=${bug}&format=raw&limit=${limit}`;
      resultText.textContent = currentLink;
      resultCard.classList.remove("hidden");
      qrBox.classList.add("hidden");
      yamlResult.classList.add("hidden");
    });

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(resultText.textContent);
      showToast("✅ Link disalin!");
    });

    openBtn.addEventListener("click", () => {
      if (currentLink) window.open(currentLink, "_blank");
    });

    previewBtn.addEventListener("click", () => {
      if (!currentLink) return;
      qrBox.innerHTML = "";
      qrBox.classList.remove("hidden");
      qrCode = new QRCode(qrBox, {
        text: currentLink,
        width: 300,
        height: 300,
        colorDark: "#00bfff",
        colorLight: "#000",
      });
    });

    downloadBtn.addEventListener("click", () => {
      if (!qrBox.querySelector("canvas")) return;
      const canvas = qrBox.querySelector("canvas");
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = canvas.toDataURL();
      link.click();
    });

    yamlBtn.addEventListener("click", () => {
      if (!currentLink) return;
      const yaml = `
- name: 1 🇮🇩 Generated Node
  server: ${document.getElementById("bug").value}
  type: ${document.getElementById("vpn").value}
  port: ${document.getElementById("tls").value === "true" ? 443 : 80}
  uuid: d02c1fd7-7bc5-4c58-b4c1-55f78a87cd7e
  tls: ${document.getElementById("tls").value}
  skip-cert-verify: true
  servername: ${document.getElementById("domain").value}
  network: ws
  ws-opts:
    path: /${document.getElementById("cc").value}-path
    headers:
      Host: ${document.getElementById("domain").value}
  udp: true
`;
      yamlResult.textContent = yaml;
      yamlResult.classList.remove("hidden");
    });
  }

  // 🧰 Tools Page
  function initTools() {
    const uuidBtn = document.getElementById("uuidBtn");
    const uuidOut = document.getElementById("uuidOut");

    if (uuidBtn) {
      uuidBtn.addEventListener("click", () => {
        uuidOut.value = crypto.randomUUID();
        showToast("🧩 UUID berhasil dibuat!");
      });
    }
  }
});
