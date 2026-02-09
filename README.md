# OpenNumismat Web

OpenNumismat Web is a web browser for [OpenNumismat](https://opennumismat.github.io/) collections.

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
      - 5000:5000
    volumes:
      - /path/to/data:/app/data
```

or docker run:

`docker run -p 5000:5000 -v /path/to/data:/app/data -d --name opennumismatweb ghcr.io/opennumismat/opennumismatweb:latest`

### From source

Look at Development section

## Development
