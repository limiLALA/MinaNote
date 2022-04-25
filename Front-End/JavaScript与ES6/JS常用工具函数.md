# 数组元素全组合

```js
function combination(arr, size) {
    // arr表示源数组，size表示选取元素的个数
    // 定义数组保存结果
    const result = [];

    function _combine(selected, arr, size) {
        // selected数组包含已经选中的元素
        // arr数组包含未选中元素数组，size表示还需选取元素的个数
        if (size === 0) { // 如果size===0，则一次组合完成，存入result数组并返回
            result.push(selected);
            return;
        }
        // 遍历所有可能选中的元素，遍历的次数为数组长度减去(size-1)
        for (let i = 0;i < arr.length - (size - 1);i++) {
            // 复制数组，避免对selected数组数据的更改
            const temp = selected.slice();
            temp.push(arr[i]);
            _combine(temp, arr.slice(i + 1), size - 1);
        }
    }

    _combine([], arr, size);
    return result;
},
// 使用
const sectionInfo = [1, 2, 3]
for (let i = 1; i <= sectionInfo.length; i++) {
    const curCombList = this.combination(sectionInfo, i);
    sectionCombs = sectionCombs.concat(curCombList);
}
```

# 对象深拷贝

```js
obj1 = {a: 1, b: 2, c: ['apple', 'banana']}
obj2 = JSON.parse(JSON.stringify(obj1))  // 深拷贝
```

