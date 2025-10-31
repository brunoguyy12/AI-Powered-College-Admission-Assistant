# AdmitAI - AI-Powered College Admissions Assistant

An intelligent platform that helps students navigate the college admissions process with AI-powered recommendations, essay generation, and expert guidance.

## Features

### For Students
- **Smart University Recommendations** - AI analyzes your profile and recommends universities that match your academic achievements and goals
- **Statement of Purpose Generator** - Generate personalized SOPs tailored to specific universities and programs
- **AI Chatbot** - Get instant answers to college admissions questions
- **Application Tracking** - Manage and track all your college applications in one place
- **Profile Management** - Store your academic information (GPA, SAT, ACT, TOEFL, IELTS scores)

### For Admins
- **University Management** - Add and manage universities in the system
- **Student Analytics** - View student profiles and application statistics
- **System Dashboard** - Monitor overall platform activity

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: Clerk
- **AI**: Vercel AI SDK with OpenAI GPT-4o-mini
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon)
- Clerk account for authentication
- OpenAI API key

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd admissions-assistant
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env.local
\`\`\`

Fill in the following variables:
- `NEON_NEON_DATABASE_URL` - Your Neon PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - From Clerk dashboard
- `CLERK_SECRET_KEY` - From Clerk dashboard
- `CLERK_WEBHOOK_SECRET` - From Clerk dashboard
- `OPENAI_API_KEY` - Your OpenAI API key

4. Set up the database
\`\`\`bash
npx prisma migrate dev --name init
npx prisma db seed
\`\`\`

5. Run the development server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/
│   ├── api/                    # API routes
│   │   ├── chat/              # Chatbot API
│   │   ├── recommendations/   # Recommendation engine
│   │   ├── sop/               # SOP generator
│   │   ├── students/          # Student profile API
│   │   ├── universities/      # University API
│   │   ├── applications/      # Application API
│   │   ├── admin/             # Admin APIs
│   │   └── webhooks/          # Clerk webhooks
│   ├── dashboard/             # Student and admin dashboards
│   ├── profile/               # Student profile page
│   ├── recommendations/       # Recommendations page
│   ├── applications/          # Applications page
│   ├── chatbot/               # Chatbot page
│   ├── admin/                 # Admin pages
│   ├── sign-in/               # Clerk sign-in
│   ├── sign-up/               # Clerk sign-up
│   └── layout.tsx             # Root layout
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── admin/                 # Admin components
│   ├── student-profile-form.tsx
│   ├── recommendations-client.tsx
│   ├── applications-client.tsx
│   ├── chat-client.tsx
│   └── navbar.tsx
├── lib/
│   ├── db.ts                  # Prisma client
│   ├── types.ts               # TypeScript types
│   ├── constants.ts           # App constants
│   ├── ai-prompts.ts          # AI system prompts
│   └── utils.ts               # Utility functions
├── prisma/
│   └── schema.prisma          # Database schema
└── scripts/
    ├── seed.ts                # Database seeding
    └── migrate.ts             # Database migration
\`\`\`

## Database Schema

### User
- Stores student and admin accounts
- Synced with Clerk authentication

### StudentProfile
- Academic information (GPA, test scores)
- Personal information (location, interests)
- Career goals and financial aid needs

### University
- University information and rankings
- Tuition and financial aid data
- Acceptance rates and average scores

### Program
- Specific degree programs at universities
- Program requirements and duration

### Application
- Student applications to universities
- Application status tracking
- Essay and deadline information

### Recommendation
- AI-generated university recommendations
- Match scores and reasoning
- Recommended programs

### ChatMessage
- Conversation history with AI chatbot

## API Endpoints

### Student APIs
- `POST /api/students/profile` - Update student profile
- `GET /api/universities` - Get universities
- `POST /api/applications` - Create application
- `GET /api/recommendations` - Get recommendations
- `POST /api/recommendations/generate` - Generate recommendations
- `POST /api/sop/generate` - Generate SOP
- `POST /api/chat` - Chat with AI

### Admin APIs
- `POST /api/admin/universities` - Create university

### Webhooks
- `POST /api/webhooks/clerk` - Clerk user sync

## Usage

### For Students

1. **Sign Up** - Create an account with Clerk
2. **Complete Profile** - Add your academic information
3. **Get Recommendations** - AI analyzes your profile and recommends universities
4. **Track Applications** - Add and manage your applications
5. **Generate SOPs** - Create personalized statements of purpose
6. **Chat with AI** - Get answers to admissions questions

### For Admins

1. **Sign In** - Use admin credentials
2. **Add Universities** - Populate the university database
3. **View Analytics** - Monitor student activity and statistics

## Development

### Running Tests
\`\`\`bash
npm run test
\`\`\`

### Building for Production
\`\`\`bash
npm run build
npm start
\`\`\`

### Database Commands
\`\`\`bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
\`\`\`

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.

## Roadmap

- [ ] Video interview preparation
- [ ] Essay review and feedback
- [ ] Scholarship matching
- [ ] Timeline and deadline management
- [ ] Peer community features
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced analytics for admins

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Vercel AI SDK](https://sdk.vercel.ai/)
- Authentication by [Clerk](https://clerk.com/)
- Database by [Neon](https://neon.tech/)
