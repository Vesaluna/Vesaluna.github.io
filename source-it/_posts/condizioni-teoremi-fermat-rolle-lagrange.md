---
title: Appunti | Le ipotesi dei teoremi di Fermat, Rolle e Lagrange
date: 2024-03-25 17:35:10
tags: [Appunti, Matematica, Teoremi]
lang: it
translation_key: fermat-rolle-lagrange-conditions
permalink: 2024/03/25/condizioni-teoremi-fermat-rolle-lagrange/
mathjax: true
ai_translation: true
---

Voglio mettere insieme le ipotesi di questi tre teoremi del calcolo differenziale: è facile ricordare la conclusione e dimenticare quando la si può applicare.

Il teorema di Fermat dice che, se {% mathjax %}x_0{% endmathjax %} è un punto interno di estremo locale e la funzione è derivabile in {% mathjax %}x_0{% endmathjax %}, allora {% mathjax %}f'(x_0)=0{% endmathjax %}. Non si possono omettere né la derivabilità né il fatto che il punto sia interno. Nel caso di un massimo locale, i rapporti incrementali da sinistra sono non negativi, quelli da destra non positivi. Se i due limiti laterali esistono e coincidono, devono quindi essere entrambi nulli. Per un minimo locale i segni si invertono. Nei miei appunti originali avevo scritto che le derivate laterali avevano segni opposti; più precisamente, prima si considerano le disuguaglianze dei rapporti incrementali, senza affermare che le derivate abbiano segno strettamente opposto.

Il teorema di Rolle richiede che {% mathjax %}f{% endmathjax %} sia continua sull'intervallo chiuso {% mathjax %}[a,b]{% endmathjax %}, derivabile sull'intervallo aperto {% mathjax %}(a,b){% endmathjax %} e che {% mathjax %}f(a)=f(b){% endmathjax %}. Ne segue che esiste {% mathjax %}c\in(a,b){% endmathjax %} tale che {% mathjax %}f'(c)=0{% endmathjax %}.

Perché chiediamo la continuità sull'intervallo chiuso, ma non la derivabilità agli estremi? La continuità garantisce che la funzione assuma massimo e minimo. Se non è costante e i valori agli estremi coincidono, almeno uno degli estremi si trova nell'intervallo aperto, dove si può applicare Fermat. Se invece la funzione è costante, la derivata è già nulla in ogni punto interno. Basta quindi chiedere la derivabilità su {% mathjax %}(a,b){% endmathjax %}.

Anche il teorema del valor medio di Lagrange richiede continuità su {% mathjax %}[a,b]{% endmathjax %} e derivabilità su {% mathjax %}(a,b){% endmathjax %}, ma non l'uguaglianza dei valori agli estremi. Afferma che esiste {% mathjax %}c\in(a,b){% endmathjax %} per cui

{% mathjax %}
f'(c)=\frac{f(b)-f(a)}{b-a}.
{% endmathjax %}

Il membro di destra è la pendenza della secante che unisce gli estremi. Per usare Rolle, sottraiamo questa retta e costruiamo

{% mathjax %}
g(x)=f(x)-\frac{f(b)-f(a)}{b-a}(x-a).
{% endmathjax %}

Allora {% mathjax %}g(a)=g(b){% endmathjax %}, mentre {% mathjax %}g{% endmathjax %} resta continua sull'intervallo chiuso e derivabile su quello aperto. Applicando Rolle a {% mathjax %}g{% endmathjax %} otteniamo un {% mathjax %}c{% endmathjax %} con {% mathjax %}g'(c)=0{% endmathjax %}; sviluppando {% mathjax %}g'{% endmathjax %} ritroviamo la formula di Lagrange. In questo senso il secondo generalizza Rolle, e le sue ipotesi emergono direttamente dalla dimostrazione.
