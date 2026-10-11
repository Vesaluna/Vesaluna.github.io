---
title: Appunti | E041 e la somma dei reciproci dei quadrati
date: 2026-10-11 00:00:00
tags: [Appunti, Matematica, Eulero]
mathjax: true
lang: it
translation_key: euler-e041-reciprocal-squares
permalink: 2026/10/11/e041-somma-dei-reciproci-dei-quadrati/
ai_translation: true
---

Oggi ho letto la prima metà dell'E041 di Eulero, 『De summis serierum reciprocarum』. È molto interessante e non richiede molte conoscenze matematiche, anche se l'inglese tradotto dall'originale latino è contorto e difficile da seguire.

Di seguito i miei appunti:

{% mathjax %}
1+\frac{1}{2^2}+\frac{1}{3^2}+\frac{1}{4^2}+\cdots.
{% endmathjax %}

Sia il raggio del cerchio {% mathjax %}BC=1{% endmathjax %}, l'arco {% mathjax %}AM=s{% endmathjax %}, {% mathjax %}PM=y{% endmathjax %} e {% mathjax %}PC=x{% endmathjax %}. Nella figura consideriamo dapprima {% mathjax %}0<s<\pi/2{% endmathjax %}: così {% mathjax %}PM{% endmathjax %} è il seno dell'arco {% mathjax %}AM{% endmathjax %}, mentre {% mathjax %}PC{% endmathjax %} è il coseno.

![Nel cerchio unitario, PM è il seno e PC il coseno dell'arco AM](/images/euler-e041-circle.svg)

Dalla formula di Taylor sappiamo che

{% mathjax %}
y=s-\frac{s^3}{3!}+\frac{s^5}{5!}-\frac{s^7}{7!}+\cdots,
{% endmathjax %}

{% mathjax %}
x=1-\frac{s^2}{2!}+\frac{s^4}{4!}-\frac{s^6}{6!}+\cdots.
{% endmathjax %}

Da qui in poi uso soltanto la formula del seno.

Di solito si assegna {% mathjax %}s{% endmathjax %} e si cerca {% mathjax %}y{% endmathjax %}; qui, al contrario, cerchiamo tutte le lunghezze d'arco il cui seno è uguale a {% mathjax %}y{% endmathjax %}. Esiste più di un tale {% mathjax %}s{% endmathjax %}.

Portiamo prima tutto da una parte, poi dividiamo per {% mathjax %}y{% endmathjax %} in modo che il termine costante diventi {% mathjax %}1{% endmathjax %}:

{% mathjax %}
0=y-s+\frac{s^3}{3!}-\frac{s^5}{5!}+\cdots,
{% endmathjax %}

{% mathjax %}
0=1-\frac{s}{y}+\frac{s^3}{3!y}-\frac{s^5}{5!y}+\cdots.
{% endmathjax %}

Consideriamo il membro di destra come un'espressione in {% mathjax %}s{% endmathjax %} di grado infinito e chiamiamo tutte le sue radici {% mathjax %}A,B,C,D,\ldots{% endmathjax %}.

Per analogia con i polinomi di grado finito, «potremmo» scomporla in un prodotto di fattori lineari (anche se, in generale, non è lecito farlo senza ulteriori giustificazioni):

{% mathjax %}
1-\frac{s}{y}+\frac{s^3}{3!y}-\cdots
=\left(1-\frac{s}{A}\right)
 \left(1-\frac{s}{B}\right)
 \left(1-\frac{s}{C}\right)\cdots.
{% endmathjax %}

Poniamo quindi {% mathjax %}a=1/A{% endmathjax %}, {% mathjax %}b=1/B{% endmathjax %}, {% mathjax %}c=1/C{% endmathjax %} e così via. Sviluppiamo i primi fattori per vedere lo schema. Con due fattori,

{% mathjax %}
(1-as)(1-bs)=1-(a+b)s+abs^2.
{% endmathjax %}

Con tre fattori,

{% mathjax %}
(1-as)(1-bs)(1-cs)
=1-(a+b+c)s+(ab+ac+bc)s^2-abcs^3.
{% endmathjax %}

Il coefficiente di {% mathjax %}s{% endmathjax %} è dunque {% mathjax %}-(a+b+c+\cdots){% endmathjax %}; quello di {% mathjax %}s^2{% endmathjax %} è {% mathjax %}\sum_{i<j}a_i a_j{% endmathjax %}, ossia la somma dei prodotti di coppie di numeri distinti; quello di {% mathjax %}s^3{% endmathjax %} è {% mathjax %}-\sum_{i<j<k}a_i a_j a_k{% endmathjax %}, dove si scelgono tre numeri distinti e compare un segno meno.

Scriviamo

{% mathjax %}
\alpha=a+b+c+\cdots=\frac1y,
{% endmathjax %}

{% mathjax %}
\beta=ab+ac+bc+\cdots=0,
{% endmathjax %}

{% mathjax %}
\gamma=abc+abd+acd+\cdots=-\frac1{3!y}.
{% endmathjax %}

Il coefficiente di {% mathjax %}s{% endmathjax %} è {% mathjax %}-1/y{% endmathjax %} a sinistra e {% mathjax %}-\alpha{% endmathjax %} a destra. A sinistra manca il termine in {% mathjax %}s^2{% endmathjax %}, quindi {% mathjax %}\beta=0{% endmathjax %}. Per {% mathjax %}s^3{% endmathjax %}, il coefficiente a destra è {% mathjax %}-\gamma{% endmathjax %} e quello a sinistra è {% mathjax %}1/(3!y){% endmathjax %}; dunque {% mathjax %}\gamma=-1/(3!y){% endmathjax %}.

Sviluppiamo prima il quadrato di {% mathjax %}\alpha{% endmathjax %}:

{% mathjax %}
(a+b+c+\cdots)^2
=a^2+b^2+c^2+\cdots+2(ab+ac+bc+\cdots),
{% endmathjax %}

perciò

{% mathjax %}
Q:=a^2+b^2+c^2+\cdots=\alpha^2-2\beta=\frac1{y^2}.
{% endmathjax %}

Poniamo {% mathjax %}R=a^3+b^3+c^3+\cdots{% endmathjax %}. Allora

{% mathjax %}
R:=a^3+b^3+c^3+\cdots
=\alpha^3-3\alpha\beta+3\gamma
=\frac1{y^3}-\frac1{2y}.
{% endmathjax %}

Per trovare la somma dei reciproci dei quadrati ci serve soltanto {% mathjax %}Q{% endmathjax %}.

Sia {% mathjax %}A{% endmathjax %} la minima lunghezza d'arco positiva il cui seno è {% mathjax %}y{% endmathjax %} e indichiamo con {% mathjax %}p=\pi{% endmathjax %} la lunghezza della semicirconferenza. Entro un periodo, {% mathjax %}A{% endmathjax %} e {% mathjax %}p-A{% endmathjax %} hanno lo stesso seno. Aggiungere o sottrarre un giro intero {% mathjax %}2p{% endmathjax %} non lo cambia. Le radici si dividono quindi in due successioni:

{% mathjax %}
s=A+2kp
\quad\text{oppure}\quad
s=p-A+2kp,
\qquad k\in\mathbb Z.
{% endmathjax %}

Per esempio, prendendo nell'ordine {% mathjax %}k=0,-1,1,-2,2,\cdots{% endmathjax %}, i primi termini si possono scrivere {% mathjax %}A{% endmathjax %}, {% mathjax %}p-A{% endmathjax %}, {% mathjax %}-p-A{% endmathjax %}, {% mathjax %}2p+A{% endmathjax %}, {% mathjax %}-2p+A{% endmathjax %} e così via.

Consideriamo ora il caso particolare {% mathjax %}y=1{% endmathjax %}.

Allora {% mathjax %}A=\pi/2{% endmathjax %} e {% mathjax %}p-A=\pi/2{% endmathjax %}.

Si ottengono dunque {% mathjax %}\pi/2{% endmathjax %}, {% mathjax %}-3\pi/2{% endmathjax %}, {% mathjax %}5\pi/2{% endmathjax %} e così via; ciascuno va contato due volte.

Prima abbiamo trovato {% mathjax %}Q=1/y^2{% endmathjax %}; in questo caso {% mathjax %}Q=1{% endmathjax %}.

{% mathjax %}
1=2\left(
\frac1{(\pi/2)^2}
+\frac1{(3\pi/2)^2}
+\frac1{(5\pi/2)^2}
+\cdots\right).
{% endmathjax %}

Raccogliendo {% mathjax %}(\pi/2)^{-2}=4/\pi^2{% endmathjax %}, otteniamo

{% mathjax %}
1=\frac8{\pi^2}\left(1+\frac1{3^2}+\frac1{5^2}+\cdots\right).
{% endmathjax %}

Quindi

{% mathjax %}
1+\frac1{3^2}+\frac1{5^2}+\cdots=\frac{\pi^2}{8}.
{% endmathjax %}

Questa è la somma dei termini dispari della serie dei reciproci dei quadrati.

Poniamo {% mathjax %}S=\sum_{n=1}^{\infty}1/n^2{% endmathjax %}. I termini pari si possono scrivere

{% mathjax %}
\frac1{2^2}+\frac1{4^2}+\frac1{6^2}+\cdots
=\frac14\left(1+\frac1{2^2}+\frac1{3^2}+\cdots\right)
=\frac14S.
{% endmathjax %}

La somma dei termini dispari è dunque {% mathjax %}S-S/4{% endmathjax %}, da cui

{% mathjax %}
\frac34S=\frac{\pi^2}{8},
\qquad S=\frac{\pi^2}{6}.
{% endmathjax %}

Testo originale: [Leonhard Euler, *De summis serierum reciprocarum* (E041)](https://scholarlycommons.pacific.edu/euler-works/41/).
