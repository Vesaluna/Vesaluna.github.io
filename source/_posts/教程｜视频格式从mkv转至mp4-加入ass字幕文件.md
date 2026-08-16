---
title: 教程｜视频格式从mkv转至mp4+加入ass字幕文件
date: 2024-09-27 19:53:11
tags: 指南
lang: zh-cn
translation_key: convert-mkv-to-mp4-with-ass
permalink: 2024/09/28/教程｜视频格式从mkv转至mp4-加入ass字幕文件/
---

在网上下载到mkv格式的视频文件，一般无法被设备的默认播放器打开。而网络上的格式转换又相当不方便，于是就有了这篇短文，用以记录自己解决这个小问题的过程：


以下是步骤: 



## 1. FFmpeg

这是一款开源的视频处理软件，以下只介绍标题中所需要用到的功能，但软件还具有其他十分强大的功能。

打开终端，输入以下指令以下载FFmpeg: 

```brew install ffmpeg```

等待下载完毕。

## 2. 转换mkv至mp4

利用```cd```指令进入存有需要修改视频的文件夹，然后在终端输入以下指令: 

```ffmpeg -i input.mkv -c copy output.mp4```

修改input为需要处理的视频名称，修改output为期望获得的文件名称。

## 3. 为视频加入字幕

默认已经拥有对应视频的ass字幕文件，在终端输入以下指令:

ffmpeg -i input.mp4 -vf ass=subtitle.ass output.mp4

input和output同上进行修改，修改subtitle为ass字幕文件名。
