---
title: Appunti | Introdurre un parametro in un integrale
date: 2024-07-09 10:45:18
tags: [Appunti, Integrali, Metodi]
lang: it
translation_key: parameter-dependent-integrals
permalink: 2024/07/09/integrali-con-parametro/
mathjax: true
ai_translation: true
---

Alcuni integrali sono scomodi da calcolare direttamente; introdurre un parametro può renderli più semplici. Nei miei appunti originali chiamavo questo procedimento «metodo del fattore integrante», ma qui sto in realtà derivando un integrale dipendente da un parametro, non usando il fattore integrante delle equazioni differenziali.

Consideriamo

{% mathjax %}
\int_0^{\infty}\frac{\sin x}{x}\,dx.
{% endmathjax %}

Inseriamo {% mathjax %}e^{-tx}{% endmathjax %} nell'integrando, prendendo per ora {% mathjax %}t>0{% endmathjax %}, e poniamo

{% mathjax %}
\varphi(t)=\int_0^{\infty}e^{-tx}\frac{\sin x}{x}\,dx.
{% endmathjax %}

Non basta dire che derivazione e integrazione si possono scambiare per portare la derivata sotto il segno di integrale; negli appunti originali avevo lasciato incompiuto l'enunciato del teorema. Per {% mathjax %}t>0{% endmathjax %}, se limitiamo {% mathjax %}t{% endmathjax %} a un intervallo chiuso lontano da zero, il fattore esponenziale dà un decadimento sufficiente a giustificare la derivazione. Derivando {% mathjax %}e^{-tx}{% endmathjax %} compare {% mathjax %}-x{% endmathjax %}, che si semplifica con {% mathjax %}x{% endmathjax %} al denominatore:

{% mathjax %}
\varphi'(t)
=-\int_0^{\infty}e^{-tx}\sin x\,dx
=-\frac{1}{1+t^2}.
{% endmathjax %}

Quindi {% mathjax %}\varphi(t)=\operatorname{arccot}(t)+C{% endmathjax %}. Quando {% mathjax %}t\to\infty{% endmathjax %}, sia l'integrale sia {% mathjax %}\operatorname{arccot}(t){% endmathjax %} tendono a zero, perciò {% mathjax %}C=0{% endmathjax %}. Facendo tendere {% mathjax %}t{% endmathjax %} a zero da destra otteniamo

{% mathjax %}
\int_0^{\infty}\frac{\sin x}{x}\,dx=\frac{\pi}{2}.
{% endmathjax %}

Quest'ultimo passaggio è un limite, non la sostituzione diretta di {% mathjax %}t=0{% endmathjax %} in una formula di derivazione dimostrata soltanto per {% mathjax %}t>0{% endmathjax %}. Va anche giustificata la convergenza dell'integrale oscillante. Nei miei appunti originali avevo sorvolato troppo in fretta su questo punto.

Lo stesso procedimento mi ha fatto pensare all'integrale di Eulero per il fattoriale. Per {% mathjax %}t>0{% endmathjax %} abbiamo

{% mathjax %}
\int_0^{\infty}e^{-tx}\,dx=\frac1t.
{% endmathjax %}

Deriviamo entrambi i membri {% mathjax %}n{% endmathjax %} volte rispetto a {% mathjax %}t{% endmathjax %}. Ogni derivata dell'integrando introduce un ulteriore fattore {% mathjax %}-x{% endmathjax %}, quindi

{% mathjax %}
(-1)^n\int_0^{\infty}x^ne^{-tx}\,dx
=\frac{(-1)^nn!}{t^{n+1}},
{% endmathjax %}

ossia

{% mathjax %}
\int_0^{\infty}x^ne^{-tx}\,dx=\frac{n!}{t^{n+1}}.
{% endmathjax %}

Ponendo {% mathjax %}t=1{% endmathjax %} ricaviamo {% mathjax %}\int_0^{\infty}x^ne^{-x}\,dx=n!{% endmathjax %}. Negli appunti originali il denominatore era {% mathjax %}t^n{% endmathjax %}; l'ho corretto in {% mathjax %}t^{n+1}{% endmathjax %}. Anche qui, per derivare un integrale improprio serve un maggiorante integrabile in un intorno di {% mathjax %}t>0{% endmathjax %}; la sola continuità uniforme su un intervallo non basta.
