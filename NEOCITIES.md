# Neocities 镜像

主站：https://vesaluna.com/

镜像：https://vesaluna.neocities.org/

日常仍然修改 Markdown、运行 `npm run check`、提交并推送到 main。
GitHub Actions 先检查三语网站并发布主站，主站发布成功后再同步 Neocities。
PR 只构建检查，不发布任何站点。镜像上传失败不影响已经发布的主站。

首次设置：在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加
`NEOCITIES_API_KEY`，内容是 vesaluna 这个 Neocities 站点的 API key。
不要把密钥写进源文件或提交记录。添加后可在 Actions 中选择
“Build and deploy Hexo site”，点击 Run workflow 重新发布，无需修改文章。

镜像的内部绝对链接、语言切换、搜索和 RSS 使用 Neocities 地址；canonical
仍指向主站，说明原始内容的位置。外部图床等链接不变。
GitHub 专用的 CNAME、.nojekyll 不会上传到镜像。

同步只上传内容有变化的文件。上传成功且远端文件哈希校验通过后，才会删除
上次镜像清单中、这次已不存在的旧文件。站点原本的其他文件不会被清理；
根 index.html 会替换成博客首页。公开的 `neocities-sync.json` 仅记录部署时间
和本流程管理的文件路径，不含密钥。不要手动修改这个清单。
为遵守 Neocities 的 API 使用建议，两次有变化的同步之间至少间隔十分钟；
连续推送时，镜像任务可能等待，主站不受此等待影响。

本地可用 `npm run build:neocities` 生成并检查 `public-neocities/`，它是忽略的
构建产物，不需要提交。没有密钥也可以进行构建检查；实际上传需要密钥。
