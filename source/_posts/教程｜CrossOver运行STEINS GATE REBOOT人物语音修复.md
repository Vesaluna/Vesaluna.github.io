---
title: 教程｜在 Mac 上用 CrossOver 运行『STEINS;GATE RE:BOOT』时的人物语音修复
date: 2026-08-30 20:02:56
tags: [指南, macOS, CrossOver, Steam, 游戏]
lang: zh-cn
translation_key: crossover-steins-gate-reboot-voice-fix
permalink: 2026/08/30/教程｜CrossOver运行STEINS-GATE-REBOOT人物语音修复/
---

前些时候，我在 Apple Silicon Mac 上通过 CrossOver 26.3.0 运行 Steam 版『STEINS;GATE RE:BOOT』时，遇到了一个比较奇怪的问题：

- 游戏可以正常启动；
- BGM 和界面音效正常；
- 唯独人物语音完全没有声音。

最后确认，问题并不在游戏文件，而在 CrossOver 的音频解码链路：游戏人物语音使用 **Windows Media Audio 2（WMA v2）**，而当前环境中缺少可用的 **GStreamer libav** 解码插件。

本文记录最终可用的解决办法。

> 本文环境为 Apple Silicon Mac、CrossOver 26.3.0 与 Steam 版『STEINS;GATE RE:BOOT』。CrossOver 升级后可能更换自带的 GStreamer，因此不要直接把本文中的动态库复制到其他版本。

## 1. 问题原因

人物语音在 CrossOver 中大致经过下面这条链路：

```text
游戏中的 WMA v2 语音
        ↓
Wine / CrossOver 的 wmadmod、winegstreamer
        ↓
GStreamer
        ↓
libav / FFmpeg 的 avdec_wmav2
        ↓
人物语音
```

CrossOver 本身已经具备 Wine、GStreamer 核心和 macOS 音频输出，因此 BGM 与普通音效可以正常播放。

但这并不意味着所有音频格式都能正常解码。

在这个案例中，WMA v2 数据已经进入 GStreamer 链路，但缺少可用的 `libgstlibav`，因此人物语音无法被解码。

CodeWeavers 也专门记录过这一类问题：

[Missing GStreamer 1.0 libav](https://support.codeweavers.com/en_US/missing-libraries/missinggstreamer1libav)

因此，这并不是『STEINS;GATE RE:BOOT』特有的问题，只是在这款游戏中表现为“BGM 正常、人物无声”。

## 2. 几个容易踩的坑

在找到最终方案之前，我尝试过几种并不合适的方法。

### 不要修改 CrossOver 的共享目录

不要直接向下面的目录添加动态库：

```text
/Applications/CrossOver.app/Contents/SharedSupport/CrossOver/
```

这里属于所有 bottle 共用的运行环境。一旦加入不兼容的库，可能同时影响 Steam 和其他 bottle，而且 CrossOver 更新时也可能覆盖修改。

### 不要混用 Windows 媒体 DLL

我尝试过 Windows 7 原生的 `wmadmod.dll`。

结果它会调用 CrossOver 自带的 `mfplat.dll`，并在角色开始说话时崩溃。如果继续替换为 Windows 7 的 `mfplat.dll`，又会因为缺少较新的 `MFLockSharedWorkQueue` 接口而无法启动。

也就是说，不同 Windows 版本以及 Wine / CrossOver 的媒体 DLL 并不能随意混用。

### 不要使用纯 ARM64 的 GStreamer 插件

Apple Silicon 上通过 Homebrew 安装的 GStreamer 通常是 ARM64。

但 CrossOver 在运行这款游戏时使用的是 x86_64 媒体链路，因此 ARM64 插件不能直接使用。

### 不要把插件环境变量加给整个 Steam

如果把 `GST_PLUGIN_PATH` 等变量直接传给 Steam，Steam 和它的网页组件也会扫描这套私有插件，可能导致 Steam 长时间停在启动阶段。

这些环境变量只应该传给 `sgre_steam.exe`。

## 3. 最终方案

我的做法是：

1. 复制一个单独的测试 bottle；
2. 在 bottle 内加入一套私有的 GStreamer libav；
3. 不替换任何 Windows 系统 DLL；
4. 只在启动 SGRE 时加载这些插件。

目录结构如下：

```text
~/Library/Application Support/CrossOver/Bottles/
└── Steam-SGRE-Voice-Test/
    └── cx_gstreamer_libav/
        └── lib/
            ├── gstreamer-1.0/
            │   └── libgstlibav.dylib
            ├── libgstpbutils-1.0.0.dylib
            ├── libavcodec.60.dylib
            ├── libavformat.60.dylib
            ├── libavfilter.9.dylib
            ├── libavutil.58.dylib
            ├── libswresample.4.dylib
            ├── libz.1.dylib
            └── libbz2.1.dylib
```

这些组件来自 [GStreamer 官方 macOS Universal 1.24 系列运行时](https://gstreamer.freedesktop.org/download/)。

CrossOver 26.3.0 自带的是 GStreamer 1.24.4，因此我选择了同属 1.24 系列的组件，以尽量降低 ABI 不兼容的风险。

不过，直接复制仍然不能工作：我使用的 1.24.13 插件声明要求更高的 1.24.x 库兼容版本，因此还需要调整最低兼容版本和动态库依赖路径，并对修改后的文件重新进行 ad-hoc 签名。

最终成功使用的两个关键文件 SHA-256 为：

```text
libgstlibav.dylib
5133e1d0ef42d81f1e39f87dd4618c6f04679fadf2c6fa844a3c185440a00ff0

libgstpbutils-1.0.0.dylib
5a3f007aabde95632acc35ac16c4902b0060883e063e60e1bb32a1175cf3b6b4
```

> 不建议不熟悉 Mach-O 动态库的用户直接用十六进制编辑器修改 `.dylib`。更稳妥的方式，是使用与 CrossOver 版本匹配、来源明确且可以校验的组件。

## 4. 只在启动 SGRE 时加载插件

即使插件已经放进 bottle，通过 Steam 的“开始游戏”按钮启动时，SGRE 仍然只能看到 CrossOver 默认的插件目录。

因此我使用了一个单独的启动脚本：

```zsh
#!/bin/zsh
set -eu

bottle_name='Steam-SGRE-Voice-Test'
bottle_root="$HOME/Library/Application Support/CrossOver/Bottles/Steam-SGRE-Voice-Test"
plugin_root="$bottle_root/cx_gstreamer_libav"
wine_bin='/Applications/CrossOver.app/Contents/SharedSupport/CrossOver/bin/wine'

export SteamAppId='4012810'
export SteamGameId='4012810'

export GST_PLUGIN_PATH="$plugin_root/lib/gstreamer-1.0"
export GST_PLUGIN_PATH_1_0="$plugin_root/lib/gstreamer-1.0"

export GST_PLUGIN_SYSTEM_PATH='/Applications/CrossOver.app/Contents/SharedSupport/CrossOver/lib64/gstreamer-1.0'
export GST_PLUGIN_SYSTEM_PATH_1_0="$GST_PLUGIN_SYSTEM_PATH"

export GST_REGISTRY="$plugin_root/registry.bin"
export GST_REGISTRY_FORK='no'
export GST_PLUGIN_FEATURE_RANK='avdec_wmav2:MAX'

exec "$wine_bin" \
  --bottle "$bottle_name" \
  --no-wait \
  --cx-app 'C:\Program Files (x86)\Steam\steamapps\common\SGRE\sgre_steam.exe'
```

如果 bottle 名称不同，需要同时修改：

```text
bottle_name
bottle_root
```

后来我又把这个脚本封装并签名成了一个普通的 macOS 应用：

```text
STEINS;GATE REBOOT Voice Fix.app
```

实际使用时：

```text
启动测试 bottle 中的 Steam
→ 不要点击 Steam 的“开始游戏”
→ 双击 STEINS;GATE REBOOT Voice Fix.app
```

这样 GStreamer 的私有插件环境只会作用于 SGRE，不会影响 Steam 本身。

## 5. 如何确认修复成功

修复后，我主要检查了下面几项：

- 游戏能够正常启动；
- BGM、界面和环境音效正常；
- 角色连续多句台词都有语音；
- 切换存档或场景后语音仍然正常；
- 退出后可以再次通过专用启动器进入。

诊断日志中还可以看到：

```text
avdec_wmav2
Decoded data
return flow ok
```

同时，运行中的游戏进程确实加载了测试 bottle 中的：

```text
libgstlibav.dylib
libavcodec.60.dylib
...
```

这说明恢复语音的原因确实是 WMA v2 解码链路已经接通，而不是偶然现象。

## 6. 常见问题

### 仍然没有人物语音

检查：

- 是否通过专用启动器启动，而不是 Steam 的“开始游戏”；
- bottle 名称是否正确；
- `cx_gstreamer_libav` 是否仍位于测试 bottle 中；
- `libgstlibav.dylib` 是否包含 x86_64 架构。

### 人物开口时游戏崩溃

检查是否曾向：

```text
drive_c/windows/system32
```

复制过原生 `wmadmod.dll`、`mfplat.dll` 或其他媒体 DLL。

如果有，建议恢复到测试前的 bottle，而不要继续混装。

### Steam 卡在启动阶段

通常是因为把 `GST_PLUGIN_PATH` 等变量传给了 Steam 本身。

恢复普通 Steam 启动方式，只在 SGRE 的专用启动器中设置这些变量即可。

### CrossOver 升级后再次失效

CrossOver 更新可能改变其 GStreamer 版本和动态库依赖。

因此升级后不要继续沿用旧插件，应重新检查：

```text
CrossOver 自带 GStreamer 版本
插件版本
CPU 架构
动态库依赖
```

## 7. 回滚

这套方案的改动都限制在测试 bottle 与独立启动器中，因此回滚很简单：

```text
停止使用专用启动器
→ 删除或移走 cx_gstreamer_libav
→ 或直接恢复原来的测试 bottle
```

不需要修改主 Steam bottle，也不需要重装 CrossOver。

## 总结

这个问题的根因可以概括为：

```text
SGRE 人物语音使用 WMA v2
→ CrossOver 的 GStreamer 链路缺少可用 libav
→ avdec_wmav2 无法工作
→ 人物语音消失
```

最终采用的办法则是：

```text
复制测试 bottle
→ 加入版本和架构匹配的私有 GStreamer libav
→ 只给 SGRE 设置插件路径
→ 使用独立启动器运行
→ 通过语音与日志确认解码成功
```

相比直接替换 Windows DLL，这种做法稍微麻烦一些，但隔离性更好，也不会污染 CrossOver 的共享环境。
