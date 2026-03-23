# Winebook Docker Setup

## Overview

This project now supports containerized deployment using Docker Compose, making it easier to run the application without requiring manual setup of MongoDB.

## Features

- **Containerized MongoDB**: MongoDB runs in Docker with proper data persistence
- **Complete Application Stack**: API and client both run in containers
- **Environment Management**: Easy configuration via .env file
- **Persistent Data**: MongoDB data stored in Docker volumes
- **Health Checks**: Container health monitoring
- **Production Ready**: Security best practices like non-root users

## Prerequisites

- Docker (version 20.10.0 or higher)
- Docker Compose (usually included with Docker Desktop)

## Getting Started

### Step 1: Setup Environment

```bash
# Clone the repository
git clone <repository-url>
cd winebook

# Create .env file
cp .env.example .env
# Edit .env to configure your preferences
```

### Step 2: Start Services

```bash
# Start all services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Step 3: Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000/api (or http://localhost:9000)
- **MongoDB**: localhost:27017

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_ROOT_PASSWORD` | MongoDB root password | `rootpassword` |
| `MONGO_DB_NAME` | Database name | `winedb` |
| `MONGO_DB_USER` | Database user | `root` |
| `MONGO_DB_PASSWORD` | Database password | (empty) |
| `TOKEN_KEY` | JWT signing key | `supersecretkey` |

### Network Ports

- `3000`: React frontend
- `9000`: Node.js API backend
- `27017`: MongoDB

## Docker Volumes

- `mongo-data`: Persists MongoDB data
- `node_modules`: Installed Node.js packages (not persisted, rebuilt on startup)

## Monitoring

The Docker containers include health checks:

```bash
docker-compose ps
docker-compose logs <service-name>
```

## Troubleshooting

### First Time Setup

1. Ensure Docker is running
2. Run `docker-compose up -d` for initial setup
3. Check logs for any startup errors

### Common Issues

**Permission Denied**: Ensure you have proper file permissions.
**Port Already in Use**: Check if other processes are using ports 3000, 9000, 27017.

### Cleanup

To completely remove containers and volumes:

```bash
docker-compose down -v --remove-orphans
```
