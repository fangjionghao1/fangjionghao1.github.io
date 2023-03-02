---
title: web服务踩的坑
description: 工作总结
date: 2023-02-24
slug: 工作总结
# image: Snipaste_2023-02-13_18-16-10.png
categories:
  - go
  - fiber
  - gorm
  - crontab
---

## 连载中。。。欢迎补充

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
4. go 的时间类型默认格式是 `YYYY-MM-DDTHH:MM:SSZ+0800`,零时间是 `0001-01-01 00：00 +0000 `我的做法是日期为 1 的时候判空，不能直接使用。
5. `time` 类型直接 `string()` 接口转出时间的时候，年月日都是单位的比如 3 月就是输出 3，但是一般要转回时间的时候就需要转换成 03,我的做法是静态的对应表，放在 util 里面需要的时候再用。

### http 篇

1. 前端数据不可信，不做修改的时候以后端数据为准，唯一值得参考的就是提供的身份信息，包括但不仅限于 id,token。做修改时以前端数据为准。
2. 由于前后端要交换数据，其实选择 string 作为交换的格式挺有风险。举个例子就是时间选用 string 类型的时候后果是每次交互两边都要进行

### Fiber 篇

1. fiber 注册的 handler 是有前后顺序分别的。原因是他在给 app 设置 handler 的时候底层实现是一个 slice。前后调用有区别就意味着不管是路由谁捕捉到，还是过滤器的先后都是有关系的。
2. staic 提供了很好的静态资源服务，但是要对静态资源做一些处理就很麻烦。我的做法是在 config next 字段加入一些回调能过抓得到 ctx 传下来的 token。对于一些用户相关的资源可以这么做但是不建议。
3. 中间件文件系统暂时没看懂是怎么用的

### gorm 篇

综述：gorm 的坑还是非常多的，一不小心就会用错，如果现在开放出来的函数不能实现需求的话建议还是用`raw()`

###### 查询篇

1. where()方法和 or 方法一起使用的时候，以 or 为分界拼接 sql。简单来说就是 or 之后是一个新的子句。
2. first 方法在查找不到记录的时候会返回一个 notfound 错误，需要做处理，但是 find 不会。

##### 创建篇

1. 在给类型写 scanner valuer 接口的时候 valuer 的接收者不能是指针接收者，否则无法触发相关行为

##### 声明篇

1.  默认的表名，字段名是驼峰改蛇形
2.  model 单数会自动加复数 s
3.  table 不会触发 hook
4.  在 gorm.DB 的 model 是使用的时候设置的，如果还想给 hook 传递信息只有通过 set，但是考虑到并发的时候，并不建议给单例 set，可以 getinstance 做一次克隆在给 db set 一些参考的参数。而且 get 需要通过制定的关键字获取，这就意味着要对参数做约定。业务一多，约定的关键字就成了关键字表，不统一管理前后不对照会 panic

### viper（配置篇）

### moby 篇（docker）

#### reexec 篇

moby 下一个很方便的工具包，基本上是零以来，可以直接拷贝下来使用。
moby 的基本原理有时间再研究，讲一下注意点。
他会在 arg[0]里设置任务的 pid 让主程序作为子程序的守护，并管理子程序的生命周期。如果想要做守护就是拿着 run()返回的 pid 去反复重启任务。
