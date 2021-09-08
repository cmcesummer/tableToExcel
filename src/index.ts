import saveFile from './saveFile';

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
            str += `<${tname}>${th}</${tname}>`;
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

    private htmlString: string;

    private filename: string;

    constructor(obj: ITableProp) {
        const { filename = new Date().valueOf() + "", dataSource, table, callback = () => {} } = obj;
        this.callback = callback;
        this.filename = filename;
        if ((!dataSource || dataSource.body.length === 0) && !table) {
            this.callback("缺少table或dataSource");
        }
        if (typeof table === "string") {
            this.stringTrans(table);
        } else if (typeof table === "object" && table.nodeType === 1 && typeof table.nodeName === "string") {
            this.elementTrans(table);
        } else if (typeof dataSource === "object" && Array.isArray(dataSource.body) && dataSource.body.length > 0) {
            // param.length;
            this.dataSourceTrans(dataSource);
        } else {
            this.callback("table或dataSource格式不正确");
        }
    }

    public down(filename?: string) {
        if (this.htmlString) {
            this.core(this.htmlString, filename || this.filename);
        }
    }

    private dataSourceTrans(data: IDataSource) {
        const { title = [], body } = data;
        const thead = joinDataToString(title, "thead", "th");
        const tbody = joinDataToString(body, "tbody", "td");
        const html = `<table> ${thead} ${tbody} <table>`;
        return this.stringTrans(html);
    }

    private elementTrans(ele: IDOM) {
        return this.stringTrans(ele.outerHTML);
    }

    private stringTrans(str: string) {
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

        this.htmlString = html;
    }

    private core(template: string, name: string) {
        try {
            const excelBlob = new Blob([template], { type: "application/vnd.ms-excel" });
            saveFile(excelBlob, name, '.xls', (e:any, m: string) => {
              this.callback(e, m);
            })
        } catch (e) {
            this.callback(e);
        }
    }
}
