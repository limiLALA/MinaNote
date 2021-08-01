## io有哪几种
同步阻塞，最简单的
同步非阻塞，轮询呗
io复用
异步非阻塞

## io复用有哪几种
1.select
需要将待watch的fd序列拷贝到内核中，然后等到其中有处于ready的状态的时候
拷贝回用户空间，还需要轮询处理
一次只能处理1024个
2.poll
和select相比使用链表存fd，其他无太大区别

3.epoll
epoll create的时候，使用mmap的方式在内核中开辟红黑树
之后往里边填入需要watch的fd只需要一次拷贝
fd ready的时候，通过回调函数挂到ready队列上，之后处理只需要处理ready队列即可

## lt和et
lt是水平触发，调用epoll wait函数之后如果有处于ready的fd不处理，下次epoll wait还可以处理
et是边沿触发，第一次不处理后面就不会看到了
