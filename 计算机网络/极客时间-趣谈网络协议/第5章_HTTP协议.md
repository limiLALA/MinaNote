# 一、基础概念
## URI
* 统一资源标识符：URI。包含URL和URN。
* 统一资源定位符：URL，域名。  
* 统一资源名称：URN。

## HTTP请求报文与响应报文

# 二、HTTP方法
###### GET
获取资源。从服务器获取资源，比如一个页面，或者一个JSON字符串。   
###### HEAD
获取报文首部。与GET类似，但是不返回实体主体，主要用于检验URL的有效性。
###### POST
传输实体主体。向服务器发送一些信息，比如用户在表单中填写的信息，放在正文中，一般是JSON格式。  
>GET操作具有幂等性，POST不具有幂等性
###### PUT
上传文件。不带验证机制，任何人都可上传文件，因此一般不使用。
>PUT也是向服务器传送东西，但有所不同的是，POST是创建资源，PUT是修改资源，但是是通过完全替代原始资源的形式进行修改，无法修改局部。  
###### PATCH
对资源进行部分修改。与PUT功能类似，但是PATCH可修改文件中的一部分，而PUT不行。  
###### DELETE
删除文件。与PUT相反。  
###### OPTIONS
查询支持的方法。查询指定的URL能够支持的方法，返回的内容如下：  
Allow：GET, POST, HEAD, OPTIONS
###### Connect
要求与代理服务器通信时建立隧道。使用SSL（Secure Socket Layer安全套接层）和TLS（Transport Layer Security传输层安全）协议对通信内容加密后经网络隧道传输。
###### Trace
追踪路径。服务器会将通信路径返回给客户端。Max-Forword首部字段。

# 三、HTTP状态码


# 四、HTTP首部字段

# 五、应用
## Cookie
## Session
## 区别
Cookie储存在客户端，Session储存在服务端。  

当客户端发送一个登录请求时，将用户名和密码放在HTTP报文中发送给服务端，服务端将用户状态信息存入Redis（内存数据库）中，并生成一个Token，Token ID作为键，用户状态信息在Redis中的索引作为值存放在Session中，并将Token ID返回给客户端，客户端将键值对(Token,Token ID)存入Cookie。  

进行下一次请求时，会带上Cookie将请求报文发送给服务端，服务端从Cookie中提取出Token ID，在Session中取出用户状态信息索引，根据该索引在Redis中提取出用户状态信息，通过响应报文返回给客户端。
