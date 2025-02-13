# etcd v3 api怎么用curl调用

版本：etcd-v3.4.13

## 背景

etcd v2使用的是http方式访问，升级到v3后，改为使用gRPC协议，但是不是所有用户都支持gRPC的，所以官方提供了一个gRPC-gateway，用来将http请求转化为gRPC请求，这样用户就能照常使用RESTful API了。

要使用v2 api，需要在--config-file选项指定的配置文件(如etcd.yaml)中设置`enable-v2: true`，然后就可以使用下面的命令读取数据了

```bash
curl http://127.0.0.1:2379/v2/keys/message
```

官方目前已经推出v3 api供用户选择，但是默认是无法直接访问的，需要先开启grpc-gateway，具体见下文。

## 启动grpc-gateway

如果使用--config-file选项，通过配置文件的方式启动，默认`enable-grpc-gateway: false`是不会启动gRPC网关的，需要手动在etcd.yaml配置文件中增加`enable-grpc-gateway: true`才能启动，进而使用v3的RESTful API。

## 使用v3 api

不同于v2直接通过api_url传递key，v3 api是通过http请求体传输key以及其他条件的，选择更加灵活，具体参数可参考 [etcd-v3.4.13开源代码rpc.proto参数定义](https://github.com/etcd-io/etcd/blob/v3.4.13/etcdserver/etcdserverpb/rpc.proto) 中的RangeRequest定义。下面演示如何使用curl调用v3 api

### 查询用户token

token是通过`/v3/auth/authenticate`接口查到的，需要传入etcd用户名和密码进行查询

```bash
curl -L http://x.135.98.185:12379/v3/auth/authenticate -X POST -d '{"name": "root", "password": "xxxx"}'
```

返回

```json
{"header":{"cluster_id":"2176561342250856149","member_id":"7413949902884206088","revision":"28483441","raft_term":"5"},"token":"nvMoxpdhADYBlCFI.173484"}
```

注意：token是会定期自动更新的，过期就会失效

### 查询指定key的value

下面的示例中，`-H 'Authorization: nvMoxpdhADYBlCFI.173484'`就是第一步查到的token，而key对应的字符串是要求先进行base64加密后再进行传输的，这里`L2hlYWx0aC1hcGlzZXJ2ZXIvbWV0cmljLWNvbnRyb2xsZXIvbWFzdGVy`的原型为`/health-apiserver/metric-controller/master`

```bash
curl -s -H 'Authorization: nvMoxpdhADYBlCFI.173484' -L http://9.135.98.185:12379/v3/kv/range -XPOST -d '{"key": "L2hlYWx0aC1hcGlzZXJ2ZXIvbWV0cmljLWNvbnRyb2xsZXIvbWFzdGVy"}'
```

返回

```json
{"header":{"cluster_id":"2176561342250856149","member_id":"7413949902884206088","revision":"28483441","raft_term":"5"},"kvs":[{"key":"L2hlYWx0aC1hcGlzZXJ2ZXIvbWV0cmljLWNvbnRyb2xsZXIvbWFzdGVy","create_revision":"28483364","mod_revision":"28483364","version":"1","value":"OS4xMzUuOTYuMjc=","lease":"1278613404651580776"}],"count":"1"}
```

其中value也是base64加密的，需要自行解密

> 参考资料：
>
> [etcd API-V2](https://www.jianshu.com/p/95f33e991aa7)
>
> etcd-v3.4官方文档：[Why gRPC gateway](https://etcd.io/docs/v3.4/dev-guide/api_grpc_gateway/)
>
> [etcd-v3.4.13开源代码rpc.proto参数定义](https://github.com/etcd-io/etcd/blob/v3.4.13/etcdserver/etcdserverpb/rpc.proto)

