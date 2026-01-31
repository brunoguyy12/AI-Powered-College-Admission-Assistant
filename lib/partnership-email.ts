export function generatePartnershipEmail(
  universityName: string,
  contactPerson?: string,
  studentCount?: number,
  successRate?: number
): { subject: string; content: string } {
  const studentCountText = studentCount ? `Over ${studentCount} successful admissions` : "Successful student placements"
  const successRateText = successRate ? `with a ${successRate}% success rate` : ""

  const subject = `Partnership Opportunity - Expanding Global Reach Together | [Consultancy Name]`

  const content = `
Dear ${contactPerson || "Admissions Team"},

I hope this message finds you well!

We are reaching out from [Your Consultancy Name], a premier educational consultancy specializing in global student placements and university partnerships. Over the years, we have successfully guided thousands of talented students from across the globe to leading institutions like yours.

**Why Partner With Us?**

We represent a unique opportunity for ${universityName} to:

1. **Expand Your International Student Base** - Access to a diverse pool of highly-qualified international applicants
2. **Streamlined Admissions Process** - Vetted candidates who meet your academic standards
3. **Enhanced Student Support** - Comprehensive guidance ensuring smooth transitions and student success
4. **Increased Enrollment** - ${studentCountText} ${successRateText}
5. **Cultural Diversity** - Bring global perspectives to your campus community

**Our Value Proposition:**

- Network of thousands of motivated international students
- Rigorous screening and qualification verification
- Personalized counseling aligned with your institution's values
- Post-admission support and student retention focus
- Dedicated relationship management and regular communication

**Next Steps:**

We would welcome the opportunity to explore a mutually beneficial partnership with ${universityName}. A collaboration would allow us to:

- Establish preferential admission pathways for our recommended candidates
- Co-develop scholarship and financial aid opportunities
- Create institutional recognition programs
- Organize virtual and in-person events to promote your programs

I would be delighted to schedule a call at your earliest convenience to discuss how we can work together to achieve our shared goals of academic excellence and institutional growth.

Please feel free to reach out with your availability for a brief introductory call. I'm happy to work around your schedule.

**Contact Information:**
[Your Name]
[Your Title]
[Your Consultancy Name]
[Phone Number]
[Email Address]
[Office Address]

Looking forward to the possibility of a fruitful partnership!

Warm regards,

[Your Name]
[Your Consultancy Name]
${new Date().getFullYear()}

---

*This is an automated professional email template. Please customize with your organization's details before sending.*
  `.trim()

  return { subject, content }
}

export function generateFollowUpEmail(
  universityName: string,
  contactPerson?: string,
  previousDate?: Date
): { subject: string; content: string } {
  const dateText = previousDate
    ? ` on ${previousDate.toLocaleDateString()}`
    : ""

  const subject = `Follow-up: Partnership Discussion with ${universityName} | [Consultancy Name]`

  const content = `
Dear ${contactPerson || "Admissions Team"},

I hope you are doing well!

I wanted to follow up regarding our partnership proposal${dateText}. We remain very enthusiastic about the potential collaboration between [Your Consultancy Name] and ${universityName}.

Our organization brings:
- A dedicated student community actively seeking quality education
- Rigorous vetting processes ensuring only qualified applicants
- Long-term commitment to institutional success
- Flexible partnership models tailored to your institution's needs

We believe that together, we can create a meaningful partnership that benefits:
- Your institution through increased enrollment and diverse talent
- Students through streamlined pathways to quality education
- The educational community through collaborative excellence

**I would love to discuss:**
- Your current enrollment priorities
- Available partnership structures
- Financial aid and scholarship opportunities
- Student support mechanisms

Would you be available for a brief 20-30 minute call next week? I'm flexible with timing and happy to work with your schedule.

Please let me know your availability, or feel free to reach out if you have any questions.

Best regards,

[Your Name]
[Your Title]
[Your Consultancy Name]
[Phone Number]
[Email Address]

---

*This is a follow-up communication regarding a partnership opportunity.*
  `.trim()

  return { subject, content }
}
