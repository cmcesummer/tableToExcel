# table-to-excel

## API

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

## 示例

### dataSource

```js
const TableToExcel = require("@soyzr/table-to-excel");

new TableToExcel({
    filename: "table转excel表格",
    dataSource: {
        title: [["主要信息", null, null, "其它信息"], ["姓名", "性别", "年龄", "注册时间"]],
        body: [["张三", "男", 18, new Date()], ["李四", "女", 22, new Date()]]
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
            filename: "table转excel表格",
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
            <th>姓名</th>
            <th>性别</th>
            <th>年龄</th>
            <th>注册时间</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>张三</td>
            <td>男</td>
            <td>18</td>
            <td>20191030</td>
        </tr>
    </tbody>
</table>
`;

new TableToExcel({
    filename: "table转excel表格",
    table
});
```

## 其他一些记录

scoped 包发布时默认是私有包，但是发布失败， 需要改为公共发布`npm publish --access public`
