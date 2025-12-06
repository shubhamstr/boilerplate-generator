# 🚀 Express Starter Kit

A production-ready Express boilerplate generated using this CLI.
It includes:

* API versioning (`/api/v1`)
* MongoDB support (Mongoose)
* Daily rotated logging (Winston + Morgan)
* Security middlewares (Helmet, CORS, Rate Limiting)
* Central error handling
* Environment variable support
* Folder-based routing
* Auto-created logs directory

---

## 📦 Getting Started

After generating a project with:

```bash
npx @shubhamstr/boilerplate-generator my-api
```

Move into the project:

```bash
cd my-app
```

Copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` and update the following values:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/mydb
NODE_ENV=development
```

---

## ▶️ Running the Server

### Development mode (auto-restart)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

---

## 📁 Project Structure

```
src/
  app.js              # Express app setup
  server.js           # Server entry point
  config/
    env.js            # Environment loader
    db.js             # MongoDB connection
  middleware/
    logger.js         # Logging system (Winston + Daily rotate)
    security.js       # Helmet, CORS, compression, rate limits
    errorHandler.js   # Error + 404 handler
  routes/
    index.js          # Versioned API router
    health.js         # Health check route
logs/                 # Auto-generated daily logs
.env                  # Environment config
```

---

## 📡 API Routes

### Health Check

```
GET /api/v1/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2025-12-06T12:00:00.000Z"
}
```

---

## 🛡 Security Features

This boilerplate includes:

* **Helmet** → HTTP headers security
* **CORS** → Allow/deny domains
* **Compression** → GZIP responses
* **Rate Limit** → Prevent abuse
* **MongoSanitize** (optional)
* **XSS Protection** (can be added)

---

## 🗄 Database (MongoDB)

Connection is managed inside:

```
src/config/db.js
```

Update the connection string in `.env`:

```env
MONGO_URI=mongodb://localhost:27017/mydb
```

---

## 📝 Logging System

Logs are automatically created inside the `logs/` directory.

### Daily Rotated Logs

* `logs/app-YYYY-MM-DD.log` → all logs
* `logs/error-YYYY-MM-DD.log` → errors only
* Keeps up to **30 days**
* Old logs rotate automatically

### HTTP Request Logging

Morgan (combined mode) → piped into Winston → saved into daily files.

### Development Console Output

In non-production mode:

* Pretty-printed colored logs in terminal
* File logs always enabled

---

## ⚠️ Error Handling

All errors pass through:

```
src/middleware/errorHandler.js
```

Example error response:

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

Logs error details in:

```
logs/error-YYYY-MM-DD.log
```

---

## 📄 Environment Variables

See `.env.example`:

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/mydb
```

---

## 🛠 Useful Scripts

| Command       | Description               |
| ------------- | ------------------------- |
| `npm run dev` | Start server with nodemon |
| `npm start`   | Start server normally     |

---

## ✨ Customization

You can customize:

* Logging format
* Database driver (PostgreSQL, MySQL, Prisma)
* Routes and versioning
* Authentication modules
* Middleware stack
