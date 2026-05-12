export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
}

export const quizData: Question[] = [
  // Frontend
  {
    id: 1,
    question: "Which hook is used for side effects in React?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correctAnswer: "useEffect",
    category: "Frontend",
  },
  {
    id: 2,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language",
    ],
    correctAnswer: "Hyper Text Markup Language",
    category: "Frontend",
  },
  {
    id: 3,
    question: "Which CSS property is used to change the background color?",
    options: ["color", "bgcolor", "background-color", "fill"],
    correctAnswer: "background-color",
    category: "Frontend",
  },
  // Backend
  {
    id: 4,
    question: "Which of these is a Node.js web framework?",
    options: ["Django", "Express", "Laravel", "Spring"],
    correctAnswer: "Express",
    category: "Backend",
  },
  {
    id: 5,
    question: "What is the default port for PostgreSQL?",
    options: ["3306", "27017", "5432", "6379"],
    correctAnswer: "5432",
    category: "Backend",
  },
  {
    id: 6,
    question: "Which HTTP method is typically used to create a new resource?",
    options: ["GET", "POST", "PUT", "PATCH"],
    correctAnswer: "POST",
    category: "Backend",
  },
  // Fullstack / General
  {
    id: 7,
    question: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Automated Program Integration",
      "Applied Protocol Interface",
      "Advanced Programming Index",
    ],
    correctAnswer: "Application Programming Interface",
    category: "General",
  },
  {
    id: 8,
    question: "Which version control system is most widely used?",
    options: ["SVN", "Mercurial", "Git", "Perforce"],
    correctAnswer: "Git",
    category: "General",
  },
  {
    id: 9,
    question: "What is the purpose of Docker?",
    options: [
      "To edit code",
      "To manage databases",
      "To containerize applications",
      "To design UI",
    ],
    correctAnswer: "To containerize applications",
    category: "General",
  },
];
