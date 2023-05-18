### 问题背景

写测试的时候需要 mock 请求，发现整个流程相当复杂

- 读文件
- 拷贝到 multiform.Writer
- 用 writer 写 filed
- parse 到 multiform
- 从 http.Request 当中取出 multiform
