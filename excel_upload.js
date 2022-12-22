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
    class ExcelUpload extends HTMLElement {
        constructor() {
            super()

            this._shadowRoot = this.attachShadow({ mode: 'open' })
            this._shadowRoot.appendChild(template.content.cloneNode(true))

            this.addEventListener("input", () => {
                this.dispatchEvent(new Event("onSelect"));
            });


            this._root = this._shadowRoot.getElementById('root')

            this._props = {}

        }

        onCustomWidgetResize(width, height) {}

        getFile() {
            return this._shadowRoot.getElementById('input_excel').files[0]
        }

        getFilename() {
            return this.getFile().name
        }

        async readCellsData() {
            await getScriptPromisify('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js')

            const file = this.getFile()

            const data = []

            // (A) NEW FILE READER
            const reader = new FileReader()

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

            // (C) START - READ SELECTED EXCEL FILE
            if (typeof file !== "undefined") {
                reader.readAsArrayBuffer(file)
            }

            await new Promise(resolve => setTimeout(resolve, 1000))

            return data
        }

        async readToJSON() {
            await getScriptPromisify('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js')

            const file = this.getFile()

            const data = []

            // (A) NEW FILE READER
            const reader = new FileReader()

            // (B) ON FINISH LOADING
            reader.addEventListener("loadend", (evt) => {
                // (B1) GET THE FIRST WORKSHEET
                const workbook = XLSX.read(evt.target.result, { type: "binary" }),
                    worksheet = workbook.Sheets[workbook.SheetNames[0]],
                    range = XLSX.utils.decode_range(worksheet["!ref"]);

                // (B2) READ HEADER ROW
                let header = [],
                    keys = {};
                for (let col = range.s.c; col <= range.e.c; col++) {
                    let cell = worksheet[XLSX.utils.encode_cell({ r: range.s.r, c: col })];
                    if (cell === undefined) {
                        cell = "";
                    }
                    header.push(cell.v);
                }

                // (B3) READ DATA ROWS
                for (let row = range.s.r + 1; row <= range.e.r; row++) {
                    for (let col = range.s.c; col <= range.e.c; col++) {
                        let cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
                        if (cell === undefined) {
                            cell = "";
                        }
                        keys[header[col]] = cell.v;
                    }
                    data.push(JSON.parse(JSON.stringify(keys)));
                }
                // console.log(data);
            })

            // (C) START - READ SELECTED EXCEL FILE
            if (typeof file !== "undefined") {
                reader.readAsArrayBuffer(file)
            }

            await new Promise(resolve => setTimeout(resolve, 1000))

            return JSON.stringify(data)
        }
    }
    customElements.define('com-sap-excel-upload', ExcelUpload)
})()
