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

- **Salary Exploration**: Browse compensation data by company, role
- **Company Comparison**: Compare salary ranges across different companies for the same role by taking company overview of both company and then compare it in frontend
- **Salary Contributions**: Users can add their own salary records to the database
- **Filtering**: Filter compensation data by various parameters
- **Real-time Data**: Access up-to-date salary information contributed by the community

## 🛠 Tech Stack

###  Backend
-This Project is mainly a Backend Api of a Compensation Intelligence System. The Tech Stack which I have used are Next.js, Node.js are the main Tech Stack used

### Database
- **PostgreSQL**: I have used a online dtabase from Neon Website
- **Node PostgreSQL Driver** (`pg` 8.21.0) -  Used it for Database connectivity

### Development & Build Tools
- **ESLint 9**: Code linting and quality checks
- **Babel Plugin React Compiler**: React optimization compiler

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**
- **PostgreSQL** (v12 or higher) - running locally or remotely accessible

## Routes Explained
- https://compensation-intelligence-system-ap.vercel.app/api/role - gives all roles which are currently stored in roles Table by GET, you can add new role also by POST
- https://compensation-intelligence-system-ap.vercel.app/api/location - gives all locations which are currently stored in locations Table by GET, you can add new location also by POST
- https://compensation-intelligence-system-ap.vercel.app/api/company - gives all companies list in company Table by GET, and you can add a new company by POST
- https://compensation-intelligence-system-ap.vercel.app/api/company?.name=companyName - give details of a specific company by its name
- https://compensation-intelligence-system-ap.vercel.app/api/company/[id] - gives complete overview of company, means gives min salary, max salary, avg salary, max and min salary roles and other details of company
- https://compensation-intelligence-system-ap.vercel.app/api/compensation-record - gives all salary records stored in current compensation_records Table by GET and you can add a new record by POST if record already exist it will update it
- https://compensation-intelligence-system-ap.vercel.app/api/compensation-record/[company] - gives the compensation record of a specific company by its name
- https://compensation-intelligence-system-ap.vercel.app/api/compensation-record/role/[role] - gives compensation records of a specific role


## Folder Structure Explained

- lib/db.js - connnect database to backend
- db-access folder - containes all ql queries code in sql language which uses db
- sevices folder - handles main logic for example normalizing company names before adding to database,checking duplicate data, calculating total-compensation and many other things
- controllers folder - fetch data from request and passes it tt services and return obtained data
- app/api - contains routes



