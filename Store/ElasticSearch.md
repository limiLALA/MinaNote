> 参考资料
>
> [Elasticsearch入门教程](https://www.bootwiki/elasticsearch/elasticsearch-getting-start.html)
>
> [arrays – 使用elasticsearch匹配嵌套数组中的所有值](https://www.qedev.com/bigdata/188389.html)
>
> [elasticsearch_script_01](https://blog.csdn.net/u013200380/article/details/109136277)
>
> [Elasticsearch--constant_score](https://blog.csdn.net/u014431852/article/details/52802747)
>
> 

# ES和MySQL

ES的最大优势在于存储的数据类型、个数能够动态扩展，但是读写效率较差，且新增/更新数据后无法立即查出

如果读多写多，数据量大，并发量高，数据类型较固定的情况下，优先使用MySQL

# 搜索

请求正文是一个JSON对象，除了其它属性以外，它还要包含一个名称为“`query`”的属性，这就可使用ElasticSearch的查询DSL。

查询DSL是ElasticSearch自己基于JSON的域特定语言，可以在其中表达查询和过滤器。想象ElasticSearch它像关系数据库的SQL。

## 指定搜索的字段-查询单个字段

```bash
curl -XPOST "http://localhost:9200/_search" -d'
{
    "query": {
        "query_string": {
            "query": "ford",
            "fields": ["title"]
        }
    }
}'
```

## 多字段查询

### 使用过滤器限制查询字符串查询的结果

```bash
curl -XPOST "http://localhost:9200/_search" -d'
{
    "query": {
        "filtered": {
            "query": {
                "query_string": {
                    "query": "drama"
                }
            },
            "filter": {
                "term": { "year": 1962 }
            }
        }
    }
}'
```

### 无需查询即可进行过滤

#### `match_all`查询

```bash
curl -XPOST "http://localhost:9200/_search" -d'
{
    "query": {
        "filtered": {
            "query": {
                "match_all": {
                }
            },
            "filter": {
                "term": { "year": 1962 }
            }
        }
    }
}'
```

#### 常数分数查询

```bash
curl -XPOST "http://localhost:9200/_search" -d'
{
    "query": {
        "constant_score": {
            "filter": {
                "term": { "year": 1962 }
            }
        }
    }
}'
```

term是精确查询

match是模糊查询