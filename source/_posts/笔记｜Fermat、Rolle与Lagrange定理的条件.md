---
title: 笔记｜Fermat、Rolle与Lagrange定理的条件
date: 2024-03-25 17:35:10
tags: [笔记, 数学, 定理]
lang: zh-cn
translation_key: fermat-rolle-lagrange-conditions
permalink: 2024/03/25/笔记｜Fermat-Rolle-Lagrange定理的条件/
mathjax: true
---

先把这三个微分学定理所要求的条件摆在一起，免得只记得结论，忘记了何时能用。

Fermat 定理说，若 {% mathjax %}x_0{% endmathjax %} 是函数定义域内的局部极值点，且函数在 {% mathjax %}x_0{% endmathjax %} 可导，那么 {% mathjax %}f'(x_0)=0{% endmathjax %}。可导与「在内部」这两点都不能省。以局部极大值为例，左侧的差商非负，右侧的差商非正；若两侧极限存在且相等，就只能同为零。局部极小值的符号相反，道理一样。原笔记把这里的左右导数说成一正一负，准确地说，应先看左右差商的不等式，而不是断言导数严格异号。

Rolle 定理要求 {% mathjax %}f{% endmathjax %} 在闭区间 {% mathjax %}[a,b]{% endmathjax %} 连续，在开区间 {% mathjax %}(a,b){% endmathjax %} 可导，并且 {% mathjax %}f(a)=f(b){% endmathjax %}。结论是存在 {% mathjax %}c\in(a,b){% endmathjax %}，使 {% mathjax %}f'(c)=0{% endmathjax %}。

为什么闭区间要连续，而端点不必可导？闭区间上的连续性保证函数取得最大值和最小值。如果函数不是常数，且两个端点函数值相等，那么至少有一个极值出现在区间内部；在那里才用到 Fermat 定理。若函数是常数，开区间内的导数本就处处为零。因此可导性只需要放在 {% mathjax %}(a,b){% endmathjax %} 上。

Lagrange 中值定理同样要求 {% mathjax %}f{% endmathjax %} 在 {% mathjax %}[a,b]{% endmathjax %} 连续、在 {% mathjax %}(a,b){% endmathjax %} 可导，却不再要求两个端点函数值相等。它给出的结论是，存在 {% mathjax %}c\in(a,b){% endmathjax %}，使

{% mathjax %}
f'(c)=\frac{f(b)-f(a)}{b-a}.
{% endmathjax %}

右边就是连接两端点的割线斜率。为了借用 Rolle 定理，可以减去这条割线，构造

{% mathjax %}
g(x)=f(x)-\frac{f(b)-f(a)}{b-a}(x-a).
{% endmathjax %}

于是 {% mathjax %}g(a)=g(b){% endmathjax %}；而 {% mathjax %}g{% endmathjax %} 仍在闭区间连续、开区间可导。对 {% mathjax %}g{% endmathjax %} 使用 Rolle 定理，得到某个 {% mathjax %}c{% endmathjax %} 满足 {% mathjax %}g'(c)=0{% endmathjax %}，再把 {% mathjax %}g'{% endmathjax %} 展开，就得到 Lagrange 定理的等式。这样看，它确实是 Rolle 定理的推广，而这些条件也正好随证明一同出现。
