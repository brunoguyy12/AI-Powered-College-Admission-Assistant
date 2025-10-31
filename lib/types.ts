import type { User, StudentProfile, University, Program, Application, Recommendation } from "@prisma/client"

export type UserWithProfile = User & {
  studentProfile: StudentProfile | null
}

export type UniversityWithPrograms = University & {
  programs: Program[]
}

export type ApplicationWithDetails = Application & {
  student: User
}

export type RecommendationWithDetails = Recommendation & {
  student: User
}

export enum UserRole {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
}

export enum ApplicationStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  WAITLISTED = "WAITLISTED",
}
