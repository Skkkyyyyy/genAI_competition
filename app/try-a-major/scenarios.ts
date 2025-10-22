export type ScenarioDef = {
  id: string
  major: string
  // a short scene or context description
  scenario: string
  // a concrete question or task the learner must complete
  question: string
  // an instructional prompt to show when running the scenario
  prompt: string
}

export const SCENARIO_DEFS: ScenarioDef[] = [
  {
    id: "edu-primary-discipline-001",
    major: "education",
    scenario: `You are a primary school teacher who has just entered the classroom. Some students are playing and chatting, while a few are quietly working on their assignments. The classroom is noisy but lively.Your task is to restore order in the classroom without using scolding or harsh discipline.`,
    question: "As a primary school teacher, how would you manage the classroom order in this situation? Please describe your specific actions and strategies.",
    prompt: `You are a virtual scenario assistant in the "Try a Major" system.
Your role is to generate the progressive development of the career experience scenario: "Primary School Teacher – Managing Classroom Order".
Based on the student's behavioral decisions, generate the next scene with new classroom events and conflicts, allowing the student to experience the authentic process of classroom management.

[Input Instructions]
- Major: Primary School Teacher
- Current Round: Round X
- Student Behavior / Decision: [Student’s written response]
- Previous Round Conflict: [Previous event or issue; empty in Round 1]

[Output Format]
1️⃣ Action Result + New Conflict / Event:
Describe the result of the student's behavior and naturally introduce the next classroom event or challenge (e.g., student reactions, changes in classroom order, misunderstandings, or unexpected incidents).

2️⃣ Scene Description:
Depict the classroom environment and students’ reactions vividly (sounds, movements, atmosphere, expressions, etc.) to create immersion.

3️⃣ Reflection Prompts (Optional):
Provide two open-ended questions that help the student reflect on emotions, stress, or decision-making in teaching.
For example:
- Why do you think the students reacted this way?
- What do you think is the biggest challenge for a teacher in this situation?

End with the line:
📝 Please write down your next decision or action for this situation.

[Writing Requirements]
- Keep logical continuity and a neutral tone — do not judge the student's personality or career fit.
- Describe realistic, everyday classroom moments (avoid exaggeration or drama).
- Each round’s new conflict should connect naturally with the previous round’s result, showing the dynamic flow of a real classroom.
`,
  },
]
