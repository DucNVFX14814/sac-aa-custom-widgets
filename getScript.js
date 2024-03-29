let getScriptPromisify = (src) => {
  return new Promise((resolve) => {
    $.getScript(src, resolve);
  });
};

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
        <style>
        </style>
        <div id="root" style="width: 100%; height: 100%;">
        </div>
      `;

  class GetScript extends HTMLElement {
    constructor() {
      super();

      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this._root = this._shadowRoot.getElementById("root");
      this.addEventListener("click", () => {
        this.dispatchEvent(new Event("onClick"));
      });
    }

    onCustomWidgetResize() {
    }

    getScript(url) {
      return getScriptPromisify(url).value
    }
  }

  customElements.define("com-sap-sample-getscript", GetScript);
})();
