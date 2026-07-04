# OpenNumismat Web

OpenNumismat Web is a web browser for [OpenNumismat](https://opennumismat.github.io/) collections.

<img src="https://opennumismat.github.io/images/OpenNumismatWeb.png" alt="InApp" width="32%"/>
<img src="https://opennumismat.github.io/images/OpenNumismatWeb-info.png" alt="Coin info" width="32%"/>

Latest stable version:
- Web-application (PWA): https://opennumismat.github.io/OpenNumismatWeb/
- Docker image - `ghcr.io/opennumismat/opennumismatweb:latest`
- Android application - https://github.com/OpenNumismat/OpenNumismatWeb/releases/latest

Latest development build available at:
- Web-application (PWA): https://opennumismat.github.io/OpenNumismatWeb/dev/
- Android application - https://github.com/OpenNumismat/OpenNumismatWeb/releases/tag/latest
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
    environment:
      API_KEY: <random_string> # optional
    ports:
      - 8000:8000
    volumes:
      - /path/to/data:/app/data:ro
```

or docker run:

`docker run -p 8000:8000 -v /path/to/data:/app/data:ro -d --name opennumismatweb ghcr.io/opennumismat/opennumismatweb:latest`

### From source

Look at Development section

### Set the necessary env vars

`API_KEY` - protects your server from unauthorized access. Generate a secure value using: `openssl rand -base64 32`

## Development

Setup env vars and run backend (optional):

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
