import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create sample universities
  const universities = await Promise.all([
    prisma.university.create({
      data: {
        name: "Stanford University",
        country: "United States",
        state: "California",
        city: "Stanford",
        acceptanceRate: 3.9,
        averageGPA: 3.95,
        averageSAT: 1505,
        averageACT: 34,
        worldRanking: 5,
        nationalRanking: 3,
        tuitionFee: 60000,
        averageAid: 50000,
      },
    }),
    prisma.university.create({
      data: {
        name: "MIT",
        country: "United States",
        state: "Massachusetts",
        city: "Cambridge",
        acceptanceRate: 3.2,
        averageGPA: 3.98,
        averageSAT: 1545,
        averageACT: 35,
        worldRanking: 1,
        nationalRanking: 1,
        tuitionFee: 60000,
        averageAid: 55000,
      },
    }),
    prisma.university.create({
      data: {
        name: "Harvard University",
        country: "United States",
        state: "Massachusetts",
        city: "Cambridge",
        acceptanceRate: 3.2,
        averageGPA: 3.98,
        averageSAT: 1520,
        averageACT: 34,
        worldRanking: 2,
        nationalRanking: 2,
        tuitionFee: 60000,
        averageAid: 60000,
      },
    }),
  ])

  console.log(`Created ${universities.length} universities`)

  // Create sample programs
  const programs = await Promise.all([
    prisma.program.create({
      data: {
        universityId: universities[0].id,
        name: "Computer Science",
        degree: "Bachelor",
        field: "Computer Science",
        duration: 4,
        minGPA: 3.8,
        minSAT: 1450,
      },
    }),
    prisma.program.create({
      data: {
        universityId: universities[1].id,
        name: "Electrical Engineering",
        degree: "Bachelor",
        field: "Engineering",
        duration: 4,
        minGPA: 3.9,
        minSAT: 1500,
      },
    }),
    prisma.program.create({
      data: {
        universityId: universities[2].id,
        name: "Applied Mathematics",
        degree: "Bachelor",
        field: "Mathematics",
        duration: 4,
        minGPA: 3.85,
        minSAT: 1480,
      },
    }),
  ])

  console.log(`Created ${programs.length} programs`)
  console.log("Database seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
