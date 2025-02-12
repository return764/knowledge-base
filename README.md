# 桌面端知识库工具
通过tauri + React进行构建，实现方式是通过langchain-rust创建的RAG Agent，将上传的文件保存到sqlite中，当用户提问时，在数据库中进行搜索，然后询问LLM

> 本项目使用sqlite-vec作为数据库的向量存储模式，所有数据均存储在本地

## 开发
确保拥有rust开发环境: https://www.rust-lang.org/zh-CN/tools/install

```shell
npx tauri dev
```

## 打包

```shell
npx tauri build
```
