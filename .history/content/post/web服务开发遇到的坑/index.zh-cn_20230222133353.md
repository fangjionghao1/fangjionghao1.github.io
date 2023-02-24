---
title: web服务踩的坑
description: 工作总结
date: 2023-02-13
slug: 工作总结
# image: Snipaste_2023-02-13_18-16-10.png
categories:
  - go
  - fiber
  - gorm
  - go
---

因为点很杂很多，都是一些使用起来容易出错的或者值得积累的地方。有兴趣可以慢慢当马桶读物来看

### GO 篇

1. go 是强类型的语言，这意味着，变量要被指定，基本类型变量一诞生就带上类型，带上类型意味着占有空间，很自然能想到，基本类型的空值是默认有值的，比如 int 的空为 0 ，string 为""。所以在序列化的时候这部分内容如果想要一个 null 值需要给结构定义指针。
2. 实现接口的时候如果是指针接收者，特别是实现工具自带的接口，比如 marshal，要使用引用。
3. json 序列化的时候要声明一个**临时类型**，否则会因为自身的反复调用而 stack overflow
   ```go
       func (g *Group) MarshalJSON() ([]byte, error) {
       type tmp Group
       return json.Marshal(&struct {
           *tmp
           CreateTimeStr string `json:"create_time"`
       }{
           tmp:           (*tmp)(g),
           CreateTimeStr: g.CreatTime.Format(consts.TLayout.Date),
       })
   }
   ```
4. go 的时间类型默认格式是 `YYYY-MM-DDTHH:MM:SSZ+0800`,零时间是 0001-01-01 00：00 +0000 我的做法是日期为 1 的时候判空，不能直接使用。
5. time 类型直接 string 接口转出时间的时候，年月日都是单位的比如 3 月就是输出 3，对于一些后续的时间操作不太方便

### http 篇

1. 前端数据不可信，不做修改的时候以后端数据为准，唯一值得参考的就是提供的身份信息，包括但不仅限于 id,token。做修改时以前端数据为准。

### Fiber 篇

### gorm 篇
