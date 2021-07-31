## GPM分别是什么
G: 表示Goroutine，每个Goroutine对应一个G结构体
G存储Goroutine的运行堆栈、状态以及任务函数，可重用。
G运行队列是一个栈结构，分全局队列和P绑定的局部队列
G需要绑定到P才能被调度执行

P: 表示Processor，对于G而言，P可以看作是调度者。
对M来说，P提供了相关的执行环境(Context)，如内存分配状态(mcache)，任务队列(G)等，P的数量决定了系统内最大可并行的G的数量
M需要绑定了具体的P，才可以执行
P会维护一个局部的G的队列

M: Machine，系统物理线程，代表着真正执行计算的资源，在绑定有效的P后，进入schedule循环；而schedule循环的机制大致是从Global队列、P的Local队列以及wait队列中获取G，切换到G的执行栈上并执行G的函数

## GPM的调度
用户创建出一个G之后，会优先加入某一个P维护的局部队列
如果都满了才会加入到全局队列

## 初始化
从runtime.main执行入口开始
一开始会初始化g0和m0，由m0执行g0
生成 gomaxprocs 个 p，每一个p都会有自己的local G 队列
同时全局也有一个G 队列，保存在runtime.schedt中
创建完所有的p之后，会把 allp【0】和m0关联起来
初始化完毕之后，m0就会调用sched函数开始调度

## gopark
例如使用time.sleep，就会将当前协程的状态从Grunning改成Gwaiting
然后m会将当前的G放入timer中进行等待，同时调用sched
超时时间到之后，G会被设置为Grunnable，放入p的本地队列中
