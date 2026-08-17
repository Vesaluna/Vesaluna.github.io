---
title: Tutorial | Converting MKV to MP4 and Adding ASS Subtitles
date: 2024-09-27 19:53:11
tags: [Guide]
lang: en
translation_key: convert-mkv-to-mp4-with-ass
permalink: 2024/09/28/convert-mkv-to-mp4-with-ass-subtitles/
ai_translation: true
---

Video files downloaded in MKV format often cannot be opened by a device's default player, while online conversion services are rather inconvenient. This short article records how I solved that small problem.

The steps are as follows.

## 1. FFmpeg

FFmpeg is open-source video-processing software. I will introduce only the functions needed for the task in the title, although the program offers many other powerful features.

Open Terminal and enter the following command to install FFmpeg:

```bash
brew install ffmpeg
```

Wait for the installation to finish.

## 2. Convert MKV to MP4

Use `cd` to enter the folder containing the video you want to convert, then enter:

```bash
ffmpeg -i input.mkv -c copy output.mp4
```

Replace `input` with the name of the source video and `output` with the desired name of the converted file.

## 3. Add subtitles to the video

Assuming you already have the corresponding ASS subtitle file, enter:

```bash
ffmpeg -i input.mp4 -vf ass=subtitle.ass output.mp4
```

Change `input` and `output` as above, and replace `subtitle` with the name of the ASS subtitle file.
