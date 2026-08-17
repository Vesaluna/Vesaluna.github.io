---
title: Guida | Convertire un MKV in MP4 e aggiungere sottotitoli ASS
date: 2024-09-27 19:53:11
tags: [Guida]
lang: it
translation_key: convert-mkv-to-mp4-with-ass
permalink: 2024/09/28/convertire-mkv-in-mp4-con-sottotitoli-ass/
ai_translation: true
---

I video scaricati in formato MKV spesso non possono essere aperti dal lettore predefinito del dispositivo, mentre i servizi di conversione online sono piuttosto scomodi. Questo breve articolo annota il procedimento con cui ho risolto il problema.

I passaggi sono i seguenti.

## 1. FFmpeg

FFmpeg è un programma open source per l'elaborazione video. Qui presento soltanto le funzioni necessarie per il compito indicato nel titolo, anche se il software offre molti altri strumenti potenti.

Apri il Terminale e inserisci il comando seguente per installare FFmpeg:

```bash
brew install ffmpeg
```

Attendi il completamento dell'installazione.

## 2. Convertire MKV in MP4

Usa `cd` per entrare nella cartella che contiene il video da convertire, quindi inserisci:

```bash
ffmpeg -i input.mkv -c copy output.mp4
```

Sostituisci `input` con il nome del video originale e `output` con il nome desiderato per il file convertito.

## 3. Aggiungere i sottotitoli al video

Supponendo di avere già il file ASS corrispondente, inserisci:

```bash
ffmpeg -i input.mp4 -vf ass=subtitle.ass output.mp4
```

Modifica `input` e `output` come sopra, e sostituisci `subtitle` con il nome del file dei sottotitoli ASS.
