# 🚀 AI Readiness Assessment App

A modern, production-ready AI Readiness Assessment tool built with Next.js 14, TypeScript, and Tailwind CSS. This application helps organizations evaluate their readiness for AI transformation through a comprehensive questionnaire and provides personalized AI-generated reports.

## ✨ Features

- **🎯 Comprehensive Assessment**: 9 key areas covering technology, data, workforce, and strategy
- **🤖 AI-Generated Reports**: Personalized insights and actionable roadmaps
- **📱 Modern UI/UX**: Beautiful, responsive design with smooth animations
- **⚡ Real-time Scoring**: Instant calculation of AI readiness scores
- **📧 Email Delivery**: Automated report delivery via email
- **🔒 Privacy First**: Secure data handling with user consent

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless backend functions
- **OpenAI API** - AI-powered report generation
- **Resend** - Reliable email delivery

### Infrastructure
- **Vercel** - Deployment and hosting
- **Supabase** - Database (PostgreSQL)
- **Prisma** - Database ORM (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Resend API key

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd ai-readiness-app
npm install
```

### 2. Environment Setup
Create a `.env.local` file:
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Email Configuration
RESEND_API_KEY=your_resend_api_key_here
REPORT_FROM_EMAIL=reports@yourdomain.com
REPORT_FROM_NAME=AI Readiness Reports

# App Configuration
SITE_URL=http://localhost:3000

# Admin Access
ADMIN_PASSWORD=your_secure_admin_password_here
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔐 Admin Panel

The app includes a secure admin panel at `/admin` that provides:

- **Secure Access**: Password-protected using `ADMIN_PASSWORD` environment variable
- **Data Viewing**: Browse all assessment submissions in a table format
- **CSV Export**: Download submissions data for HubSpot or other CRM imports
- **Submission Details**: View scores, tiers, pain points, and AI reports

**Security Note**: Always use a strong, unique password for the admin panel in production.

## 📋 Assessment Structure

The assessment covers 9 key areas with a maximum score of 29 points:

### **Section 1: Current Automation Level (0-8 points)**
- Chatbots, RPA, AI assistants, Automated QA/analytics

### **Section 2: Data Infrastructure Maturity (0-4 points)**
- CRM integration, data hygiene, reporting systems

### **Section 3: Workforce AI Adoption Readiness (0-4 points)**
- Training levels, change management, team readiness

### **Section 4: Scalability of CX Operations (0-4 points)**
- 24/7 coverage, multi-channel support, scaling capabilities

### **Section 5: KPI Tracking Sophistication (0-5 points)**
- NPS, AHT, FCR, CSAT, productivity metrics

### **Section 6: Security & Compliance (0-6 points)**
- ISO certifications, penetration testing, industry compliance

### **Section 7: Budget & Executive Buy-In (0-4 points)**
- Leadership commitment, dedicated budget, sponsorship

### **Section 8: Pain Points (Non-scored)**
- Business challenges and operational issues

### **Section 9: Urgency Assessment (Non-scored)**
- Timeline for addressing challenges

## 🎯 Scoring & Tiers

- **AI-Enhanced (21-29 points)**: Ready for advanced AI implementation
- **Getting Started (11-20 points)**: Good foundation, needs some improvements
- **Not Ready Yet (0-10 points)**: Requires foundational work before AI adoption

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   └── page.tsx        # Main page
├── components/          # React components
│   └── AssessmentForm.tsx
├── data/               # Static data
│   └── questions.ts    # Assessment questions
├── lib/                # Utility functions
│   ├── scoring.ts      # Score calculation
│   └── prompt.ts       # AI prompt builder
└── types/              # TypeScript types
    └── index.ts
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production
```env
OPENAI_API_KEY=your_production_openai_key
RESEND_API_KEY=your_production_resend_key
REPORT_FROM_EMAIL=reports@yourdomain.com
REPORT_FROM_NAME=AI Readiness Reports
SITE_URL=https://yourdomain.com
```

## 🔮 Next Steps

### Phase 1: Core Functionality ✅
- [x] Assessment form with validation
- [x] Scoring algorithm
- [x] Basic UI/UX
- [x] Local score calculation

### Phase 2: AI Integration 🚧
- [ ] OpenAI API integration
- [ ] AI report generation
- [ ] Email delivery via Resend
- [ ] Report storage and retrieval

### Phase 3: Advanced Features 📋
- [ ] User authentication
- [ ] Progress tracking
- [ ] Team assessments
- [ ] Analytics dashboard
- [ ] Export functionality

### Phase 4: Enterprise Features 🏢
- [ ] Multi-tenant support
- [ ] Custom question sets
- [ ] Advanced reporting
- [ ] API access
- [ ] White-label options

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- Powered by [OpenAI](https://openai.com/)
- Email delivery via [Resend](https://resend.com/)

---

**Ready to transform your organization's AI readiness? Start the assessment today! 🚀**
