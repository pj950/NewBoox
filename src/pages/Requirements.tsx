import React from 'react';
import { ArrowLeft, CheckCircle2, CircleDot, CircleDashed, Rocket, FileText } from 'lucide-react';
import { Page, NavigationParams } from '../App';

interface RequirementsProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
}

type Status = '已实现' | '部分实现' | '计划中' | '未来方向';

interface SpecItem {
  title: string;
  status: Status;
  note?: string;
}

interface SpecGroup {
  title: string;
  items: SpecItem[];
}

interface SpecSection {
  section: string;
  groups: SpecGroup[];
}

const statusStyles: Record<Status, { bg: string; text: string; border: string; icon: JSX.Element }> = {
  '已实现': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
  },
  '部分实现': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: <CircleDot className="h-3.5 w-3.5 text-blue-600" />
  },
  '计划中': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: <CircleDashed className="h-3.5 w-3.5 text-amber-600" />
  },
  '未来方向': {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: <Rocket className="h-3.5 w-3.5 text-gray-600" />
  }
};

const specData: SpecSection[] = [
  {
    section: '一、个人用户系统',
    groups: [
      {
        title: '1.1 仓库管理模块',
        items: [
          { title: '可以创建多个仓库（仓库→盒子→物品）', status: '已实现', note: '支持仓库/盒子/物品多级结构与详情页' },
          { title: '一个仓库里有多个盒子，一个盒子里有多个物品', status: '已实现', note: '数据模型和界面均支持' },
          { title: '自定义仓库样式（衣柜/书架/冰箱/票据/相册等等）', status: '部分实现', note: '支持类型与主题色选择，暂无专用模板' },
          { title: '拍照上传物品并智能识别标签', status: '部分实现', note: '支持拍照/上传与模拟AI识别填充' },
          { title: '物品状态管理（在用/闲置/损坏/借出）', status: '已实现', note: '提供在用/闲置/借出/维修中等状态' },
          { title: '物品批量操作（批量移动/删除/标签修改）', status: '计划中' },
          { title: '仓库容量限制与扩容机制', status: '部分实现', note: '盒子容量与利用率统计，未强制限制' },
          { title: '物品到期提醒（保质期/保修期）', status: '计划中', note: '具备通知能力，待接入提醒逻辑' }
        ]
      },
      {
        title: '1.2 物品交互模块',
        items: [
          { title: '扫码/NFC实体物品', status: '部分实现', note: '支持二维码扫码，NFC待实现' },
          { title: '物品属性标注（颜色/尺寸/购买时间）', status: '部分实现', note: '支持购买时间/价格/品牌/型号，颜色/尺寸待补充' },
          { title: '快速搜索（标签/路径/模糊匹配）', status: '已实现', note: '内置拼音/模糊搜索，支持多条件' },
          { title: '物品使用记录（最后使用时间/使用频率）', status: '已实现', note: '支持记录与统计展示' },
          { title: '智能推荐功能（基于使用习惯推荐物品位置）', status: '部分实现', note: '提供相关物品推荐' },
          { title: '物品关联性分析（经常一起使用的物品组合）', status: '部分实现' },
          { title: '语音搜索功能', status: '计划中' }
        ]
      },
      {
        title: '1.3 个人成长模块',
        items: [
          { title: '每日签到奖励（积分+金币）', status: '计划中' },
          { title: '等级体系（经验值计算）', status: '部分实现', note: '基于成就积分推导等级' },
          { title: '成就系统（徽章收集）', status: '已实现', note: 'AchievementManager 支持' },
          { title: '收纳整理达人', status: '已实现', note: '成就体系覆盖' },
          { title: '推广达人', status: '计划中' }
        ]
      },
      {
        title: '1.4 社交互动模块',
        items: [
          { title: '关注/粉丝系统', status: '计划中' },
          { title: '仓库分享（公开/私密/指定用户）', status: '计划中' },
          { title: '点赞/评论他人仓库物品', status: '部分实现', note: '社区帖子支持点赞/评论，仓库物品评论待接入' }
        ]
      },
      {
        title: '1.5 虚拟资产模块',
        items: [
          { title: '积分兑换虚拟装扮（仓库皮肤/AR特效）', status: '计划中' },
          { title: '金币购买虚拟道具（标签模板/智能分类助手）', status: '计划中' }
        ]
      }
    ]
  },
  {
    section: '二、社区模块',
    groups: [
      {
        title: '2.1 板块管理',
        items: [
          { title: '官方频道（教程/活动公告）', status: '计划中' },
          { title: '用户自建兴趣板块', status: '计划中' },
          { title: '板块订阅与推荐算法', status: '计划中' }
        ]
      },
      {
        title: '2.2 内容互动模块',
        items: [
          { title: '发帖/回帖（支持图片+物品链接）', status: '部分实现', note: '支持发帖与图片，物品链接待完善' },
          { title: '帖子热度排行（点赞/评论/分享）', status: '部分实现', note: '有热门/最新分栏，排行逻辑待完善' },
          { title: '打赏系统（金币打赏优质内容）', status: '计划中' },
          { title: '内容分级制度（新手/进阶/专家内容标识）', status: '计划中' },
          { title: '专家认证体系（领域KOL认证）', status: '部分实现', note: '支持用户认证标识字段' },
          { title: '内容举报与处理机制', status: '计划中' }
        ]
      },
      {
        title: '2.3 积分经济模块',
        items: [
          { title: '积分获取（发帖/活动参与）→ 解锁高级功能', status: '计划中' },
          { title: '金币获取（内容打赏/充值）→ 兑换实体盲盒', status: '计划中' },
          { title: '虚拟商城（虚拟装扮/道具购买）', status: '计划中' }
        ]
      },
      {
        title: '2.4 线下活动模块',
        items: [
          { title: '城市寻宝（AR+NFC触发）', status: '未来方向' },
          { title: '解谜大赛（实体魔盒拼图）', status: '未来方向' },
          { title: '魔盒交换市集（扫码转移所有权）', status: '未来方向' }
        ]
      },
      {
        title: '2.5 自治管理模块',
        items: [
          { title: '版主竞选（社区投票）', status: '未来方向' },
          { title: '规则提案与公投', status: '未来方向' },
          { title: '纠纷仲裁委员会', status: '未来方向' }
        ]
      },
      {
        title: '2.6 虚实联动模块',
        items: [
          { title: '实体魔盒编码绑定APP数据', status: '未来方向' },
          { title: '扫描魔盒解锁AR内容（3D模型/故事线索）', status: '未来方向' },
          { title: '活动积分双倍奖励', status: '未来方向' }
        ]
      }
    ]
  },
  {
    section: '三、核心系统模块',
    groups: [
      {
        title: '3.1 用户认证模块',
        items: [
          { title: '手机/邮箱注册', status: '计划中' },
          { title: '第三方登录（微信/Google）', status: '计划中' },
          { title: '生物识别（Face ID/指纹）', status: '未来方向' }
        ]
      },
      {
        title: '3.2 数据存储模块',
        items: [
          { title: '分布式存储（用户图片/视频）', status: '未来方向' },
          { title: '冷热数据分离（高频访问数据缓存优化）', status: '未来方向' },
          { title: '数据库读写分离', status: '未来方向' },
          { title: 'CDN加速（图片/视频内容分发）', status: '未来方向' }
        ]
      },
      {
        title: '3.3 安全风控模块',
        items: [
          { title: '内容审核（AI+人工）', status: '计划中' },
          { title: '防刷机制（行为分析模型）', status: '未来方向' },
          { title: '虚拟货币防通胀设计', status: '未来方向' },
          { title: 'GDPR/CCPA合规', status: '计划中' },
          { title: '用户隐私控制面板', status: '部分实现', note: '设置页具备入口，功能待完善' }
        ]
      },
      {
        title: '3.5 货币体系模块',
        items: [
          { title: '积分/金币/钻石多层级货币', status: '计划中' },
          { title: '钱包系统（交易记录查询）', status: '计划中' },
          { title: '兑换比例动态调整', status: '未来方向' }
        ]
      },
      {
        title: '3.6 性能优化模块',
        items: [
          { title: '缓存策略优化（Redis多级缓存）', status: '未来方向' },
          { title: '图片压缩与格式优化', status: '计划中' },
          { title: '数据匿名化处理', status: '未来方向' }
        ]
      },
      {
        title: '3.7 用户体验模块',
        items: [
          { title: '个性化推荐引擎', status: '部分实现', note: '相关物品/热门话题等' },
          { title: '智能消息推送（避免过度打扰）', status: '部分实现', note: '具备PWA通知能力' },
          { title: '多语言国际化支持', status: '部分实现', note: '语言设置项已提供，i18n待接入' },
          { title: '无障碍访问设计', status: '计划中' }
        ]
      }
    ]
  },
  {
    section: '四、新增核心模块',
    groups: [
      {
        title: '4.1 数据同步与备份模块',
        items: [
          { title: '跨设备数据同步', status: '部分实现', note: '离线同步队列+模拟服务端' },
          { title: '数据备份与恢复', status: '已实现', note: '支持JSON备份导出/导入' },
          { title: '数据导出（用户数据主权）', status: '已实现', note: '支持Excel导出' }
        ]
      },
      {
        title: '4.2 AI智能助手模块',
        items: [
          { title: '智能整理建议（基于物品使用模式）', status: '计划中' },
          { title: '语音助手集成', status: '计划中' },
          { title: '图像识别优化（提高物品识别准确率）', status: '部分实现', note: '内置模拟识别服务' }
        ]
      },
      {
        title: '4.3 商业化功能模块',
        items: [
          { title: '广告系统（品牌植入/原生广告）', status: '计划中' },
          { title: '会员订阅制（高级功能解锁）', status: '计划中' }
        ]
      }
    ]
  },
  {
    section: '五、扩展模块（未来方向）',
    groups: [
      {
        title: '5.1 虚实融合模块',
        items: [
          { title: '元宇宙展厅（3D展示仓库）', status: '未来方向' },
          { title: 'NFT化稀有物品', status: '未来方向' }
        ]
      },
      {
        title: '5.2 自治社区模块',
        items: [
          { title: 'DAO治理（链上投票）', status: '未来方向' },
          { title: '社区金库（活动资金众筹）', status: '未来方向' }
        ]
      },
      {
        title: '5.3 营销功能模块',
        items: [
          { title: '裂变邀请（生成专属魔盒链接）', status: '未来方向' },
          { title: '品牌联名活动（限量版实体魔盒）', status: '未来方向' }
        ]
      },
      {
        title: '5.4 高级数据分析模块',
        items: [
          { title: '用户行为画像', status: '未来方向' },
          { title: '仓库热度地图（物品聚集区域分析）', status: '未来方向' }
        ]
      }
    ]
  }
];

function computeSummary(data: SpecSection[]) {
  const counts: Record<Status, number> = { '已实现': 0, '部分实现': 0, '计划中': 0, '未来方向': 0 };
  data.forEach(section => {
    section.groups.forEach(group => {
      group.items.forEach(item => {
        counts[item.status] += 1;
      });
    });
  });
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return { ...counts, total };
}

export default function Requirements({ onNavigate }: RequirementsProps) {
  const summary = computeSummary(specData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="relative px-6 pt-12 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('profile')}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-white" />
                  <span>智能仓库管理系统需求追踪</span>
                </h1>
                <p className="text-purple-100">当前实现进度与规划</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className={`p-4 rounded-2xl border ${statusStyles['已实现'].border} ${statusStyles['已实现'].bg}`}>
            <div className="flex items-center space-x-2">
              {statusStyles['已实现'].icon}
              <span className={`text-sm font-semibold ${statusStyles['已实现'].text}`}>已实现</span>
              <span className="ml-auto text-base font-bold text-emerald-700">{summary['已实现']}</span>
            </div>
          </div>
          <div className={`p-4 rounded-2xl border ${statusStyles['部分实现'].border} ${statusStyles['部分实现'].bg}`}>
            <div className="flex items-center space-x-2">
              {statusStyles['部分实现'].icon}
              <span className={`text-sm font-semibold ${statusStyles['部分实现'].text}`}>部分实现</span>
              <span className="ml-auto text-base font-bold text-blue-700">{summary['部分实现']}</span>
            </div>
          </div>
          <div className={`p-4 rounded-2xl border ${statusStyles['计划中'].border} ${statusStyles['计划中'].bg}`}>
            <div className="flex items-center space-x-2">
              {statusStyles['计划中'].icon}
              <span className={`text-sm font-semibold ${statusStyles['计划中'].text}`}>计划中</span>
              <span className="ml-auto text-base font-bold text-amber-700">{summary['计划中']}</span>
            </div>
          </div>
          <div className={`p-4 rounded-2xl border ${statusStyles['未来方向'].border} ${statusStyles['未来方向'].bg}`}>
            <div className="flex items-center space-x-2">
              {statusStyles['未来方向'].icon}
              <span className={`text-sm font-semibold ${statusStyles['未来方向'].text}`}>未来方向</span>
              <span className="ml-auto text-base font-bold text-gray-700">{summary['未来方向']}</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        {specData.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-xl font-extrabold text-gray-900">{section.section}</h2>
            {section.groups.map((group, gIdx) => (
              <div key={gIdx} className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{group.title}</h3>
                <div className="space-y-3">
                  {group.items.map((item, iIdx) => {
                    const style = statusStyles[item.status];
                    return (
                      <div key={iIdx} className="flex items-start justify-between p-3 rounded-2xl border bg-gradient-to-r from-gray-50 to-white">
                        <div className="pr-3">
                          <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                          {item.note && (
                            <p className="text-xs text-gray-500 mt-1">{item.note}</p>
                          )}
                        </div>
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border ${style.border} ${style.bg}`}>
                          {style.icon}
                          <span className={`text-xs font-semibold ${style.text}`}>{item.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Footer Note */}
        <div className="text-center text-xs text-gray-500 pb-8">
          最后更新：{new Date().toLocaleDateString('zh-CN')} · 共 {summary.total} 个功能点追踪
        </div>
      </div>
    </div>
  );
}
