# router
## 事件触发跳转页面
通过在事件method中调用this.$router.push即可实现页面跳转，前提是所给path在router中有定义，指向了某一个vue组件。
```js
onEditClick(row) {
  // 点击编辑
  this.$router.push({ path: `/workflows/${row.trace_id}` });
}
```
## 思路
router配置的页面放在views中，views要引入的组件放在components中。
