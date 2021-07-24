# 概述
# copy方法
## [].clone()
注意这个只能对基本类型的数组使用


## Arrays.copyOf(int[] original, int newLength)
底层调用System.arraycopy()


## System.arraycopy(Object src, int srcPos, Object dest, int destPos, int length)
推荐使用，速度最快，使用了native方法


## for
