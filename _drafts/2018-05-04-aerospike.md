---
layout: post
title: "aerospike的安装与使用"
tags: [aerospike, 大数据, 数据库]
---
### 介绍
优势: 
- 快速——我们不仅快速, 而且始终保持快速
- 可靠——没有中断、没有停机、没有数据损失
<!--excerpt-->

### 下载
```shell
wget -O aerospike.tgz 'https://www.aerospike.com/download/server/latest/artifact/el6'
```
### 系统需求(已测试机器)
- CentOS 6 (RHEL 6)
- Debian 6 and 7
- Ubuntu 12.04

### 软件需求
	64-bit Linux
	2 GB of RAM
部署计划
	1. 估计数据的大小。
		注: 单个设备和文件的限制是不大于2 TiB的。
	2. 确定存储类型。
		In memory (without persistence)
		In memory (with persistence; data is backed up on disk)
		On flash (SSD) storage (with indexes in memory)
		注: 一旦配置, 无法在不丢失数据的情况下更改它。
	3. 确定名称空间的数量。
		名称空间: 大致相当于RDBMS中的数据库
		不同命名空间 可存储在不同存储介质中
	4. 容量规划
		数据存储要求
			建议replication factor = 2
			每条记录被存储为 512 bytes 的倍数
			集群所需的总存储:
				(size per record as calculated above) x (Number of records) x (replication factor)
		内存要求
			索引总是存储在RAM中。主索引和二级索引必须有足够的RAM。
			不要查过内存的50%,理论上可100% 但还要有系统的运行和其他操作的内存
			主索引
				64 bytes × (replication factor) × (number of records)
			二级索引
		
	5. 服务器硬件
	
	6. 闪存
	
	7. 网络
	

安装
	tar zxvf aerospike-3.5.9.tgz
	cd aerospike
	sudo ./asinstall
服务
	service aerospike start # 启动
	service aerospike restart # 重启
	service aerospike stop # 停止
	service aerospike status # 查看状态
基本概念
	Namespaces # AS数据存储的最高层级, 类比于传统的数据库的库层级, 一个namespace包含记录(records), 索引(indexes ) 及策略(policies)。

	其中策略决定namespace的行为, 包括: 
		1.数据的存储位置是内存还是SSD。
		2.一条记录存储的副本个数。
		3.过期时间(TTL): 不同redis的针对key设置TTL, AS可以在库的层级进行全局设置, 并且支持对于已存在的数据进行TTL的设置, 方便了使用。
	Set # 存储于namespace, 是一个逻辑分区, 类比于传统数据库的表。set的存储策略继承自namespace, 也可以为set设置单独的存储策略
	Records # 类比于传统数据库的行, 包含key, Bins(value), 和Metadata(元数据)。 key全局唯一, 作为K-V数据库一般也是通过key去查询。 Bins相当于列, 存储具体的数据。 元数据存储一些基本信息, 例如TTL等。
	Key # 提到key, 有一个和key伴生的概念是摘要(Digests), 当key被存入数据库, key与set信息一起被哈希化成一个160位的摘要。 数据库中, 摘要为所有操作定位记录。 key主要用于应用程序访问, 而摘要主要用于数据库内部查找记录.
	Metadata # 每一条记录包含以下几条元数据
		1.generation(代): 表示记录被修改的次数。 该数字在程序度数据时返回, 用来确认正在写入的数据从最后一次读开始未被修改过。
		2.time-to-live(TTL): AS会自动根据记录的TTL使其过期。 每次在对象上执行写操作TTL就会增加。 3.10.1版本以上, 可以通过设置策略, 使更新记录时不刷新TTL。
		3.last-update-time (LUT): 上次更新时间, 这是一个数据库内部的元数据, 不会返回给客户端。
	Bins # 在一条记录里, 数据被存储在一个或多个bins里, bins由名称和值组成。 bins不需要指定数据类型, 数据类型有bins中的值决定。 动态的数据类型提供了很好的灵活性。 AS中每条记录可以由完全不同的bins组成。 记录无模式, 你可以记录的任何生命周期增加或删除bins。
		在一个库中bins的名称最多包含32k, 这是由内部字符串优化所致。 (相比于HBase支持几百万列还是有一定差距, 如果想直接将HBase表迁移到AS可能需要重新设计存储结构)

配置文件
	vim /etc/aerospike/aerospike.conf
	network {
        ...
        heartbeat {
                mode multicast
                multicast-group 239.1.99.222
                port 9918

                # To use unicast-mesh heartbeats, remove the 3 lines above, and see
                # aerospike_mesh.conf for alternative.

                interval 150
                timeout 10
        }
		...
	}
	其中multicast表示在同一网段中广播, 所有使用相同address和port的Aerospike会自动组合成集群。 但在Aerospike集群中, 如果namespace名称相同, 配置不同则会报错。 解决方法可以把IP地址换成其他的, 如139.1.99.222。
命令
	asmonitor # 
		info # 查看Aerospike集群信息
	asadm # 管理员
		net # 查看集群节点情况
	aql
		-V, --version        打印AQL版本信息。
		-O, --options        打印命令行选项的信息。
		-E, --help           打印命令行选项消息和AQL命令文档。
		-c, --command <cmd>  执行指定的命令。
		-f, --file <path>    执行指定的文件中的命令。
		-e, --echo           启用命令回应。
		-v, --verbose        启用详细输出。
		[cluster]
			-h HOST, --host=HOST
			-p PORT, --port=PORT Server default port. Default: 3000
			-U USER, --user=USER User name used to authenticate with cluster. Default: none
			-P, --password Password used to authenticate with cluster. Default: none User will be prompted on command line if -P specified and no password is given.
		DDL
			CREATE INDEX <index> ON <ns>[.<set>] (<bin>) NUMERIC|STRING|GEO2DSPHERE
			CREATE LIST/MAPKEYS/MAPVALUES INDEX <index> ON <ns>[.<set>] (<bin>) NUMERIC|STRING|GEO2DSPHERE
			DROP INDEX <ns>[.<set>] <index>
			Examples:
				CREATE INDEX idx_foo ON test.demo (foo) NUMERIC
				DROP INDEX test.demo idx_foo
		USER ADMINISTRATION
			CREATE USER <user> PASSWORD <password> ROLE[S] <role1>,<role2>...
			pre-defined roles: read|read-write|read-write-udf|sys-admin|user-admin
			DROP USER <user>
			SET PASSWORD <password> [FOR <user>]
			GRANT ROLE[S] <role1>,<role2>... TO <user>
			REVOKE ROLE[S] <role1>,<role2>... FROM <user>
			CREATE ROLE <role> PRIVILEGE[S] <priv1[.ns1[.set1]]>,<priv2[.ns2[.set2]]>...
				priv: read|read-write|read-write-udf|sys-admin|user-admin|data-admin
				ns:   namespace.  Applies to all namespaces if not set.
				set:  set name.  Applie to all sets within namespace if not set. sys-admin, user-admin and data-admin can't be qualified with namespace or set.
			DROP ROLE <role>
			GRANT PRIVILEGE[S] <priv1[.ns1[.set1]]>,<priv2[.ns2[.set2]]>... TO <role>
			REVOKE PRIVILEGE[S] <priv1[.ns1[.set1]]>,<priv2[.ns2[.set2]]>... FROM <role>
		DML
			INSERT INTO <ns>[.<set>] (PK, <bins>) VALUES (<key>, <values>)
			DELETE FROM <ns>[.<set>] WHERE PK = <key>
			TRUNCATE <ns>[.<set>] [upto <LUT>] 
				<ns> is the namespace for the record.
				<set> is the set name for the record.
				<key> is the record's primary key.
				<bins> is a comma-separated list of bin names.
				<values> is comma-separated list of bin values, which may include type cast expressions. Set to NULL (case insensitive & w/o quotes) to delete the bin.
				<LUT> is last update time upto which set or namespace needs to be truncated. LUT is either nanosecond since Unix epoch like 1513687224599000000 or in date string in format like "Dec 19 2017 12:40:00".
			Type Cast Expression Formats:
			CAST(<Value> AS <TypeName>)
				<TypeName>(<Value>)
			Supported AQL Types:
			Bin Value Type                    Equivalent Type Name(s)
			===============================================================
			Integer                           DECIMAL, INT, NUMERIC
			Floating Point                    FLOAT, REAL
			Aerospike CDT (List, Map, etc.)   JSON
			Aerospike List                    LIST
			Aerospike Map                     MAP
			GeoJSON                           GEOJSON
			String                            CHAR, STRING, TEXT, VARCHAR
			===============================================================
			[Note:  Type names and keywords are case insensitive.]
			Examples:
				INSERT INTO test.demo (PK, foo, bar) VALUES ('key1', 123, 'abc')
				INSERT INTO test.demo (PK, foo, bar) VALUES ('key1', CAST('123' AS INT), JSON('{"a": 1.2, "b": [1, 2, 3]}'))
				INSERT INTO test.demo (PK, foo, bar) VALUES ('key1', LIST('[1, 2, 3]'), MAP('{"a": 1, "b": 2}'))
				INSERT INTO test.demo (PK, gj) VALUES ('key1', GEOJSON('{"type": "Point", "coordinates": [123.4, -456.7]}'))
				DELETE FROM test.demo WHERE PK = 'key1'
      
		INVOKING UDFS
			EXECUTE <module>.<function>(<args>) ON <ns>[.<set>]
			EXECUTE <module>.<function>(<args>) ON <ns>[.<set>] WHERE PK = <key>
			EXECUTE <module>.<function>(<args>) ON <ns>[.<set>] WHERE <bin> = <value>
			EXECUTE <module>.<function>(<args>) ON <ns>[.<set>] WHERE <bin> BETWEEN <lower> AND <upper>
      
			<module> is UDF module containing the function to invoke.
			<function> is UDF to invoke.
			<args> is a comma-separated list of argument values for the UDF.
			<ns> is the namespace for the records to be queried.
			<set> is the set name for the record to be queried.
			<key> is the record's primary key.
			<bin> is the name of a bin.
			<value> is the value of a bin.
			<lower> is the lower bound for a numeric range query.
			<upper> is the lower bound for a numeric range query.
		Examples:
			EXECUTE myudfs.udf1(2) ON test.demo
			EXECUTE myudfs.udf1(2) ON test.demo WHERE PK = 'key1'
      
  OPERATE
      OPERATE <op(<bin>, params...)>[with_policy(<map policy>),] [<op(<bin>, params...)> with_policy (<map policy>) ...] ON <ns>[.<set>] where PK=<key>
      
          <op> name of operation to perform.
          <bin> is the name of a bin.
          <params> parameters for operation.
          <map policy> map operation policy.
          <ns> is the namespace for the records to be queried.
          <set> is the set name for the record to be queried.
          <key> is the record's primary key.
      
      OP
          LIST_APPEND (<bin>, <val>)         
          LIST_INSERT (<bin>, <index>, <val>)
          LIST_SET    (<bin>, <index>, <val>)
          LIST_GET    (<bin>, <index>)       
          LIST_POP    (<bin>, <index>)       
          LIST_REMOVE (<bin>, <index>)       
          LIST_APPEND_ITEMS (<bin>, <list of vals>)         
          LIST_INSERT_ITEMS (<bin>, <index>, <list of vals>)
          LIST_GET_RANGE    (<bin>, <startindex>[, <count>])
          LIST_POP_RANGE    (<bin>, <startindex>[, <count>])
          LIST_REMOVE_RANGE (<bin>, <startindex>[, <count>])
          LIST_TRIM         (<bin>, <startindex>[, <count>])
          LIST_INCREMENT    (<bin>, <index>, <numeric val>) 
          LIST_CLEAR        (<bin>) 
          LIST_SIZE         (<bin>) 
          MAP_PUT             (<bin>, <key>, <val>) [with_policy (<map policy>)]
          MAP_PUT_ITEMS       (<bin>, <map>)  [with_policy (<map policy>)]
          MAP_INCREMENT       (<bin>, <key>, <numeric val>) [with_policy (<map policy>)]
          MAP_DECREMENT       (<bin>, <key>, <numeric val>) [with_policy (<map policy>)]
          MAP_GET_BY_KEY      (<bin>, <key>)  
          MAP_REMOVE_BY_KEY   (<bin>, <key>)  
          MAP_GET_BY_VALUE    (<bin>, <value>)
          MAP_REMOVE_BY_VALUE (<bin>, <value>)
          MAP_GET_BY_INDEX    (<bin>, <index>)
          MAP_REMOVE_BY_INDEX (<bin>, <index>)
          MAP_GET_BY_RANK     (<bin>, <rank>) 
          MAP_REMOVE_BY_RANK  (<bin>, <rank>) 
          MAP_REMOVE_BY_KEY_LIST    (<bin>, <list of keys>)         
          MAP_REMOVE_BY_VALUE_LIST  (<bin>, <list of vals>)         
          MAP_GET_BY_KEY_RANGE      (<bin>, <startkey>, <endkey>)   
          MAP_REMOVEBY_RANGE        (<bin>, <startkey>, <endkey>)   
          MAP_GET_BY_VALUE_RANGE    (<bin>, <startval>, <endval>)   
          MAP_REMOVE_BY_VALUE_RANGE (<bin>, <startval>, <endval>)   
          MAP_GET_BY_INDEX_RANGE    (<bin>, <startindex>[, <count>])
          MAP_REMOVE_BY_INDEX_RANGE (<bin>, <startindex>[, <count>])
          MAP_GET_BY_RANK_RANGE     (<bin>, <startrank> [, <count>])
          MAP_REMOVE_BY_RANK_RANGE  (<bin>, <startrank> [, <count>])
          MAP_CLEAR     (<bin>) 
          MAP_SET_TYPE  (<bin>, <map type>) 
          MAP_SIZE      (<bin>) 
          TOUCH   ()            
          READ    (<bin>)       
          WRITE   (<bin>, <val>)
          PREPEND (<bin>, <val>)
          APPEND  (<bin>, <val>)
          INCR    (<bin>, <numeric val>)
      
      Examples:
      
          OPERATE LIST_APPEND(listbin, 1), LIST_APPEND(listbin2, 10) ON test.demo where PK = 'key1'
          OPERATE LIST_POP_RANGE(listbin, 1, 10) ON test.demo where PK = 'key1'
      
      
  QUERY
      SELECT <bins> FROM <ns>[.<set>]
      SELECT <bins> FROM <ns>[.<set>] WHERE <bin> = <value>
      SELECT <bins> FROM <ns>[.<set>] WHERE <bin> BETWEEN <lower> AND <upper>
      SELECT <bins> FROM <ns>[.<set>] WHERE PK = <key>
      SELECT <bins> FROM <ns>[.<set>] IN <indextype> WHERE <bin> = <value>
      SELECT <bins> FROM <ns>[.<set>] IN <indextype> WHERE <bin> BETWEEN <lower> AND <upper>
      SELECT <bins> FROM <ns>[.<set>] IN <indextype> WHERE <bin> CONTAINS <GeoJSONPoint>
      SELECT <bins> FROM <ns>[.<set>] IN <indextype> WHERE <bin> WITHIN <GeoJSONPolygon>
      
          <ns> is the namespace for the records to be queried.
          <set> is the set name for the record to be queried.
          <key> is the record's primary key.
          <bin> is the name of a bin.
          <value> is the value of a bin.
          <indextype> is the type of a index user wants to query. (LIST/MAPKEYS/MAPVALUES)
          <bins> can be either a wildcard (*) or a comma-separated list of bin names.
          <lower> is the lower bound for a numeric range query.
          <upper> is the lower bound for a numeric range query.
      
      Examples:
      
          SELECT * FROM test.demo
          SELECT * FROM test.demo WHERE PK = 'key1'
          SELECT foo, bar FROM test.demo WHERE PK = 'key1'
          SELECT foo, bar FROM test.demo WHERE foo = 123
          SELECT foo, bar FROM test.demo WHERE foo BETWEEN 0 AND 999
          SELECT * FROM test.demo WHERE gj CONTAINS CAST('{"type": "Point", "coordinates": [0.0, 0.0]}' AS GEOJSON)
      
  AGGREGATION
      AGGREGATE <module>.<function>(<args>) ON <ns>[.<set>]
      AGGREGATE <module>.<function>(<args>) ON <ns>[.<set>] WHERE <bin> = <value>
      AGGREGATE <module>.<function>(<args>) ON <ns>[.<set>] WHERE <bin> BETWEEN <lower> AND <upper>
      
          <module> is UDF module containing the function to invoke.
          <function> is UDF to invoke.
          <args> is a comma-separated list of argument values for the UDF.
          <ns> is the namespace for the records to be queried.
          <set> is the set name for the record to be queried.
          <key> is the record's primary key.
          <bin> is the name of a bin.
          <value> is the value of a bin.
          <lower> is the lower bound for a numeric range query.
          <upper> is the lower bound for a numeric range query.
      
      Examples:
      
          AGGREGATE myudfs.udf2(2) ON test.demo WHERE foo = 123
          AGGREGATE myudfs.udf2(2) ON test.demo WHERE foo BETWEEN 0 AND 999
      
  EXPLAIN
      EXPLAIN SELECT * FROM <ns>[.<set>] WHERE PK = <key>
      
          <ns> is the namespace for the records to be queried.
          <set> is the set name for the record to be queried.
          <key> is the record's primary key.
      
      Examples:
      
          EXPLAIN SELECT * FROM test.demo WHERE PK = 'key1'
      
      
  INFO
      SHOW NAMESPACES | SETS | BINS | INDEXES
      SHOW SCANS | QUERIES
      STAT NAMESPACE <ns> | INDEX <ns> <indexname>
      STAT SYSTEM
      ASINFO <ASInfoCommand>
      
  JOB MANAGEMENT
      KILL_QUERY <transaction_id>
      KILL_SCAN <scan_id>
      
  USER ADMINISTRATION
      SHOW USER [<user>]
      SHOW USERS
      SHOW ROLE <role>
      SHOW ROLES
      
  MANAGE UDFS
      SHOW MODULES
      DESC MODULE <filename>
      
          <filepath> is file path to the UDF module(in single quotes).
          <filename> is file name of the UDF module.
      
      Examples:
      
          SHOW MODULES
          DESC MODULE test.lua
      
  RUN <filepath>
      
  SYSTEM <bash command>
      
      
  SETTINGS
        ECHO                          (true | false, default false)
        VERBOSE                       (true | false, default false)
        OUTPUT                        (TABLE | JSON | MUTE | RAW, default TABLE)
        OUTPUT_TYPES                  (true | false, default true)
        TIMEOUT                       (time in ms, default: 1000)
        LUA_USERPATH                  <path>, default : /opt/aerospike/usr/udf/lua
        LUA_SYSPATH                   <path>, default : /opt/aerospike/sys/udf/lua
        USE_SMD                       (true | false, default false)
        RECORD_TTL                    (time in sec, default: 0)
        RECORD_PRINT_METADATA         (true | false, default false, prints record metadata)
        REPLICA_ANY                   (true | false, default false)
        KEY_SEND                      (true | false, default false)
        DURABLE_DELETE                (true | false, default false)
        FAIL_ON_CLUSTER_CHANGE        (true | false, default true, policy applies to scans)
        SCAN_PRIORITY                 priority of scan (LOW, MEDIUM, HIGH, AUTO), default : AUTO
        NO_BINS                       (true | false, default false, No bins as part of scan and query result)
        LINEARIZE_READ                (true | false, default false, Make read linearizable, applicable only for namespace with strong_consistency enabled.)
  
      
      To get the value of a setting, run:
      	
          aql> GET <setting>
      	
      To set the value of a setting, run:
      	
          aql> SET <setting> <value>
      	
      To reset the value of a setting back to default, run:
      	
          aql> RESET <setting>
      	
      	
    OTHER
        HELP
        QUIT|EXIT|Q
		show namespaces; # 查看命名空间
		select * from test # 
		insert into test(pk,id,name,age) values('key1','101','AAA','21'); # 
		delete from test where pk='key2' # 
namespace配置 # 一个namespace相当于一个数据库
	namespace <namespace-name> {
		# memory-size 4G           # 4GB of memory to be used for index and data
		# replication-factor 2     # For multiple nodes, keep 2 copies of the data
		# high-water-memory-pct 60 # Evict non-zero TTL data if capacity exceeds
								   # 60% of 4GB
		# stop-writes-pct 90       # Stop writes if capacity exceeds 90% of 4GB
		# default-ttl 0            # Writes from client that do not provide a TTL
								   # will default to 0 or never expire
		# storage-engine memory    # Store data in memory only
	}
存储方式 # namespace里的存储方式决定了这个namespace里的数据是存在内存里还是存在磁盘上还是两者混合存储。这也将影响AS的性能、成本和可持久性。
	SSD存储方案
		namespace <namespace-name> {
			memory-size <SIZE>G         # Maximum memory allocation for primary
										# and secondary indexes.
			storage-engine device {     # Configure the storage-engine to use persistence
				device /dev/<device>    # raw device. Maximum size is 2 TiB
				# device /dev/<device>  # (optional) another raw device.
				write-block-size 128K   # adjust block size to make it efficient for SSDs.
			}
		}
	HDD及内存混合存储方案
		namespace <namespace-name> {
			memory-size <SIZE>G             # Maximum memory allocation for data and
											# primary and secondary indexes.
			storage-engine device {         # Configure the storage-engine to use
											# persistence. Maximum size is 2 TiB
			file /opt/aerospike/<filename>  # Location of data file on server.
			# file /opt/aerospike/<another> # (optional) Location of data file on server.
			filesize <SIZE>G                # Max size of each file in GiB.
			data-in-memory true             # Indicates that all data should also be
											# in memory.
			}
		}
	纯内存数据储存方案
		namespace <namespace-name> {
			memory-size <SIZE>G   # Maximum memory allocation for data and primary and
								  # secondary indexes.
			storage-engine memory # Configure the storage-engine to not use persistence.
		}
	HDD及索引储存方案
		namespace <namespace-name> {
			memory-size <N>G                # Maximum memory allocation for data and
											# primary and secondary indexes.
			single-bin true                 # Required true by data-in-index.
			data-in-index true              # Enables in index integer store.
			storage-engine device {         # Configure the storage-engine to use
											# persistence.
			file /opt/aerospike/<filename>  # Location of data file on server.
			# file /opt/aerospike/<another> # (optimal) Location of data file on server.
			# device /dev/<device>          # Optional alternative to using files.

			filesize <SIZE>G               # Max size of each file in GiB. Maximum size is 2TiB
			data-in-memory true            # Required true by data-in-index.
			}
		}
	数据有效期 # namespace可以配置数据的有效时长, 过时的数据自动清理。
namespace <namespace-name> {
    default-ttl <VALUE>             # 数据保留的时长, 单位秒
    high-water-disk-pct <PERCENT>   # 持久化数据达到总容量的百分比后开始清理数据
    high-water-memory-pct <PERCENT> # 内存数据达到总容量的百分比后开始清理数据
    stop-writes-pct <PERCENT>       # 数据达到总容量的百分比后停止写入数据
    ...
}
	设置某个set不被清洗
		namespace <namespace-name> {
			...
			set <set-name> {
				set-disable-eviction true # Protect this set from evictions.

			}
		}
	设置某个set最多容纳的记录数(record)
		namespace <namespace-name> {
			...
			set <set-name> {
				set-stop-writes-count 5000     # Limit number of records that can be written to this set to 5000.

			}
		}
	设置备份数量
		namespace <namespace-name> {
			...
			replication-factor 2
			...
		}
	多个namespace
		当你需要多个数据库时, 可以同时配置多个namespace, 但是要注意, 一个AS集群最多只能容纳32个namespace。
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
