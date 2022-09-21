# 方法一：socket.gethostname()

通常使用socket.gethostname()方法即可获取本机IP地址，但有时候获取不到（比如没有正确设置主机名称）

```python
import socket
 
#获取计算机名称
hostname=socket.gethostname()
#获取本机IP
ip=socket.gethostbyname(hostname)
print(ip)
```

# 方法二：socket之getsockname

本方法在windows和linux系统下均可正确获取ip地址

```python
import socket
 
def get_host_ip():
    """
    查询本机ip地址
    :return:
    """
    try:
        s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
        s.connect(('8.8.8.8',80))
        ip=s.getsockname()[0]
    finally:
        s.close()
    return ip
 
 
if __name__ == '__main__':
    print(get_host_ip())
```

# 方法三：使用第三方netifaces库

获取的是**局域网IP**。

```python
from netifaces import interfaces, ifaddresses, AF_INET
for ifaceName in interfaces():
    addresses = [i['addr'] for i in ifaddresses(ifaceName).setdefault(AF_INET, [{'addr':'No IP addr'}] )]
    print(' '.join(addresses))
```

注意：如果是在测试用例中获取远程主机的IP地址，需要将上述任一脚本放在远程主机上，然后SSH连接远程主机，执行python3命令+对应py脚本，用例中的实现如下，这里省略SSH连接的代码

```python
def get_local_ip():
    # 远程执行python脚本获取远程机器IP
    cmd = "python3 -m pip install netifaces"
    _ = exec_cmd(cmd)['outlines']
    cmd = "python3 /data/get_local_ip.py"
    out_ip_str = exec_cmd(cmd)['outlines']
    ip = out_ip_str.strip("[\"").split("\n")[0].strip()
    return ip
```


> 参考资料：
>
> [python3获取本机IP地址](https://blog.csdn.net/n_fly/article/details/119250342)
>
> [Python3获取本机IP地址的几种方式](https://blog.csdn.net/n_fly/article/details/119250342)
>
> [一文带你了解Python Socket 编程](https://zhuanlan.zhihu.com/p/481539075)
>
> [python2实现ioctl&SIOCGIFCONF获取IP并发送到邮箱](http://www.vevb.com/wen/2020/01-04/621484.html)
>
> [C++：ioctl&SIOCGIFCONF提取IP和MAC](https://blog.csdn.net/hq181msn/article/details/45482561)