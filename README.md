Cycluno

A complete, production-ready MVP for managing test cases, executing tests, and tracking bugs with AI assistance.

Features:

- User Authentication: Email verification, password reset, JWT with refresh tokens
- Product Management: Create products with features manually or via PRD upload
- AI-Powered Test Generation: Automatic test case generation from features
- Test Execution: Execute test cases with pass/fail tracking
- Smart Bug Logging: AI-generated bug reports from failed tests
- Bugbed Kanban Board: Visual bug tracking with drag-and-drop
- Analytics Dashboard: Comprehensive reports with charts and metrics

Tech Stack 
Backend
- Node.js with TypeScript
- NestJS framework
- PostgreSQL with Prisma ORM
- JWT authentication
- OpenAI integration
- BullMQ for background jobs
- Swagger API documentation


- Docker & Docker Compose
- Redis for job queues
- Multi-service architecture



- Node.js 20+
- Docker & Docker Compose
- OpenAI API Key
- SMTP credentials (Gmail, SendGrid, etc.)


```bash
# Clone the repository
git clone <your-repo-url>
cd cycluno-mvp

# Create environment file
cp .env.example .env
```



Edit `.env` file with your credentials:
```env
# Database
POSTGRES_USER=cycluno
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=cycluno_db

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_REFRESH_SECRET=your_super_secret_refresh_key_minimum_32_characters

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
```


```bash
# Build and start all services
docker-compose up --build
```


```bash
# Run Prisma migrations
docker-compose exec backend npx prisma migrate dev

# Generate Prisma client
docker-compose exec backend npx prisma generate
```


```bash
# Backend
cd backend
npm install
npm run start:dev

# Worker
cd worker
npm install
npm run dev
```


```bash
# Create a new migration
docker-compose exec backend npx prisma migrate dev --name migration_name

# Reset database
docker-compose exec backend npx prisma migrate reset

# Open Prisma Studio
docker-compose exec backend npx prisma studio
```


```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f worker
```


Once the backend is running, visit:
- Swagger UI: http://localhost:3001/api/docs

