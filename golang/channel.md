## channel 是什么
channel是CSP模型中的一个概念，用来给P也就是process之间交互数据。
golang中channel可以看作是一个匿名消息队列，通过不同的使用方法可以实现同步或者异步。

## channel 有什么作用
如同消息队列一样，解耦，削峰，异步化
比如kafka的producer在发送消息时，底层其实依然走的是异步batch发送，然后通过channel阻塞获取返回值的形式，实现同步化。这一个点和java里边的future有点像。
