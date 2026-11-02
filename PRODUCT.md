# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Streamers Twitch (principalement francophones) qui organisent un giveaway pendant un live : ils ont le stream en cours, le chat qui bouge, et besoin d’un outil clair pour collecter les participants et tirer un gagnant sans friction.

## Product Purpose

Rollaway permet d’organiser un tirage au sort sur un stream Twitch en connectant le chat, en capturant les viewers qui tapent une commande exacte, puis en tirant un gagnant au hasard. Le succès = un giveaway lancé et clos pendant le live, sans compte, sans setup lourd.

## Positioning

Giveaway Twitch gratuit, open source, sans authentification : lecture IRC anonyme via tmi.js, matching exact de commande, capture on/off, participants uniques, tirage aléatoire. Un seul outil — le giveaway — pas une toolbox.

## Operating Context

Utilisé pendant un live, souvent en fenêtre séparée à côté d’OBS / du dashboard Twitch. Flux : définir la commande → connecter la chaîne → démarrer la capture → suivre la liste des participants → tirer le gagnant → (optionnel) reset. Pas de backend, pas de persistence du giveaway (état en mémoire de session).

## Capabilities and Constraints

- Connexion chat Twitch anonyme (tmi.js), sans OAuth
- Commande configurable (défaut `!giveaway`) ; non éditable pendant la capture
- Inscription uniquement si capture active ; message = commande exacte (trim + casefold) ; un participant une seule fois
- Tirage aléatoire uniforme d’un ou plusieurs gagnants (sans doublon) ; reset liste / reset tirage indépendants
- Route unique : `/` (ex-`/giveaway`) ; Better Chat retiré ; ancienne home « TwitchToolBox » retirée
- Stack existante : Next.js 15 App Router, React 19, Tailwind 4, composants UI locaux (shadcn-like)
- Ouvert : pondération, overlay OBS dédié, auth Twitch — non dans le produit actuel

## Brand Commitments

- Nom officiel : **Rollaway** (pas TwitchToolBox)
- Open source (MIT), crédit @Onivoid / GitHub Onivoid/rollaway
- UI principalement en français ; le wording peut évoluer tant que le comportement métier reste intact

## Evidence on Hand

- Copy et flux existants dans `app/` et `components/custom/` (giveaway)
- Repo GitHub public ; pas de logos marque dédiés dans `public/`
- Ne pas inventer de témoignages, métriques d’usage, ou clients

## Product Principles

1. Le script métier ne casse pas : même règles de capture, matching, déduplication, tirage
2. Clarté pendant le live : états (connecté / capture / participants / gagnant) lisibles en un coup d’œil
3. Un seul job : le giveaway — zéro distraction toolbox
4. Gratuit et sans compte : aucune auth imposée
5. Améliorer l’expérience visuelle et le wording sans dénaturer le fonctionnement

## Accessibility & Inclusion

Pas d’exigence formelle documentée ; viser une UI utilisable au clavier et des contrastes corrects pour un outil opéré en conditions de stream.
