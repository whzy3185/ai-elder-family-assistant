window.DESIGN_SCREENS = [
  {
    "id": "EL-TASK-00",
    "title": "今天要记什么事？",
    "tone": "Neutral",
    "status": "还没有事务",
    "card": [
      "从这里开始",
      "点“记一件事”，说出或手动填写一件日常事务。"
    ],
    "actions": [
      [
        "Primary",
        "记一件事"
      ],
      [
        "Secondary",
        "查看家庭协作"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-TASK-01",
    "title": "你想记什么事？",
    "tone": "Info",
    "status": "等待输入",
    "card": [
      "你可以这样说",
      "明天上午九点去社区服务中心办公交卡年审，提前半小时提醒我。"
    ],
    "actions": [
      [
        "Primary",
        "模拟说话"
      ],
      [
        "Secondary",
        "手动填写"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-TASK-02",
    "title": "正在帮你整理",
    "tone": "Info",
    "status": "处理中",
    "card": [
      "你刚才说",
      "明天上午九点去社区服务中心办年审，提前半小时提醒，再问小梅能否陪同。"
    ],
    "actions": [
      [
        "Quiet",
        "返回"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-TASK-03A",
    "title": "看看我理解得对不对",
    "tone": "Info",
    "status": "需要你确认",
    "card": [
      "我理解的是",
      "公交卡年审，明天上午 9:00，地点是社区服务中心。"
    ],
    "fields": [
      [
        "提醒",
        "提前 30 分钟"
      ],
      [
        "家属",
        "提到希望小梅陪同"
      ]
    ],
    "actions": [
      [
        "Primary",
        "确认无误"
      ],
      [
        "Secondary",
        "改一处"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-TASK-03B",
    "title": "时间可能不对",
    "tone": "Warning",
    "status": "识别错误",
    "card": [
      "你刚才说",
      "你说的是上午 9:00；系统暂时整理成了上午 8:00。"
    ],
    "fields": [
      [
        "时间",
        "明天上午 8:00"
      ],
      [
        "提醒",
        "上午 7:30"
      ]
    ],
    "actions": [
      [
        "Primary",
        "改时间"
      ],
      [
        "Secondary",
        "改其他内容"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-TASK-04",
    "title": "改成几点？",
    "tone": "Warning",
    "status": "正在修改时间",
    "card": [
      "只改这一项",
      "其他事项、日期、地点和家属意图都不会改变。"
    ],
    "fields": [
      [
        "当前",
        "上午 8:00"
      ],
      [
        "改为",
        "上午 9:00"
      ]
    ],
    "actions": [
      [
        "Primary",
        "改成上午 9:00"
      ],
      [
        "Secondary",
        "不改了"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-TASK-05",
    "title": "再看一遍",
    "tone": "Info",
    "status": "确认后才会记好",
    "card": [
      "最终安排",
      "明天上午 9:00（10 月 7 日）去社区服务中心办理公交卡年审。"
    ],
    "fields": [
      [
        "提醒",
        "明天上午 8:30"
      ],
      [
        "协作",
        "稍后决定是否告诉小梅"
      ]
    ],
    "actions": [
      [
        "Primary",
        "确认记好"
      ],
      [
        "Secondary",
        "返回修改"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-TASK-06",
    "title": "这件事已记好",
    "tone": "Success",
    "status": "个人提醒已保存",
    "card": [
      "明天的安排",
      "上午 9:00 去社区服务中心办理公交卡年审。"
    ],
    "fields": [
      [
        "提醒",
        "明天上午 8:30"
      ],
      [
        "家属",
        "还没有告诉小梅"
      ]
    ],
    "actions": [
      [
        "Primary",
        "请小梅陪同"
      ],
      [
        "Secondary",
        "只提醒我自己"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-TASK-07",
    "title": "该准备出发了",
    "tone": "Warning",
    "status": "提醒已触发",
    "card": [
      "今天上午 9:00",
      "去社区服务中心办理公交卡年审。小梅是否陪同以她的回复为准。"
    ],
    "actions": [
      [
        "Primary",
        "知道了"
      ],
      [
        "Secondary",
        "查看这件事"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-TASK-08",
    "title": "修改已共享的事情",
    "tone": "Warning",
    "status": "旧请求会失效",
    "card": [
      "修改的影响",
      "时间、地点或所需帮助改变后，小梅不能再回应旧请求。"
    ],
    "actions": [
      [
        "Primary",
        "继续修改"
      ],
      [
        "Secondary",
        "暂不修改"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-TASK-09A",
    "title": "这件事已经办完了吗？",
    "tone": "Warning",
    "status": "需要确认",
    "card": [
      "确认完成",
      "只有现实中的公交卡年审已经办完，才选择完成。"
    ],
    "actions": [
      [
        "Primary",
        "这件事办完了"
      ],
      [
        "Secondary",
        "还没有"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-TASK-09B",
    "title": "这件事已完成",
    "tone": "Success",
    "status": "已完成",
    "card": [
      "已停止提醒",
      "公交卡年审已由你确认完成。小梅此前的回应仅作记录。"
    ],
    "actions": [
      [
        "Primary",
        "返回首页"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-TASK-10",
    "title": "当前事务已结束",
    "tone": "Neutral",
    "status": "完成或取消",
    "card": [
      "你接下来可以",
      "查看这次结果，或者重新记一件新的事情。"
    ],
    "actions": [
      [
        "Primary",
        "记一件新事"
      ],
      [
        "Secondary",
        "查看结果"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-EX-01",
    "title": "还需要知道时间",
    "tone": "Warning",
    "status": "必要信息缺失",
    "card": [
      "我不会替你猜",
      "已经保留事项、日期和地点，只需要补上具体时间。"
    ],
    "actions": [
      [
        "Primary",
        "补上时间"
      ],
      [
        "Secondary",
        "返回输入"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-EX-02A",
    "title": "这次没有整理好",
    "tone": "Danger",
    "status": "AI 解析失败",
    "card": [
      "你的原话还在",
      "没有创建事务，也没有告诉小梅。你可以重试或手动填写。"
    ],
    "actions": [
      [
        "Primary",
        "再试一次"
      ],
      [
        "Secondary",
        "手动填写"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-EX-02B",
    "title": "手动填写",
    "tone": "Info",
    "status": "不依赖 AI",
    "card": [
      "填写这件事",
      "输入后仍会让你检查，确认之前不会保存。"
    ],
    "fields": [
      [
        "事项",
        "办理公交卡年审"
      ],
      [
        "时间",
        "明天上午 9:00"
      ]
    ],
    "actions": [
      [
        "Primary",
        "保存并检查"
      ],
      [
        "Secondary",
        "返回"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-SHARE-01",
    "title": "要请小梅陪你去吗？",
    "tone": "Neutral",
    "status": "还没有共享",
    "card": [
      "个人提醒已经设好",
      "无论是否邀请小梅，明天上午 8:30 都会提醒你。"
    ],
    "actions": [
      [
        "Primary",
        "请小梅陪我去"
      ],
      [
        "Secondary",
        "只提醒我自己"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-SHARE-01B",
    "title": "只提醒你自己",
    "tone": "Neutral",
    "status": "没有共享",
    "card": [
      "没有告诉小梅",
      "明天上午 8:30 仍会提醒你，家属端不会出现请求。"
    ],
    "actions": [
      [
        "Primary",
        "返回这件事"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-SHARE-02",
    "title": "这次小梅会看到",
    "tone": "Info",
    "status": "等待你确认共享",
    "card": [
      "只分享这五项",
      "事项、日期、时间、地点，以及希望小梅陪同。不会分享提醒、原话或位置。"
    ],
    "actions": [
      [
        "Primary",
        "发给小梅"
      ],
      [
        "Secondary",
        "暂不发送"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-SHARE-03",
    "title": "正在发给小梅",
    "tone": "Info",
    "status": "发送中",
    "card": [
      "还不能算已收到",
      "请稍等。你的个人事务和提醒已经安全保存。"
    ],
    "actions": [
      [
        "Quiet",
        "请稍等"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-SHARE-04A",
    "title": "已经发给小梅",
    "tone": "Success",
    "status": "发送成功",
    "card": [
      "请求已经送出",
      "接下来等待小梅选择接受、拒绝或建议改期。"
    ],
    "actions": [
      [
        "Primary",
        "查看等待状态"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-SHARE-04B",
    "title": "正在等小梅回复",
    "tone": "Info",
    "status": "等待回应",
    "card": [
      "你的提醒已经设好",
      "小梅还没有回复。明天上午 8:30 仍会提醒你。"
    ],
    "actions": [
      [
        "Primary",
        "继续等待"
      ],
      [
        "Secondary",
        "撤回请求"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-SHARE-05",
    "title": "小梅答应陪你去",
    "tone": "Success",
    "status": "已接受",
    "card": [
      "协作结果",
      "小梅会陪同。公交卡年审仍需你在现实办完后确认完成。"
    ],
    "actions": [
      [
        "Primary",
        "知道了"
      ],
      [
        "Secondary",
        "查看这件事"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-SHARE-06",
    "title": "小梅这次不能陪同",
    "tone": "Warning",
    "status": "已拒绝",
    "card": [
      "你的事情没有取消",
      "明天上午 8:30 仍会提醒你，你可以自行安排。"
    ],
    "actions": [
      [
        "Primary",
        "我自己安排"
      ],
      [
        "Danger",
        "取消这件事"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-SHARE-07",
    "title": "小梅建议改到下午 2 点",
    "tone": "Warning",
    "status": "等待你决定",
    "card": [
      "原时间仍是上午 9:00",
      "只有你同意以后，事务时间才会改变。"
    ],
    "actions": [
      [
        "Primary",
        "改成下午 2 点"
      ],
      [
        "Secondary",
        "还是上午 9 点"
      ],
      [
        "Quiet",
        "撤回请求"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-SHARE-08",
    "title": "新时间还没有重新分享",
    "tone": "Warning",
    "status": "旧请求已失效",
    "card": [
      "事务已改为下午 2 点",
      "小梅原来的答复不会自动继承，你需要决定是否重新发送。"
    ],
    "actions": [
      [
        "Primary",
        "重新发给小梅"
      ],
      [
        "Secondary",
        "只保留事务"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-SHARE-09",
    "title": "仍按上午 9 点",
    "tone": "Info",
    "status": "继续等待回应",
    "card": [
      "没有接受改期",
      "事务时间没有改变，小梅可以继续回应原请求。"
    ],
    "actions": [
      [
        "Primary",
        "继续等待"
      ],
      [
        "Secondary",
        "撤回请求"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-EX-03",
    "title": "还没有发给小梅",
    "tone": "Danger",
    "status": "发送失败",
    "card": [
      "个人内容没有丢失",
      "事情和明天上午 8:30 的提醒仍在，家属端没有假请求。"
    ],
    "actions": [
      [
        "Primary",
        "再试一次"
      ],
      [
        "Secondary",
        "暂不发送"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-EX-04",
    "title": "小梅还没有回复",
    "tone": "Warning",
    "status": "暂未回应",
    "card": [
      "这不是拒绝",
      "你可以继续等、撤回陪同请求，或者决定自己安排。"
    ],
    "actions": [
      [
        "Primary",
        "继续等一等"
      ],
      [
        "Secondary",
        "撤回请求"
      ],
      [
        "Quiet",
        "我自己安排"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-EX-05A",
    "title": "确定不用小梅陪了吗？",
    "tone": "Warning",
    "status": "撤回请求确认",
    "card": [
      "只撤回陪同请求",
      "公交卡年审和明天上午 8:30 的提醒都会保留。"
    ],
    "actions": [
      [
        "Danger",
        "确认撤回请求"
      ],
      [
        "Secondary",
        "返回"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-EX-05B",
    "title": "已告诉小梅不用陪同",
    "tone": "Success",
    "status": "请求已撤回",
    "card": [
      "你的事情还在",
      "明天上午 8:30 仍会提醒你。"
    ],
    "actions": [
      [
        "Primary",
        "返回这件事"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-EX-06A",
    "title": "确定取消这件事吗？",
    "tone": "Danger",
    "status": "取消事务确认",
    "card": [
      "取消后的影响",
      "事务和提醒都会取消，小梅也不能再回应原请求。"
    ],
    "actions": [
      [
        "Danger",
        "确认取消这件事"
      ],
      [
        "Secondary",
        "返回"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-EX-06B",
    "title": "这件事已取消",
    "tone": "Danger",
    "status": "已取消",
    "card": [
      "全部相关状态已结束",
      "提醒已取消，给小梅的请求也已失效。"
    ],
    "actions": [
      [
        "Primary",
        "返回首页"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-EX-07A",
    "title": "修改后旧请求会失效",
    "tone": "Warning",
    "status": "版本变更确认",
    "card": [
      "需要重新分享",
      "小梅看到的旧时间和旧答复不会带到新版本。"
    ],
    "actions": [
      [
        "Primary",
        "确认保存新版本"
      ],
      [
        "Secondary",
        "返回"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-EX-07B",
    "title": "新版本已经保存",
    "tone": "Info",
    "status": "尚未共享新版本",
    "card": [
      "旧请求已经失效",
      "你可以重新查看共享内容后发送，或者只保留个人提醒。"
    ],
    "actions": [
      [
        "Primary",
        "查看并重新发送"
      ],
      [
        "Secondary",
        "只提醒我自己"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-SET-01",
    "title": "显示设置",
    "tone": "Neutral",
    "status": "P1 可选能力",
    "card": [
      "默认已经适老",
      "可在 P0 完成后提供标准 / 大字和高对比切换。"
    ],
    "fields": [
      [
        "文字大小",
        "大字"
      ],
      [
        "对比度",
        "标准"
      ]
    ],
    "actions": [
      [
        "Primary",
        "保存显示设置"
      ],
      [
        "Secondary",
        "恢复默认"
      ]
    ],
    "role": "Elder",
    "group": "老人端"
  },
  {
    "id": "EL-REL-01",
    "role": "Elder",
    "title": "邀请小梅建立家庭协作",
    "tone": "Info",
    "status": "首次建立关系",
    "card": [
      "让家人扫码",
      "二维码只用于确认双方身份，不会自动共享事务、位置或历史。"
    ],
    "actions": [
      [
        "Primary",
        "显示二维码"
      ],
      [
        "Secondary",
        "以后再说"
      ]
    ],
    "group": "关系授权"
  },
  {
    "id": "FM-REL-01",
    "role": "Family",
    "title": "扫描张阿姨的二维码",
    "tone": "Info",
    "status": "等待扫码",
    "card": [
      "你将申请成为协助者",
      "建立后只能收到张阿姨主动发来的具体请求。"
    ],
    "actions": [
      [
        "Primary",
        "模拟扫码"
      ],
      [
        "Secondary",
        "取消"
      ]
    ],
    "group": "关系授权"
  },
  {
    "id": "EL-REL-02",
    "role": "Elder",
    "title": "小梅想和你建立协作",
    "tone": "Warning",
    "status": "需要你确认",
    "card": [
      "请核对身份",
      "小梅（女儿）提出申请。她不会自动看到你的提醒、历史或位置。"
    ],
    "actions": [
      [
        "Primary",
        "同意建立"
      ],
      [
        "Secondary",
        "暂不同意"
      ],
      [
        "Quiet",
        "她能看到什么"
      ]
    ],
    "group": "关系授权"
  },
  {
    "id": "EL-REL-02A",
    "role": "Elder",
    "title": "小梅能看到什么？",
    "tone": "Info",
    "status": "权限说明",
    "card": [
      "只有你每次主动发出的内容",
      "事项、日期、时间、地点、希望她提供的帮助。"
    ],
    "fields": [
      [
        "默认不可见",
        "提醒时间、原话、位置、历史事务"
      ],
      [
        "控制方式",
        "每件事单独确认"
      ]
    ],
    "actions": [
      [
        "Primary",
        "我明白了"
      ],
      [
        "Secondary",
        "返回"
      ]
    ],
    "group": "关系授权"
  },
  {
    "id": "EL-REL-03",
    "role": "Elder",
    "title": "已建立家庭协作",
    "tone": "Success",
    "status": "关系已确认",
    "card": [
      "现在可以向小梅求助",
      "建立关系不等于永久共享；每件事务仍由你决定是否发送。"
    ],
    "actions": [
      [
        "Primary",
        "继续记事"
      ],
      [
        "Secondary",
        "管理关系"
      ]
    ],
    "group": "关系授权"
  },
  {
    "id": "FM-REL-03",
    "role": "Family",
    "title": "已和张阿姨建立协作",
    "tone": "Success",
    "status": "关系已确认",
    "card": [
      "你的权限",
      "只能回应她主动发来的单次请求，不能改、删或完成她的事务。"
    ],
    "actions": [
      [
        "Primary",
        "查看请求"
      ],
      [
        "Secondary",
        "返回首页"
      ]
    ],
    "group": "关系授权"
  },
  {
    "id": "EL-REL-06",
    "role": "Elder",
    "title": "已拒绝这次申请",
    "tone": "Neutral",
    "status": "没有建立关系",
    "card": [
      "小梅不会获得协作权限",
      "以后需要时，可以重新发起建立关系。"
    ],
    "actions": [
      [
        "Primary",
        "返回"
      ]
    ],
    "group": "关系授权"
  },
  {
    "id": "FM-REL-02",
    "role": "Family",
    "title": "正在等张阿姨确认",
    "tone": "Warning",
    "status": "申请待确认",
    "card": [
      "暂时不能查看任何事务",
      "请让张阿姨在自己的设备上决定是否同意。"
    ],
    "actions": [
      [
        "Primary",
        "知道了"
      ]
    ],
    "group": "关系授权"
  },
  {
    "id": "EL-REL-07",
    "role": "Elder",
    "title": "申请已失效",
    "tone": "Danger",
    "status": "二维码过期",
    "card": [
      "没有建立关系",
      "请重新显示二维码。失效二维码不能继续使用。"
    ],
    "actions": [
      [
        "Primary",
        "重新生成"
      ],
      [
        "Secondary",
        "返回"
      ]
    ],
    "group": "关系授权"
  },
  {
    "id": "EL-REL-04A",
    "role": "Elder",
    "title": "要解除与小梅的协作吗？",
    "tone": "Warning",
    "status": "需要再次确认",
    "card": [
      "解除后的影响",
      "未处理请求会撤回；小梅不能再收到新的请求。个人提醒不受影响。"
    ],
    "actions": [
      [
        "Danger",
        "确认解除"
      ],
      [
        "Secondary",
        "保留关系"
      ]
    ],
    "group": "关系授权"
  },
  {
    "id": "EL-REL-05",
    "role": "Elder",
    "title": "已解除家庭协作",
    "tone": "Success",
    "status": "关系已解除",
    "card": [
      "小梅已无法继续查看请求",
      "你的个人事务和提醒仍保留。以后可重新建立关系。"
    ],
    "actions": [
      [
        "Primary",
        "返回首页"
      ]
    ],
    "group": "关系授权"
  },
  {
    "id": "FM-REL-04",
    "role": "Family",
    "title": "家庭协作已解除",
    "tone": "Neutral",
    "status": "无法继续回应",
    "card": [
      "张阿姨已解除关系",
      "此前请求只保留结果摘要，不再显示事务详情。"
    ],
    "actions": [
      [
        "Primary",
        "知道了"
      ]
    ],
    "group": "关系授权"
  },
  {
    "id": "FM-REQ-00",
    "title": "张阿姨的协作请求",
    "tone": "Neutral",
    "status": "暂时没有新请求",
    "card": [
      "你只会看到她主动发送的事情",
      "不会显示她的其他提醒、位置、历史或语音原话。"
    ],
    "actions": [
      [
        "Primary",
        "返回首页"
      ]
    ],
    "role": "Family",
    "group": "家属端"
  },
  {
    "id": "FM-REQ-01",
    "title": "张阿姨希望你陪同",
    "tone": "Warning",
    "status": "等待你的回复",
    "card": [
      "公交卡年审",
      "10 月 7 日上午 9:00，社区服务中心；希望你陪她一起去。"
    ],
    "fields": [
      [
        "可见范围",
        "事项、时间、地点、陪同请求"
      ],
      [
        "不可操作",
        "不能改、删或标记完成"
      ]
    ],
    "actions": [
      [
        "Primary",
        "我可以陪你"
      ],
      [
        "Secondary",
        "我不能陪同"
      ],
      [
        "Quiet",
        "建议改时间"
      ]
    ],
    "role": "Family",
    "group": "家属端"
  },
  {
    "id": "FM-REQ-02",
    "title": "确认答应陪同",
    "tone": "Warning",
    "status": "回复前确认",
    "card": [
      "你将告诉张阿姨",
      "明天上午 9:00 可以陪她去社区服务中心。"
    ],
    "actions": [
      [
        "Primary",
        "确认可以陪同"
      ],
      [
        "Secondary",
        "再想一想"
      ]
    ],
    "role": "Family",
    "group": "家属端"
  },
  {
    "id": "FM-REQ-03A",
    "title": "已回复可以陪同",
    "tone": "Success",
    "status": "已接受请求",
    "card": [
      "张阿姨会看到",
      "小梅可以在明天上午 9:00 陪同。事务仍需她自己确认完成。"
    ],
    "actions": [
      [
        "Primary",
        "返回请求"
      ]
    ],
    "role": "Family",
    "group": "家属端"
  },
  {
    "id": "FM-REQ-03B",
    "title": "这个请求已变化",
    "tone": "Warning",
    "status": "旧回复已失效",
    "card": [
      "张阿姨修改了时间",
      "请查看最新的下午 2:00 请求；原上午 9:00 回复不再生效。"
    ],
    "actions": [
      [
        "Primary",
        "查看最新请求"
      ]
    ],
    "role": "Family",
    "group": "家属端"
  },
  {
    "id": "FM-REQ-04A",
    "title": "确认不能陪同",
    "tone": "Warning",
    "status": "回复前确认",
    "card": [
      "你将告诉张阿姨",
      "这次不能陪同。她的个人提醒仍然有效。"
    ],
    "actions": [
      [
        "Danger",
        "确认不能陪同"
      ],
      [
        "Secondary",
        "返回"
      ]
    ],
    "role": "Family",
    "group": "家属端"
  },
  {
    "id": "FM-REQ-04B",
    "title": "已回复不能陪同",
    "tone": "Neutral",
    "status": "已拒绝请求",
    "card": [
      "张阿姨已收到结果",
      "你没有取消她的事务，也没有改变她的提醒。"
    ],
    "actions": [
      [
        "Primary",
        "返回请求"
      ]
    ],
    "role": "Family",
    "group": "家属端"
  },
  {
    "id": "FM-REQ-05A",
    "title": "建议一个新时间",
    "tone": "Info",
    "status": "只提出建议",
    "card": [
      "不会直接修改事务",
      "选择下午 2:00 后，仍要由张阿姨决定是否接受。"
    ],
    "fields": [
      [
        "原时间",
        "明天上午 9:00"
      ],
      [
        "建议时间",
        "明天下午 2:00"
      ]
    ],
    "actions": [
      [
        "Primary",
        "发送建议"
      ],
      [
        "Secondary",
        "取消"
      ]
    ],
    "role": "Family",
    "group": "家属端"
  },
  {
    "id": "FM-REQ-05B",
    "title": "改期建议已发送",
    "tone": "Success",
    "status": "等待老人决定",
    "card": [
      "事务时间没有自动改变",
      "张阿姨接受后，双方才会看到下午 2:00 的新请求。"
    ],
    "actions": [
      [
        "Primary",
        "知道了"
      ]
    ],
    "role": "Family",
    "group": "家属端"
  },
  {
    "id": "FM-EX-01",
    "title": "请求正在更新",
    "tone": "Warning",
    "status": "暂时不能回应",
    "card": [
      "请查看最新内容",
      "张阿姨正在修改事务；当前页面不会提交回复。"
    ],
    "actions": [
      [
        "Primary",
        "刷新请求"
      ]
    ],
    "role": "Family",
    "group": "家属端"
  },
  {
    "id": "FM-EX-02",
    "title": "请求已被撤回",
    "tone": "Neutral",
    "status": "无需回应",
    "card": [
      "张阿姨不再需要陪同",
      "她的个人事务可能仍然保留，但不会继续向你共享。"
    ],
    "actions": [
      [
        "Primary",
        "返回首页"
      ]
    ],
    "role": "Family",
    "group": "家属端"
  },
  {
    "id": "FM-EX-03",
    "title": "回复没有发出去",
    "tone": "Danger",
    "status": "发送失败",
    "card": [
      "不会显示为已回复",
      "请重试；重试前仍保持“等待回复”，不会重复提交。"
    ],
    "actions": [
      [
        "Primary",
        "重新发送"
      ],
      [
        "Secondary",
        "稍后处理"
      ]
    ],
    "role": "Family",
    "group": "家属端"
  },
  {
    "id": "DM-01",
    "title": "演示控制台",
    "tone": "Info",
    "status": "可切换角色",
    "card": [
      "预置案例",
      "张阿姨明天上午 9:00 办理公交卡年审，提前 30 分钟提醒，可邀请小梅陪同。"
    ],
    "actions": [
      [
        "Primary",
        "以张阿姨开始"
      ],
      [
        "Secondary",
        "切换到小梅"
      ]
    ],
    "role": "Demo",
    "group": "演示工具"
  },
  {
    "id": "DM-02",
    "title": "选择要演示的状态",
    "tone": "Neutral",
    "status": "状态模拟",
    "card": [
      "所有数据均为预置",
      "不会调用真实 AI、消息、定位或外部服务。"
    ],
    "actions": [
      [
        "Primary",
        "主流程"
      ],
      [
        "Secondary",
        "识别错误"
      ],
      [
        "Quiet",
        "家属未回应"
      ]
    ],
    "role": "Demo",
    "group": "演示工具"
  },
  {
    "id": "DM-03",
    "title": "已恢复初始状态",
    "tone": "Success",
    "status": "重置完成",
    "card": [
      "现在可以重新演示",
      "关系未建立、没有事务、没有请求；预置角色信息保留。"
    ],
    "actions": [
      [
        "Primary",
        "开始演示"
      ]
    ],
    "role": "Demo",
    "group": "演示工具"
  },
  {
    "id": "DM-04A",
    "title": "你正在查看张阿姨端",
    "tone": "Info",
    "status": "老人角色",
    "card": [
      "角色边界",
      "这里能创建、确认、修改和取消自己的事务，并决定是否向小梅求助。"
    ],
    "actions": [
      [
        "Primary",
        "切换到小梅端"
      ],
      [
        "Secondary",
        "继续老人流程"
      ]
    ],
    "role": "Demo",
    "group": "演示工具"
  },
  {
    "id": "DM-04B",
    "title": "你正在查看小梅端",
    "tone": "Info",
    "status": "家属角色",
    "card": [
      "角色边界",
      "这里只能回应张阿姨主动发来的请求，不能编辑、删除或完成她的事务。"
    ],
    "actions": [
      [
        "Primary",
        "切换到张阿姨端"
      ],
      [
        "Secondary",
        "继续家属流程"
      ]
    ],
    "role": "Demo",
    "group": "演示工具"
  }
];
