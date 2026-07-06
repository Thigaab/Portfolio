# Portfolio — Thibaut Bonefont

Personal portfolio site — a premium, interactive showcase with a dark/gold
**finance** aesthetic, 3D WebGL scenes and scroll-driven animation.

🔗 [github.com/Thigaab](https://github.com/Thigaab) · [LinkedIn](https://www.linkedin.com/in/thibaut-bonefont-aa7822268/)

## Tech stack

| Domain | Tools |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack), React 19, TypeScript |
| 3D / WebGL | [React Three Fiber](https://r3f.docs.pmnd.rs) + [drei](https://github.com/pmndrs/drei), [three.js](https://threejs.org) |
| Animation | [GSAP](https://gsap.com) + ScrollTrigger, [Lenis](https://lenis.darkroom.engineering) smooth scroll |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |

## Highlights

- Animated 3D **candlestick chart** hero with a cursor-reactive point grid
- Gold coin-stack 3D element, magnetic buttons and 3D tilt cards
- Global animated background (dotted grid + drifting gold aurora)
- Smooth scrolling with scroll-triggered section reveals

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # lint
```

## Project structure

```
src/
├── app/                 # Next.js App Router (layout, page, global styles)
├── components/
│   ├── canvas/          # React Three Fiber scenes
│   ├── sections/        # Hero, About, Skills, Projects, Contact
│   ├── layout/          # Section/Container, background texture
│   ├── providers/       # smooth scroll
│   └── ui/              # navbar, cursor, magnetic, tilt, scroll progress
└── lib/                 # site content (data.ts) + animation helpers
```

## Deployment & Infrastructure

This app runs in production on a personal Ubuntu VPS, deployed to a single-node **k3s** cluster.

### Stack

- **Docker** — multi-stage build using Next.js `output: "standalone"` for a minimal runtime image
- **GitHub Container Registry (GHCR)** — private image registry
- **k3s + Traefik** — container orchestration and ingress
- **cert-manager** — automatic TLS via Let's Encrypt
- **GitHub Actions** — CI/CD on every push to `main`

Cluster-wide infrastructure (TLS issuer, monitoring stack, alerting) lives in a separate [`infra`](https://github.com/) repo, since it isn't specific to this app.

### CI/CD pipeline

On every push to `main`:

1. GitHub Actions builds the Docker image from the `Dockerfile`
2. The image is pushed to GHCR (`ghcr.io/<user>/portfolio:latest`)
3. GitHub Actions connects to the VPS over SSH and runs:
   ```bash
   kubectl rollout restart deployment/portfolio
   kubectl rollout status deployment/portfolio --timeout=120s
   ```

> Changes to files under `k8s/` are **not** applied automatically by the pipeline — it only rebuilds and restarts the app. Manifest changes (Deployment, Service, Ingress, alert rules) need to be applied manually on the VPS:
> ```bash
> git pull origin main
> kubectl apply -f k8s/
> ```

### Repository structure (infra-related)

```
portfolio/
├── Dockerfile
├── .dockerignore
├── k8s/
│   ├── deployment.yaml     # Deployment (image, resources, health probes)
│   ├── service.yaml        # ClusterIP Service
│   ├── ingress.yaml        # Traefik Ingress + TLS
│   └── alert-rules.yaml    # PrometheusRule: app-specific alerts (pod down, crash loop)
└── .github/workflows/
    └── deploy.yml
```

### Required GitHub secrets

| Secret | Description |
|---|---|
| `VPS_HOST` | VPS public IP |
| `VPS_USER` | SSH user |
| `VPS_SSH_KEY` | Private key for a dedicated deploy keypair (not your personal one) |
| `VPS_SSH_PORT` | Custom SSH port |

### Monitoring & alerts

Metrics and health for this app are visible in Grafana (see the `infra` repo for setup). Two alert rules are defined in `k8s/alert-rules.yaml`:

- **PortfolioPodDown** — fires if no replicas are available for more than 2 minutes
- **PortfolioPodCrashLooping** — fires if the pod is restarting repeatedly

Alerts are routed to Discord via Alertmanager.

### Local development

```bash
npm install
npm run dev
```

To test the production image locally:

```bash
docker build -t portfolio:test .
docker run -p 3000:3000 portfolio:test
```
