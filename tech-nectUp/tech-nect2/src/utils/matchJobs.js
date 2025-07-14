export function matchJobs(studentSkills, jobs) {
  return jobs
    .map(job => {
      const overlap = job.required_skills.filter(skill =>
        studentSkills.includes(skill)
      );
      const matchScore = overlap.length / job.required_skills.length;
      return { ...job, matchScore };
    })
    .filter(job => job.matchScore >= 0.5)
    .sort((a, b) => b.matchScore - a.matchScore);
}
