# 知识库软件
通过tauri + React进行构建，实现方式是通过langchain-rust创建的RAG Agent，将上传的文件保存到sqlite中，当用户提问时，在数据库中进行搜索，然后询问LLM

## 开发
```shell
npx tauri dev
```
