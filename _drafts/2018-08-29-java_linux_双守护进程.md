技术需求
	1、jps命令。
		JDK自带的命令工具,使用jps -l可以列出正在运行的Java程序,显示Java程序的pid与Name。只对Java程序有效,其实查看的是运行的JVM
	2、java.nio.channels.FileLock类的使用
		这个是Java new IO中的类,使用他可以维持在读取文件的给文件加上锁,判断文件时候有锁可以判断该文件是否被其他的程序使用
	3、ProcessBuilder与Process
		这两个原理差不多,都是调用系统的命令运行,然后返回信息。但是硬编码会导致你的Java程序失去可移植性,可以将命令独立到配置文件中。
设计原理
		Server:服务器程序
		A:守护进程A
		B:守护进程B
		A.lock:守护进程A的文件锁
		B.lock:守护进程B的文件锁
	Step 1:首先不考虑Server,只考虑A与B之间的守护
		1.A判断B是否存活,没有就启动B
		2.B判断A是否存活,没有就启动A
		3.在运行过程中A与B互相去拿对方的文件锁,如果拿到了,证明对面挂了,则启动对方。
		4.A启动的时候,获取A.lock文件的锁,如果拿到了证明没有A启动,则A运行;如果没有拿到锁,证明A已经启动了,或者是B判断的时候拿到了锁,如果是A已经启动了,不需要再次启动A,如果是B判断的时候拿到了锁,没关紧 要,反正B会再次启动A。
		5.B启动的时候原理与A一致。
		6.运行中如果A挂了,B判断到A已经挂了,则启动A。B同理。
	Step 2:加入Server
		1.A用于守护B和Server,B用于守护A。
		2.原理与Step 1 一致,只是A多个一个守护Serer的任务。
		3.当A运行的时候,使用进程pid检测到Server已经挂了,就启动Server
		4.如果Server与A都挂了,B会启动A,然后A启动Server
		5.如果Server与B挂了,A启动Server与B
		6.如果A与B都挂了,守护结束
	Step 3:使用Shutdown结束守护,不然结束Server后会自动启动
实现
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		