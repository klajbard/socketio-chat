class CustomButton extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = `
<style>
  :host {
    padding: 0.5rem;
  }
  button{
    box-sizing: border-box;
    text-align: center;
    height: 100%;
    width: 6rem;
    background: none;
    font-size: 1.25rem;
    text-overflow: ellipsis;
    border: 1px solid var(--theme-button-border-color, #222);
    outline: none;
    cursor: pointer;
    font-weight: bold;
  }
  button:hover {
    box-shadow: inset 1px 1px 0 var(--theme-button-border-color, #222);
  }
  button:focus {
    box-shadow: inset 0 0 0 1px var(--theme-button-border-color, #222);
  }
  button:active {
    box-shadow: inset 3px 3px 0 var(--theme-button-border-color, #222);
  }
</style> 

<button autocomplete="off" type="text"><slot></button>`;

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.button = this.shadowRoot.querySelector("button");
  }

  connectedCallback() {
    if (this.button.isConnected) {
      this.button.addEventListener("click", () => {
        const customClick = new CustomEvent("button-click", {
          bubbles: true,
          composed: true,
        });

        this.dispatchEvent(customClick);
      });
    }
  }
}

window.customElements.define("custom-button", CustomButton);
