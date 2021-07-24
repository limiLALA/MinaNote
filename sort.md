# java 自带 sort 方法
## Arrays.sort()

## Collections.sort()
>事实上Collections.sort方法底层就是调用的array.sort方法

## TimSort
>不论是Collections.sort方法或者是Arrays.sort方法，底层实现都是TimSort实现的，这是jdk1.7新增的以前是归并排序。
TimSort算法就是找到已经排好序数据的子序列，然后对剩余部分排序，然后合并起来
