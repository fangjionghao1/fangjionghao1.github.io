---
title: 设计模式小试（一）
description: 访问者模式
date: 2023-02-13
slug: 算法
# image: Snipaste_2023-02-13_18-16-10.png
categories:
  - 设计模式
  - go
---

#### 设计模式概念

##### 简述

设计模式将算法和具体实现的对象分离

###### 问题描述

设计了一个应用程序，其中有一些不同的类需要做一个行为，去输出一份信息摘要，但是应用程序已经在线上稳定运行，组长不希望你对现有的类破坏，同时质疑往类中添加摘要的必要性。

###### 问题解决

这时可以为应用程序添加访问者模式
访问者模式将新行为交给访问者，不同的类型对于访问者执行不同的行为，而不是将新行为整合到访问者当中。
个人感觉这有点像装饰器的行为，不同的是这个行为是依赖于外部的一个访问者。

##### 示例

```go
package main

import "fmt"

//
//  DiffDiInfo
//  @author: FJH
//  @Description:  用于一组稳定的信息通过访问模式输出自己不同维度的信息，这些信息都是通过自身信息整合而来
//
type DiffDiInfo interface {
	Acceptor(dimension Dimension) // 接收入口， 用于不同维度的接收
}
type Dimension interface {
	FirstDimension(*T1)
	SecondDimension(*T2)
}
type T1 struct {
	info int
}

func (t *T1) Acceptor(dimension Dimension) {
	dimension.FirstDimension(t)
}

type DimensionHandler struct {
	data interface{}
}

func (d *DimensionHandler) FirstDimension(t1 *T1) {
	d.data = t1.info
}


func (d *DimensionHandler) SecondDimension(t2 *T2) {
	d.data = t2.info
}

type T2 struct {
	info string
}

func (t *T2) Acceptor(dimension Dimension) {
	dimension.SecondDimension(t)
}

type Manager struct {
	t1 T1
	t2 T2
}

func main() {
	manager := Manager{
		t1: T1{1},
		t2: T2{"2"},
	}
	handler := DimensionHandler{}
	manager.t2.Acceptor(&handler)
	fmt.Println(handler.data)
}


```

如果想要更极端的访问者，可以直接使用实例充当访问者，只不过耦合度就高了很多，顺着这个想法下去他就是在这个类型上开了个口子写了装饰器。所以耦合程度从高到低是 装饰>填充实例>访问者
