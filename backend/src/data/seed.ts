import prisma from '../db/prisma';
import { demoEmployees, demoCandidates, demoJobs, demoPrograms } from './demoData';

export async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  // Delete existing records
  await prisma.employee.deleteMany({});
  await prisma.candidate.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.program.deleteMany({});

  // Seed employees
  for (const emp of demoEmployees) {
    await prisma.employee.create({
      data: {
        id: emp.id,
        name: emp.name,
        role: emp.role,
        skills: emp.skills,
        tenureMonths: emp.tenureMonths,
        performanceScore: emp.performanceScore,
        promotionsCount: emp.promotionsCount,
        lastRoleChangeMonths: emp.lastRoleChangeMonths,
        salaryBand: emp.salaryBand,
        recentWorkloadLevel: emp.recentWorkloadLevel,
        overtimeHoursLast4Weeks: emp.overtimeHoursLast4Weeks,
        engagementScore: emp.engagementScore,
        managerCheckinsLastMonth: emp.managerCheckinsLastMonth,
        ptoDaysTakenLast90Days: emp.ptoDaysTakenLast90Days,
        projectCriticality: emp.projectCriticality,
        projectEndInDays: emp.projectEndInDays,
        recognitionLast60Days: emp.recognitionLast60Days,
        internalMobilityInterest: emp.internalMobilityInterest,
      },
    });
  }

  // Seed candidates
  for (const cand of demoCandidates) {
    await prisma.candidate.create({
      data: {
        id: cand.id,
        name: cand.name,
        role: cand.role,
        skills: cand.skills,
        experienceYears: cand.experienceYears,
      },
    });
  }

  // Seed jobs
  for (const job of demoJobs) {
    await prisma.job.create({
      data: {
        id: job.id,
        title: job.title,
        department: job.department,
        requiredSkills: job.requiredSkills,
        level: job.level,
      },
    });
  }

  // Seed programs
  for (const prog of demoPrograms) {
    await prisma.program.create({
      data: {
        id: prog.id,
        name: prog.name,
        department: prog.department,
        requiredSkills: prog.requiredSkills,
        urgency: prog.urgency,
        businessImpact: prog.businessImpact,
        headcountNeeded: prog.headcountNeeded,
        deadlineInWeeks: prog.deadlineInWeeks,
      },
    });
  }

  const employeeCount = await prisma.employee.count();
  const candidateCount = await prisma.candidate.count();
  const jobCount = await prisma.job.count();
  const programCount = await prisma.program.count();

  console.log(`✅ Seeded ${employeeCount} employees, ${candidateCount} candidates, ${jobCount} jobs, ${programCount} programs.`);

  return {
    employees: employeeCount,
    candidates: candidateCount,
    jobs: jobCount,
    programs: programCount,
  };
}
