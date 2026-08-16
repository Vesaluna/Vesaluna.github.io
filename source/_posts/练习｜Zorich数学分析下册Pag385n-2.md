---
title: 练习｜Zorich数学分析下册Pag385n.2
date: 2024-09-12 17:02:58
tags: 练习
mathjax: true
lang: zh-cn
translation_key: zorich-analysis-p385-n2
permalink: 2024/09/12/练习｜Zorich数学分析下册Pag385n-2/
---

记录关于Pag.385中n.2的c)的解决方法, 题目见书.

注意到{% mathjax %}f(-x)=f(x){% endmathjax %}, 故有

{% mathjax %}
(\int_{\mathbb{R}}x^2\frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{x^2}{2\sigma^2}}dx)^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=(2\int_{0}^{+\infty}x^2\frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{x^2}{2\sigma^2}}dx)^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=(\frac{2}{\sigma\sqrt{2\pi}}\int_{0}^{+\infty}x^2e^{-\frac{x^2}{2\sigma^2}}dx)^{\frac{1}{2}}
{% endmathjax %}

令{% mathjax %}\frac{x^2}{2{\sigma}^2}=u\rightarrow{dx}=\frac{\sigma^2}{\sqrt{2\sigma^2u}}du{% endmathjax %}, 有

{% mathjax %}
=(\frac{2}{\sigma\sqrt{2\pi}}\int_{0}^{+\infty}2\sigma^2ue^{-u}\frac{\sigma^2}{\sqrt{2\sigma^2u}}du)^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=(\frac{2}{\sqrt{\pi}}\int_{0}^{+\infty}2\sigma^2ue^{-u}\frac{1}{\sqrt{2u}}du)^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=(\frac{2\sigma^2}{\sqrt{\pi}}\int_{0}^{+\infty}\sqrt{u}e^{-u}du)^{\frac{1}{2}}
{% endmathjax %}

利用Laplace变换, 即{% mathjax %}\int_{0}^{+\infty}t^ne^{-st}dt=\frac{\Gamma(n+1)}{s^{n+1}}{% endmathjax %}, 又由上节知{% mathjax %}\Gamma{% endmathjax %}函数在取{% mathjax %}\frac{1}{2}{% endmathjax %}时为{% mathjax %}\sqrt{\pi}{% endmathjax %}

{% mathjax %}
=(\frac{2\sigma^2}{\sqrt{\pi}}(\frac{\Gamma(1+\frac{1}{2})}{1^{\frac{3}{2}}}))^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=(\frac{2\sigma^2}{\sqrt{\pi}}(\frac{\frac{1}{2}\Gamma(\frac{1}{2})}{1}))^{\frac{1}{2}}
{% endmathjax %}

{% mathjax %}
=\sigma
{% endmathjax %}
