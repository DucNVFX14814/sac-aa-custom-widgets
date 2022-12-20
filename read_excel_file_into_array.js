const getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function() {
    const template = document.createElement('template')
    template.innerHTML = `
        <div id="root" style="width: 100%; height: 100%;">
            <input type="file" id="input_excel" class="input_excel" accept=".xls,.xlsx"/>
        </div>
      `
    class ReadExcelFileIntoArray extends HTMLElement {
        constructor() {
            super()

            this._shadowRoot = this.attachShadow({ mode: 'open' })
            this._shadowRoot.appendChild(template.content.cloneNode(true))

            this.addEventListener("input", () => {
                this.dispatchEvent(new Event("onSelect"));
            });


            this._root = this._shadowRoot.getElementById('root')

            this._props = {}

            this._data = []
        }

        onCustomWidgetResize(width, height) {}

        async reader() {
            await getScriptPromisify('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js')

            const element = this._shadowRoot.getElementById("input_excel")

            const data = []

            // (A) NEW FILE READER
            const reader = new FileReader()

            // (C) START - READ SELECTED EXCEL FILE
            reader.readAsArrayBuffer(element.files[0])

            // (B) ON FINISH LOADING
            reader.addEventListener("loadend", (evt) => {
                // (B1) GET THE FIRST WORKSHEET
                const workbook = XLSX.read(evt.target.result, { type: "binary" }),
                    worksheet = workbook.Sheets[workbook.SheetNames[0]],
                    range = XLSX.utils.decode_range(worksheet["!ref"])

                // (B2) READ CELLS IN ARRAY
                for (let row = range.s.r; row <= range.e.r; row++) {
                    let i = data.length
                    data.push([])
                    for (let col = range.s.c; col <= range.e.c; col++) {
                        let cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })]
                        if (cell === undefined) {
                            cell = ""
                        }
                        data[i].push(cell.v)
                    }
                }
                // console.log(data)
            })

            await new Promise(resolve => setTimeout(resolve, 1000))

            return data
        }
    }
    customElements.define('com-sap-sample-read-excel-file-into-array', ReadExcelFileIntoArray)
})()