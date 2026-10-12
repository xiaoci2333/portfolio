# 姚振扬 · AI 商业广告导演作品集

中文版 React + Vite 作品集，包含首页循环混剪、5 组项目案例、6 支完整广告、分类作品画廊、创作能力、制作流程、工具与联系信息。

## 开发与构建

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

生产文件在 `dist/`。请使用本地服务预览，直接双击项目根目录的 `index.html` 不会运行 React 应用。部署时将 `dist/` 作为网站根目录，可使用支持 Vite 的静态主机。

## 内容位置

- `src/commercial/Portfolio.tsx`：中文页面、案例、分类与播放弹窗。
- `src/commercial/styles.css`：桌面与手机布局、动画和中文字体设置。
- `src/commercial/react-bits/`：React Bits SpotlightCard 组件及许可证。
- `public/videos/`：6 支广告与 12 秒首页混剪，H.264/AAC，支持渐进加载。
- `public/thumbnails/`：真实视频封面。
- `public/contact.json`：姓名、邮箱、电话与可选 LinkedIn。

原页面的 `src/App.jsx`、相关组件和图片素材继续保留，原说明存放在 `README-previous.md`。当前入口 `src/main.jsx` 使用新版中文广告作品集。

首页静音循环播放；卡片悬停或聚焦时预览；点击打开含声音和控制条的完整播放器。支持键盘关闭、分类筛选和减少动态效果偏好。案例不声明客户合作或实际投放业绩。

React Bits 来源：https://github.com/DavidHDev/react-bits ，许可证见 `src/commercial/react-bits/LICENSE.md`。
