# Ghost Research Pro 商品页文案草稿

双语文案，更新于 2026-11-01，描述**已发布、可下载的 v0.2.0**。
本页尚未发布到商店；价格、购买入口、退款政策和人工售后条款未设定，不作承诺。
中英内容等价，面向单一语言的商品页无需同时展示两版。

## 中文版

### Ghost Research Pro

**让长报告、短简报和多年研究各有位置。**

面向独立研究者与小型研究出版团队的 Ghost 主题，适合同时发布专业长文、
持续积累的资料和公开／会员内容的出版者。

### 三组可实际试用的功能

**1. 配置出版首页与品牌颜色**

在 Ghost Admin 设置 Hero 标题、简介、开放注册按钮文案，以及是否显示编辑精选。
空值保留原版文案；精选默认开启，无 Featured 内容时显示阅读指引，关闭后移除该栏。
会员账户、登录和付费方案入口保留各自语义，自定义按钮文字仅用于开放注册。
Ghost 品牌色接入主题按钮、链接和可访问的 Portal，浅色会转换为可读色调，保留键盘焦点。
这是四个有限设置，不是拖拽构建器或任意 HTML 编辑器。

**2. 从报告阅读到旧文发现**

报告提供作者、日期、公开安全摘要、访问标签、章节目录及表格／代码阅读样式。
默认 Search 入口打开 Ghost 原生搜索；可选资料库提供按主题、内容类型和年份分别浏览的
服务端分页视图。这些不是组合筛选器，主题不建立私有正文索引。
资料库仍需按文档配置 Pages、标签、路由与导航，ZIP 不会自动创建内容。

**3. 沿用 Ghost 的会员与内容权限**

公开、会员与付费会员内容使用原生 Ghost 权限和 Portal，没有另建账户或计费系统。
主题呈现内容与正确的会员提示；支付由 Ghost 设置和连接的服务负责，完整付款生命周期未验。

### 下载与交付内容

- [正式 v0.2.0 Release](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.2.0)
  的 [安装 ZIP](https://github.com/henryxu1008/ghost-research-pro/releases/download/v0.2.0/ghost-research-pro.zip)、源码及 MIT LICENSE。
- [安装与配置指南](../user-guide.md)，包含实际可用的首页、品牌色、原生搜索和可选资料库设置。
- [虚构演示内容手工指南](../demo-content.md)，供测试站自行创建内容；不是 Ghost 导入文件、
  已填充演示站或已交付的五篇草稿素材包。主题安装通过不等于素材导入通过。

Ghost 托管、域名、邮件投递和支付服务不包含在主题交付中。当前没有公开托管 demo；
本地测试实例也不是生产站点。

### 支持范围与已知边界

Ghost 5 的[故障调查与新版 Portal 实验](../engineering/ghost5-portal-compatibility.md)
未通过原有完整验收，不能当作已支持的升级方案。默认 2.51.5 的旧失败仍保留；
主题 ZIP 不替换 Portal，也不扩大正式支持承诺。

当前候选仅正式支持 **Ghost 6**，精确实测目标为6.73.0 / Node24.22.1。
Ghost 5 已于2026年1月EOL，仅保留历史资料；建议按官方流程升级。
候选安装范围为 `>=6.0.0 <7.0.0`，未验证或承诺Ghost 7。参见[支持政策](../support-policy.md)。

正式支持精确 **Ghost 6.73.0 / Node 24.22.1**。当前开发测试将官方 Portal 固定为
**2.72.12**，实际完整复验结果见 [当前产品要求](prd.md#acceptance-evidence-and-current-portal-follow-up)。
2026-11-01 本地既有完整验收为 **142 PASS／0 FAIL／0 SKIP**，包括正常／键盘保存和
失败无提前成功提示、显式重试；首次缺少 zip 工具的环境失败及修复后新数据库复验分别保留。
它不替换已发布 ZIP，也不会更新用户站点实际加载的 Portal。
Ghost 5.130.6 / Node 22.23.4 / Portal 2.51.5 仅有历史兼容 CI，仍有已知失败，不属于当前支持或发布门槛；CI范围调整不是修复三项旧失败。

v0.2.0 的历史验收使用 Portal 2.72.11，记录过评论通知保存失败却提前提示成功的问题；
该旧记录保持原样。本轮新版本结果不能倒写为旧版本已通过。Ghost 5 的评论反馈及 newsletter
503/429 恢复失败仍保留。保存通知偏好后应核对实际值，而非仅依赖成功提示。

原生搜索测试使用官方 Sodo Search 1.9.6，未声称验证 Ghost 5 默认的 1.8 版本。
完整 Stripe 生命周期、远程字体外观、跨域 Portal 增强、全浏览器／读屏器和完整 WCAG 合规未验。
不承诺人工响应时限、退款条款或终身更新，也不包含托管运维、内容迁移和定制开发。

### 许可

主题源码采用 **MIT 许可**，以随包 LICENSE 为准，不增加“禁止转售”等冲突限制。
服务范围与代码许可分别说明。请先在自己的测试出版物试用功能，再判断是否适合。

---

## English version

### Ghost Research Pro

**A place for long reports, short briefs, and years of research.**

A Ghost theme for independent researchers and small research publishers combining
in-depth writing, a growing archive, and public and member-only content.

### Three groups of features to try

**1. Configure the homepage and publication brand**

Set the Hero title, introduction, open-signup label and editor-selection switch
in Ghost Admin. Blank text retains the original copy. Selection defaults on,
shows a reading guide without Featured content, and removes its column when off.
Account, sign-in and paid-plan prompts keep their own meaning; a custom label
applies only to open signup. Ghost's brand color drives theme actions and an
accessible Portal, with readable tones for light colors and visible keyboard
focus. These are four bounded settings, not a drag-and-drop or HTML page builder.

**2. Read reports and discover earlier work**

Reports include authors, dates, public-safe excerpts, access labels, a table of
contents and table/code styling. A default Search entry opens Ghost's native
search. The optional library supplies separate server-paginated topic, format
and year views. These are not combined facets; the theme creates no private body
index. Library Pages, tags, routes and navigation require the documented setup;
the ZIP does not create them.

**3. Use Ghost's existing membership system**

Public, members-only and paid-member content use native Ghost access controls
and Portal. There is no separate account or billing system. The theme presents
content and appropriate member prompts; payments remain with Ghost and connected
services. The complete payment lifecycle has not been verified.

### Download and included material

- The [official v0.2.0 Release](https://github.com/henryxu1008/ghost-research-pro/releases/tag/v0.2.0),
  [installation ZIP](https://github.com/henryxu1008/ghost-research-pro/releases/download/v0.2.0/ghost-research-pro.zip),
  source and MIT LICENSE.
- The [installation/configuration guide](../user-guide.md) covering the available
  homepage, brand-color, native-search and optional library settings.
- A [fictional manual demo guide](../demo-content.md) for a test publication. It
  is not a Ghost import file, a populated demo site or a delivered five-draft
  content pack. Theme installation and importing sample content are distinct.

Hosting, a domain, email delivery and payment services are not included. No
hosted public demo is supplied; a local test instance is not production hosting.

### Support and known boundaries

The [Ghost 5 failure investigation and newer-Portal experiment](../engineering/ghost5-portal-compatibility.md)
did not pass the unchanged full acceptance contract and is not a supported
upgrade recipe. The theme ZIP does not replace Portal. Default 2.51.5 defects
remain disclosed, without expanding the formal support target.

Current candidates support **Ghost 6**, tested exactly on6.73.0 / Node24.22.1.
Ghost 5 reached EOL in January2026 and is historical evidence only; use the
official upgrade process. Candidate engines are `>=6.0.0 <7.0.0`; Ghost 7 is
unverified and unsupported. See the [support policy](../support-policy.md).

Formal support remains exact **Ghost 6.73.0 / Node 24.22.1**. The current development
fixture pins official **Portal 2.72.12**; see the [current product contract](prd.md#acceptance-evidence-and-current-portal-follow-up)
for the actual full rerun. On 2026-11-01, the unchanged full local suite recorded
**142 PASS / 0 FAIL / 0 SKIP**, including normal/keyboard saves, failure without
premature success and explicit retry. The first missing-zip environment failure
and the successful fresh-database rerun are recorded separately. This neither replaces the released ZIP nor updates
the Portal loaded by an existing site. Ghost 5.130.6 / Node 22.23.4 / Portal 2.51.5
is historical compatibility evidence with known failures, outside current support
and release gates. Changing CI scope is not a repair of those failures.

The historical v0.2.0 run used Portal 2.72.11 and recorded premature success on
failed comment-notification saves. That record is retained; newer results do not
make the old version pass. Ghost 5's comment-feedback and newsletter HTTP 503/429
recovery failures remain disclosed. Check the saved preference rather than
relying only on a success message.

Native search tests use official Sodo Search 1.9.6, not Ghost 5's default 1.8
bundle. The complete Stripe lifecycle, remote-font appearance, cross-origin
Portal enhancement, comprehensive browser/screen-reader coverage and full WCAG
conformance remain unverified. No response-time, refund-policy or lifetime-update
commitment is made. Managed operations, migration and custom development are not
included.

### License

The source is **MIT licensed**; see the included LICENSE. No additional no-resale
restriction is imposed. Service scope is separate from the code license. Try the
features on your own test publication before deciding whether the theme fits.

---

## 内部发布核对（不放商品页）

- 已发布产品以 [0.2.0 发布说明及清单](../release-notes-0.2.0.md) 为准；本分支只更新开发测试
  Portal 和说明，不创建新版本、tag、Release 或公开附件，不把开发构建冒充正式下载包。
- 新旧 Portal 的实际结果分开记录在 [PRD](prd.md#acceptance-evidence-and-current-portal-follow-up)
  和 exact-HEAD CI；严格断言不 skip、不 allow_failure，Ghost 5 已知问题不扩为新功能任务。
- 安装 ZIP 与手工 demo 指南已提供；样例导入包未提供，当前无公开托管 demo。
  商店上架、价格、购买／支付入口、支持联系与退款条款尚未确定，不虚构已提供项。
- 仍无本主题客户结果、付费意向或提升转化的实证，不许诺投资回报或客户成效。
  开发工具 audit 仍有 0 critical / 3 known high / 3 moderate，不宣称全清。
