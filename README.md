# Rollaway

https://github.com/user-attachments/assets/18da5b7d-2c1c-41ae-92ae-243657642e65

Petit outil de giveaway pour Twitch. Tu branches le chat, les gens tapent une commande, tu tires un gagnant. Pas de compte, pas de serveur, rien à configurer côté Twitch.

Fait pour tourner en fenêtre à côté d’OBS pendant un live.

## Ce que ça fait

- Connexion en lecture seule au chat d’une chaîne publique (`tmi.js`, IRC anonyme)
- Commande configurable (par défaut `!giveaway`) — le message doit matcher exactement
- Ouverture / fermeture des inscriptions
- Un viewer = une inscription max
- Un ou plusieurs gagnants, tirés au hasard, sans doublon
- Confirmation avant le tirage
- Mode démo avec de faux inscrits si tu testes seul
- Petit tour d’aide au premier lancement

Le tirage a une anim un peu théâtrale (confettis, tampon). Le reste de l’UI reste sobre.

## Tech

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4
- État en mémoire côté client uniquement

## Lancer en local

```bash
pnpm install
pnpm dev
```

→ [http://localhost:3000](http://localhost:3000)

```bash
pnpm build
pnpm lint
```

## En live

1. Nom de la chaîne
2. Commande (si tu changes le défaut)
3. Connecter le chat, ouvrir les inscriptions
4. Attendre les commandes dans le chat
5. Fermer les inscriptions, confirmer, tirer

Pour tester sans viewers : **Démonstration** en haut à droite.

## Look

UI type comptoir / ticket : fond sombre, panneau clair, jaune ticket `#F5D547`, rose punch quand les inscriptions sont ouvertes. Fonts : Barlow Condensed + Source Sans 3.

Plus de détails dans [`DESIGN.md`](./DESIGN.md).

## Licence

MIT — [@Onivoid](https://github.com/Onivoid)
