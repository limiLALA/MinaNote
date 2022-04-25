01.HTML常用元素、标签与属性
>[HTML参考手册](https://www.w3school.com.cn/tags/tag_span.asp)
[HTML 样式- CSS](https://www.runoob.com/html/html-css.html)
[关于template标签用法总结(含vue中的用法总结)](https://blog.csdn.net/u010510187/article/details/100356624)

#### <li>
定义列表项目，可用在有序列表<ol>和无序列表<ul>中
#### <ol>
定义有序列表，会顺序标号，有不同类型的顺序标号，如数字（1）、大小写字母（"A"/"a"）、大小写罗马字母（"I"/"i"）。
#### <ul>
定义无序列表，无标号，但是有项目符号，可用type属性指定，如"disc"、"circle"、"square"等，默认"disc"
```HTML
<html>
<body>
<ul type="disc">
  <li>咖啡</li>
  <li>茶</li>
  <ul>
    <li>红茶</li>
    <li>绿茶</li>
  </ul>
  <li>牛奶</li>
</ul>
</body>
</html>

```
#### <section>
标签定义文档中的节（section、区段）。比如章节、页眉、页脚或文档中的其他部分。一个section通常由内容和标题组成，通常不推荐那些没有标题的内容用section
#### <template>
不在vue实例绑定的元素中：标签和内容均在页面上不可见，但是在DOM结构中存在该标签和内部结构
在vue实例绑定的元素中：内容在页面上可见，但是在DOM结构中不存在该标签，而存在其内部结构。支持v-if、v-else-if、v-else、v-for这些指令，不支持v-show。
