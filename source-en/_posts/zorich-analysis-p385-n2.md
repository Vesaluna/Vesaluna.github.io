---
title: Exercise | Zorich Mathematical Analysis II, p. 385, no. 2
date: 2024-09-12 17:02:58
tags: [Exercise]
mathjax: true
lang: en
translation_key: zorich-analysis-p385-n2
permalink: 2024/09/12/zorich-analysis-p385-n2/
ai_translation: true
---

This note records my solution to part c) of problem 2 on page 385. See the book for the statement of the problem.

Observe that {% mathjax %}f(-x)=f(x){% endmathjax %}. Therefore,

{% mathjax %}
(\int_{\mathbb{R}}x^2\frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{x^2}{2\sigma^2}}dx)^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=(2\int_{0}^{+\infty}x^2\frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{x^2}{2\sigma^2}}dx)^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=(\frac{2}{\sigma\sqrt{2\pi}}\int_{0}^{+\infty}x^2e^{-\frac{x^2}{2\sigma^2}}dx)^{\frac{1}{2}}
{% endmathjax %}

Let {% mathjax %}\frac{x^2}{2{\sigma}^2}=u\rightarrow{dx}=\frac{\sigma^2}{\sqrt{2\sigma^2u}}du{% endmathjax %}. Then

{% mathjax %}
=(\frac{2}{\sigma\sqrt{2\pi}}\int_{0}^{+\infty}2\sigma^2ue^{-u}\frac{\sigma^2}{\sqrt{2\sigma^2u}}du)^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=(\frac{2}{\sqrt{\pi}}\int_{0}^{+\infty}2\sigma^2ue^{-u}\frac{1}{\sqrt{2u}}du)^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=(\frac{2\sigma^2}{\sqrt{\pi}}\int_{0}^{+\infty}\sqrt{u}e^{-u}du)^{\frac{1}{2}}
{% endmathjax %}

Using the Laplace transform, {% mathjax %}\int_{0}^{+\infty}t^ne^{-st}dt=\frac{\Gamma(n+1)}{s^{n+1}}{% endmathjax %}, and recalling from the previous section that the {% mathjax %}\Gamma{% endmathjax %} function at {% mathjax %}\frac{1}{2}{% endmathjax %} equals {% mathjax %}\sqrt{\pi}{% endmathjax %}, we obtain

{% mathjax %}
=(\frac{2\sigma^2}{\sqrt{\pi}}(\frac{\Gamma(1+\frac{1}{2})}{1^{\frac{3}{2}}}))^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=(\frac{2\sigma^2}{\sqrt{\pi}}(\frac{\frac{1}{2}\Gamma(\frac{1}{2})}{1}))^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=\sigma
{% endmathjax %}
