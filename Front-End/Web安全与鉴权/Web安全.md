# Web攻击手段
## CSRF（Cross-Site Request Forgery）跨站请求伪造
## XSS（Cross-Site Script）跨站脚本
## XSSI（Cross-Site Script Inclusion）跨站脚本包含
>[跨站脚本包含-一个名不见经传但广为流传的 WEB 漏洞类](https://www.scip.ch/en/?labs.20160414)  
[XSSI 漏洞总结](https://www.bilibili.com/read/cv10067945)

# 应对手段
## Fetch Metadata Request Headers
Sec-Fetch开头的请求头都属于Fetch Metadata Request Headers，都是Forbidden header，即不可被篡改，由浏览器自动加上，保证了数据的准确性。另外，如果资源是本地加载，就不会加上这些请求头（无跨域问题，不需要加）。  
Fetch Metadata Request Headers的出现是为了解决服务端的web安全问题，在服务端要识别非法请求往往比较困难，缺乏判断的依据，控制比较粗线条，而Fetch Metadata Request Headers为服务端识别非法请求提供了元数据，能够更加轻松地避免CSRF/XSSI等攻击。

>[Sec-Fetch-*请求头，了解下?](https://www.cnblogs.com/fulu/p/13879080.html)

### Sec-Fetch-Dest
表示请求的目的，期望什么样的资源。如report、document、image、video等。

### Sec-Fetch-Mode
表明请求的模式。
#### 取值范围
| 取值 | 说明 |
| :------------- | :------------- |
| cors | 跨域请求，要求后端设置cors响应头 |
| no-cors | 默认模式，限制请求只能用请求方法(get/post/put)和请求头(accept/accept-language/content-language/content-type)，这不是说请求不跨域，只是说图片/脚本/样式表这些请求时容许跨域且不需要设置跨域响应头 |
| same-origin | 不容许跨域，只接收同源请求，如果向其他源发送请求，会返回错误 |
| navigate | 浏览器的页面切换请求，仅在切换页面时创建navigate请求，该请求应返回HTML |
| websocket | 建立websocket连接 |

### Sec-Fetch-Site
表明请求发起者的来源与目标资源来源之间的关系。
#### 取值范围
| 取值 | 说明 |
| :------------- | :------------- |
| cross-site | 跨域请求 |
| same-origin | 同源，站点、协议、端口完全一致 |
| same-site | 满足3个条件：(1)协议相同，如都是HTTPS协议；(2)被请求方域名必须是请求方域名下的子域名或者本身，如example.com请求example.com，或者example.com请求sub.othor.example.com。如果满足以上三种条件，port不同也是same-site。 |
| cross-site | 跨域请求 |
| none | 用户直接触发页面导航，比如直接在浏览器地址栏中输入地址，或者点击书签跳转等，会设置为none |

>[Sec-Fetch-Site](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site)

### Sec-Fetch-User
指示导航请求是否由用户激活触发（鼠标点击/键盘）
#### 取值范围
| 取值 | 说明 |
| :------------- | :------------- |
| ?1 | true，导航请求由用户激活触发 |
| ?0 | false，导航请求由其他原因触发 |

#### 说明
该请求头只在导航请求中会携带，包括document , embed , frame , iframe , object
