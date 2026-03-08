# Playbook App – CasaOS Deployment

## Quick Start (3 Schritte)

### 1. Ordner auf den Server kopieren
```bash
# Vom eigenen Rechner aus:
scp -r playbook-deploy/ user@DEINE-CASAOS-IP:~/playbook


```

### 2. Per SSH auf den Server & bauen
```bash
ssh user@DEINE-CASAOS-IP
cd ~/playbook
docker compose up -d --build
```

### 3. Öffnen
```
http://DEINE-CASAOS-IP:3210
```

Fertig. Die App läuft als Docker-Container mit nginx.

---

## PWA installieren
- **Android**: Chrome → Menü → "Zum Startbildschirm hinzufügen"
- **iOS**: Safari → Teilen → "Zum Home-Bildschirm"

## Port ändern
In `docker-compose.yml` den Port `3210` anpassen:
```yaml
ports:
  - "DEIN_PORT:80"
```

## Icons (optional)
Lege eigene App-Icons unter `public/` ab:
- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)

## Update
```bash
cd ~/playbook
docker compose down
docker compose up -d --build
```
