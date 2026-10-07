# 最终静态导出验证

当前最终材料为1.1.1文档语义校正版：68图、73页原型PDF均未变；产品说明PDF重新生成，仍7页26节。[最新核对](../delivery/definition-and-delivery-audit.md)和exports/material-manifest.json记录当前摘要。以下保留前轮导出历史，不作为当前材料数量的唯一依据。

阶段：P15；版本：1.1.0；结果：PASS。

源码冻结：`6a3734be5488e85f43096564cded675994e66244`。动态保存标题补充HTML转义后，重建Docker、通过45项状态测试、11组浏览器业务流程和65状态可见文案扫描，再重新取得全部截图。

- `exports/screens/`共65张：60张产品画面宽390px，保留完整滚动内容；5张评审辅助画面宽338px，截取产品容器外对应工具区域。
- `exports/prototype-pages.pdf`共69页，含封面、三页索引、65独立画面；编号、书签及图片索引一致。
- `exports/product-description.pdf`共7页，覆盖26节产品说明。
- 使用Poppler渲染全部PDF页，并检查六张原型联系表与产品说明联系表；未发现缺字、截断或重叠。转义修复后再次检查最终封面和产品说明第一页的冻结SHA。
- 逐项计算SHA-256：源码manifest全部文件一致；65张图片全部匹配索引摘要。产品图片与当前Docker同版。

证据：`exports/screens/audit.json`、`exports/screens/results.json`、`exports/prototype-index.json`、`exports/source-manifest.json`、`artifacts/qa/title-escape-regression/`。

旧设计资料只作为历史过程记录，最终提交入口为exports。实际体验两款产品本人体验已确认，按原题体验要求PASS；PDF未将假设或继承文字当作本次实测。

## 独立审查修复后的重新导出

最终1.1.1源码冻结`cb1a37f`。独立审查发现的旧请求导引、取消返回和家属文案全部修复；重新取得60产品图、5辅助图及三布局审计，再生成69页原型PDF和7页产品说明PDF。导出时拒绝混入额外非页面图片；所有编号集合与摘要一致。最终PDF再次全页渲染并人工检查。

最终补齐三个关系状态后的提交集：源码冻结`5444021`，68张（63产品+5辅助），原型PDF73页（封面+4页索引+68画面），产品说明PDF7页；新增邀请等待、申请等待及家属结束协作确认均单独查看。完整图片、页面矩阵、辅助入口的编号集合一致。
