

##### 浏览器缓存什么时候失效
Expires、Cache-Control
>[浏览器缓存看这一篇就够了](https://www.sohu.com/a/306017942_669829)
>[【转】谈谈浏览器的缓存过期时间](https://www.cnblogs.com/yuanzai12345/p/5946730.html)

###### TCP三次握手
1. 客户端发送SYN包，CLOSED->SYN-SEND
2. 服务端发送SYN+ACK包，LISTEN->SYN-RCVD
3. 客户端发送ACK包，SYN-SEND->ESTABLISHED
4. 服务端收到ACK，SYN-RCVD->ESTABLISHED
上述过程均由OS全权处理，不经过应用层
携带信息：初始序列号、端口号、滑动窗口大小、最大消息长度等

###### TCP四次挥手
1. 客户端发送FIN包，ESTABLISHED->FIN-WAIT1
2. 服务端返回ACK包，ESTABLISHED->CLOSE-WAIT；客户端收到ACK，FIN-WAIT1->FIN-WAIT2
3. 服务端发送FIN包，CLOSE-WAIT->LAST-ACK
4. 客户端返回ACK包，FIN-WAIT2->TIME-WAIT，2MSL后进入CLOSED
5. 服务端收到ACK，LAST-ACK->CLOSED
* CLOSE-WAIT在干嘛？此期间TCP连接处于半关闭状态，主动发起断开连接的一方（这里是客户端）只能收不能发，被动要求断开连接的一方（服务端）如果是数据接收方，会让应用进程尽快拿走接收缓存中的数据，如果是数据发送方，会将发送窗口中的剩余数据发送出去。准备工作做完后，就通知客户端自己可以断开连接了。
* TIME-WAIT为什么要等待2MSL？TCP有一个报文超时重传机制，一般设置的超时时间t低于MSL（最大报文存活时间），发出报文起计时，如果超过时间t还没有收到ACK，就会重发这个报文。如果客户端返回的ACK丢失，没有被服务端收到，那么在2MSL内客户端大概率会收到服务端重传的FIN报文，然后重新返回一个ACK，仍然继续等待2MSL再进入CLOSED状态。假设客户端没有等待2MSL而是直接关闭连接，一旦这个唯一的ACK丢失，不管服务端怎么重传FIN都得不到任何回应，但是又不敢把连接断开，于是这个端口就永远无法被释放，造成端口浪费。

###### TCP和UDP的区别
1. TCP可靠，UDP不可靠
2. TCP有序，UDP无序
3. TCP面向字节流，UCP面向报文
4. TCP面向连接，UDP面向无连接
5. TCP支持流量控制和拥塞控制，UDP不支持
6. TCP仅支持一对一通信，UDP支持一对一、一对多、多对多

###### TCP的糊涂窗口综合征
* 如果发送方的应用进程发送数据速率太慢，或者接收方的应用进程读取数据的速率太慢，都会引起糊涂窗口综合征，他们都有各自的解决方案。
* 首先说下发送方引起的，如果发送方的应用进程发送数据的速度比较慢，每次都只给一个字节，那么TCP每次都只会打包一个字节的数据，然后经过层层包装发送出去，IP头占20字节，TCP头占20字节，那么一个IP数据包就是41字节，真正的数据只有1字节，这将导致网络流量的利用率十分低下。可以用nagle算法解决发送方的问题。nagle算法要求TCP连接中只能有一个发送未确认的小分组，其他小分组必须等这个小分组被确认后才可以发出去。因此发送方在发送了一个小分组后，会等待一段时间，这段时间应用进程发送的小分组会不断积累成一个大分组，最终在达到MSS时发出。
* 接收方也会引起糊涂窗口综合征。原因是应用进程读取数据的速度比较慢，导致接收缓冲很快就满了，每次应用进程都只读取一个字节的数据，然后接收方就发送一个rwnd=1的确认报文，发送方每次就只能发一个字节过来，然后缓冲区又满了，接收方就又得返回一个rwnd=0的报文让发送方停止发送。clark算法可以解决这个问题，如果接受缓冲剩余空间不足一半，每次收到数据都返回一个零窗口报文，直至接收缓冲空出了一半的空间就返回一个正常的确认报文，让发送方开始发送数据。
>#### [37-tcp协议——糊涂窗口综合征和nagle算法](https://blog.csdn.net/qq_35733751/article/details/80224079?tdsourcetag=s_pcqq_aiomsg)
>#### [38-tcp协议——由接收方引发的糊涂窗口](https://blog.csdn.net/qq_35733751/article/details/80231172)

###### TCP拥塞控制？MSS是什么？有什么作用？
* 拥塞控制机制的目的是为了解决网络拥塞的问题，在网络十分拥塞的情况下，发出的数据报很有可能丢失，如果此时不断重传，只会增加网络堵塞的程度，因此需要一个机制来避免给网络添堵。
* 在讲拥塞控制之前，需要先讲一下滑动窗口和缓冲区图的概念。接收方的接收缓冲区分为3部分，接收已ACK、可接收未ACK、不可接收，通告窗口就是允许接收的数据。发送方的发送缓冲区分4部分，已发送已ACK，已发送未ACK，未发送但可以发送，未发送且不能发送，其发送窗口涵盖了中间2部分的数据。发送窗口也叫做拥塞窗口cwnd，会随着网络拥塞状态进行大小的调整，这就是拥塞控制。  
* 拥塞控制有4种算法，慢开始、拥塞避免、快重传和快恢复。  
* 慢开始的cwnd初始为1，表示一次最多只能发送一个字节，之后每次发送前都会将cwnd增大到之前的2倍，直至ssthresh，也就是慢开始门限，然后转为拥塞避免算法。  
* 此阶段cwnd从ssthresh开始，每次发送前都将cwnd加一，呈线性增长，虽然cwnd可以无限增长，但并不意味着可以一次性发送无限个字节数。发送方一次可发送的最大字节数是受window_size限制的，window_size取的是min(cwnd,rwnd,mss)。  
* 如果接收方接收到了1、2、4、5这几个字节，那么接收方只会对连续字节的最后一个2进行确认，如果仍然没有收到3这个字节，就会连续发送3个相同的ACK包，告知发送方3这个字节丢失了，发送方收到3个相同的ACK包后，就快重传3这个字节，然后进入快恢复阶段。  
* 快恢复阶段会将ssthresh变为当前cwnd的一半，再将cwnd降到ssthresh，此时直接进入拥塞避免。  
* 再讲讲MSS，这是最大报文段长度，在TCP三次握手阶段会交换的一个信息之一，用于告知对方自己这边可以接收的最大TCP报文段长度。这个值是可以自己设定的，一般设为路径上的最小MTU减去IP头和TCP头的长度。比如MTU一般为1500，那么MSS就可以设为1500-20-20=1460。这样设置可以避免在传输过程中被路径上的路由器再次分片，拉低传输效率。

###### 网络层协议
有IP和ICMP。IP协议是用于规范网络层的格式，确保有源IP地址和目的IP地址，声明数据报的长度，以及上层协议。如果使用了ICMP，那么IP头中的协议字段就是ICMP，但这并不意味着ICMP是传输层的协议，因为ICMP报文中并没有端口号字段，它只是一个网络层协议。
ICMP有两种应用，分别是ping和Traceroute。ping用到的是ICMP查询报文，用于探测某个IP是否存在以及能否响应。Traceroute使用的是差错报文，它有2大作用：一是用来追踪一个数据报发送过程途径的所有路由器，这是通过设置特殊的TTL值来实现的，一开始TTL是1，之后依次是2,3,4...，从而获取到每一跳的IP地址。当TTL减为0时，最后一个收到这个报文的的路由器就会向源主机返回一个超时差错报文，这样就可以拿到该路由器的IP地址。第二个作用是确定这条路径的最小MTU（允许通过的最大报文长度），这需要设置不分片位，让路由器返回终点不可达差错报文。

###### 听过冲突域吗？交换机和集线器的冲突域分别是什么？
冲突域就是可能发生冲突的最小单位。交换机的冲突域是单个接口，集线器是所有接口。因为交换机一次只会往一个接口发送数据，而集线器每次都是广播。

###### 比起HTTP1.1，HTTP2.0有什么改进
* Header压缩：收发双方维护一个头信息表，请求一发送所有的头部字段，对方缓存在本地后，之后的请求都只需要发送差异数据，减少冗余数据，降低开销。
* 传输方式：HTTP1.1使用pipeline的方式传输，一次可以按序发送n个请求，然后必须按序收到n条response才能继续发送之后的请求。HTTP2.0使用stream的方式传输，充分利用TCP带宽，可以连续发送很多条请求，可以乱序发乱序收，解决了HTTP1.1的服务端队头阻塞问题。
* 编码格式：HTTP1.1发送的每条报文都是将header和body放在同一个HTTP报文中发送，并且发送的都是文本格式的信息。但是HTTP2.0会将报文信息进行二进制编码，同时会将header和body分为2个二进制帧进行分帧发送，提升效率。
* 资源推送：HTTP1.1在建立HTTP连接后，必须由一方主动发起请求，另一方才会返回其需要的数据。但是HTTP2.0会在建立连接后，由服务端主动推送客户端需要的资源，这叫做Server push。

###### QUIC
* 使用udp作为传输层的协议，在应用层实现可靠传输，解决了TCP的队头阻塞问题。
* 每个数据报都有自己单独的pack id，包括重传的包的id也是不同的，这样可以对ack进行更好的辨别，从而准确计算出rtt，更好的估算rto。
* 缓存上一次tls的秘钥信息，在下次建立连接的时候可以省去非对称加密传输和生成新对称秘钥的过程
。

###### 你了解http吗?http1.0 1.1有什么改进？
* HTTP是一种应用层的协议，用于规范传输应用信息的格式，便于网络信息交互。HTTP报文一般分为请求报文和响应报文。
  * 请求报文一般是客户端向服务端发送的，通过声明方法来确定该请求报文的目的，如GET就是向服务端请求数据，比如请求HTML文件用于呈现网页；POST会在服务端新增对象数据，比如用户在浏览器填写的表单字段；PUT是修改服务器的对象数据；DELETE是删除服务端的对象数据；HEAD是获取报文首部，一般用于检验URL是否有效；Connect是请求建立SSL/TLS安全连接（隧道）。
  * 响应报文是服务端返回给客户端的信息，状态码标明请求的结果状态，如200表示请求成功，一切正常，浏览器可以从实体中拿到需要的HTML/JSON文件；301表示永久性重定向；302表示临时性重定向；304表示该页面目前没有更新，无需返回新的数据；401表示客户端请求需要认证；403表示客户端请求被拒；404表示请求的页面找不到；500表示服务端正在执行请求时发生错误；503表示服务端超负荷或者正在停机维护。
* 相对于HTTP1.0，HTTP1.1做了部分改进。
  1. 引入Cookie：HTTP是无状态的，用于处理大量事务，但是有时候我们往往需要保存一些状态信息以免频繁去请求，因此HTTP1.1引入了Cookie来保存状态信息。Cookie存放在浏览器中，在每次向服务端发送请求时都会携带上Cookie信息，方便验证用户身份与更新状态。
  2. 默认长连接和流水线：HTTP1.0是默认短连接的，意味着浏览器的每次请求都要建立一个TCP连接，而这样一次TCP连接很少能通过slow-start区，不利于提高带宽利用率。因此在HTTP1.1中就改为了默认长连接，在一个TCP连接上可以发送多个请求和响应，减少连接建立和关闭的延迟与消耗。与此同时还增加了流水线机制，客户端不用等待上一个响应返回就可以直接发送下一个请求，极大地提升了下载速度，但是服务器返回的响应还是要按照顺序来，以便客户端能够区分出每条请求的响应内容，因此会导致服务器的队头阻塞问题。
  3. 引入了更多缓存控制策略，如Etag、If-Unmodified-Since等可供选择的缓存头来控制缓存策略。
  4. Header中引入了range策略，可以只请求部分资源，不用将完整的对象数据都发送过来，响应的服务端返回206 Partial Content状态码。
>[HTTP1.0、HTTP1.1 和 HTTP2.0 的区别](https://www.cnblogs.com/heluan/p/8620312.html)

###### tcp和udp有什么区别？
1. TCP支持可靠交付，保证送达；UDP只是尽最大可能交付，不保证送达
2. TCP面向连接，只能一对一通信；UDP不面向连接，支持一对一、一对多、多对多通信。
3. TCP有流量控制和拥塞控制，有效减少丢包和减轻网络拥塞；UDP只会一股脑地把报文发出去，不管对方接不接收得过来，也不管网络是否通畅。
4. TCP面向字节流，每个字节都有自己的序列号，保证数据报的有序性；UDP面向报文，接收和发送都是无序的。
5. TCP的传输过程安全可靠但是效率低，适用于追求绝对完整和安全的场景，如支付；UDP的传输简单高效，适用于追求实时性而不过度追求完整性的场景，如直播。
>拓展
TCP长连接与HTTP长连接

###### 为什么TCP中的初始化序列号要是随机的？
如果初始序列号是固定的，很容易被攻击者猜出后继序列号，并且伪造序列号进行攻击，这已经成为了一种常见的网络攻击手段。鉴于网络安全的问题，初始序列号随机化可以一定程度上减少这种攻击手段成功的概率。

###### 三次握手的时候双方会交换什么数据？
首先是双方发送的TCP报文的序列号，其次是自己的端口号，滑动窗口的大小，最大消息长度等。

###### 对SACK的理解（不常问）
* SACK（选择确认）是TCP首部的一个选项，用于对非连续字段进行确认。如果通信双方都支持SACK，则可以在建立连接的时候设置SACK Permitted=true来打开SACK的选项。
* SACK一般由数据接收方生成，且一般是不携带数据的，只有TCP首部。在TCP首部中的选项中可以看到SACK字段，其中left edge表示左边界，right edge表示右边界。假设确认号=x，左边界=x+100，右边界=x+200，表示的是[x,x+100)内的数据还没有收到，而[x+100,x+200)的数据已经收到了，因此发送方仅需重发[x,x+100)的数据即可。
* SACK解决的是普通确认原则下导致的效率问题。以上面的情况为例，在没有SACK的情况下，[x+100,x+200)的数据会放在接收方缓冲区，然后接收方只会返回ackNum=x的ACK包，发送方收到后只会认为x之后的数据都丢失了，于是重传x之后的所有数据，非常浪费时间，极大降低了传输的效率。而SACK就只需重传丢失的那部分数据即可。
* 由于TCP首部的选项最多只能40字节，SACK字段的一对边界就占了8个字节，4对就32个字节，再加上Kind和Length的2个字节，就只剩下6个字节。这意味着SCAK最多只能告知4个以接收到的数据段。

>参考资料：[TCP-IP详解：SACK选项（Selective Acknowledgment）](https://blog.csdn.net/wdscq1234/article/details/52503315)  
[29-tcp可靠传输——选择确认选项（SACK）](https://blog.csdn.net/qq_35733751/article/details/80157509)

###### TCP连接和释放
* TCP连接建立过程要经过三次握手。假设一个客户端向服务端请求连接，需要经过如下过程：
1. 客户段发送TCP连接请求，即SYN包，其中SYN=1，ACK=0，假设序列号为x，然后客户端进入SYN-SEND状态。
2. 服务端收到SYN包后，确认可以建立连接，就返回一个ACK包，其中ACK=1表示这是一个确认报文，SYN=1表示这同时也是一个连接请求报文。另外，报文中的确认号为x+1，表示希望接收到的下一个报文序号。假设此包序列号为y，然后服务端从LISTEN状态进入SYN-RCVD状态。
3. 客户端收到ACK包后，返回一个对服务端的连接请求的确认报文，进入ESTABLISHED状态。该报文的SYN=0,ACK=1,序号=x+1,确认号=y+1。
4. 服务端接收到ACK报文后，进入ESTABLISHED状态。然后双方开始传输数据。

* TCP连接的释放需要四次挥手。假设客户端已经发送完了所有数据，可以断开连接了，但是服务器还没准备好，此时连接的断开需要经过如下步骤。
1. 客户端发送FIN包，主动请求断开连接，然后进入FIN-WAIT1状态。FIN包中的FIN=1,ACK=0,seqNum=u。
2. 服务端接收到FIN请求后，返回一个ACK，其中FIN=0,ACK=1,seqNum=v,ackNum=u+1，然后进入CLOSE-WAIT状态，此期间会通知应用尽快接收完所有数据。此时TCP连接进入半关闭状态，即只有被动断开连接的一方可以发送数据，另一方只能接收。
3. 服务端准备好后，向客户端发送FIN包请求断开连接，其中FIN=1,ACK=1,seqNum=w,ackNum=u+1，然后进入LAST-ACK状态，等待最后一次确认。
4. 客户端收到FIN包后，返回ACK包表示确认收到断开连接请求，其中FIN=0,ACK=1,seqNum=u+1,ackNum=w+1，然后进入TIME-WAIT状态，等待2MSL后进入CLOSED。
5. 服务端收到ACK后确认可以断开连接了，于是进入CLOSED。
我解释一下在这个过程的最后客户端为什么要等待2MSL再关闭连接。我们知道每个报文在网络中都有一定的生存时间，超过这个时间就会在网络中消失，这个最大报文生存时间叫做MSL。正常情况下报文会在远小于MSL的时间内到达目的地，如果没有到达，说明报文已经不可能到达了，我们此时一般会想要重传。TCP就有这个报文重传机制。当发出去一个需要确认的报文时，如果经过规定的时间T（一般小于2MSL）还没有收到ACK，说明报文有可能丢失了，于是会重新发送这个报文。在第3步服务端发出FIN包后，如果T时间后仍未收到ACK，就会重传这个包，此时客户端要做到就是等到这个重传的包到来，再次发送ACK，保证服务端能够收到ACK并关闭连接，释放端口，避免空等待。如果客户端在2MSL的等待中都没有收到重传的包，大概率是服务端已经收到ACK并正常关闭了，此时客户端便可安心关闭连接了。
>###### 假设说一台电脑上很多端口处于CLOSE_WAIT状态，是发生了什么事呢？
>>说明对应的应用程序出了问题，导致迟迟没有接收数据，因此线程也无法执行CLOSE方法让主机进入LAST-ACK状态。
>###### 如果一台电脑上有很多端口处于TIME-WAIT状态，是发生了什么呢？
>>说明存在很多短连接。

###### IP头TCP头UDP头这些能不能介绍一下？
1. IP头是网络层的东西，固定部分的长度为20字节，其中包含的主要字段有源IP地址、目的IP地址、版本、首部长度、总长度、首部检验和等，我着重介绍一下其中比较有趣的一些字段。
* 标识和片偏移：当数据报过长，超过了一个IP数据报所能容纳的最大长度时，需要进行分片。相同数据报的不同分片具有相同的标识符，片偏移和标识符一起使用，表示当前IP包相对完整数据报首地址的偏移量，片偏移以8个字节为单位。
* 生存时间TTL：这个字段表示可经过的最大路由数，是人为设定的，用于防止不可交付的数据报一直在互联网中兜圈子，以路由器跳数为单位，每经过一个路由器就减一，当TTL减为0时，路由器就会丢弃这个数据报。这字段一般在进行Traceroute的时候使用，用于跟踪从源主机到目的主机的途径的所有路由IP。
* 协议：指出携带的数据要上交给哪个协议去处理，比如ICMP、TCP、UDP。
2. TCP头的固定部分也是20字节，主要字段有源端口、目的端口、序号、确认号、数据偏移、检验和等等，我简要说下其中的部分字段。
* 序号：每个TCP报文都会有一个序列号，用于标识当前TCP报文数据部分的第1个字节在本次TCP连接中的编号，加入当前序号为200，数据部分长度为1字节，那么下一个TCP报文的序号就是201。
* 确认号：当标志ACK为1时有效，表示这是一个确认报文，确认号是期望收到的下一个TCP报文的序号。一般只会对携带数据的、携带SYN的、携带FIN的TCP报文进行确认。
* 数据偏移表示数据部分相对于TCP首地址的偏移量。
* 窗口：是接收方用于告知发送方设置发送窗口的依据，因为接收方的接收缓存有限，发送方需要控制一次性发送的字节数。
* 紧急指针：当URG标志为1时，该字段有效，此时该报文中的数据部分会分为紧急数据和普通数据，紧急指针指向的是紧急数据的最后一个字节，之后的便是普通数据。当主机收到这样的TCP报文，会优先处理其中的紧急数据，尽管它们还没有进入滑动窗口。
* 标志：RST、SYN、ACK、FIN、PSH、URG共6个标志位，每个标志位占用1个bit，其中SYN、ACK、FIN都比较常见，URG在前面紧急指针的介绍中提过，剩下的RST是连接复位标志，收到此包的进程会将回滚到建立TCP连接前的状态。而PSH是用于催促发送方赶紧把缓冲区的数据发送出来或者催促接收方赶紧把缓冲区的数据交给应用。
3. UCP头比较简单，只有8个字节，包括的字段有源端口、目的端口、长度、检验和。除此之外还有一个12字节的伪首部，里面主要是源IP、目的IP、UDP长度这些信息，是用于计算检验和而临时添加的。

###### 谈谈你对TCP中确认原则的理解
TCP最大的特点就是确认原则，解决的是能不能通信的问题。  
有3种报文收到后需要确认：携带数据的、携带SYN的、携带FIN的TCP报文。  
有2种报文是无需确认的：不携带数据的ACK报文、携带RST的报文。  
另外，TCP进行确认的时机也是很有讲究的。由于返回ACK报文也要消耗一部分CPU资源，因此每次都返回ACK的话，开销会增大，CPU处理TCP报文的时间会变长。因此现在一般都是每收到2个报文再返回对后面这个报文的ACK，这叫做*延迟确认**（Delayed ACK）。但是如果第一个报文发来很久都没有收到第二个报文，此时会有一个Delayed ACK定时器（Timer）进行检测，一旦超时，就会赶紧将ACK发出。

###### TCP/IP层的一些专用概念
RTT：报文往返时间。  
RTO(Retransmission Timeout)：最大报文超时重传时间。  
MSL(Maximun Segment Lifetime)：最大报文段寿命，与TTL有关，但MSL更大。  
TTL(Time To Live)：IP数据报可经过的最大路由数。是IP层的概念。

###### TCP头部是怎样的
TCP头部有20个固定字节，里面包含了目的和源端口号，序号、确认号、数据偏移、窗口、检验和、紧急指针、RST、PSH、URG、SYN、FIN、ACK等字段。
* 序号是当前TCP报文中的数据部分的第1个字节在整个字节流中的编号（即第几个字节）。  
* 确认号是期望收到的下一个TCP报文的序列号。  
数据偏移是该TCP报文中数据部分的首地址相对于TCP报文首部的偏移量。  
* 窗口值是接收方让发送方设置其发送窗口的依据，用于告知发送方一次性最多发送几个字节，因为接收方的接收缓存有限，这就是TCP的流量控制。
* 紧急指针：当URG字段为1时有效，指向的是紧急数据的最后一个字节，之后的都是普通数据。
* RST是连接复位字段，让接收到此包的进程回滚到建立TCP连接前的状态。
* PSH字段用于催促接收方尽快将缓冲区的数据交给应用或者催促发送方尽快将缓冲区的数据发送出来。
* URG是紧急字段，用于声明这是一个包含紧急数据的TCP报文，与紧急指针配合使用。
* SYN是同步字段，表明当前正在建立TCP连接。SYN=1,ACK=0时表明这是一个连接请求报文。
* ACK是确认字段，为1时表明这是一个确认包，确认已经收到了对方发来的TCP报文，与确认号配合使用。
* FIN是结束字段，为1时表明要请求关闭连接。

###### TCP的头部除了SYN、ACK外，还有哪些标记位？它们都有哪些作用
* RST(连接复位)字段  
RST为1时，接收到RST包的一方将回退到建立TCP连接之前的状态。
1. SYN被发给了一个不处于listen状态的端口。
>此时OS发现监听这个端口的进程尚未处于listen状态，于是返回一个RST包。
2. 发送的SYN超时后又收到了ACK。
>此时OS拆开ACK包，发现本机上对应端口的进程已经关闭连接，于是返回一个RST包。
3. 宕机重启后收到了上一次TCP连接中传过来的信息。
>此时该TCP连接处于半开启状态，即一方意外中断，另一方仍然保持连接。OS发现找不到对应的进程来处理这些信息，就当是对方发错了，于是返回一个RST包。
4. 国家防火墙监控流量时发现有进程尝试进行非法连接。
>此时防火墙会伪造RST包发给正在建立连接的两台主机。

* PSH字段  
1. 当数据接收方发PSH给发送方时，意在催促发送方赶紧把包发过来，不要老放在缓冲区里。  
2. 当数据发送方发PSH给接收方时，旨在催促接收方赶紧把数据交给应用层，不要老放在缓冲区。

* URG字段  
URG字段表明一个报文是否是紧急（urgent）报文。  
URG为1时，紧急指针有效，指向的是紧急数据的最后一个字节，该字节之后的数据都是普通数据。  
接收方收到这个TCP报文后放在缓冲区中，即使没有进入滑动窗口（或者窗口大小为0），也会预先处理这个TCP报文中的紧急数据。

###### HTTPS加密了什么内容
HTTPS就是加了一层TLS的HTTP。而TLS是属于会话层的协议，介于应用层和传输层之间，TLS和HTTP协议共同为用户提供安全的访问网页的服务。  
HTTPS实际加密的只有HTTP头和内容，数据的发送方和接收方在建立TLS安全连接的时候交换的对称秘钥可以解开，任何没有秘钥的第三方都无法获取其中的明文，但是仍然可以获取TLS、端口、IP等的内容。

###### 邮件传输安全吗？
用户登录时通过HTTPS交换了相关的Session ID、Access Token、对称秘钥等私密信息。发送方使用SMTP协议进行邮件的安全发送，使用TLS对邮件内容加密后发送给服务器。服务器使用POP3/IMAP安全接收邮件，使用TLS解密获取明文。
但是邮件传输有一个致命的弱点，如果建立TLS连接总是失败，那么就会退而求其次，直接明文传输。HK就可以利用这一缺陷，从中作梗，人为的让双方连接过程中不停丢包，失败了一定次数后就会使用明文传输，这样HK就可以窃取邮件内容。所以并不安全。

###### 网关、路由器、三层交换机之间的区别在哪？
* 网关只是一个抽象概念，具体可以通过路由器、三层交换机、三层防火墙来实现，它们都是三层接力设备，可以处理IP报文头，主要用于转发跨网段的数据包。
* 路由器和三层交换机都是用来连接不同的网段，做一些数据包转发的工作。不同点在于硬件架构不同，三层交换机优化转发效率，而路由器的接口更丰富。

>* 网桥：二层交换机，是二层接力设备，也可以完成信号的转发，但是只能处理二层的以太帧头。
* 集线器/信号放大器：是一层接力设备，也能转发信号，但是只能处理物理信号，无法理解信号内容。

###### DNS原理？
当我们在浏览器输入一个URL并回车的时候，就会发生DNS，即域名解析，将URL映射到一个IP地址，拿到IP地址后才能发送HTTP/HTTPS请求。首先会查询浏览器的缓存，如果没有，就去本地hosts和DNS缓存中查找，如果依旧没有，就去路由器的缓存中找，还是没有的话，就将请求发送给ISP DNS服务器，首先也是去本地缓存找，没有的话就只能向根域名服务器发送DNS请求，根域名服务器收到后会返回对应的顶级域名服务器的IP地址，本地DNS服务器再发请求给顶级域名服务器，顶级域名服务器会返回权威域名服务器的IP地址，本地DNS服务器接着去权威域名服务器找，如果权威域名服务器找到了这个URL对应的IP，就返回给本地DNS服务器。
这时DNS服务器将这个URL到IP地址的映射放入自己的缓存中，然后返回给路由器，路由器存入缓存后发给主机，主机存在DNS缓存中再交给浏览器，这时浏览器拿到了这个IP地址后，就可以发送真正的HTTP请求了。

###### 浏览器输入完url按下回车开始到返回页面的过程
假设使用的是HTTP协议。
1. 浏览器先查询本地host，如果没有匹配的URL，就向DNS服务器发送查询请求，本地域名服务器向根域名服务器查询一般使用迭代查询。浏览器收到正常回复后即拿到对应的IP地址。
2. 浏览器生成一个HTTP请求报文，交由OS的传输层，将这份HTTP请求拆分成字节流，套上TCP头，交给网络层。
3. 网络层对收到的TCP数据流进行分组，生成IP包，交给链路层。
4. 如果IP属于外网，会将MAC地址设置成路由器的MAC；如果是内网IP，就查询本地ARP缓存，如果没有记录，就向路由器发送ARP请求，取得对应机器的MAC地址。这里假设IP属于外网。
5. 链路层给IP包套上MAC头，然后将生成的MAC帧交给物理层。
6. OS将完整的帧发送出去，路由器收到后，根据IP层的目标IP地址，加上下一跳的MAC地址，进行相应的转发。
7. 经过若干次转发后，到达目标局域网的路由器（即最后一跳）。路由器取下IP头，发现这个包是发给自己管辖的局域网内的主机，没有下一跳了，于是进行ARP，获得目标主机的MAC地址后，发送到自己的局域网下。
8. 目标主机收到了这个包，接收过程是发送过程的逆过程，最终这个HTTP请求报文会被交给监听对应端口的进程去处理。
9. 进程处理好后，会生成一个HTTP响应报文，经过同样的过程，层层封装好后发给我们的浏览器。
10. 浏览器收到HTTP响应报文后，取出其中的html内容，然后就可以展示这个完整的网页了。
[Linux系统下搭建DNS服务器——DNS原理总结](https://zhuanlan.zhihu.com/p/31568450)
