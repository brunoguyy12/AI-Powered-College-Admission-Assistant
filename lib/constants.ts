export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  STUDENT_DASHBOARD: "/dashboard/student",
  ADMIN_DASHBOARD: "/dashboard/admin",
  PROFILE: "/profile",
  UNIVERSITIES: "/universities",
  APPLICATIONS: "/applications",
  RECOMMENDATIONS: "/recommendations",
  CHATBOT: "/chatbot",
  LOGIN: "/login",
  SIGNUP: "/signup",
} as const

export const API_ROUTES = {
  STUDENTS: "/api/students",
  UNIVERSITIES: "/api/universities",
  PROGRAMS: "/api/programs",
  APPLICATIONS: "/api/applications",
  RECOMMENDATIONS: "/api/recommendations",
  CHAT: "/api/chat",
  AUTH: "/api/auth",
} as const
