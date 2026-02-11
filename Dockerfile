# Stage 1: Build Vue app
FROM node:24-alpine AS build-stage
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build


# Stage 2: FastAPI backend with Vue build files
FROM python:3.12-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY backend/requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ /app

COPY --from=build-stage /app/frontend/dist /app/static

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
