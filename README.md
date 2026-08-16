# Vesaluna Blog

这是 `vesaluna.com` 的 Hexo 源码。中文位于网站根路径，英语与意大利语分别位于 `/en/` 和 `/it/`。

## 本地检查

```bash
npm ci
npm run check
```

`npm run check` 会依次构建三种语言，并检查旧中文链接、语言隔离、SEO 元数据、RSS 和作品数据。生成结果位于 `public/`，不提交到 Git。

`npm run server` 只用于快速预览中文站。需要完整预览时，先运行 `npm run build`，再用任意静态文件服务器打开 `public/`。

## 添加或翻译文章

- 中文文章：`source/_posts/`
- 英文文章：`source-en/_posts/`
- 意大利文文章：`source-it/_posts/`

每篇文章必须具有 `lang` 和 `translation_key`。同一文章的三个版本共用同一个 `translation_key`：

```yaml
lang: en
translation_key: firenze-trip
```

译文不存在时，语言按钮会显示为不可用，不会生成中文正文的外语副本。为避免改变既有链接，已有中文文章还使用显式 `permalink`。

## 添加书籍、游戏或电影

在 `data/media.yml` 中添加真实条目，并把压缩后的 WebP 或 AVIF 封面放入 `source/images/media/`。构建会检查 ID、类型、中文标题、中文短评和封面路径。

```yaml
- id: unique-slug
  type: book
  title:
    zh-cn: 中文标题
    en: English title
    it: Titolo italiano
  cover: /images/media/unique-slug.webp
  year: 2026
  finished_on: 2026-08-16
  tags: [文学]
  review:
    zh-cn: 中文短评
    en:
    it:
```

英语或意大利语短评为空时，对应页面会显示中文短评和“暂仅中文”提示。

## 发布

Pull Request 只执行构建与检查；合并到 `main` 后，`.github/workflows/pages.yml` 会把 `public/` 作为 GitHub Pages artifact 发布。自定义域名在仓库的 GitHub Pages 设置中保持为 `vesaluna.com`。
