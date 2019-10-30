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

```js
const TableToExcel = require("table-to-excel");
new TableToExcel({
    filename: "table转excel表格",
    dataSource: {
        title: [["主要信息", null, null, "其它信息"], ["姓名", "性别", "年龄", "注册时间"]],
        body: [["张三", "男", 18, new Date()], ["李四", "女", 22, new Date()]]
    }
});
```
