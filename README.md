# OpenNumismat Web

OpenNumismat Web is a web browser for [OpenNumismat](https://opennumismat.github.io/) collections.

![Screenshot](https://opennumismat.github.io/images/OpenNumismatWeb.png)

Latest stable version:
- Web-application (PWA): https://opennumismat.github.io/OpenNumismatWeb/
- Docker image - `ghcr.io/opennumismat/opennumismatweb:latest`

Latest development build available at:
- Web-application (PWA): https://opennumismat.github.io/OpenNumismatWeb/dev/
- Android application - https://github.com/OpenNumismat/OpenNumismatWeb/releases/download/v0.2.0/OpenNumismat.apk
- Docker image - `ghcr.io/opennumismat/opennumismatweb:main`

## Running it yourself

### With docker

Using docker compose:

```yaml
services:
  opennumismatweb:
    container_name: opennumismatweb
    image: ghcr.io/opennumismat/opennumismatweb:latest
    restart: unless-stopped
    ports:
      - 8000:8000
    volumes:
      - /path/to/data:/app/data:ro
```

or docker run:

`docker run -p 8000:8000 -v /path/to/data:/app/data:ro -d --name opennumismatweb ghcr.io/opennumismat/opennumismatweb:latest`

### From source

Look at Development section

## Development

Run backend (optional):

```
cd backend
pip3 install -r requirements.txt
python3 app.py
```

Run frontend:

```
cd frontend
npm install
npm run dev
```
