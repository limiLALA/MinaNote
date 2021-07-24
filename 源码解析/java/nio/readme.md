# 概述
java.nio包

# 特性

# 重点类
## Channel
### 以下是Java NIO中最重要的通道的实现：
1. ### FileChannel
从文件中读写数据
2. ### DatagramChannel
能通过UDP读写网络中的数据。
3. ### SocketChannel
能通过TCP读写网络中的数据。
4. ### ServerSocketChannel
可以监听新进来的TCP连接，像Web服务器那样。对每一个新进来的连接都会创建一个SocketChannel。

## Buffer
### Buffer有以下几种类型
ByteBuffer ShortBuffer IntBuffer
LongBuffer FloatBuffer DoubleBuffer
CharBuffer MappedByteBuffer
8种基本数据类型中 **除boolean类型** 所对应的Buffer类型。

## Selector
