# Ghost Research Pro 商品页文案草稿

发布文案草稿，2026-10-31，供 PR17 的 0.1.0 交付准备使用；未发布到商店。以下中文、英文是两份等义文案，不需要同时展示。价格、购买链接、退款政策和人工售后条款未设定，不补写承诺。

## 中文版

# Ghost Research Pro

**让长报告、短简报和历年研究各有位置。**

面向独立研究者与小型研究出版团队的 Ghost 主题。适合持续发布专业长文、积累主题资料库，并同时提供公开内容与会员内容的出版者。

### 三个可以亲自查看的特点

**1. 从首页重点到完整报告**  
用 Featured 展示重点研究，在报告页通过元信息、章节目录和表格呈现研究内容。读者可以先了解报告，再跳转到需要的章节。

**2. 让旧研究继续被找到**  
资料库提供按主题标签、内容类型和年份浏览的独立列表与分页。长报告和短简报可以放在同一出版物中；这里不是多条件组合筛选器。可选资料库需按文档配置页面、标签、路由与导航；ZIP 不会自动创建这些内容。

**3. 沿用 Ghost 的会员与内容权限**  
公开内容、会员内容与付费会员内容使用 Ghost 原生权限和 Portal，不另建账户或计费系统。主题负责内容展示，订阅和支付仍由你的 Ghost 配置及相关服务处理。

### 包含什么

- 可安装的主题 ZIP、主题源码及 MIT 许可文件。
- 安装与内容配置说明，帮助你设置现有页面、标签和报告内容。
- [虚构演示内容配置指南](../demo-content.md)，供测试站人工创建示例；不是 Ghost 一键导入文件，不包含已导入的演示站。独立五篇草稿素材包不属于本版承诺交付。

Ghost 托管、域名、邮件服务和支付服务不包含在主题中。

### 版本与安装支持范围

本版支持范围为 **Ghost 6.73.0**。已在该版本核验主题上传与激活、重复／取消上传、升级回退、无效 ZIP 保护，以及文章访问权限、资料库分页和主题路由。其他 Ghost 版本不在首版支持承诺内；Ghost5 有兼容性 CI 证据及已知失败，不宣称完整支持。

提供安装与内容配置文档。问题报告范围为该版本上的主题安装、配置和展示；代部署、内容迁移、定制开发及第三方服务运维不包含在本版交付中。本文不承诺人工响应时限、退款规则或终身更新。

尚未完成完整 Stripe 订阅生命周期、全浏览器覆盖及完整 WCAG 无障碍合规验证。

### 已知限制

在 Ghost 6.73.0 的 Portal 中，更改评论通知偏好时，若保存请求失败或被取消，界面可能提前显示成功，但更改实际未保存；例如关闭通知后仍可能收到邮件。请重新打开设置核对，不要仅以成功提示判断。此限制不表示正常保存必然失败，也不等于发现了扣款或受限正文泄漏问题。

### 许可

主题代码采用 **MIT 许可**，具体以随附 LICENSE 为准。商品交付不附加“禁止转售”等与该许可冲突的限制；服务边界与代码许可分别说明。

**建议在测试站按演示指南查看完整公开报告、资料库与会员预览，再判断是否适合你的研究出版方式。当前未提供公开托管演示地址。**

---

## English version

# Ghost Research Pro

**A place for long reports, short briefs, and years of research.**

A Ghost theme for independent researchers and small research publishers. Designed for publications that combine in-depth writing, a growing topic archive, and public and member-only content.

### Three features you can inspect

**1. From a featured story to a complete report**  
Highlight research on the homepage with Featured content. Report metadata, a table of contents, and table styling give readers a way to understand the report and move between its sections.

**2. Keep earlier research discoverable**  
The library provides separate, paginated views by topic tag, content type, and year. Publish long reports and short briefs together. These are separate browsing views, not a combined multi-filter search tool. The optional library requires the documented Pages, tags, routes, and navigation setup; the ZIP does not create them.

**3. Use Ghost’s existing membership system**  
Public, members-only, and paid-member content use native Ghost access controls and Portal. There is no separate account or billing system. The theme presents your content; subscriptions and payments remain with your Ghost configuration and connected services.

### What is included

- An installable theme ZIP, theme source, and the MIT license file.
- Installation and content-configuration documentation for the existing pages, tags, and report layout.
- A [fictional demo setup guide](../demo-content.md) for manual use on a test publication. It is not a one-click Ghost import or an already populated demo site. A separate five-draft content pack is not part of the promised delivery.

Ghost hosting, a domain, email delivery, and payment services are not included.

### Version and installation support scope

This release supports **Ghost 6.73.0**. Checks on that version cover theme upload and activation, repeated and cancelled uploads, upgrade and rollback, invalid-ZIP protection, article access controls, library pagination, and theme routing. Other Ghost versions are outside the initial support promise. Ghost5 has compatibility CI evidence with known failures, not a full support claim.

Installation and content-configuration documentation is included. The issue-reporting scope covers theme installation, configuration, and presentation on that version. Managed deployment, content migration, custom development, and third-party service operations are not included in this release. This page makes no response-time, refund-policy, or lifetime-update commitment.

The complete Stripe subscription lifecycle, comprehensive browser coverage, and full WCAG accessibility compliance have not been verified.

### Known limitation

In Ghost 6.73.0 Portal, changing a comment-notification preference can show success prematurely if the save request fails or is cancelled. The change may not have been saved, so a reader who turns notifications off could still receive emails. Reopen the settings to check rather than relying only on the success message. This does not mean normal saves always fail, or that a charging or restricted-content disclosure issue has been found.

### License

The theme code is provided under the **MIT license**; see the included LICENSE. No additional “no resale” restriction is imposed. The service scope is separate from the code license.

**Use the demo guide on a test publication to inspect a complete public report, the library, and a member-content preview before deciding whether the theme fits. No hosted public demo URL is currently supplied.**

---

## 内部发布核对（不上商品页）

- 交付对象以 [0.1.0 发布说明/清单](../release-notes-0.1.0.md)为准：现有源码与 MIT、可重建主题 ZIP、安装/配置文档及手工虚构演示指南。独立五篇草稿包未纳入、未导入验证，不把主题 ZIP 安装通过当成内容导入通过。
- 版本/证据：运行代码 `431990ef`，[CI41073586729](https://github.com/henryxu1008/ghost-research-pro/actions/runs/41073586729)，Ghost6 137 PASS / 1 FAIL / 0 SKIP。主功能验收与已接受的上游偏好反馈失败分别披露，不能宣传全绿或上游已修复。
- 托管演示、商品下载/购买位置、价格、支持联系入口及退款政策尚未设定。正式上架前确认这些实际提供项；不虚构链接、响应时限或终身更新承诺。
- 不附客户背书、销量、性能/转化率、投资回报、付费意向或订阅生命周期验证声明。市场研究仍无访谈/需求/购买意向实证；它不是这次限定交付的技术阻塞。
- 本文是可用于上架准备的双语文案，不是已发布商品或服务合同。未发布、未上传独立素材包、未外联或创建账号。
