---
title: Notes | E041 and the sum of reciprocal squares
date: 2026-10-11 00:00:00
tags: [Notes, Mathematics, Euler]
mathjax: true
lang: en
translation_key: euler-e041-reciprocal-squares
permalink: 2026/10/11/euler-e041-reciprocal-squares/
ai_translation: true
---

Today I read the first half of Euler's E041, 『De summis serierum reciprocarum』. It was very interesting and does not require much mathematical background, though the English translated from the Latin original is rather convoluted and hard to follow.

My notes follow:

{% mathjax %}
1+\frac{1}{2^2}+\frac{1}{3^2}+\frac{1}{4^2}+\cdots.
{% endmathjax %}

Let the radius of the circle be {% mathjax %}BC=1{% endmathjax %}, the arc {% mathjax %}AM=s{% endmathjax %}, {% mathjax %}PM=y{% endmathjax %}, and {% mathjax %}PC=x{% endmathjax %}. In the figure, first take {% mathjax %}0<s<\pi/2{% endmathjax %}; then {% mathjax %}PM{% endmathjax %} is the sine of the arc {% mathjax %}AM{% endmathjax %}, and {% mathjax %}PC{% endmathjax %} is its cosine.

![In the unit circle, PM is the sine and PC the cosine of arc AM](/images/euler-e041-circle.svg)

By Taylor's formula,

{% mathjax %}
y=s-\frac{s^3}{3!}+\frac{s^5}{5!}-\frac{s^7}{7!}+\cdots,
{% endmathjax %}

{% mathjax %}
x=1-\frac{s^2}{2!}+\frac{s^4}{4!}-\frac{s^6}{6!}+\cdots.
{% endmathjax %}

From here on, I only use the expression for sine.

Usually we are given {% mathjax %}s{% endmathjax %} and find {% mathjax %}y{% endmathjax %}. Here we reverse the question and look for every arc length whose sine equals {% mathjax %}y{% endmathjax %}. There is more than one such {% mathjax %}s{% endmathjax %}.

First move everything to one side, then divide by {% mathjax %}y{% endmathjax %} so that the constant term becomes {% mathjax %}1{% endmathjax %}:

{% mathjax %}
0=y-s+\frac{s^3}{3!}-\frac{s^5}{5!}+\cdots,
{% endmathjax %}

{% mathjax %}
0=1-\frac{s}{y}+\frac{s^3}{3!y}-\frac{s^5}{5!y}+\cdots.
{% endmathjax %}

Treat the right-hand side as an infinite-degree expression in {% mathjax %}s{% endmathjax %}, and call all its roots {% mathjax %}A,B,C,D,\ldots{% endmathjax %}.

Then, by analogy with finite polynomials, it *could* be factored into linear factors (although in general one cannot simply do this):

{% mathjax %}
1-\frac{s}{y}+\frac{s^3}{3!y}-\cdots
=\left(1-\frac{s}{A}\right)
 \left(1-\frac{s}{B}\right)
 \left(1-\frac{s}{C}\right)\cdots.
{% endmathjax %}

Now set {% mathjax %}a=1/A{% endmathjax %}, {% mathjax %}b=1/B{% endmathjax %}, {% mathjax %}c=1/C{% endmathjax %}, and so on. Expanding the first few factors helps reveal the pattern. With two factors,

{% mathjax %}
(1-as)(1-bs)=1-(a+b)s+abs^2.
{% endmathjax %}

With three factors,

{% mathjax %}
(1-as)(1-bs)(1-cs)
=1-(a+b+c)s+(ab+ac+bc)s^2-abcs^3.
{% endmathjax %}

So the coefficient of {% mathjax %}s{% endmathjax %} is {% mathjax %}-(a+b+c+\cdots){% endmathjax %}; that of {% mathjax %}s^2{% endmathjax %} is {% mathjax %}\sum_{i<j}a_i a_j{% endmathjax %}, the sum of products of pairs of distinct numbers; and that of {% mathjax %}s^3{% endmathjax %} is {% mathjax %}-\sum_{i<j<k}a_i a_j a_k{% endmathjax %}, where three distinct numbers are selected and the sign is negative.

Write

{% mathjax %}
\alpha=a+b+c+\cdots=\frac1y,
{% endmathjax %}

{% mathjax %}
\beta=ab+ac+bc+\cdots=0,
{% endmathjax %}

{% mathjax %}
\gamma=abc+abd+acd+\cdots=-\frac1{3!y}.
{% endmathjax %}

The coefficient of {% mathjax %}s{% endmathjax %} is {% mathjax %}-1/y{% endmathjax %} on the left and {% mathjax %}-\alpha{% endmathjax %} on the right. There is no {% mathjax %}s^2{% endmathjax %} term on the left, so {% mathjax %}\beta=0{% endmathjax %}. For {% mathjax %}s^3{% endmathjax %}, the right-hand coefficient is {% mathjax %}-\gamma{% endmathjax %} and the left-hand one is {% mathjax %}1/(3!y){% endmathjax %}; hence {% mathjax %}\gamma=-1/(3!y){% endmathjax %}.

First expand the square of {% mathjax %}\alpha{% endmathjax %}:

{% mathjax %}
(a+b+c+\cdots)^2
=a^2+b^2+c^2+\cdots+2(ab+ac+bc+\cdots),
{% endmathjax %}

and therefore

{% mathjax %}
Q:=a^2+b^2+c^2+\cdots=\alpha^2-2\beta=\frac1{y^2}.
{% endmathjax %}

Let {% mathjax %}R=a^3+b^3+c^3+\cdots{% endmathjax %}. Then

{% mathjax %}
R:=a^3+b^3+c^3+\cdots
=\alpha^3-3\alpha\beta+3\gamma
=\frac1{y^3}-\frac1{2y}.
{% endmathjax %}

To find the sum of reciprocal squares, we only need {% mathjax %}Q{% endmathjax %}.

Let {% mathjax %}A{% endmathjax %} be the smallest positive arc length whose sine equals {% mathjax %}y{% endmathjax %}, and write {% mathjax %}p=\pi{% endmathjax %} for the length of a semicircle. Within a period, {% mathjax %}A{% endmathjax %} and {% mathjax %}p-A{% endmathjax %} have the same sine. Adding or subtracting a whole revolution {% mathjax %}2p{% endmathjax %} does not change it either. The roots thus form two sequences:

{% mathjax %}
s=A+2kp
\quad\text{or}\quad
s=p-A+2kp,
\qquad k\in\mathbb Z.
{% endmathjax %}

For example, taking {% mathjax %}k=0,-1,1,-2,2,\cdots{% endmathjax %} successively, the first few terms can be written {% mathjax %}A{% endmathjax %}, {% mathjax %}p-A{% endmathjax %}, {% mathjax %}-p-A{% endmathjax %}, {% mathjax %}2p+A{% endmathjax %}, {% mathjax %}-2p+A{% endmathjax %}, and so on.

Now consider the special case {% mathjax %}y=1{% endmathjax %}.

Then {% mathjax %}A=\pi/2{% endmathjax %}, and {% mathjax %}p-A=\pi/2{% endmathjax %}.

Thus we have {% mathjax %}\pi/2{% endmathjax %}, {% mathjax %}-3\pi/2{% endmathjax %}, {% mathjax %}5\pi/2{% endmathjax %}, and so on; each must be counted twice.

We found earlier that {% mathjax %}Q=1/y^2{% endmathjax %}, so here {% mathjax %}Q=1{% endmathjax %}.

{% mathjax %}
1=2\left(
\frac1{(\pi/2)^2}
+\frac1{(3\pi/2)^2}
+\frac1{(5\pi/2)^2}
+\cdots\right).
{% endmathjax %}

Taking out the factor {% mathjax %}(\pi/2)^{-2}=4/\pi^2{% endmathjax %} gives

{% mathjax %}
1=\frac8{\pi^2}\left(1+\frac1{3^2}+\frac1{5^2}+\cdots\right).
{% endmathjax %}

Hence

{% mathjax %}
1+\frac1{3^2}+\frac1{5^2}+\cdots=\frac{\pi^2}{8}.
{% endmathjax %}

This is the sum of the odd terms in the reciprocal-square series.

Let {% mathjax %}S=\sum_{n=1}^{\infty}1/n^2{% endmathjax %}. The even terms can be written

{% mathjax %}
\frac1{2^2}+\frac1{4^2}+\frac1{6^2}+\cdots
=\frac14\left(1+\frac1{2^2}+\frac1{3^2}+\cdots\right)
=\frac14S.
{% endmathjax %}

The odd terms therefore sum to {% mathjax %}S-S/4{% endmathjax %}, and we obtain

{% mathjax %}
\frac34S=\frac{\pi^2}{8},
\qquad S=\frac{\pi^2}{6}.
{% endmathjax %}

Original text: [Leonhard Euler, *De summis serierum reciprocarum* (E041)](https://scholarlycommons.pacific.edu/euler-works/41/).
