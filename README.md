# Compensation Intelligence System API

A comprehensive web application that helps users explore and compare salary information across different companies, roles, and levels. Users can view compensation data and contribute their own salary records to build a collaborative salary database.

**Live Demo:** [https://compensation-intelligence-system-ap.vercel.app](https://compensation-intelligence-system-ap.vercel.app)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Salary Exploration**: Browse compensation data by company, role, and experience level
- **Company Comparison**: Compare salary ranges across different companies for the same role
- **Salary Contributions**: Users can add their own salary records to the database
- **Advanced Filtering**: Filter compensation data by various parameters
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Data**: Access up-to-date salary information contributed by the community

## 🛠 Tech Stack

### Frontend & Backend
- **Framework**: [Next.js 16.2.7](https://nextjs.org/) - React meta-framework
- **React**: 19.2.4 - UI library
- **Node.js**: Runtime environment

### Database
- **PostgreSQL**: Primary relational database
- **Node PostgreSQL Driver** (`pg` 8.21.0) - Database connectivity

### Development & Build Tools
- **ESLint 9**: Code linting and quality checks
- **Babel Plugin React Compiler**: React optimization compiler

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**
- **PostgreSQL** (v12 or higher) - running locally or remotely accessible
- **Git**

## 🚀 Installation

1. **Clone the Repository**

```bash
git clone https://github.com/BuildAndExcecute/Compensation-Intelligence-System-Api.git
cd Compensation-Intelligence-System-Api
```

2. **Install Dependencies**

```bash
npm install
# or
yarn install
```

## ⚙️ Configuration

1. **Create Environment Variables**

Create a `.env.local` file in the root directory with the following variables:

```env
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/compensation_db

# Node Environment
NODE_ENV=development

# Application Port (optional, defaults to 3000)
PORT=3000

# Add other API keys or configuration variables as needed
```

**Example for local PostgreSQL:**
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/compensation_db
```

2. **Database Setup**

Create the PostgreSQL database and initialize the schema:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE compensation_db;

# Exit psql
\q
```

Then run the database initialization script (if available in the project):
```bash
# Initialize database schema
npm run db:init
```

## 🏃 Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

Build and run the production version:

```bash
npm run build
npm start
# or
yarn build
yarn start
```

### Linting

Check code quality:

```bash
npm run lint
```

## 📊 Database Schema

### Tables Overview

The Compensation Intelligence System uses the following PostgreSQL database schema:

#### 1. **users** Table
Stores user account information and authentication data.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **companies** Table
Maintains a list of companies and their details.

```sql
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    industry VARCHAR(100),
    headquarters_country VARCHAR(100),
    employees_count INT,
    website_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. **roles** Table
Defines job roles/positions available in the system.

```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. **experience_levels** Table
Defines experience levels (Junior, Mid, Senior, Lead, etc.).

```sql
CREATE TABLE experience_levels (
    id SERIAL PRIMARY KEY,
    level_name VARCHAR(100) UNIQUE NOT NULL,
    min_years_experience INT,
    max_years_experience INT,
    description TEXT
);
```

#### 5. **salaries** Table
Core table storing salary records contributed by users.

```sql
CREATE TABLE salaries (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    company_id INT NOT NULL,
    role_id INT NOT NULL,
    experience_level_id INT NOT NULL,
    base_salary DECIMAL(12, 2),
    bonus DECIMAL(12, 2),
    stock_options DECIMAL(12, 2),
    total_compensation DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    location VARCHAR(255),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (experience_level_id) REFERENCES experience_levels(id)
);
```

#### 6. **salary_comparisons** Table (Optional)
Stores pre-calculated comparison metrics for performance optimization.

```sql
CREATE TABLE salary_comparisons (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL,
    role_id INT NOT NULL,
    experience_level_id INT NOT NULL,
    average_salary DECIMAL(12, 2),
    median_salary DECIMAL(12, 2),
    min_salary DECIMAL(12, 2),
    max_salary DECIMAL(12, 2),
    total_records INT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (experience_level_id) REFERENCES experience_levels(id)
);
```

#### 7. **audit_logs** Table (Optional)
Tracks data changes for security and compliance.

```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    action VARCHAR(100),
    table_name VARCHAR(100),
    record_id INT,
    old_values JSONB,
    new_values JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### Indexes for Performance

```sql
CREATE INDEX idx_salaries_company_id ON salaries(company_id);
CREATE INDEX idx_salaries_role_id ON salaries(role_id);
CREATE INDEX idx_salaries_experience_level_id ON salaries(experience_level_id);
CREATE INDEX idx_salary_comparisons_company_role ON salary_comparisons(company_id, role_id);
CREATE INDEX idx_users_email ON users(email);
```

## 🔌 API Endpoints

### Salary Endpoints

- `GET /api/salaries` - List all salary records with filters
- `GET /api/salaries/:id` - Get specific salary record
- `POST /api/salaries` - Create new salary record
- `PUT /api/salaries/:id` - Update salary record
- `DELETE /api/salaries/:id` - Delete salary record

### Company Endpoints

- `GET /api/companies` - List all companies
- `GET /api/companies/:id` - Get company details
- `GET /api/companies/:id/salaries` - Get all salaries for a company

### Role Endpoints

- `GET /api/roles` - List all roles
- `GET /api/roles/:id` - Get role details

### Comparison Endpoints

- `GET /api/compare` - Compare salaries between companies/roles
- `GET /api/statistics` - Get salary statistics and analytics

## 📁 Project Structure

```
Compensation-Intelligence-System-Api/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/              # Utility functions and helpers
│   ├── pages/            # API routes
│   └── styles/           # CSS/styling
├── public/               # Static assets
├── .env.local           # Environment variables (not committed)
├── package.json         # Project dependencies
├── next.config.mjs      # Next.js configuration
├── jsconfig.json        # JavaScript configuration
├── eslint.config.mjs    # ESLint configuration
└── README.md            # This file
```

## 🌐 Deployment

The application is configured for deployment on [Vercel](https://vercel.com/).

### Deploy on Vercel

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on each push

```bash
# Or deploy using Vercel CLI
vercel
```

For more information, see [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 📧 Support

For issues, questions, or suggestions, please open an [issue](https://github.com/BuildAndExcecute/Compensation-Intelligence-System-Api/issues) on GitHub.

---

**Happy Coding! 🚀**
