# 统计文件行数

以统计test.txt文件行数为例。统计test.txt文件的行数的命令：

```bash
wc -l test.txt 或者 cat test.txt | wc -l
# 5 test.txt
```

# 统计单词数

```bash
wc -w test.txt 或者 cat test.txt | wc -w
# 12 test.txt
```

# 统计字符数

```bash
wc -c test.txt 或者 cat test.txt | wc -c
# 457 test.txt
```

# 同时统计文件的行数，单词数和字符数

```bash
wc test.txt
#   5  12 457 test.txt
```

# 统计文本中的字符数

-n 用于避免echo添加额外的换行符。

```bash
echo -n "1234567" | wc -c
# 7
```

# 统计文件中，最长行的长度

```bash
wc test.txt -L
# 130 test.txt
```

> [Linux如何统计文本的的行数/单词数和字符数](https://www.yisu.com/zixun/423011.html)