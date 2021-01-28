class CustomMessage extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = `
<style>
  :host {
    display: block;
  }

  .message {
    font-size: 1.5rem;
  }

  .content {
    padding: 1rem 2rem;
  }
  
  :host([sent]) .message .content{
    background-color: var(--theme-sent-message-background, #eee);
    border-radius: 1.5rem 0 1.5rem 1.5rem;
  }
  
  :host([received]) .message .content{
    background-color: var(--theme-received-message-background, #ddd);
    border-radius: 0 1.5rem 1.5rem 1.5rem;
  }

  :host([sent]) .message {
    text-align: right;
    margin-top: 0.25rem;
    margin-left: 1rem;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
  }

  :host([received]) .message {
    text-align: left;
    margin-right: 1rem;
    margin-top: 0.25rem;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }
</style> 

<li class="message"><span class="content"><slot></span></li>`;

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.listItem = this.shadowRoot.querySelector('li')
  }
}

window.customElements.define("custom-message", CustomMessage);
