# table-to-excel

## API

typescript interface

```ts
type IDataArray = Array<any[]>;

type ICB = (err: any, data?: any) => any;

interface IDataSource {
    title?: IDataArray;
    body: IDataArray;
}

interface ITableProp {
    filename?: string;
    dataSource?: IDataSource;
    table?: string | HTMLElement;
    callback?: ICB;
}
```

## example

### dataSource

```js
const TableToExcel = require("@soyzr/table-to-excel");

new TableToExcel({
    filename: "table_to_excel_list",
    dataSource: {
        title: [["Message", null, null, "Other"], ["Name", "Sex", "Age", "Time"]],
        body: [["ZA", "male", 18, new Date()], ["LS", "male", 22, new Date()]]
    }
});
```

### table

1. HTMLElement

```js
const TableToExcel = require("@soyzr/table-to-excel");

const table = document.querySelector("table");

const btn = document.querySelector("button");

btn.addEventListener(
    "click",
    function() {
        new TableToExcel({
            filename: "table_to_excel_list",
            table
        });
    },
    false
);
```

2. string

```js
const TableToExcel = require("@soyzr/table-to-excel");

const table = `
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Sex</th>
            <th>Age</th>
            <th>Time</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>ZS</td>
            <td>male</td>
            <td>18</td>
            <td>2019103 0</td>
        </tr> 
    </tbody>
</table>
`;

new TableToExcel({
    filename: "table_to_excel_list",
    table
});
```
