[Linux awk 命令](https://www.runoob.com/linux/linux-comm-awk.html)

[Linux三剑客之awk命令](https://www.cnblogs.com/ginvip/p/6352157.html)

# 用法

## 用法一

```bash
awk -F '{[pattern] action}' {filenames}   # 行匹配语句 awk '' 只能用单引号；-F相当于内置变量FS, 指定分割字符
```

```bash
$  awk -F, '{print $1,$2}'   log.txt  # 使用","分割，打印每行第一、第二列字段
$  awk 'BEGIN{FS=","} {print $1,$2}'     log.txt  # 或者使用内建变量FS
$  awk -F '[ ,]'  '{print $1,$2,$5}'   log.txt  # 使用多个分隔符.先使用空格分割，然后对分割结果再使用","分割
```

## 用法二

```bash
awk -f {awk脚本} {文件名}
```

```bash
$  awk -f cal.awk log.txt
```

## 用法三

```bash
$  awk '$1>2 && $2=="Are" {print $1,$2,$3}' log.txt  # 过滤第一列大于2并且第二列等于'Are'的行
```

