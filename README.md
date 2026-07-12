# 吉时网 — 项目完整文档

## 基本信息
- 网站名称：吉时网
- 英文名称：JishiWang / Jishi.today
- 副标题：择吉日 · 顺天时
- 网站地址：https://jishi.today（主域名）
- 备用地址：https://desheng01.github.io/tianshi-calendar
- GitHub 仓库：https://github.com/desheng01/tianshi-calendar
- 创建日期：2026-07-01
- 最近更新：2026-07-12

## 技术栈
- 托管：GitHub Pages
- 域名：jishi.today（阿里云注册）
- DNS：阿里云 DNS
- 支付：PayPal（paypal.me/jishinet）
- 开发环境：Codex（AI 辅助）

## 品牌
- 原品牌名：天时（已废弃）
- 现品牌名：吉时网（2026-07-07 起用）
- 域名 jishi.today 与品牌匹配

## 定价体系
（开业特惠 · 限时 5 折）

### 择吉系列
| 产品 | 原价 | 五折价 |
|------|------|--------|
| 择日报告 | .99 | .99 |
| 吉时精选 | .99 | .99 |
| 择吉豪华包 | .88 | .44 |

### 命理系列
| 产品 | 原价 | 五折价 |
|------|------|--------|
| 八字命理 | .99 | .99 |
| 周易深度报告 | .66 | .33 |
| 定制合盘服务 | .99 | .99 |

## 功能清单
- [x] 择吉日（日历视图+事项选择）
- [x] 今日黄历（当日信息+时辰吉凶）
- [x] 生肖运势（12生肖每日运势）
- [x] 八字排盘（四柱+五行+日主分析）
- [x] 报告预览（6个产品全部可预览）
- [x] 免费3次体验 + PayPal 解锁
- [x] 中英双语界面
- [x] PWA（可添加到手机桌面）

## 支付配置
- 当前支付：PayPal（paypal.me/jishinet）
- 尝试过的方案：
  - ❌ Stripe US 账号（需要 SSN，无法通过）
  - ❌ Stripe HK 账号（邮箱验证收不到，卡住）
  - ✅ PayPal（已上线可用）
- Payoneer 账号：客户 ID 105170075
  - 银行：Citibank
  - Routing：031100209
  - 账号：70587750002504094（美国账户）

## 域名记录
- ✅ jishi.today（当前主域名，阿里云，DNS 正常）
- ⏳ jishinet.top（备用域名，NameSilo，DNS 传播卡住）
- ❌ tianshi.life / tianshi.today（未注册）

## 已知问题
1. jishinet.top DNS 未传播（需联系 NameSilo 客服）
2. Stripe 无法启用（需要 SSN 或 HK 邮箱验证）
3. 付费解锁依赖浏览器 localStorage（换设备会失效）
4. 支付宝收款未接入

## 下次可继续的工作
- 解梦功能、起名功能、多人合盘功能
- 接收支付宝/PayPal 收款后完善支付体验
- 尝试解决 Stripe HK 邮箱验证问题
