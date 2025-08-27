# JobHub Frontend

A modern job platform built with Next.js 13+, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Next.js 13+ App Router** - Latest Next.js features with App Router
- 🎨 **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- 📱 **Responsive Design** - Mobile-first responsive design
- 🔐 **Authentication** - User authentication with context-based state management
- 📊 **Dashboard** - Analytics and job tracking dashboard
- 🔍 **Job Search** - Advanced job search with filters
- 👤 **User Profiles** - Comprehensive user profile management
- 🎯 **TypeScript** - Full TypeScript support for better development experience

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Analytics dashboard
│   ├── jobs/             # Job listings
│   ├── login/            # Authentication pages
│   ├── profile/          # User profile
│   ├── register/         # User registration
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/           # Reusable UI components
│   ├── common/          # Common components (Header, Footer, etc.)
│   ├── dashboard/       # Dashboard-specific components
│   ├── job/            # Job-related components
│   └── profile/        # Profile-related components
├── context/             # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API services
└── styles/             # Additional styles
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jobhub/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Tech Stack

- **Framework**: Next.js 15.5.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context
- **Code Quality**: ESLint + Prettier
- **Authentication**: Custom auth context (mock implementation)

## Key Components

### Authentication
- `AuthContext` - Global authentication state management
- Login/Register pages with form validation
- Protected routes and user session management

### Job Management
- `JobCard` - Reusable job listing component
- Job search with filters
- Job application tracking

### Dashboard
- Analytics overview
- Application tracking
- Job recommendations

### Profile Management
- User profile editing
- Skills management
- Job preferences

## Styling

The project uses Tailwind CSS with custom components and utilities:

- Custom color palette with primary and secondary colors
- Responsive design utilities
- Custom component classes (`.btn-primary`, `.card`, etc.)
- Inter font family for better typography

## API Integration

The project includes a service layer for API integration:

- `apiService` - Base API service with authentication
- Custom hooks for data fetching (`useJobs`, etc.)
- Mock data for development and testing

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Implement proper error handling

### Component Structure
- Use PascalCase for component names
- Place components in appropriate directories
- Export components as default exports
- Use TypeScript interfaces for props

### Styling
- Use Tailwind CSS classes
- Create custom components for repeated patterns
- Follow mobile-first responsive design
- Use semantic HTML elements

## Deployment

The project can be deployed to various platforms:

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings
3. Deploy automatically on push

### Other Platforms
- Netlify
- AWS Amplify
- Docker deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
