---
layout: post
title: "idea没有servlet选项"
tags: [web开发, java, IDE]
---
### 摘要
<!--excerpt-->
在pom文件中加入下面的节点：
```xml
<!--创建Servlet-->
<dependency>
  <groupId>jstl</groupId>
  <artifactId>jstl</artifactId>
  <version>1.2</version>
</dependency>
```
后就会出现servlet选项。
