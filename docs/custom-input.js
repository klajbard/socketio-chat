class CustomInput extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = `
<style>
  :host {
    padding: 0.5rem;
  }
  :host([wide]) {
    flex: 1
  }
  input{
    box-sizing: border-box;
    text-align: center;
    height: 100%;
    width: 100%;
    padding: 1rem;
    background: none;
    font-size: 1.25rem;
    text-overflow: ellipsis;
    border: 1px solid var(--theme-input-border-color, #222);
    outline: none;
  }
  input[type="submit"] {
    cursor: pointer;
    font-weight: bold;
  }
  input[type="submit"]:active {
    box-shadow: inset 3px 3px 0 var(--theme-input-border-color, #222);
  }
  input.left {
    text-align: left;
  }
  input:hover {
    box-shadow: inset 1px 1px 0 var(--theme-input-border-color, #222);
  }
  input:focus {
    box-shadow: inset 0 0 0 1px var(--theme-input-border-color, #222);
  }
</style> 

<input autocomplete="off" type="text"/>`;
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.input = this.shadowRoot.querySelector("input");
  }

  static get observedAttributes() {
    return ["textalign", "name", "placeholder", "type", "value"];
  }

  connectedCallback() {
    const changeOnBlur = this.getAttribute("changeonblur") !== null;
    if (this.input.isConnected) {
      if (changeOnBlur) {
        this.input.addEventListener("blur", (event) => {
          this._dispatchEvent(event.currentTarget.value, true);
        });
      }

      this.input.addEventListener("change", (event) => {
        this.value = event.currentTarget.value;
      });

      this.input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          this._dispatchEvent(event.currentTarget.value);
        }
      });
    }
  }

  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "name":
      case "placeholder":
      case "type":
        this.input[name] = newValue;
        break;
      case "textalign":
        this.input.classList.add(newValue)
      default:
        break;
    }
  }

  _dispatchEvent(value) {
    const customEv = new CustomEvent("update-value", {
      bubbles: true,
      composed: true,
      detail: { value },
    });

    this.dispatchEvent(customEv);
  }

  get value() {
    return this.getAttribute("value");
  }

  set value(newValue) {
    this.setAttribute("value", newValue);
    this.input.value = newValue;
    this.input.title = newValue;
  }
}

window.customElements.define("custom-input", CustomInput);
