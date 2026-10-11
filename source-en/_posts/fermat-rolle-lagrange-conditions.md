---
title: Notes | The conditions in Fermat's, Rolle's and Lagrange's theorems
date: 2024-03-25 17:35:10
tags: [Notes, Mathematics, Theorems]
lang: en
translation_key: fermat-rolle-lagrange-conditions
permalink: 2024/03/25/fermat-rolle-lagrange-conditions/
mathjax: true
ai_translation: true
---

I want to set out the assumptions of these three theorems from differential calculus together. It is easy to remember a conclusion and forget when it may be used.

Fermat's theorem says that if {% mathjax %}x_0{% endmathjax %} is an interior point of local extremum and the function is differentiable at {% mathjax %}x_0{% endmathjax %}, then {% mathjax %}f'(x_0)=0{% endmathjax %}. Neither differentiability nor the word “interior” can be omitted. For a local maximum, the difference quotients from the left are nonnegative and those from the right are nonpositive. If both one-sided limits exist and agree, they must both be zero. For a local minimum the signs are reversed. My original note described the one-sided derivatives as having opposite signs; more precisely, it is the inequalities for the difference quotients that come first, not a claim that the derivatives are strictly of opposite sign.

Rolle's theorem requires {% mathjax %}f{% endmathjax %} to be continuous on the closed interval {% mathjax %}[a,b]{% endmathjax %}, differentiable on the open interval {% mathjax %}(a,b){% endmathjax %}, and to satisfy {% mathjax %}f(a)=f(b){% endmathjax %}. It follows that some {% mathjax %}c\in(a,b){% endmathjax %} has {% mathjax %}f'(c)=0{% endmathjax %}.

Why continuity on the closed interval, but no requirement of differentiability at the endpoints? Continuity guarantees that the function attains its maximum and minimum. If it is not constant and its endpoint values agree, at least one extremum occurs inside the interval; Fermat's theorem applies there. If the function is constant, its derivative is zero throughout the open interval anyway. Thus differentiability is only needed on {% mathjax %}(a,b){% endmathjax %}.

Lagrange's mean value theorem again requires continuity on {% mathjax %}[a,b]{% endmathjax %} and differentiability on {% mathjax %}(a,b){% endmathjax %}, but no longer requires equal endpoint values. It says that some {% mathjax %}c\in(a,b){% endmathjax %} satisfies

{% mathjax %}
f'(c)=\frac{f(b)-f(a)}{b-a}.
{% endmathjax %}

The right-hand side is the slope of the secant through the endpoints. To use Rolle's theorem, subtract this secant and define

{% mathjax %}
g(x)=f(x)-\frac{f(b)-f(a)}{b-a}(x-a).
{% endmathjax %}

Then {% mathjax %}g(a)=g(b){% endmathjax %}, while {% mathjax %}g{% endmathjax %} is still continuous on the closed interval and differentiable on the open one. Rolle's theorem gives a {% mathjax %}c{% endmathjax %} with {% mathjax %}g'(c)=0{% endmathjax %}; expanding {% mathjax %}g'{% endmathjax %} yields Lagrange's formula. In this sense Lagrange's theorem generalizes Rolle's, and its assumptions emerge naturally from the proof.
