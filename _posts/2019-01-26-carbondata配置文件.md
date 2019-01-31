---
layout: post
title: "CarbonData配置文件"
tags: [carbondata]
---
### 介绍
整理CarbonData配置文件所有配置项
<!--excerpt-->
### carbon.properties
```shell
#################### 系统配置 ##################
##可选项。 carbondata将用它自己的格式创建存储并写入数据的位置。
##如果没有指定，将使用 spark.sql.warehouse.dir作为路径。
#carbon.storelocation
#数据文件的基础路径
#carbon.ddl.base.hdfs.url
#坏数据保存的路径
#carbon.badRecords.location

#################### 性能配置 ##################
######## 数据加载期间配置 ########
#在排序期间使用的文件读取缓冲区大小(单位 MB) :MIN=1:MAX=100
carbon.sort.file.buffer.size=10
#在数据加载时要使用的核心数
carbon.number.of.cores.while.loading=2
#要排序并写入临时中间文件的记录数量
carbon.sort.size=100000
#用于hashmap的hashkey计算的算法
carbon.enableXXHash=true
#在合并排序期间启用数据预读取，同时从数据加载中的排序临时文件读取数据
#carbon.merge.sort.prefetch=true

######## 修改分区配置 ########
#更改分区时要使用的核心数
carbon.number.of.cores.while.alterPartition=2

######## 压缩配置 ########
#压缩时使用的核心数
carbon.number.of.cores.while.compacting=2
#对于较小的压缩, 配置第一阶段要合并的分段数量和第2阶段中要合并的压缩分段数。
carbon.compaction.level.threshold=4,3
#用于触发主要压缩默认大小(单位 MB)。
carbon.major.compaction.size=1024

#################### 额外配置 ##################
##配置输入数据的Timestamp数据类型的格式。
#carbon.timestamp.format=yyyy-MM-dd HH:mm:ss

######## 数据加载配置 ########
##排序期间使用的文件写入缓冲区大小。
#carbon.sort.file.write.buffer.size=16384
##表上数据加载的锁定机制。
#carbon.lock.type=LOCALLOCK
##合并后要开始排序的中间文件的最小数目。
#carbon.sort.intermediate.files.limit=20
##配置在carbon数据文件中的写入块元数据的保留的百分比空间
#carbon.block.meta.size.reserved.percentage=10
##读取csv文件缓冲区大小。
#carbon.csv.read.buffersize.byte=1048576
##对于读取用于最终合并的中间文件的线程数。
#carbon.merge.sort.reader.thread=3
##禁用/启用 carbon 块分区
#carbon.custom.block.distribution=false

######## 压缩配置 ########
##指定要从压缩中保留的分段数。
#carbon.numberof.preserve.segments=0
##To determine the loads of number of days to be compacted
#carbon.allowed.compaction.days=0
##To enable compaction while data loading
#carbon.enable.auto.load.merge=false

######## 查询配置 ########
##Maximum time allowed for one query to be executed.
#max.query.execution.time=60
##Min max feature is added to enhance query performance. To disable this feature, make it false.
#carbon.enableMinMax=true

######## 全局目录配置 ########
##The property to set the date to be considered as start date for calculating the timestamp.
#carbon.cutOffTimestamp
##The property to set the timestamp (ie milis) conversion to the SECOND, MINUTE, HOUR or DAY level.
#carbon.timegranularity=SECOND
##the number of prefetched rows in sort step
#carbon.prefetch.buffersize=1000
```
