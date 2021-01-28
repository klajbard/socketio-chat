(function () {
  const SOCKETIOIP = "35.157.80.184:8080"
  const socket = io(SOCKETIOIP);
  let timeout;

  window.addEventListener("unload", () => {
    leaveRoom();
  });

  window.addEventListener("resize", handleResizeHeight);
  requestAnimationFrame(handleResizeHeight);

  function handleResizeHeight() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      timeout = null;
    }, 100);
  }

  function getUserName() {
    let userName = localStorage.getItem("user");
    if (!userName) {
      localStorage.setItem("user", "Guest");
    }
    userName = localStorage.getItem("user") || "Guest";

    return userName;
  }

  function leaveRoom(off = false) {
    socket.emit("leave");
    off && socket.off();
  }

  function joinRoom() {
    socket.emit("join", { user: getUserName() });
  }

  const messages = document.getElementById("messages");
  const form = document.getElementById("form");
  const messageInput = document.getElementById("message");
  const nameInput = document.getElementById("username");
  const submitButton = document.getElementById("submit");

  nameInput.value = getUserName();
  joinRoom();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (messageInput.value) {
      socket.emit("message", {
        message: messageInput.value,
        user: getUserName(),
      });
      messageInput.value = "";
    }
  });

  submitButton.addEventListener("button-click", () => {
    const form = messageInput.closest("form");
    const value = messageInput.value;
    if (value && value.length) {
      form.requestSubmit();
    }
  });

  messageInput.addEventListener("update-value", ({ detail: { value } }) => {
    const form = messageInput.closest("form");
    if (value && value.length) {
      messageInput.value = value;
      form.requestSubmit();
    }
  });

  nameInput.addEventListener("update-value", ({ detail: { value } }) => {
    const regex = /^[A-Za-z]\w{3,19}$/;
    if (!regex.test(value)) {
      alert("Use 4-20 alphanumeric characters!");
      nameInput.value = getUserName();
    } else if (value !== getUserName()) {
      nameInput.value = value;
      localStorage.setItem("user", value);
    }
  });

  socket.on("message", function (data) {
    const item = document.createElement("custom-message");
    const { message, user } = data;
    if (user === getUserName()) {
      item.textContent = message;
      item.setAttribute("sent", "");
    } else {
      item.textContent = `${user}: ${message}`;
      item.setAttribute("received", "");
    }
    messages.appendChild(item);
    messages.scrollTo(0, messages.scrollHeight);
  });
})();
