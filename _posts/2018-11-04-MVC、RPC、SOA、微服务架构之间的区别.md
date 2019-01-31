---
layout: post
title: "MVC、RPC、SOA、微服务架构之间的区别"
tags: [java]
---
### 摘要
几种常用架构之间的区别
<!--excerpt-->

![架构区别](assets/images/架构区别.png)
### MVC 架构
其实 MVC 架构就是一个单体架构。

代表技术:Struts2、SpringMVC、Spring、Mybatis 等等。
### RPC 架构
RPC(Remote Procedure Call):远程过程调用。他一种通过网络从远程计算机程序上请求服务,而不需要了解底层网络技术的协议。

代表技术:Thrift、Hessian 等等
### SOA 架构
SOA(Service oriented Architecture):面向服务架构

ESB(Enterparise Servce Bus):企业服务总线,服务中介。主要是提供了一个服务于服务之间的交互。

ESB 包含的功能如:负载均衡,流量控制,加密处理,服务的监控,异常处理,监控告急等等。

代表技术:Mule、WSO2
### 微服务架构
微服务就是一个轻量级的服务治理方案。

代表技术:SpringCloud、dubbo 等等
###### 出处 尚学堂课程 SpringCloud
###### 网址 [https://www.bjsxt.com/down/8672.html](https://www.bjsxt.com/down/8672.html)
