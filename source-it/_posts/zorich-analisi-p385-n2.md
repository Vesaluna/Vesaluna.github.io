---
title: Esercizio | Zorich, Analisi matematica II, p. 385, n. 2
date: 2024-09-12 17:02:58
tags: [Esercizio]
mathjax: true
lang: it
translation_key: zorich-analysis-p385-n2
permalink: 2024/09/12/zorich-analisi-p385-n2/
ai_translation: true
---

Questa nota raccoglie la mia soluzione del punto c) dell'esercizio 2 a pagina 385. Per il testo del problema si rimanda al libro.

Osserviamo che {% mathjax %}f(-x)=f(x){% endmathjax %}. Dunque,

{% mathjax %}
(\int_{\mathbb{R}}x^2\frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{x^2}{2\sigma^2}}dx)^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=(2\int_{0}^{+\infty}x^2\frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{x^2}{2\sigma^2}}dx)^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=(\frac{2}{\sigma\sqrt{2\pi}}\int_{0}^{+\infty}x^2e^{-\frac{x^2}{2\sigma^2}}dx)^{\frac{1}{2}}
{% endmathjax %}

Poniamo {% mathjax %}\frac{x^2}{2{\sigma}^2}=u\rightarrow{dx}=\frac{\sigma^2}{\sqrt{2\sigma^2u}}du{% endmathjax %}. Allora

{% mathjax %}
=(\frac{2}{\sigma\sqrt{2\pi}}\int_{0}^{+\infty}2\sigma^2ue^{-u}\frac{\sigma^2}{\sqrt{2\sigma^2u}}du)^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=(\frac{2}{\sqrt{\pi}}\int_{0}^{+\infty}2\sigma^2ue^{-u}\frac{1}{\sqrt{2u}}du)^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=(\frac{2\sigma^2}{\sqrt{\pi}}\int_{0}^{+\infty}\sqrt{u}e^{-u}du)^{\frac{1}{2}}
{% endmathjax %}

Usando la trasformata di Laplace, {% mathjax %}\int_{0}^{+\infty}t^ne^{-st}dt=\frac{\Gamma(n+1)}{s^{n+1}}{% endmathjax %}, e ricordando dalla sezione precedente che la funzione {% mathjax %}\Gamma{% endmathjax %} in {% mathjax %}\frac{1}{2}{% endmathjax %} vale {% mathjax %}\sqrt{\pi}{% endmathjax %}, otteniamo

{% mathjax %}
=(\frac{2\sigma^2}{\sqrt{\pi}}(\frac{\Gamma(1+\frac{1}{2})}{1^{\frac{3}{2}}}))^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=(\frac{2\sigma^2}{\sqrt{\pi}}(\frac{\frac{1}{2}\Gamma(\frac{1}{2})}{1}))^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=\sigma
{% endmathjax %}
