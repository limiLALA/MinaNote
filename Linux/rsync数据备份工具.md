[rsync(一)：基本命令和用法](https://blog.csdn.net/qq_32706349/article/details/91451053)

# 简介

rsync主要目的是实现本地主机和远程主机的文件同步，包括本地推远程、远程拉到本地2种同步方式。也可以实现本地不同路径下文件的同步，但是不能实现远程不同路径之间的同步（scp可以实现）。

rsync有2部分可设置的模式

1. 检查模式：按照指定规则来决定哪些文件要同步，哪些不要。默认使用“quick check”算法来快速检查源文件和目标文件的大小、mtime(修改时间)是否一致，如不一致则传输。
2. 同步模式：在确定文件要被同步后，在同步前要做的额外工作。如是否删除源主机没有但是目标主机上有的文件，是否要先备份已存在的目标文件，是否要追踪链接文件等。

# rsync的三种工作方式

1. 本地主机文件系统上实现同步。
2. 本地主机使用远程shell和远程主机通信。
3. 本地主机通过网络套接字连接远程主机上的rsync daemon。

分别对应的语法为：

```bash
Local:  rsync [OPTION...] SRC... [DEST]
 
Access via remote shell:
  Pull: rsync [OPTION...] [USER@]HOST:SRC... [DEST]
  Push: rsync [OPTION...] SRC... [USER@]HOST:DEST
 
Access via rsync daemon:
  Pull: rsync [OPTION...] [USER@]HOST::SRC... [DEST]
        rsync [OPTION...] rsync://[USER@]HOST[:PORT]/SRC... [DEST]
  Push: rsync [OPTION...] SRC... [USER@]HOST::DEST
        rsync [OPTION...] SRC... rsync://[USER@]HOST[:PORT]/DEST
```

前两种本质是管道通信，而第三种需要远程主机上运行rsync服务，监听某个端口，等待客户端连接。
但其实还有第四种工作方式，通过远程shelll让远程主机临时派生出单用途一次性的rsync daemon，仅用于临时读取daemon的配置文件，当本地rsync同步完毕，远程主机的rsync也会自动消逝。语法同Access via rsync daemon，但是options必须明确指定--rsh或短选项-e。

另外有个要注意的点是，如果原路径是一个目录的话，带上尾随斜线表示的是目录中的文件不含目录本身，而不带尾随斜线则表示整个目录包括本身。



