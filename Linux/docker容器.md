# 常用docker命令

```bash
docker system df -v  #显示所有docker及images的磁盘占用情况
docker ps   # 查看正在运行中的容器
docker ps -a  # 查看所有容器
docker exec -it [CONTAINER ID]  /bin/bash  # 指定容器id进入容器
docker stop <NAMES>  #停止container
docker rm <NAMES>  #删除container
docker images  #查看当前有些什么images
docker rmi <image id>  #删除images，通过image的id来指定删除谁
```

> [Docker运维笔记-Docker端口映射](https://blog.csdn.net/qq_29994609/article/details/51730640?utm_medium=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromBaidu-1.control&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromBaidu-1.control)
>
> [Docker容器进入的4种方式](https://blog.csdn.net/qq_32907195/article/details/120144748)

# Kubernetes - 容器集群管理系统
> [K8s简介之什么是K8s](https://baijiahao.baidu.com/s?id=1730956371994388279&wfr=spider&for=pc)
> 