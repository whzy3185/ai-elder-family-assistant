# 页面结构映射

输入以表单为中心；确认以日程字段为中心；结果用一句答复与摘要；详情用时间/地点/提醒/陪同的自然排列。首页为记事日历，家属列表为妈妈的消息。等待使用轻时钟，失败留原话与恢复。Review是独立工具面板。

| 类型 | 结构 |
|---|---|
| input | 开放表单、持久标签、原话/字段、主提交及手动替代 |
| confirm | 提问、日期与大时间、结构化字段、一个主要决定 |
| result | 结果符号、一句结果、简短事务摘要、下一步 |
| detail | 时间为主、地点和提醒、陪同状况、次操作、最后取消 |
| waiting / failure | 当前等待或失败、输入/事务保留、恢复或返回 |
| home / family-list / relationship | 日期页签/消息行/家人头像，与任务细节分工 |
| review | 独立面板，辅助说明一次，工具分组 |

| 页面编号 | 类型 | 主要视觉焦点 |
|---|---|---|
| EL-TASK-00 | home | 晚上好，张阿姨 |
| EL-TASK-01 | input | 想记什么事？ |
| EL-TASK-02 | waiting | 正在帮你整理 |
| EL-TASK-03A | confirm | 我这样记，对吗？ |
| EL-TASK-03B | confirm | 我这样记，对吗？ |
| EL-TASK-04 | confirm | 改成几点？ |
| EL-TASK-05 | confirm | 再看一遍 |
| EL-TASK-06 | detail | 公交卡年审 |
| EL-TASK-07 | reminder | 该准备出发了 |
| EL-TASK-08 | confirm | 要改时间吗？ |
| EL-TASK-09A | confirm | 这件事办完了吗？ |
| EL-TASK-09B | result | 这件事办完了 |
| EL-TASK-10 | home | 这件事办完了 |
| EL-EX-01 | failure | 还需要时间和地点 |
| EL-EX-02A | failure | 这次没整理好 |
| EL-EX-02B | input | 把这件事写下来 |
| EL-EX-03 | failure | 没有发给小梅 |
| EL-EX-04 | waiting | 小梅还没有回复 |
| EL-EX-05A | confirm | 不需要小梅陪了吗？ |
| EL-EX-05B | result | 陪同请求已撤回 |
| EL-EX-06A | confirm | 要取消这件事吗？ |
| EL-EX-06B | result | 这件事已取消 |
| EL-EX-07A | confirm | 改到下午2:00？ |
| EL-EX-07B | result | 已改到下午2:00 |
| EL-SET-01 | detail | 看得更清楚 |
| EL-SHARE-01 | confirm | 要请小梅陪你去吗？ |
| EL-SHARE-01B | result | 只提醒你自己 |
| EL-SHARE-02 | confirm | 发给小梅前，再看看 |
| EL-SHARE-03 | waiting | 正在发给小梅 |
| EL-SHARE-04A | result | 已经发给小梅 |
| EL-SHARE-04B | waiting | 等小梅回复 |
| EL-SHARE-05 | result | 小梅可以陪你去 |
| EL-SHARE-06 | result | 小梅这次不能陪你 |
| EL-SHARE-07 | confirm | 小梅想下午2:00去 |
| EL-SHARE-08 | result | 已改到下午2:00 |
| EL-SHARE-09 | result | 仍按原来的时间 |
| EL-REL-01 | relationship | 和小梅一起记挂 |
| EL-REL-02 | confirm | 小梅想与你建立协作 |
| EL-REL-02A | confirm | 同意和小梅协作吗？ |
| EL-REL-03 | result | 这次先不建立协作 |
| EL-REL-04A | confirm | 结束和小梅的协作？ |
| EL-REL-05 | result | 家庭协作已结束 |
| EL-REL-06 | relationship | 小梅 · 女儿 |
| EL-REL-07 | detail | 她能看到什么？ |
| FM-REL-01 | relationship | 和妈妈建立协作 |
| FM-REL-02 | relationship | 妈妈 · 张阿姨 |
| FM-REL-03 | result | 妈妈这次先不同意 |
| FM-REL-04 | result | 家庭协作已结束 |
| FM-REQ-00 | family-list | 妈妈的消息 |
| FM-REQ-01 | family-list | 妈妈的消息 |
| FM-REQ-02 | detail | 妈妈想请你陪她去 |
| FM-REQ-03A | confirm | 确认可以陪妈妈？ |
| FM-REQ-03B | result | 已告诉妈妈你可以陪同 |
| FM-REQ-04A | confirm | 这次不能陪妈妈？ |
| FM-REQ-04B | result | 已告诉妈妈这次不能陪同 |
| FM-REQ-05A | confirm | 建议下午2:00去？ |
| FM-REQ-05B | result | 已把建议告诉妈妈 |
| FM-EX-01 | result | 妈妈不用你陪同了 |
| FM-EX-02 | result | 妈妈取消了这件事 |
| FM-EX-03 | result | 之前的安排更新了 |
| DM-01 | review | 评审辅助 |
| DM-02 | review | 快速查看 |
| DM-03 | review | 演示时间 |
| DM-04A | review | 恢复初始状态？ |
| DM-04B | review | 已恢复初始状态 |

全部65项包括60项产品画面与5项工具画面已映射；不删除异常来简化布局。固定模板只复用低层按钮/字段，页面构图按类型独立，结果页不强制状态pill或卡片。

P06 Gate=PASS：全部P0映射到至少四种不同页面结构。
