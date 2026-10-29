# Delay the End：附录 7B

一款纯静态、双语的十回合叙事策略游戏。玩家扮演《生命之书》附录中的原创档案员，在被重写后的世界里决定旧天堂、旧地狱与人间自由应当如何被记录。

## 当前版本

- 10 回合、三幕、单局约 20–30 分钟。
- 18 个主线节点：4 个固定锚点、14 个随机或条件节点；每局使用 10 个。
- 四项公开刻度，三项隐藏人物关系，有限次数的 5 类档案印章。
- 选择前只显示方向，选择后公开精确数值、叙事后果与延迟回收。
- 6 个结局、人物关系尾声、自动保存、收藏索引与跨周目页边批注。
- 默认中文，故事、选项、后果、系统界面与结局均维护英文版本。
- 响应式桌面/平板/手机界面，支持键盘、减少动态与安全区。

## 运行

项目不需要构建步骤。请通过静态服务器打开，避免浏览器阻止 JSON 请求：

```bash
python3 -m http.server 8000
```

然后访问 `http://127.0.0.1:8000/`。可直接部署到 GitHub Pages。

## 结构

```text
index.html                 页面外壳与可访问性结构
styles.css                 “被删改的圣典”视觉系统与响应式布局
game.js                    状态引擎、渲染、存档、收藏与测试接口
data/story-v2.json         18 个主线事件
data/game-config-v2.json   初始值、压力增长、印章与结局阈值
data/endings-v2.json       6 个结局与 3 类人物尾声
data/events.json           旧原型的 10 个可解锁残档
data/simulate_balance.py   与浏览器一致顺序的蒙特卡洛模拟器
assets/plates/             3 张幕间与 6 张结局版画（含移动端裁切）
assets/fonts/              实际使用字重的自托管字体
docs/                      规则与视觉规范
```

## 校验与模拟

```bash
node --check game.js
python3 -m json.tool data/story-v2.json >/dev/null
python3 data/simulate_balance.py --runs 10000
```

浏览器自动化可使用：

- `window.render_game_to_text()`：输出当前状态 JSON。
- `window.advanceTime(ms)`：为自动化测试推进时间。
- `?test=1`：固定随机种子并跳过剧透确认/印章装备页。

## 同人声明

本项目为非商业同人作品，与原作者、制作公司、发行平台及其他权利人无关。故事使用原创档案员、原创叙事文本与原创物件/空间版画；不复用官方台词、片段、剧照或演员肖像。
