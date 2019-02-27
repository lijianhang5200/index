kerberos认证原理
	Authentication解决的是“如何证明某个人确确实实就是他或她所声称的那个人”的问题。对于如何进行Authentication，我们采用这样的方法：如果一个秘密（secret）仅仅存在于A和B，那么有个人对B声称自己就是A，B通过让A提供这个秘密来证明这个人就是他或她所声称的A。这个过程实际上涉及到3个重要的关于Authentication的方面：
		Secret如何表示。
		A如何向B提供Secret。
		B如何识别Secret。
	基于这3个方面，我们把Kerberos Authentication进行最大限度的简化：整个过程涉及到Client和Server，他们之间的这个Secret我们用一个Key（KServer-Client）来表示。Client为了让Server对自己进行有效的认证，向对方提供如下两组信息：
		代表Client自身Identity的信息，为了简便，它以明文的形式传递。
		将Client的Identity使用KServer-Client作为Public Key、并采用对称加密算法进行加密。
	由于KServer-Client仅仅被Client和Server知晓，所以被Client使用KServer-Client加密过的Client Identity只能被Client和Server解密。同理，Server接收到Client传送的这两组信息，先通过KServer-Client对后者进行解密，随后将机密的数据同前者进行比较，如果完全一样，则可以证明Client能过提供正确的KServer-Client，而这个世界上，仅仅只有真正的Client和自己知道KServer-Client，所以可以对方就是他所声称的那个人。
	Keberos大体上就是按照这样的一个原理来进行Authentication的。
hadoop使用kerberos
	默认Hadoop各个组件间无任何认证，因此可以恶意伪装某一组件（比如NameNode）接入到集群中搞破坏。而通过kerberos，可以将密钥事先放到可靠的节点上并只允许有限制的访问，该节点的服务启动时读取密钥，并与kerberos交互以做认证，从而接入到hadoop集群中。注意，我们这里主要是针对服务与服务之间的安全认证，没有涉及user。

