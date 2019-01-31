介绍
	Greenplum（以下简称GPDB）是一款开源数据仓库，基于开源的PostgreSQL改造而来，主要用来处理大规模数据分析任务。相比Hadoop，Greenplum更适合做大数据的存储、计算和分析引擎。
优点
	1.大规模并行处理架构
	2.高性能加载，使用 MPP 技术，提供 Petabyte 级别数据量的加载性能（支持PB级别数据）。
		描述：采取MPP架构的数据库系统才能对海量数据进行管理。
			Greenplum支持50PB(1PB=1000TB)级海量数据的存储和处理，Greenplum将来自不同源系统的、不同部门、不同平台的数据集成到数据库中集中存放，
			并且存放详尽历史的数据轨迹，业务用户不用再面对一个又一个信息孤岛，也不再困惑于不同版本数据导致的偏差，同时对于IT人员也降低管理维护工作的复杂度。
	3.大数据工作流查询优化
		描述：Greenplum提供资源管理功能(workload managemnt)来管理数据库资源，利用资源队列管理可实现按用户组的进行资源分配，如Session同时激活数、最大资源值等。
			通过资源管理功能，可以按用户级别进行资源分配和管理用户SQL查询优先级别，同时也能防止低质量SQL(如没有条件的多表join等)对系统资源的消耗。
	4.线性扩展。在MPP架构中增加节点就可以线性提高系统的存储容量和处理能力。
		描述：Greenplum在扩展节点时操作简单，在很短时间内就能完成数据的重新分布。
			Greenplum线性扩展支持为数据分析系统将来的拓展给予了技术上的保障，用户可根据实施需要进行容量和性能的扩展。
	5.反应速度快。
		描述：Greenplum通过准实时、实时的数据加载方式，实现数据仓库的实时更新，进而实现动态数据仓库(ADW)。
			基于动态数据仓库，业务用户能对当前业务数据进行BI实时分析-“Just In Time BI”，能够让企业敏锐感知市场的变化，加快决策支持反应速度。
	5.多态数据存储和执行
	6.基于Apache MADLib 的高级机器学习功能
应用场景：大数据量的统计分析类业务（这个也是目前统计分析业务结合考量后所出的选择）。
		GREENPLUM虽然是关系型数据库产品，它的特点主要就是查询速度快，数据装载速度快，批量DML处理快。
		而且性能可以随着硬件的添加，呈线性增加，拥有非常良好的可扩展性。因此，它主要适用于面向分析的应用。比如构建企业级ODS/EDW，或者数据集市等等。
		GREENPLUM运行在X86架构的硬件平台上，目前支持的操作系统包括32/64位的 LINUX(REDHAT/SUSE)/SOLARIS/MAC OS。
下载
	https://network.pivotal.io/products/pivotal-gpdb#/releases/4540/file_groups/560
安装
	系统信息
		uname -a # Linux sdw1 2.6.32-642.el6.x86_64 #1 SMP Tue May 10 17:27:01 UTC 2016 x86_64 x86_64 x86_64 GNU/Linux
		cat /etc/issue # CentOS release 6.8 (Final)
	vi /etc/hosts # 地址分配
		192.168.0.223	master
		192.168.0.224	slave1
		192.168.0.225	slave2
	vi /etc/sysconfig/network
		HOSTNAME=master #其他的机子将 -1 改为 -2 -3 ...
	系统参数 # 参数修改后各个机器需要reboot下才能生效
		vim /etc/sysctl.conf # 以下是最小配置(把没有的输进去，不一样的修改之)
			kernel.shmmax = 500000000
			kernel.shmmni = 4096
			kernel.shmall = 4000000000
			kernel.sem = 250 512000 100 2048
			kernel.sysrq = 1
			kernel.core_uses_pid = 1
			kernel.msgmnb = 65536
			kernel.msgmax = 65536
			kernel.msgmni = 2048
			net.ipv4.tcp_syncookies = 1
			net.ipv4.ip_forward = 0
			net.ipv4.conf.default.accept_source_route = 0
			net.ipv4.tcp_tw_recycle = 1
			net.ipv4.tcp_max_syn_backlog = 4096
			net.ipv4.conf.all.arp_filter = 1
			net.ipv4.ip_local_port_range = 1025 65535
			net.core.netdev_max_backlog = 10000
			net.core.rmem_max = 2097152
			net.core.wmem_max = 2097152
			vm.overcommit_memory = 2
		vim /etc/security/limits.conf # 修改文件打开数等限制(每个节点)
			*  soft  nofile  65536
			*  hard  nofile  65536
			*  soft  nproc  131072
			*  hard  nproc  131072
		vi /etc/selinux/config 
			SELINUX=disabled
		关闭防火墙 (所有机器)
			service iptables stop
			chkconfig iptables off
		设置预读块的值为16384(每个节点)
			# /sbin/blockdev --getra /dev/sda # 查看预读块，默认大小为256
			# /sbin/blockdev --setra 16384 /dev/sda # 设置预读块
		echo deadline > /sys/block/sda/queue/scheduler # 设置磁盘访问I/O调度策略(每个节点)
		安装依赖
			yum -y install rsync coreutils glib2 lrzsz sysstat e4fsprogs xfsprogs ntp readline-devel zlib zlib-devel openssl openssl-devel pam-devel libxml2-devel libxslt-devel python-devel tcl-devel gcc make smartmontools flex bison perl perl-devel perl-ExtUtils* OpenIPMI-tools openldap openldap-devel logrotate gcc-c++ python-py
			yum -y install bzip2-devel libevent-devel apr-devel curl-devel ed python-paramiko python-devel
			wget https://bootstrap.pypa.io/2.6/get-pip.py
			python get-pip.py
			pip install lockfile paramiko setuptools epydoc psutil
			pip install --upgrade setuptools
		上传并解压数据库安装文件(master节点)
			unzip greenplum-db-4.2.2.4-build-1-CE-RHEL5-i386.zip
		安装软件(master节点)
			/bin/bash greenplum-db-4.2.2.4-build-1-CE-RHEL5-i386.bin
		安装过程中会显示以下内容，直接使用默认即可
		获取环境参数(master节点)
			source /usr/local/greenplum-db/greenplum_path.sh
		创建包含所有主机名的文件all_hosts，文件内容：(每个节点)
			mdw
			sdw1
			sdw2
		运行gpseginstall工具 (master节点)
			gpseginstall -f all_hosts -u gpadmin -p gpadmin
		切换到gpadmin用户验证无密码登录(三台主机)
			(1)切换用户
				su - gpadmin
			(2)使用gpssh工具来测试无密码登录所有主机，结果如下图：
				gpssh -f all_hosts -e ls -l $GPHOME
		配置环境变量(master节点)
			将". /usr/local/greenplum-db-4.2.2.4/greenplum_path.sh"添加到.bashrc文件最后，然后将.bashrc文件发送到sdw1和sdw2,命令如下：
			scp .bashrc sdw1:~
			scp .bashrc sdw2:~
		创建存储区域(master节点)
			(1) 创建Master数据存储区域
				mkdir -p /data/master
			(2) 改变目录的所有权
				chown gpadmin:gpadmin /data/master
			(3) 创建一个包含所有segment主机名的文件seg_hosts，内容如下：
				sdw1
				sdw2
			(4) 使用gpssh工具在所有segment主机上创建主数据和镜像数据目录，如果没有设置镜像可以不创建mirror目录
				gpssh -f seg_hosts -e 'mkdir -p /data/primary'
				gpssh -f seg_hosts -e 'mkdir -p /data/mirror'
				gpssh -f seg_hosts -e 'chown gpadmin /data/primary'
				gpssh -f seg_hosts -e 'chown gpadmin /data/mirror
		同步系统时间
			(1) 在Master主机上编辑/etc/ntp.conf来设置如下内容：
				server 127.127.1.0
			(2) 在Segment主机上编辑/etc/ntp.conf
				server mdw
			(3) 在Master主机上，通过NTP守护进程同步系统时钟
				gpssh -f all_hosts -v -e 'ntpd'
		验证操作系统设置
			gpcheck -f all_hosts -m mdw
		创建Greenplum数据库配置文件
			(1) 以gpadmin用户登录
				su - gpadmin
			(2) 从模板中拷贝一份gpinitsystem_config文件
				cp $GPHOME/docs/cli_help/gpconfigs/gpinitsystem_config   /home/gpadmin/gpinitsystem_config
				chmod 775 gpinitsystem_config
			(3) 设置所有必须的参数
				ARRAY_NAME="EMC Greenplum DW"
				SEG_PREFIX=gpseg
				PORT_BASE=40000
				declare -a DATA_DIRECTORY=(/data/primary)
				MASTER_HOSTNAME=mdw
				MASTER_DIRECTORY=/data/master
				MASTER_PORT=5432
				TRUSTED SHELL=ssh
				CHECK_POINT_SEGMENT=8
				ENCODING=UNICODE
			(4) 设置可选参数
				MIRROR_PORT_BASE=50000
				REPLICATION_PORT_BASE=41000
				MIRROR_REPLICATION_PORT_BASE=51000
				declare -a MIRROR_DATA_DIRECTORY=(/data/mirror)
		运行初始化工具初始化数据库
			gpinitsystem -c gpinitsystem_config -h seg_hosts
		设置环境变量
			添加“export MASTER_DATA_DIRECTORY=/data/master/gpseg-1”到~/.bashrc文件尾，并同步到sdw1和sdw2节点
			scp .bashrc sdw1:~
			scp .bashrc sdw2:~
		启动和停止数据库测试是否能正常启动和关闭，命令如下
				gpstart
				gpstop
		访问数据库
			psql -d postgres
		输入查询语句
			select datname,datdba,encoding,datacl from pg_database;
参考网址
	https://blog.csdn.net/gnail_oug/article/details/46945283
	https://blog.csdn.net/mchdba/article/details/71036925
gcc编译
	./configure -enable-checking=release -enable-languages=c,c++ -disable-multilib
c++11依赖
	https://www.linuxidc.com/Linux/2017-01/139976.htm
mpc mpfr_fmma 类型错误
	https://www.cnblogs.com/syyxy/p/8846751.html
	
	https://github.com/greenplum-db/gp-xerces
	https://github.com/greenplum-db/gporca
	https://github.com/greenplum-db/gpdb/blob/master/README.md
	https://github.com/greenplum-db/gpdb/issues/4836
	https://www.jianshu.com/p/d118615c1943
	
	
	
	
	