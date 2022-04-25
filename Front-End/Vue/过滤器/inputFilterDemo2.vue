<template>
  <div class="tools-config-container">
    <el-form :inline="true">
      <el-row>
        <el-form-item label="工具名称">
          <el-input
            v-model="inputFilter.tool_name"
            placeholder="请输入工具名称"
            size="medium"
            clearable
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="inputFilter.status"
            placeholder="请选择"
            size="medium"
            filterable
            style="width:90px"
          >
            <el-option
              v-for="(value,key) in toolStatus"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table
      :key="tools.key"
      :v-loading="tools.loading"
      :data="filterTools"
      border
      stripe
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="工具名称"
        prop="name"
        width="160px"
        show-overflow-tooltip
      />
      <el-table-column
        label="状态"
        prop="status"
        width="50px"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{ toolStatus[row.status] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ToolsConfig',
  data() {
    return {
      that: this,
      tools: {
        key: 0,
        loading: false,
        data: [
          { name: '资金安全检测', status: '0' },
          { name: 'CGI安全扫描', status: '0' },
          { name: 'SQL安全扫描', status: '0' },
          { name: '123', status: '1' },
        ],
      },
      toolStatus: { 0: '下线', 1: '上线' },
      inputFilter: {
        tool_name: '',
        status: null,
      },
    };
  },
  computed: {
    filterTools() {
      const name = this.inputFilter.tool_name.trim();
      let data;
      // 包含"",null,undefined,NaN多种情况
      if (name && this.inputFilter.status) {
        data = this.tools.data.filter(item => item.name.indexOf(name) > -1 && item.status === this.inputFilter.status);
      } else if (name) {
        data = this.tools.data.filter(item => item.name.indexOf(name) > -1);
      } else if (this.inputFilter.status) {
        data = this.tools.data.filter(item => item.status === this.inputFilter.status);
      } else {
        data = this.tools.data;
      }
      return data;
    },
  },
}
;
</script>

<style lang="scss">
.tools-config-container {
  .el-textarea__inner {
    padding-right: 50px;
  }
}
</style>
