# 🚀 JobHub - Modern Job Board Platform

A full-stack job board application built with Next.js, TypeScript, and Tailwind CSS. JobHub connects job seekers with employers through a modern, intuitive interface.

## ✨ Features

### 🔐 Authentication & User Management
- **Google & LinkedIn OAuth Integration** - Seamless social login
- **User Registration & Login** - Traditional email/password authentication
- **Role-based Access** - Support for job seekers and employers
- **Profile Management** - Real-time profile updates with skills and social links

### 💼 Job Management
- **Live Job Postings** - Browse and search through active job listings
- **Advanced Filtering** - Filter by location, job type, salary, and more
- **Job Details** - Comprehensive job information with requirements and benefits
- **Direct Application** - One-click job application with cover letter and portfolio links

### 📊 Dashboard & Analytics
- **Application Tracking** - Monitor your job application status
- **Job Recommendations** - AI-powered job matching based on your profile
- **Statistics Dashboard** - Track your job search progress
- **Real-time Updates** - Instant feedback on application status

### 🎨 Modern UI/UX
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode** - Beautiful gradient designs and modern aesthetics
- **Loading States** - Smooth skeleton loading animations
- **Interactive Elements** - Hover effects and micro-interactions

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management and side effects
- **Context API** - Global state management

### Backend (Mock API)
- **Mock API Service** - Comprehensive mock backend for development
- **Local Storage** - Client-side data persistence
- **JWT Tokens** - Authentication token management

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jobhub.git
   cd jobhub
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## 📁 Project Structure

```
jobhub/
├── frontend/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/         # Dashboard page
│   │   ├── jobs/             # Job listings and details
│   │   ├── login/            # Authentication pages
│   │   ├── register/         # User registration
│   │   └── profile/          # User profile management
│   ├── components/           # Reusable React components
│   │   ├── common/          # Shared components (Header, Footer, etc.)
│   │   └── job/             # Job-related components
│   ├── context/             # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service layer
│   ├── types/               # TypeScript type definitions
│   └── styles/              # Global styles and Tailwind config
└── README.md
```

## 🎯 Key Features Demo

### 1. **Browse Jobs**
- Visit `/jobs` to see all available job listings
- Use search and filters to find specific positions
- Click on any job card to view detailed information

### 2. **Apply to Jobs**
- Click "Apply Now" on any job detail page
- Fill out the application form with cover letter and links
- Submit your application with one click

### 3. **Authentication**
- Try Google or LinkedIn login (mock implementation)
- Register with email/password
- Manage your profile and preferences

### 4. **Dashboard**
- Track your job applications
- View job recommendations
- Monitor your application statistics

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Check TypeScript types
```

### Mock Data

The application includes comprehensive mock data:
- **5 Sample Jobs** - Various positions across different companies
- **User Profiles** - Mock user data for testing
- **Applications** - Sample application history
- **OAuth Simulation** - Mock Google and LinkedIn authentication

## 🎨 Customization

### Styling
- Modify `tailwind.config.ts` for theme customization
- Update `app/globals.css` for global styles
- Use the existing component classes for consistency

### Adding New Features
- Create new pages in the `app/` directory
- Add components in the `components/` directory
- Extend the API service in `services/api.ts`
- Update types in `types/index.ts`

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** - Full-featured experience with sidebar navigation
- **Tablet** - Adaptive layout with optimized touch interactions
- **Mobile** - Mobile-first design with collapsible navigation

## 🔒 Security Features

- **JWT Token Management** - Secure authentication
- **Input Validation** - Form validation and sanitization
- **Protected Routes** - Authentication-based access control
- **Secure Storage** - Local storage with token encryption

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Upload the `out` directory to Netlify
3. Configure redirects for client-side routing

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- AWS Amplify
- Google Cloud Platform
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **React Community** - For the excellent ecosystem and tools

## 📞 Support

If you have any questions or need help:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

---

**Made with ❤️ by the JobHub Team**
