## 🐳 Services Docker

| Service        | Description                    | Port local |
| -------------- | ------------------------------ | ---------- |
| `pos_backend`  | Backend API en NestJS          | `3000`     |
| `postgres`     | Base de données PostgreSQL     | `5432`     |
| `pgadmin`      | Interface graphique PostgreSQL | `5050`     |
| `pos_frontend` | Frontend React/Vite            | -          |
| `nginx`        | Serveur web pour le frontend   | `80`       |

---

## 🔧 Prérequis

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)
- Cloner les deux dépôts :
  git clone https://github.com/<ton-org>/pos_backend.git
  git clone https://github.com/<ton-org>/pos_frontend.git
  ⚠️ Les deux répertoires doivent être au même niveau :

/project-root/
├── pos_backend/
└── pos_frontend/
🚀 Lancer l'application

Se placer dans le dossier pos_backend :
cd pos_backend

Créer un fichier .env à la racine :
Exemple :
env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/mydb

Construire et lancer tous les services :
docker-compose up --build

Accéder aux services :

🌐 Frontend : http://localhost

🛠️ Backend API : http://localhost:3000

📊 PgAdmin : http://localhost:5050

Email: admin@admin.com

Mot de passe: pgadmin4

📦 Dockerisation
Backend (pos_backend/Dockerfile)
Image de base : node:22-alpine

Étapes :

Crée un dossier de travail /app

Copie les fichiers package\*.json puis exécute npm ci

Copie tout le code, build avec npm run build

Démarre le serveur avec node dist/main

Frontend (pos_frontend/Dockerfile)
Image de base : node:22-alpine

Étapes :

Dossier de travail /app

Copie des package\*.json + npm ci

Copie du code source + npm run build

Le dossier dist est exposé via un volume Docker nommé react_build

Serveur NGINX (nginx.conf)
Sert les fichiers frontend depuis /usr/share/nginx/html

Supporte le routing client-side (React Router)

Redirige toutes les requêtes vers index.html pour les SPA
