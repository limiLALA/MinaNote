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
删除文件。与PUT相反。同样不带验证机制。  
###### OPTIONS
查询支持的方法。查询指定的URL能够支持的方法，返回的内容如下：  
Allow：GET, POST, HEAD, OPTIONS
###### Connect
要求与代理服务器通信时建立隧道。使用SSL（Secure Socket Layer安全套接层）和TLS（Transport Layer Security传输层安全）协议对通信内容加密后经网络隧道传输。
###### Trace
追踪路径。服务器会将通信路径返回给客户端。Max-Forword首部字段。

# 三、HTTP状态码
服务器返回的响应报文的第一行为状态行，包含状态码级原因短语。
>常用的有200、302、304、403、404、500、503

## 1XX信息
**100 Continue**：表明到目前为止都很正常，客户端可以继续发送请求或者忽略这个响应。

## 2XX成功
**200 OK**  
**204 Not Content**：服务器已经成功处理，但是返回的响应报文不含实体的主体部分。一般只需要客户端向服务端发送信息而不需要服务端返回数据时使用。  
**206 Partial Content**：表示客户端进行了范围请求，服务端返回的响应报文包含Content-Range指定范围的实体内容。

## 3XX重定向
**301 Moved Permanently**：永久性重定向  
**302 Found**：临时性重定向  
**303 See Other**：和302一样，但是303明确要求客户将POST方法改为GET方法。
>虽然HTTP协议要求在301、302状态下不允许把POST改成GET，但是大多数浏览器在301、
302、303状态下都会将POST方法改为GET。

**304 Not Modified**：如果请求报文首部包含一些条件，如If-Match、If-Modified-Since、If-None-Match、If-Range、If-Unmodified-Since，服务器发现不满足条件时则返回304状态码。  
**307 Temporary Redirect**：临时重定向，与302类似，但是307要求浏览器不要把重定向请求的POST方法改成GET方法。

## 4XX客户端错误
**400 Bad Request**：客户端请求存在语法错误  
**401 Unauthorized**：客户端请求需要进行认证（BASIC认证、DIGEST认证），如果之前已经发过一次请求，说明认证失败。  
**403 Forbidden**：客户端请求被拒绝。  
**404 Not Found**：请求的页面找不到。

## 5XX服务器错误
**500 Internal Server Error**：服务器正在执行请求时发生错误。  
**503 Service Unavailable**：服务器暂时超负荷或者正在进行停机维护，暂时无法处理请求。

# 四、HTTP首部字段
### 通用首部字段

### 请求首部字段

### 响应首部字段

### 实体首部字段

# 五、具体应用
## 连接管理
![](HTTP1_x_Connections.png)

#### 短连接与长连接
HTTP 1.1之前默认都是短连接，每发送一次信息都会自动断开连接，如果需要长连接，则使用*Connect：Keep-Alive*。  
HTTP 1.1开始默认都是长连接，由客户端或者服务端主动关闭连接，使用*Connect：Close*。
#### 流水线
改善长连接每次都需要等待前一个请求收到响应后再发送下一条请求的延迟问题，以流水线的方式连续发出请求而不需要等待响应返回，可减少延迟。

## Cookie
HTTP协议是无状态的，让其能够处理大量事务。

HTTP/1.1引入Cookie来保存状态信息。

Cookie是服务器发送到用户浏览器并保存在本地的一小块数据，会在下一次想同一服务器发送请求时被带上，用于告知服务器这两个请求时同一浏览器发出。由于之后每次请求都要带上Cookie，会带来额外的性能开销。

Cookie用于客户端数据的存储。

#### 用途
* 会话状态管理（用户登录状态、购物车、游戏分数或其他需要记录的信息）
* 个性化设置（用户自定义设置、主题等）
* 浏览器行为跟踪（如跟踪分析用户行为等）

#### 创建过程
服务器返回的响应报文中包含Set-Cookie字段，客户端收到后会将Cookie内容存到浏览器中。

客户端之后向服务器发送请求时会从浏览器中取出Cookie信息，通过Cookie请求首部字段发送给服务器。

#### 分类
**会话期Cookie**：浏览器关闭后就会被自动删除，即仅在会话期有效。

**持久性Cookie**：指定过期时间（Expires）或有效期（max-age）后就成为持久性Cookie。

#### 作用域
**二级域名**：形如baidu.com  
**三级域名**：形如www.baidu.com ，是baidu.com的子域名。

**Domain标识** 指定了哪些主机(Host)可以接受Cookie。  
如果不指定，则默认为当前文档下的主机（不包含子域名）。  
如果指定，则一般包含子域名。
>如果指定Cookie的Domain为baidu.com，则访问www.baidu.com 时也会使用该Cookie。  
相反，若指定Cookie的Domain为www.baidu.com ，则访问baidu.com时不会使用该Cookie。

**Path标识** 指定主机下的哪些路径可以接受Cookie，以"/"作为路径分隔符，子路径也会被匹配。
>如指定Path=/docs，则以下路径均被匹配：  
* /docs
* /docs/Web
* /docs/Web/HTTP

#### 使用JavaScript创建Cookie
浏览器通过*document.cookie*属性可创建新的Cookie，也可访问非HttpOnly标记的Cookie。

#### HttpOnly
标记为HttpOnly的Cookie不能被JavaScript脚本调用，可避免跨站脚本攻击（XSS）。XSS常常利用*document.cookie*这个API来窃取用户的Cookie信息，因此使用HttpOnly可在一定程度上避免XSS攻击。

#### Secure
Secure标记的Cookie只能通过被HTTPS加密的请求发送给服务器，但是敏感信息页不应该通过Cookie发送，因为Cookie有其固有的不安全性。

>为什么说Cookie有其固有的不安全性？  
玩冒险岛时，如果你的等级存在Cookie中，由于Cookie的主体是浏览器，浏览器有权限修改cookie，你的等级原本为70，浏览器将其改为100级，是不是就可以直接发送给服务器了？  
如果通过HTTP报文发送等级信息，半路截获修改信息，也是不安全的。  
实际上，等级信息仅存储在服务端的Session中，客户端只能向服务端发送打怪的伤害值，然后在Session中增加你的经验值。外挂的原理就是修改伤害值为9999让用户快速升级。  
但是现如今的网游对于此类敏感信息的传输已经有自己的加密机制，无法被轻易修改，加密机制类似于HTTPS的混合加密过程。

#### Session
用户信息除了可以存在浏览器的Cookie中，也可以存储在服务器的Session中，更加安全。

Session可以存储在服务器的文件、数据库、内存中，也可以将Session存储在Redis这种内存性数据库中，效率更快。

使用Session维护用户的登录状态的过程如下：
1. 浏览器将用户名和密码发给服务器。
2. 服务器确认信息正确后，为这个客户端生成一个Session对象，分配一个Session ID。并将其登录状态及相关常用信息存在这个Session的HashMap中（不常用的用户信息存在服务器的数据库中，如MySql），此时Session相当于是一个缓存，一般放在Redis中。服务器将Session ID放在响应报文中返回给客户端。  
```JavaScript
Set-Cookie: Token=Session ID
```
3. 浏览器收到响应报文后，取出Session ID，在Cookie中生成一条键值对，Key为Token（不同平台可能名称不一样，客户端服务端一致即可），Value为Session ID。
4. 客户端发送下一条请求时带上刚刚新生成的Cookie一起传输给服务器，服务器收到后提取出Session ID，在对应的Session中提取出需要的用户状态信息，放在响应报文中返回给客户端。

>区别: Cookie储存在客户端，Session储存在服务端。  

#### 浏览器禁用Cookie
此时不能将用户信息存储在Cookie中，只能存储在Session中。Session ID也不能存在Cookie中，而是使用URL重写技术，将Session ID作为URL的参数进行传递。

#### Cookie与Session的选择
* Cookie仅能存储ACSII码字符串，而Session支持所有类型的数据，因此在考虑数据复杂性时首选Session。
* Cookie存储在浏览器中，容易被恶意查看，如果非要在Cookie中存放一些隐私数据，可以对Cookie值中进行加密，在服务端进行解密。
* 对于大型网站，如果所有用户信息都存储在Session中，开销将非常大，因此不建议将所有用户信息都存储在Session中，一般户将不常用的用户信息存储在数据库中，如MySQL。

## 缓存
