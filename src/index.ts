type IDataArray = Array<any[]>;

type ICB = (err: any, data?: any) => any;

interface IDataSource {
    title?: IDataArray;
    body: IDataArray;
}

type IDOM = HTMLElement | Element;

interface ITableProp {
    filename?: string;
    dataSource?: IDataSource;
    table?: string | IDOM;
    callback?: ICB;
}

function joinDataToString(data: IDataArray, hname: string, tname: string) {
    let thead = "";
    let trh = "";
    for (const tr of data) {
        let str = "<tr>";
        for (const th of tr) {
            str += `<${tname}>${th ? th : ""}</${tname}>`;
        }
        trh += `${str}</tr>`;
    }
    if (trh.length > 0) {
        thead = `<${hname}>${trh}</${hname}>`;
    }
    return thead;
}

export default class TableToExcel {
    private callback: ICB;

    constructor(obj: ITableProp) {
        const { filename = Date.now() + "", dataSource, table, callback = () => {} } = obj;
        this.callback = callback;
        if ((!dataSource || dataSource.body.length === 0) && !table) {
            this.callback("缺少table或dataSource");
        }
        if (typeof table === "string") {
            this.stringTrans(table, filename);
        } else if (typeof table === "object" && table.nodeType === 1 && typeof table.nodeName === "string") {
            this.elementTrans(table, filename);
        } else if (typeof dataSource === "object" && Array.isArray(dataSource.body) && dataSource.body.length > 0) {
            // param.length;
            this.dataSourceTrans(dataSource, filename);
        } else {
            this.callback("table或dataSource格式不正确");
        }
    }

    private dataSourceTrans(data: IDataSource, name: string) {
        const { title = [], body } = data;
        const thead = joinDataToString(title, "thead", "th");
        const tbody = joinDataToString(body, "tbody", "td");
        const html = `<table> ${thead} ${tbody} <table>`;
        return this.stringTrans(html, name);
    }

    private elementTrans(ele: IDOM, name: string) {
        return this.stringTrans(ele.outerHTML, name);
    }

    private stringTrans(str: string, name: string) {
        const html = `
            <html>
            <head>
                <meta charset="UTF-8">     
                <style>
                tr td { border:  1px solid #e8e8e8; height: 40px; text-align: center;}
                tr th { background: #fafafa;height: 50px;  border: 1px solid #e8e8e8; color: rgba(0, 0, 0, 0.85);padding: 16px 16px; }
                </style>
            </head>
            <body>${str}</body>
            </html>  
        `;
        // return html;
        this.core(html, name);
    }

    private core(template: string, name: string) {
        console.log(name);
        try {
            const excelBlob = new Blob([template], { type: "application/vnd.ms-excel" });
            const filename = `${name}.xls`;
            if ("msSaveOrOpenBlob" in window.navigator) {
                window.navigator.msSaveOrOpenBlob(excelBlob, filename);
            } else {
                const oA = document.createElement("a");
                oA.href = URL.createObjectURL(excelBlob);
                oA.download = filename;
                oA.click();
            }
            this.callback(null, "下载成功");
        } catch (e) {
            this.callback(e);
        }
    }
}
