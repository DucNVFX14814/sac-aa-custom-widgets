(function() {
    const template = document.createElement('template')
    template.innerHTML = `
        <style>
            #input_excel {
                width: auto;
                max-width: 100%;
                color: #444;
                padding: 2px;
                background: #fff;
                border-radius: 4px;
            }
            
            #input_excel::file-selector-button {
                margin-right: 4px;
                border: none;
                background: #084cdf;
                padding: 6px 8px;
                border-radius: 4px;
                color: #ffffff;
                cursor: pointer;
                transition: background .5s ease-in-out;
            }
            
            #input_excel::file-selector-button:hover {
                background: #c9cbd5;
                color: #000000;
            }
        </style>

        <div id="root" style="width: 100%; height: 100%;">
            <input type="file" id="input_excel" accept=".xls,.xlsx"/>
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
                    const dataRow = []
                    for (let col = range.s.c; col <= range.e.c; col++) {
                        let cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })]
                        if (cell === undefined) {
                            dataRow.push(undefined)
                        } else {
                            if (cell.t == "n" && cell.v.toString() !== cell.w.trim()) {
                                const date = new Date(cell.w.trim())
                                let month = (date.getMonth() + 1).toString()
                                if (month.length === 1) {
                                    month = "0" + month
                                }
                                dataRow.push(date.getFullYear().toString() + month)
                            } else {
                                dataRow.push(cell.w.trim())
                            }
                        }
                    }

                    if (dataRow.length > 0) {
                        let isDataRow = false
                        for (let dataCell of dataRow) {
                            if (typeof dataCell !== "undefined") {
                                isDataRow = true
                                break
                            }
                        }
                        if (isDataRow) {
                            data.push(dataRow)
                        }
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
            let data = []

            // (A) NEW FILE READER
            const reader = new FileReader()

            // (B) ON FINISH LOADING
            reader.addEventListener("loadend", (e) => {
                data = cofigureData(e)
            })

            // (C) START - READ SELECTED EXCEL FILE
            if (typeof file !== "undefined") {
                reader.readAsArrayBuffer(file)
            }

            await new Promise(resolve => setTimeout(resolve, 1000))

            return data
        }
    }
    customElements.define('com-sap-excel-upload', ExcelUpload)
})()

const getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}
const cofigureData = (e) => {
    const data = []
        // (B1) GET THE FIRST WORKSHEET
    const workbook = XLSX.read(e.target.result, { type: "binary" }),
        worksheet = workbook.Sheets[workbook.SheetNames[0]],
        range = XLSX.utils.decode_range(worksheet["!ref"]);

    // (B2) READ HEADER ROW
    const header = []
    for (let col = range.s.c; col <= range.e.c; col++) {
        let cell = worksheet[XLSX.utils.encode_cell({ r: range.s.r, c: col })];
        if (cell !== undefined) {
            header[col] = cell.w.trim()
        }
    }

    // (B3) READ DATA ROWS
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
        const dataRow = {};
        for (let col = range.s.c; col <= range.e.c; col++) {
            let cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
            if (cell !== undefined) {
                if (cell.t == "n" && cell.v.toString() !== cell.w.trim()) {
                    const date = new Date(cell.w.trim())
                    let month = (date.getMonth() + 1).toString()
                    if (month.length === 1) {
                        month = "0" + month
                    }
                    dataRow[header[col]] = date.getFullYear().toString() + month
                } else {
                    dataRow[header[col]] = cell.w.trim()
                }
            }
        }

        let isDataRow = false
        for (let key in dataRow) {
            if (dataRow[key] !== undefined) {
                isDataRow = true
                break
            }
        }
        if (isDataRow) {
            data.push(dataRow)
        }
    }
    // console.log(data)
    return data
}