# SQLAlchemy之Column常用参数

1. primary_key：True设置某个字段为主键。
2. autoincrement：True设置这个字段为自动增长的。
3. default：设置某个字段的默认值。在发表时间这些字段上面经常用。
4. nullable：指定某个字段是否为空。默认值是True，就是可以为空。
5. unique：指定某个字段的值是否唯一。默认是False。
6. onupdate：在数据更新的时候会调用这个参数指定的值或者函数。在第一次插入这条数据的时候，不会用onupdate的值，只会使用default的值。常用于是update_time字段（每次更新数据的时候都要更新该字段值）。
7. name：指定ORM模型中某个属性映射到表中的字段名。如果不指定，那么会使用这个属性的名字来作为字段名。如果指定了，就会使用指定的这个值作为表字段名。这个参数也可以当作位置参数，在第1个参数来指定。
8. comment：为列添加注释

```python
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class ModuleConfig(db.Model):
    """模块配置表"""
    __tablename__ = 't_module_config'
    __table_args__ = {'mysql_charset': 'utf8'}
    id = db.Column('Fid', db.Integer, primary_key=True, comment='自增主键')
    name = db.Column('Fname', db.String(32), nullable=False, unique=True, index=True, comment='模块名')
    config = db.Column('Fconfig', db.JSON, nullable=False, default={}, comment='勾选专区项')
```

# 创建联合唯一索引

```python
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class RiskInfo(db.Model):
    """风险记录表"""
    __tablename__ = 't_risk_info'
    __table_args__ = (db.UniqueConstraint('Frun_id', 'Ftool_id', 'Frisk_id', name="idx_risk_id_run_tool"),
                      {'mysql_charset': 'utf8'})
    id = db.Column('Fid', db.BigInteger, primary_key=True, comment='风险id')
    run_id = db.Column('Frun_id', db.BigInteger, nullable=False, index=True, comment='执行id')
    tool_id = db.Column('Ftool_id', db.Integer, nullable=False, index=True, comment='工具id')
    risk_id = db.Column('Frisk_id', db.String(256), nullable=False, index=True, comment='工具上报的风险id')
    risk_name = db.Column('Frisk_name', db.String(256), default='', index=True, comment='风险名称')
```

如上，在\_\_table_args\_\_中加入db.UniqueConstraint('Frun_id', 'Ftool_id', 'Frisk_id', name="idx_Frun_id_Ftool_id_Frisk_id")即可。

最终生成的建表语句为

```sql
CREATE TABLE `t_risk_info` (
  `Fid` bigint NOT NULL AUTO_INCREMENT COMMENT '风险id',
  `Frun_id` bigint NOT NULL COMMENT '执行id',
  `Ftool_id` int NOT NULL COMMENT '工具id',
  `Frisk_id` varchar(256) DEFAULT NULL COMMENT '工具上报的风险id',
  `Frisk_name` varchar(256) DEFAULT NULL COMMENT '风险名称',
  PRIMARY KEY (`Fid`),
  UNIQUE KEY `idx_risk_id_run_tool` (`Frun_id`,`Ftool_id`,`Frisk_id`),
  KEY `ix_t_risk_info_Frisk_id` (`Frisk_id`),
  KEY `ix_t_risk_info_Frisk_name` (`Frisk_name`),
  KEY `ix_t_risk_info_Frun_id` (`Frun_id`),
  KEY `ix_t_risk_info_Ftool_id` (`Ftool_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
```

