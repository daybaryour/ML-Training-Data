# Housing Price Predictor (TypeScript)

A robust, production-ready full-stack web application that predicts housing prices using machine learning. Built with TypeScript, following best practices with proper separation of concerns.

## Tech Stack

### Backend (TypeScript + Node.js)
- **TypeScript** - Type-safe JavaScript
- **Express** - Web framework
- **mathjs** - Mathematical operations for ML
- **Winston** - Advanced logging
- **Helmet** - Security headers
- **Express Rate Limit** - API rate limiting
- **Joi** - Schema validation
- **Morgan** - HTTP request logging
- **Compression** - Response compression

### Frontend
- **React** - UI library
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool

### Features
- 🏠 **Predict** - Get price predictions with confidence intervals
- 📋 **History** - View all past predictions with pagination
- 📊 **Statistics** - Analyze prediction trends and averages
- 🤖 **Model Info** - Explore ML model details and metrics
- 🎯 **Navigation** - Easy tab-based interface
- 📱 **Responsive** - Works on all devices

## Project Structure

```
housing-price-predictor/
├── backend/
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   │   ├── predictionController.ts
│   │   │   └── healthController.ts
│   │   ├── models/               # Data models & ML model
│   │   │   ├── HousingPriceModel.ts
│   │   │   └── PredictionModel.ts
│   │   ├── routes/               # API routes
│   │   │   ├── index.ts
│   │   │   ├── predictionRoutes.ts
│   │   │   └── healthRoutes.ts
│   │   ├── middleware/           # Express middleware
│   │   │   ├── errorHandler.ts
│   │   │   ├── validator.ts
│   │   │   └── modelReadyCheck.ts
│   │   ├── utils/                # Utility functions
│   │   │   └── logger.ts
│   │   ├── types/                # TypeScript type definitions
│   │   │   └── index.ts
│   │   └── server.ts             # Application entry point
│   ├── dist/                     # Compiled JavaScript (generated)
│   ├── logs/                     # Application logs
│   ├── predictions.json          # Data storage
│   ├── .env.example              # Environment template
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json             # TypeScript configuration
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── README.md
├── ARCHITECTURE.md
├── API_TESTING.md
└── setup.sh
```

## Architecture Overview

### MVC Pattern with TypeScript

The backend follows the **Model-View-Controller (MVC)** pattern with clear separation of concerns:

#### 1. **Models** (`src/models/`)
- **HousingPriceModel.ts**: ML model for price predictions
  - Training algorithm (OLS regression)
  - Prediction logic
  - Model metrics calculation
  
- **PredictionModel.ts**: Data persistence layer
  - CRUD operations for predictions
  - File I/O handling
  - Statistics calculation

#### 2. **Controllers** (`src/controllers/`)
- **predictionController.ts**: Business logic for predictions
  - Create predictions
  - Retrieve predictions
  - Get statistics
  - Model management
  
- **healthController.ts**: Health check logic
  - System status
  - Model status

#### 3. **Routes** (`src/routes/`)
- **predictionRoutes.ts**: Prediction endpoints
- **healthRoutes.ts**: Health check endpoints
- **index.ts**: Route aggregator

#### 4. **Middleware** (`src/middleware/`)
- **validator.ts**: Input validation with Joi
- **errorHandler.ts**: Centralized error handling
- **modelReadyCheck.ts**: Model readiness validation

#### 5. **Types** (`src/types/`)
- Centralized TypeScript type definitions
- Interface definitions
- Custom error classes

## Installation & Setup

### Prerequisites
- Node.js v14+ 
- npm or yarn
- TypeScript knowledge (for development)

### Quick Setup

```bash
# Clone repository
git clone <repo-url>
cd housing-price-predictor

# Backend setup
cd backend
npm install
cp .env.example .env

# Build TypeScript
npm run build

# Start server
npm start

# Or for development with hot reload
npm run dev

# In a new terminal - Frontend setup
cd ../frontend
npm install
npm run dev
```

### Manual Setup

#### Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Or development mode with auto-reload
npm run dev
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

Create `.env` file in the backend directory:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Available Scripts

### Backend

```bash
npm run build        # Compile TypeScript to JavaScript
npm start            # Run compiled code (production)
npm run dev          # Development mode with hot reload
npm run watch        # Watch mode for TypeScript compilation
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## API Endpoints

All endpoints are prefixed with `/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /model/info | Model information |
| POST | /predict | Create prediction |
| GET | /predictions | Get predictions (paginated) |
| GET | /predictions/stats | Get statistics |
| DELETE | /predictions | Delete all predictions |

## Type Safety

The TypeScript implementation provides:

### Request/Response Types
```typescript
interface PredictionRequest {
  sqft: number;
  bedrooms: number;
}

interface PredictionResponse {
  id: string;
  sqft: number;
  bedrooms: number;
  prediction: number;
  confidenceInterval: ConfidenceInterval;
  timestamp: string;
}
```

### Model Types
```typescript
interface ModelInfo {
  trained: boolean;
  intercept?: number;
  coefficients?: {
    sqft: number;
    bedrooms: number;
  };
  metrics?: ModelMetrics;
  equation?: string;
}
```

## Benefits of TypeScript Implementation

### 1. **Type Safety**
- Catch errors at compile time
- Better IDE support with IntelliSense
- Self-documenting code

### 2. **Maintainability**
- Clear interfaces and contracts
- Easier refactoring
- Better code organization

### 3. **Developer Experience**
- Autocomplete and suggestions
- Inline documentation
- Reduced runtime errors

### 4. **Scalability**
- Easier to add new features
- Better code structure
- Improved team collaboration

## Development Workflow

### 1. Make Changes
Edit TypeScript files in `src/` directory

### 2. Development Mode
```bash
npm run dev
```
Changes are automatically recompiled and server restarts

### 3. Build for Production
```bash
npm run build
```
Compiled JavaScript appears in `dist/` directory

### 4. Run Production
```bash
npm start
```
Runs the compiled code from `dist/`

## Code Organization Best Practices

### Controllers
- Handle HTTP requests/responses
- Call model methods
- Return appropriate status codes
- Delegate business logic to models

### Models
- Contain business logic
- Handle data operations
- No HTTP concerns
- Pure functions where possible

### Routes
- Define API endpoints
- Apply middleware
- Map URLs to controllers
- Keep thin and focused

### Middleware
- Reusable request processors
- Validation, authentication, logging
- Error handling
- Cross-cutting concerns

## Error Handling

TypeScript custom error class:

```typescript
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

Usage:
```typescript
throw new AppError('Model not ready', 503);
```

## Testing

```bash
# Unit tests (to be implemented)
npm test

# Watch mode
npm test:watch

# Coverage
npm test:coverage
```

## Linting

```bash
# Check for issues
npm run lint

# Fix automatically
npm run lint:fix
```

## Migration from JavaScript

If migrating from JavaScript:

1. Rename `.js` files to `.ts`
2. Add type annotations
3. Define interfaces in `types/`
4. Update imports
5. Fix type errors
6. Build and test

## Future Enhancements

- [ ] Add unit tests (Jest)
- [ ] Add integration tests
- [ ] Implement DTOs (Data Transfer Objects)
- [ ] Add request/response transformers
- [ ] Implement dependency injection
- [ ] Add API documentation (Swagger)
- [ ] Database migration (TypeORM)
- [ ] GraphQL support

## Performance

TypeScript compilation adds build step but:
- No runtime overhead (compiles to JavaScript)
- Better optimization opportunities
- Reduced bugs = less debugging time

## Documentation

- **[README.md](README.md)**: This file
- **[ARCHITECTURE.md](ARCHITECTURE.md)**: System architecture
- **[API_TESTING.md](API_TESTING.md)**: API testing guide
- **[TypeScript Docs](https://www.typescriptlang.org/)**: Official TypeScript documentation

## License

MIT

## Contributing

1. Follow TypeScript best practices
2. Add types for all functions
3. Update tests
4. Run linter before committing
5. Keep controllers thin
6. Document complex logic