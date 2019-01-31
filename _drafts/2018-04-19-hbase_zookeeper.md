软件版本情况:
	HBase-0.98.6-cdh5.3.6
	zookeeper-3.4.5-cdh5.3.6
HBase介绍:
	hdfs之上 高可用 高性能 列存储 可伸缩 实时读写  的数据库系统  介于 nosql 和 RDBMs 之间的 一种数据库系统 仅支持通过 rowkey 和 range 进行数据的检索 主要存储 结构化数据 和 半结构化数据
	通过 横向扩展 添加普通机器来增加 存储性能 和 计算性能 
HBase特点:
	大（一个表可以有上亿行以及百万级的行）
	面向行存储
	稀疏（由于null不占用存储空间，所以表结果可以设计的非常稀疏）
HBase组成结构:
	使用Zookeeper进行集群节点管理 自身也集成了一个ZK系统（一般不使用）
	由 master(默认1个) 和 regionserver（默认多个） 两类节点（使用自带zk，还有 HQuorumPeer进程）  提供backup master 进行 master 备份
	master 节点负责与 zk 进行通信 以及 存储regionserver 的相关位置信息 regionserver 节点实现具体对数据的操作 最终存储在 hdfs 上
Hbase安装:
	三种模式:独立模式 ·分布式模式（集成zookeeper） 分布式模式（独立zokeeper） 
	安装步骤:
		1.安装jdk
		2.安装ssh免密登录
		3.修改hostname hosts （hbase通过hostname获取ip地址）
		4.hadoop安装
		5.生成环境集群（NTP + ulimit & nproc + hdfs 的 dfs.datanode.max.xcievers）
		6.hbase下载安装
			配置信息:http://archive.cloudera.com/cdh5/cdh/5/hbase-0.98.6-cdh5.3.6/
			地址:http://archive.cloudera.com/cdh5/cdh/5/
		7.解压 创建软连接
		8.创建tmp文件夹存储临时文件 pid等 默认/tmp
		9.修改配置信息
			cp $ZK_HOME/conf/zoo_sample.cfg $ZK_HOME/conf/zoo.cfg
			vi $ZK_HOME/conf/zoo.cfg
				dataDir=/home/hadoop/zookeeper/data
				dataLogDir=/home/hadoop/zookeeper/logs
				server.1=192.168.113.111:2888:3888
			vi $HBASE_HOME/conf/hbase-env.sh
				export JAVA_HOME=/opt/jdk
				export HBASE_CLASSPATH=/opt/hadoop/etc/hadoop/
				export HBASE_PID_DIR=/home/hadoop/hbase/tmp/pids
				export HBASE_MANAGES_ZK=false	//是否使用自带zk
			vi $HBASE_HOME/conf/hbase-site.xml
				<configuration>
					<property>
						<name>hbase.rootdir</name>
						<value>hdfs://192.168.113.111:9000/hbase</value>
					</property>
					<property>
						<name>hbase.cluster.distributed</name>
						<value>true</value>
					</property>
					<property>
						<name>hbase.tmp.dir</name>
						<value>/home/hadoop/hbase/tmp</value>
					</property>
					<property>
						<name>hbase.zookeeper.quorum</name>
						<value>192.168.113.111</value>
					</property>
					<property>
						<name>hbase.zookeeper.property.clientPort</name>
						<value>2181</value>
					</property>
					<property>
						<name>dfs.replication</name>
						<value>1</value>
					</property>
					<property>
						<name>hbase.zookeeper.property.dataDir</name>
						<value>/home/hadoop/zookeeper/data</value>
					</property>
				</configuration>
			regionserver(指定regionserver节点hostname)
				lvmama
		10.添加hbase相关信息到环境变量中
			export ZK_HOME=/opt/zookeeper
			export PATH=$PATH:$ZK_HOME/bin
			
			export HBASE_HOME=/opt/hbase
			export PATH=$PATH:$HBASE_HOME/bin
	启动zookeeper服务:
		zkServer.sh start
	zookeeper检查状态:
		zkServer.sh status
	HBase启动:
		start-hbase.sh
		stop-hbase.sh
		hbase-daemon.sh start|stop master|regionserver|zookeeper
	验证是否成功:
		jps
			7985 ResourceManager
			8593 HQuorumPeer
			7585 NameNode
			8645 HMaster
			7846 SecondaryNameNode
			8761 HRegionServer
			7674 DataNode
			8076 NodeManager
			8862 Jps
		web界面:
			http://192.168.113.111:60010
	HBase命令:
		Options:
		  --config DIR    Configuration direction to use. Default: ./conf
		  --hosts HOSTS   Override the list in 'regionservers' file

		Commands:
		Some commands take arguments. Pass no args or -h for usage.
		  shell           Run the HBase shell
		  hbck            Run the hbase 'fsck' tool
		  hlog            Write-ahead-log analyzer
		  hfile           Store file analyzer
		  zkcli           Run the ZooKeeper shell
		  upgrade         Upgrade hbase
		  master          Run an HBase HMaster node
		  regionserver    Run an HBase HRegionServer node
		  zookeeper       Run a Zookeeper server
		  rest            Run an HBase REST server
		  thrift          Run the HBase Thrift server
		  thrift2         Run the HBase Thrift2 server
		  clean           Run the HBase clean up script
		  classpath       Dump hbase CLASSPATH
		  mapredcp        Dump CLASSPATH entries required by mapreduce
		  pe              Run PerformanceEvaluation
		  ltt             Run LoadTestTool
		  version         Print the version
		  CLASSNAME       Run the class named CLASSNAME
	hbase shell 命令:
		hbase(main):001:0> help
		hbase(main):002:0> status
	命名空间:默认两个命名空间:hbase default
	命令:
		hbase(main):003:0> create_namespace 'bigdata',{'commit'=>'this is bigdata namespace','key'=>'value'}
		hbase(main):004:0> alert_namespace 'bigdata','new_table'
		hbase(main):005:0> describe_namespace 'bigdata'
		hbase(main):006:0> drop_namespace 'bigdata'
		hbase(main):007:0> list_namespace ['regex_str']
		hbase(main):008:0> list_namespace_tables 'namespace'
	DDL:
		hbase(main):009:0> list 
		hbase(main):009:0> create '[namespace:]table_name','family_name_1',...,'family_name_n'(family_name不要超过3个)
		hbase(main):010:0> disable '[namespace:]table_name'
		hbase(main):011:0> drop '[namespace:]table_name'
	DML:
		hbase(main):012:0> put '[namespace:]table_name','rowkey','family:[column]',
							'value'[,'timestamp'][,ATTRIBUTES=>{'mykey'=>'myvalue'},VISIBILITY=>'PRIVATE|SECRET']
		hbase(main):013:0> get '[namespace:]table_name','rowkey'
		hbase(main):012:0> scan '[namespace:]table_name'
		hbase(main):012:0> scan '[namespace:]table_name',{FILTER=>"ColumnPrefixFilter('id')"}
		hbase(main):012:0> scan '[namespace:]table_name',{FILTER=>"MultipColumnPrefixFilter('id','name')"}
		hbase(main):012:0> scan '[namespace:]table_name',{FILTER=>"RowFilter(>=,'binary:row8')"}
		hbase(main):012:0> scan '[namespace:]table_name',{FILTER=>"SingleColumnValueFilter('f','id',<=,'binary:2')"}
		hbase(main):012:0> delete '[namespace:]table_name','rowkey','family:[column]'
		hbase(main):012:0> truncate '[namespace:]table_name'
		hbase(main):014:0> import java.util.Date
		hbase(main):014:0> Date.now().toString()
	JavaAPI:
		
	文件结构:
		/命名空间/表/列簇/列
		
	hbase_mapreduce整合:
		1.hadoop下添加hbase-site.xml的软连接
			ln -s $HBASE_HOME/conf/hbase-site.xml $HADOOP_HOME/etc/hadoop/hbase-site.xml
		2.将hbase需要的jar包添加到hadoop环境中，其中hbase需要的jar包就是lib目录下所有的jar包
			方法1.vi $HADOOP_HOME/etc/hadoop/hadoop-env.sh
				if [ "$HADOOP_CLASSPATH" ]; then
					export HADOOP_CLASSPATH=$HADOOP_CLASSPATH:$HBASE_HOME/lib/*
				else
					export HADOOP_CLASSPATH=$HBASE_HOME/lib/*
				fi
			方法2.sudo vi /etc/profile
				export HADOOP_CLASSPATH=$HADOOP_CLASSPATH:$HBASE_HOME/lib
			方法3.cp $HBASE_HOME/lib/*.jar $HADOOP_HOME/share/hadoop/common/lib/
		3.测试是否安装成功
			hadoop jar $HBASE_HOME/lib/hbase-server-*.jar
			Valid program names are:
			  CellCounter: Count cells in HBase table
			  completebulkload: Complete a bulk data load.
			  copytable: Export a table from local cluster to peer cluster
			  export: Write table data to HDFS.
			  import: Import data written by Export.
			  importtsv: Import data in TSV format.
			  rowcounter: Count rows in HBase table
			  verifyrep: Compare the data from tables in two different clusters. WARNING: It doesn't work for incrementColumnValues'd cells since the timestamp is changed after being appended to the log.
			hadoop jar $HBASE_HOME/lib/hbase-server-*.jar rowcounter hbasetablename
		
开启服务：
	zkServer.sh start && start-all.sh && start-hbase.sh
停止服务：
	stop-hbase.sh && stop-all.sh && zkServer.sh stop
删除目录：
	rm -rf ~/hdfs/* ~/zookeeper/logs/* ~/zookeeper.out ~/zookeeper/data/* $HADOOP_HOME/logs/* /home/hadoop/hbase/tmp/* && hdfs namenode -format
hadoop日志：
	sz $HADOOP_HOME/logs/*.log

问题总结:
	问题1.java.lang.UnsatisfiedLinkError:org.apache.hadoop.util.NativeCrc32.nativeComputeChunkedSumsByteArray
	解决1.删除$HADOOP_HOME/lib/native/
	问题2.exception=com.google.protobuf.ServiceException: java.net.ConnectException: Connection refused: no further information
	解决2.配置文件有误
	问题3.Failed to create local dir file:\usr\local\hbase\tmp\local\jars, DynamicClassLoader failed to init
	解决3.去掉 <name>hbase.tmp.dir</name> 这个属性
	问题4.exception=ServiceException: ConnectException: Connection refused: no further information
	解决4.未解决
	
