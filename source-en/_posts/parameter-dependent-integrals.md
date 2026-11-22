---
title: Notes | Introducing a parameter into an integral
date: 2024-07-09 10:45:18
tags: [Notes, Integrals, Methods]
lang: en
translation_key: parameter-dependent-integrals
permalink: 2024/07/09/parameter-dependent-integrals/
mathjax: true
ai_translation: true
---

Some integrals are awkward to compute directly; introducing a parameter can make them easier. In my original note I called this an “integrating-factor method,” but what I actually use here is differentiation of a parameter-dependent integral, not the integrating factor from differential equations.

Consider

{% mathjax %}
\int_0^{\infty}\frac{\sin x}{x}\,dx.
{% endmathjax %}

Insert {% mathjax %}e^{-tx}{% endmathjax %} into the integrand, taking {% mathjax %}t>0{% endmathjax %} for now, and write

{% mathjax %}
\varphi(t)=\int_0^{\infty}e^{-tx}\frac{\sin x}{x}\,dx.
{% endmathjax %}

One cannot move the derivative inside the integral merely by saying that differentiation and integration commute; the statement of a theorem in the original note was left unfinished. For {% mathjax %}t>0{% endmathjax %}, if we restrict {% mathjax %}t{% endmathjax %} to a closed interval away from zero, the exponential provides enough decay to justify differentiation. Differentiating {% mathjax %}e^{-tx}{% endmathjax %} introduces {% mathjax %}-x{% endmathjax %}, which cancels the {% mathjax %}x{% endmathjax %} in the denominator:

{% mathjax %}
\varphi'(t)
=-\int_0^{\infty}e^{-tx}\sin x\,dx
=-\frac{1}{1+t^2}.
{% endmathjax %}

Thus {% mathjax %}\varphi(t)=\operatorname{arccot}(t)+C{% endmathjax %}. As {% mathjax %}t\to\infty{% endmathjax %}, both the integral and {% mathjax %}\operatorname{arccot}(t){% endmathjax %} tend to zero, so {% mathjax %}C=0{% endmathjax %}. Letting {% mathjax %}t\downarrow0{% endmathjax %} gives

{% mathjax %}
\int_0^{\infty}\frac{\sin x}{x}\,dx=\frac{\pi}{2}.
{% endmathjax %}

This last step takes a limit; it is not a direct substitution of {% mathjax %}t=0{% endmathjax %} into a differentiation formula proved only for {% mathjax %}t>0{% endmathjax %}. The convergence of the oscillatory integral also needs to be justified. My original note passed over this too quickly.

The same idea brought to mind Euler's integral for the factorial. For {% mathjax %}t>0{% endmathjax %}, we start from

{% mathjax %}
\int_0^{\infty}e^{-tx}\,dx=\frac1t.
{% endmathjax %}

Differentiate both sides {% mathjax %}n{% endmathjax %} times with respect to {% mathjax %}t{% endmathjax %}. Each derivative of the integrand introduces another {% mathjax %}-x{% endmathjax %}, so

{% mathjax %}
(-1)^n\int_0^{\infty}x^ne^{-tx}\,dx
=\frac{(-1)^nn!}{t^{n+1}},
{% endmathjax %}

or

{% mathjax %}
\int_0^{\infty}x^ne^{-tx}\,dx=\frac{n!}{t^{n+1}}.
{% endmathjax %}

Putting {% mathjax %}t=1{% endmathjax %} yields {% mathjax %}\int_0^{\infty}x^ne^{-x}\,dx=n!{% endmathjax %}. The original note had {% mathjax %}t^n{% endmathjax %} in the denominator; I have corrected it to {% mathjax %}t^{n+1}{% endmathjax %}. Here too, differentiating an improper integral requires an integrable bound in a neighbourhood of {% mathjax %}t>0{% endmathjax %}; uniform continuity on an interval alone is not enough.
