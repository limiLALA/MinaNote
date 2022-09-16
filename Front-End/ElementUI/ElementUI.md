# 组件

## Layout 布局（栅格）

通常栅格都是el-row和el-col搭配使用，并且一般是el-row包在最外层

```vue
<el-row>
  <el-col :span="8"><div style="background: #99a9bf;"></div></el-col>
  <el-col :span="8"><div style="background: #d3dce6;"></div></el-col>
  <el-col :span="8"><div style="background: #e5e9f2;"></div></el-col>
</el-row>
```

在不指定每个栅格列宽:span的情况下，直接使用el-row套el-col是达不到栅格el-col高度一致效果的，必须在el-row中指定type="flex"，其中el-col会默认均等分布

```vue
<el-row type="flex">
  <el-col><div style="background: #99a9bf;"></div></el-col>
  <el-col><div style="background: #d3dce6;"></div></el-col>
  <el-col><div style="background: #e5e9f2;"></div></el-col>
</el-row>
```

想在栅格中显示文字，必须指定style中的font-size，否则默认为0，显示不出来。

如果要动态获取样式中的某一项，需要把style后面的内容用大括号包起来，非变量/函数的值都用单引号包起来，如下所示：

```vue
<template>
<el-row type="flex">
  <el-col>
      <div style="font-size:18px;color:#99a9bf">固定颜色文字</div>
  </el-col>
  <el-col>
      <div :style="{'font-size':'18px','color':getColor(status),'font-weight':'bold','margin-left':'10px','line-height':1}">动态获取字体颜色</div>
  </el-col>
</el-row>
</template>
<script>
export default {
    name: 'Atom',
    data() {
        return {
            status: 1
        }
    },
    methods: {
        getColor(status) {
          // 文字颜色
          if (status === 0) {
            return '#404040';
          }
          if (status === 1) {
            return '#409eff';
          }
          if (status === 2) {
            return '#67c23a';
          }
          if (status === 3) {
            return '#f56c6c';
          }
          return '#bbb';
        },
    }
}
</script>
```

如果想要栅格中的内容水平居中，可以在el-col中加上align="middle"

```vue
<el-row type="flex">
  <el-col align="middle"><div style="font-size:18px;color:#99a9bf">固定颜色文字</div></el-col>
</el-row>
```

如果想要栅格中的内容垂直居中，可以在el-row中加上align="middle"

```vue
<el-row type="flex" align="middle">
  <el-col><div style="font-size:18px;color:#99a9bf">固定颜色文字</div></el-col>
</el-row>
```

> [Vue e-row、el-col高度一致且内容居中](https://www.jianshu.com/p/5e2a475b6b5f)

## Form表单

hide-required-asterisk:是否隐藏必填字段的标签旁边的红色星号

### 修改默认表单项间距和label的字体

css中增加

```css
.el-form {
    .el-form-item {
        margin-bottom: 10px;
    }
    .el-form-item__label {
        font-size: 14px;
        font-weight:bold;
        color: #606266;
    }
}
```

### Form表单不换行

css中添加

```css
.el-form {
	white-space: nowrap;
}
```

### el-form的label自适应宽度并左对齐

在el-form中赋予label-width="auto"后，label就会自适应标签的长度，但会默认右对齐(此时使用label-position="left"也无法改变对其方式)

element中是通过

```css
.el-form-item__label-wrap{ float: left; }
```

将label向左漂之后，通过填补margin-left实现右对齐，所以想让label自适应之后**左对齐**，只需要将**margin-left**设置为**0px**即可。

```css
.el-form-item__label-wrap {
  margin-left: 0px !important;
}
```

另外：如果**label-width**是设定了**固定值**，那么可以通过**labe-position**直接设置label**标签的对齐方式**

> [el-form表单验证的trigger类型](https://www.cnblogs.com/weibo258/p/14356307.html)
>
> [修改ElementUI默认表单项el-form-item间距](https://blog.csdn.net/qq_35462323/article/details/123084943?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1-123084943-blog-122236935.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1-123084943-blog-122236935.pc_relevant_default&utm_relevant_index=1)
>
> [修改el-form表单的el-form-item的label的字体大小以及修改el-row中的el-col的高度](http://t.zoukankan.com/pzw23-p-13581598.html)

## table表格
当el-table元素中的data注入对象数组后，el-table-column中用prop属性对应对象的键名即可填入数据，label用来定义展示出来的列名，width定义列宽。

### 带斑马纹的表格

在el-table中使用stripe属性可以创建带斑马纹的表格
### 带竖直边框的表格

默认情况下，Table 组件是不具有竖直方向的边框的，如果需要，可以使用border属性
### 单选

选择单行数据时，用色块表示。配置highlight-current-row属性即可实现单选。之后由current-change事件来管理选中时触发的事件，它会传入currentRow，oldCurrentRow。如果需要显示索引，可以增加一列el-table-column，设置type属性为index即可显示从 1 开始的索引号。
### 排序
在列中设置sortable属性即可实现以该列为基准的排序。也可在el-table中设置default-sort属性设置默认的排序列和排序顺序，它的prop属性指定默认的排序的列，order指定默认排序的顺序。如果需要后端排序，需将sortable设置为custom，同时在 Table 上监听@sort-change事件，在事件回调中可以获取当前排序的字段名和排序顺序，从而向接口请求排序后的表格数据。
### slot-scope
通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据。
### 展开行
当行内容过多，不想显示行滚动条时，可以使用Table展开行功能。
通过设置 type="expand" 和 Scoped slot 可以开启展开行功能，el-table-column 的模板会被渲染成为展开行的内容，展开行可访问的属性与使用自定义列模板时的 Scoped slot 相同。
### 事件
@row-click：点击某一行时触发该事件
@expand-change：当用户对某一行展开或关闭时触发该事件
### Table-column Attributes
show-overflow-tooltip：当内容过长被隐藏时显示 tooltip
>[Table 表格](https://element.eleme.cn/#/zh-CN/component/table)

### 进阶个性化用法

##### 修改表头、列的背景颜色、字体样式

###### [全表头修改](https://wenku.baidu.com/view/b7dd6c4a26c52cc58bd63186bceb19e8b8f6ec95.html)

`header-cell-style`是**表头**单元格的 style 的回调⽅法，下面直接在el-table中使用这个属性

```
<el-table :header-cell-style="{background:'#eef1f6',color:'#606266'}">
...
</el-table>
```

###### [针对部分单元格修改](https://blog.csdn.net/Dax1_/article/details/119739781)

`cell-style`是**数据**单元格的 style 的回调⽅法，可通过指定对应的method的方式实现部分列的背景颜色和字体颜色修改

html部分：

```html
<script src="//unpkg.com/vue/dist/vue.js"></script>
<script src="//unpkg.com/element-ui@2.4.11/lib/index.js"></script>
<div id="app">
<template>
    <el-table :data="tableData" 
    			:cell-style="cellStyle" 
    			border style="width: 100%">
      <el-table-column prop="date" label="日期" width="180">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
    </el-table>
  </template>
</div>
```

js部分：

```js
var Main = {
      data() {
        return {
          tableData: [{
            date: '2016-05-02',
            name: '王小虎1',
            address: '上海市普陀区金沙江路 1518 弄'
          },{
            date: '2016-05-02',
            name: '王小虎1',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎2',
            address: '上海市普陀区金沙江路 1517 弄'
          },{
            date: '2016-05-02',
            name: '王小虎1',
            address: '上海市普陀区金沙江路 1522 弄'
          }]
        }
      },
      methods: {
      	cellStyle({row, column, rowIndex, columnIndex}){
        	if(column.property === 'name'){
          	switch(row.name) {
            	case '王小虎1':
              	return {
                	background: 'red',
                  color: '#FFFFFF'
                }
              	break
              case '王小虎2':
              	return {
                	background: 'blue',
                  color: '#FFFFFF'
                }
              	break
            }
          }
        }
      }
    }
var Ctor = Vue.extend(Main)
new Ctor().$mount('#app')
```

###### 针对行修改

`row-style`是**数据行**的 style 的回调⽅法

#### 行内详情查看（类似collapse折叠面板）

增加一列并给el-table-column组件指定type="expand"即可，然后在组件内放要展示的详情

```html
<el-table ref='table' :data="tableData" @row-click="rowClick">
    <!-- ⾏内展开展⽰⾏（⾏内展开必填） -->
    <el-table-column type="expand" label="详情">
        <!-- 作⽤域插槽，获取当前⾏数据 -->
        <template slot-scope="{row}">
            <div>我是详情</div>
        </template>
    </el-table-column>
</el-table>
```

#### 清空selection已经选择的数据

el-table中如果存在type="selection"的列，当选择完并做提交/数据更新/翻页操作后，原来选择的项不会被清空，这里在用户理解上是不合理的，需要进行下面2步操作实现清空

1、在`el-table` 标签加上`ref="materialTable"`
2、在你需要清空的时候加上以下代码

```js
this.$refs.materialTable.clearSelection();
```

> [element-UI+Vue:el-table的selection已经选择的数据，翻页不清空 + 清除table选择数据](https://blog.csdn.net/weixin_46099269/article/details/111225391)

#### 设置默认选中selection

> [vue+elementui实现表格默认选中(el-table)](https://blog.csdn.net/weixin_46038888/article/details/124172624)

#### 去掉表格边框线

下边框样式

```stylus
.el-table::before {
  height: 0px;
}
```

右边框线

```stylus
.el-table--border::after {
  width: 0px;
}
```

左和上的

```stylus
.el-table--border {
  border: none;
}
```

> [el-table去掉最外层的边框线](http://t.zoukankan.com/pzw23-p-14302237.html)

#### 去掉表格内部分割线

```stylus
.el-table {
    tr th,
    tr td {
        border-top: none;
        border-bottom: none;
        border-left: none;
        border-right: none;
    }
}
```

> [一文图解自定义修改el-table样式](https://blog.csdn.net/weixin_48337566/article/details/123340499)

#### 设置单元格（el-table-column）保留空格和换行

在使用 el-table 展示数据时，单元格中的数据有可能存在空格和换行符，若不进行设置，浏览器默认会取消空格和换行符

```vue
 <style>
   .el-table .cell.el-tooltip {
       white-space: pre-wrap;
   }
 </style>
```

“white-space” 属性常见的配置对应的释义如下所示：

| 配置项   | 释义                                                         |
| -------- | ------------------------------------------------------------ |
| normal   | 默认。连续的空白符会被合并，换行符会被当作空白符来处理。换行在填充「行框盒子 (line boxes)」时是必要。 |
| pre      | 空白会被浏览器保留。其行为方式类似 HTML 中的<pre> 标签。     |
| nowrap   | 和 `normal` 一样，连续的空白符会被合并。但文本内的换行无效，直到遇到\<br\>标签为止。 |
| pre-wrap | 保留空白符序列，且正常地进行换行。                           |
| pre-line | 合并空白符序列，但是保留换行符。                             |
| inherit  | 规定应该从父元素继承 white-space 属性的值。                  |

> [Elelemt-UI el-table 接收后端返回换行符 /n 不生效](https://blog.csdn.net/lhban108/article/details/125601824)

#### el-table表格控件表头与内容列不对齐问题

将以下样式代码添加到app.vue中（必须是入口文件，起全局作用！）

```css
body .el-table th.gutter{
	display: table-cell!important;
}
```

> [el-table表格控件表头与内容列不对齐问题](https://www.jianshu.com/p/a3f4b82a16ac?u_atoken=a4f2ba53-48df-400d-9a42-1a77859d5b6a&u_asession=01eY3LM4f8x8UA-5TAR4Vx4rYrgJKTT1Zys5gCOd-awsi419FKN6KjlV_UFwNngIWpX0KNBwm7Lovlpxjd_P_q4JsKWYrT3W_NKPr8w6oU7K8A3pTJMziFbXMDWPd58cRdnHmbkqVcEgdObpAroqY1_GBkFo3NEHBv0PZUm6pbxQU&u_asig=05qQYhRevD29F9Yl3kQGqbE0IpEbfp8T_WfCCsEHlSYuayVKsWDfDjL3p9i2lxBFsCud52xciU5ciumMqKtXJ2Hyns86vrXCDRf80TD13YOP2SC-r-rMbq5uBP940a5u2egxlPnJ6tHIv_g32B0SkdymMr5178h6-atLteHb8s8Ur9JS7q8ZD7Xtz2Ly-b0kmuyAKRFSVJkkdwVUnyHAIJzTi9zgoJlNW0yBH28fffKboW872Q58OJN498FirWIlnH6xbSxAaWh9ph0bRUFW-6vO3h9VXwMyh6PgyDIVSG1W8pull1I08jE7EJ3vUPdKMLSGGhLzPyvHy4oNvsNvjA3xA_y6Gj2lrlsJKCKmIRC9k6Xcg1AyQUW7j2LbHqh3lqmWspDxyAEEo4kbsryBKb9Q&u_aref=tcJ0W9QYCuP77V%2FNPXhdH%2BSSrPo%3D)

## Progress 进度条

设置percentage属性即可，表示进度条对应的百分比，必填，必须在 0-100。通过 format 属性来指定进度条文字内容。通过 stroke-width 属性更改进度条的高度，并可通过 text-inside 属性来将进度条描述置于进度条内部。

> [Element UI 自定义环形进度条里的内容](https://blog.csdn.net/weixin_41192489/article/details/110874362)

## Collapse折叠面板
通过折叠面板收纳内容区域
```html
<el-collapse v-model="activeNames" @change="handleChange">
  <el-collapse-item title="一致性 Consistency" name="1">
    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
  </el-collapse-item>
  <el-collapse-item title="反馈 Feedback" name="2">
    <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
    <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
  </el-collapse-item>
  <el-collapse-item title="效率 Efficiency" name="3">
    <div>简化流程：设计简洁直观的操作流程；</div>
    <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
    <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
  </el-collapse-item>
  <el-collapse-item title="可控 Controllability" name="4">
    <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
    <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
  </el-collapse-item>
</el-collapse>
<script>
  export default {
    data() {
      return {
        activeNames: ['1']
      };
    },
    methods: {
      handleChange(val) {
        console.log(val);
      }
    }
  }
</script>
```
### 手风琴效果
每次只能展开一个面板。
通过 accordion 属性来设置是否以手风琴模式显示。
比如第一行改为
```html
<el-collapse v-model="activeNames" accordion>
```
>[Collapse 折叠面板](https://cloud.tencent.com/developer/section/1489906)

## Select选择器
v-model的值为当前被选中的el-option的value属性值
```html
<el-select
  v-if="mode==='edit'&&scope.row.editing"
  v-model="scope.row.type"
  size="mini"
  style="width:100px"
>
  <el-option
    v-for="item in typeOptions"
    :key="item.value"
    :label="item.label"
    :value="item.value"
  />
</el-select>
```
#### 样式调整

##### 高度调整

el-select组件的高度是固定的，如果要调整，需要单独设置style，为了避免影响到其他的select组件，可以加个自定义class，如my-el-select，并修改el-input__inner属性。另外还要做好下面的配置工作

- 安装stylus的包**npm install stylus stylus-loader --save-dev**
- 在webpack.config.js中新增module的rules配置，用以匹配stylus样式的加载器

stylusDemo.vue

```vue
<template>
	<el-select v-model="cur" placeholder="请选择" class="my-el-select">
        <el-option v-for="item in items" :key="item" :label="item" :value="item"></el-option>
    </el-select>
</template>

<script>
    export default {
        name: 'stylus-demo',
        data() {
		    return {
                cur: '西瓜',
                items: ['西瓜', '苹果', '草莓', '香蕉', '菠萝']
            }
        }
    }
</script>

<style lang="stylus">
/* 自定义宽度 */
.my-el-select {
    width: 320px;
    /* selecte 框的高度设置，默认是 40px*/
    .el-input__inner{
        height: 30px;
    }
    /* 下面设置右侧按钮居中 */
    .el-input__suffix {
        top: 5px;
    }
    .el-input__icon {
        line-height: inherit;
    }
    .el-input__suffix-inner {
        display: inline-block;
    }
}
</style>
```

webpack.config.js

```js
module: {
    rules: [
        {
            test: /\.styl(us)?$/,//若不填写(us)?则无法解析vue里的style stylus样式
            use: ['style-loader', 'css-loader', 'stylus-loader']
        }
    ]
}
```

##### 宽度调整

如果想要 label宽度 + el-select宽度填满一行，只需在el-select的style中加上`display:block`即可

![image-20220329162317483](../resources/images/选择器宽度填满.png)

```vue
<el-select v-model="item.input_data" size="middle" filterable style="display:block"></el-select>
```

>[Select 选择器](https://cloud.tencent.com/developer/section/1489873)
>[Vue ElementUI el-select 改变高度](https://blog.csdn.net/sinat_31213021/article/details/114115024)
>[el-form-item 内的 el-select如何自适应宽度](https://segmentfault.com/q/1010000020225305)

## Dropdown下拉菜单
将动作或菜单折叠到下拉菜单中。
通过组件slot来设置下拉触发的元素以及需要通过具名slot为dropdown来设置下拉菜单。默认情况下，下拉按钮只要hover即可，无需点击也会显示下拉菜单。

>[Dropdown 下拉菜单](https://cloud.tencent.com/developer/section/1489899)

## Steps步骤条
引导用户按照流程完成任务的分步导航条，可根据实际应用场景设定步骤，步骤不得少于 2 步。

## Dialog对话框
before-close是在关闭对话框之前执行的事情。
```html
<el-button type="text" @click="dialogVisible=true">打开对话框</el-button>
<el-dialog title="提示" :visible.sync="dialogVisible" :before-close="handleClose">
  <span>你打开了对话框看到了这段话</span>
</el-dialog>
<script>
export default {
  data(){
    return {dialogVisible: false};
  },
  method:{
    handleClose(done){
      this.$confirm('确认关闭？')
      .then(_=>{
        done();
      })
      .catch(!=>{});
    }
  }
}
</script>
```

## Input输入框
* v-model绑定值
* disabled禁用
* clearable可清空
* show-password密码框
* prefix-icon 和 suffix-icon 可在组件首部和尾部增加显示图标

### 样式调整

> [Element：设置el-input宽度大小](https://blog.csdn.net/Xidian2850/article/details/104576398)

## CheckBox多选框

### 勾选项绑定值与实际显示标签不同

在el-checkbox-group组件中使用v-model绑定用来存储选择项的数组变量

在el-checkbox中使用:label来指定最终存储到v-model中的数据，而:key和:value在这里不起任何有效作用

而:key和:value在这里不起任何有效作用

```vue
<el-checkbox-group v-model="testTools.query.tool_ids">
    <el-checkbox
                 v-for="(testTool, index) in testTools.data"
                 :key="index"
                 :label="testTool.id"
                 :value="testTool.name"
    >
        {{ testTool.name }}
    </el-checkbox>
</el-checkbox-group>
```

如果使用纯闭合标签，则显示在复选框后面的文字就是:label指定的数据

```vue
<el-checkbox-group v-model="testTools.query.tool_ids">
    <el-checkbox
                 v-for="testTool in testTools.data"
                 :label="testTool.id"  // 显示的是id而不是name
    />
</el-checkbox-group>
```

### [el-checkbox 点击Label不改变复选框的选中状态](https://www.itxm.cn/post/28198.html)

```vue
<el-checkbox
  :label="toolRun.id"
  style="font-weight:bold;"
>
  {{ toolRun.name }}
</el-checkbox>
```

背景：上述代码中，标签文字部分点击一定会触发事件勾选/取消勾选，但有时候我们不想要这么大的响应范围，只要点击勾选框来触发事件，应该怎么做呢？

思路：自己使用span渲染展示标签然后通过click事件的修饰符[prevent]阻止默认事件

```vue
<el-checkbox
  :label="toolRun.id"
  style="font-weight:bold;"
>
  <span @click.prevent>{{ toolRun.name }}</span>
</el-checkbox>
```

还有一种方法是把要展示的文字部分放在el-checkbox之外（注意，el-checkbox中间一定要有个占位符，如空格，否则会显示toolRun.id）

```vue
<el-checkbox
  :label="toolRun.id"
  class="my-checkbox"
>
    {{ }}
</el-checkbox>
<span style="font-weight:bold;">
    {{ toolRun.name }}
</span>
```

### 样式调整

#### 加粗label里面的文字部分

在el-checkbox中的style增加`font-weight:bold`即可

```vue
<el-checkbox :label="testingTool.name" style="font-weight:bold">哈哈哈 </el-checkbox>
```

> [如何给label里面的文字部分更改字体加粗](https://bbs.csdn.net/topics/390080895)

## Button按钮

### 样式调整

#### 2个按钮居中显示

可以外面包一个div，加上`align="center"`属性。

![image-20220329162144935](../resources/images/2个按钮居中显示.png)

```vue
<div align="center" style="padding-bottom: 12px">
 <el-button size="middle" :theme="'primary'" type="primary" :outline="true" style="margin-right: 50px"
            @click="handleClickExecute">执行
 </el-button>
 <el-button size="middle" :theme="'primary'" type="primary" :outline="true" style="margin-left: 50px"
            @click="handleClickCancel">取消
 </el-button>
</div>
```

`注意button的style中的margin-right表示在按钮外部的右侧增加空白填充，而使用padding的话就会变成按钮内部填充，会影响按钮本身的形状`

## Switch开关

## tab标签页

在使用el-tabs时，如果要使用v-model自定义绑定变量，那么el-tab-pane中就必须指定name属性（**必须为字符串类型**），表示当前tab-pane的名称，如果这个tab-pane被选中，则会更新v-model绑定值为这个name。

如果不指定v-model，只指定了el-tab-pane的label，官方底层默认的v-model是有问题的，在切换tab的时候不会触发兄弟组件内的子组件重新渲染，然后就会导致只有第一个tab显示正常，其他tab渲染异常的问题。

比如tab-pane中包了el-form，并设置了`label-width="auto"`，但是只有第一个tab的表单标签是正常右侧对齐（`.el-form-item__label-wrap`有设置`margin-left`）、输入框全部左对齐的（`.el-form-item__content`有设置`margin-left`），其他tab的标签都变成了左对齐（`.el-form-item__label-wrap`的`margin-left`没有了），并且输入框也没有左对齐了（`.el-form-item__content`的`margin-left`变少了），变成了参差不齐TAT

这里底层是为什么还不得而知，后面有时间再仔细研究下。目前看tab 的切换是 display 的属性切换，猜测v-model可以触发重新computed的事件，但是el-tabs内置的操作就没有触发，兄弟组件传值没有监听到值变化。

总之一定要加上v-model，自己指定tab绑定值。

> [vue-el-tabs一些常见坑](http://www.manongjc.com/detail/25-sulwmmkjqxoypsa.html)

## Link链接

默认是在当前页面跳转，如果要新开标签页跳转，需要加上`target="_blank"`

```vue
<el-link
    href="https://www.baidu.com/"
    target="_blank"
    type="primary"
>
    百度一下
</el-link>
```

# 组件嵌套使用

## el-form中嵌套el-table

[element-ui的el-table与el-form的使用与表单校验](https://blog.csdn.net/weixin_56650035/article/details/117792216)
