# window.location的使用

```js
getQuery(para) {
    const reg = new RegExp("(^|&)" + para + "=([^&]*)(&|$)");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

console.log("location.href:"+location.href)
console.log("pipelineId:" + getQuery('pipelineId'))
console.log("projectId:" + getQuery('projectId'))
```

