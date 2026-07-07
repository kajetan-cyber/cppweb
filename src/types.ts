export type StageId =
  | "start"
  | "control"
  | "structures"
  | "algorithms"
  | "advanced"
  | "independent";

export type Difficulty = "Latwe" | "Srednie" | "Trudne" | "Projektowe";

export interface Stage {
  id: StageId;
  title: string;
  subtitle: string;
  description: string;
  outcomes: string[];
  accent: string;
}

export interface TestCase {
  name: string;
  input: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface Exercise {
  id: string;
  stageId: StageId;
  title: string;
  difficulty: Difficulty;
  xp: number;
  minutes: number;
  concepts: string[];
  brief: string;
  task: string;
  inputFormat: string;
  outputFormat: string;
  starterCode: string;
  hints: string[];
  tests: TestCase[];
  stretch?: string;
}

export interface Judge0Settings {
  endpoint: string;
  languageId: number;
}

export interface ExerciseProgress {
  completed: boolean;
  attempts: number;
  bestPassed: number;
  hintsRevealed: number;
  completedAt?: string;
  lastRunAt?: string;
}

export interface UserProgress {
  learnerName: string;
  selectedExerciseId: string;
  codeByExercise: Record<string, string>;
  customInputByExercise: Record<string, string>;
  exercises: Record<string, ExerciseProgress>;
  settings: Judge0Settings;
}

export interface SubmissionResult {
  stdout: string;
  stderr: string;
  compileOutput: string;
  message: string;
  statusId: number;
  status: string;
  time?: string;
  memory?: number;
}

export interface TestResult {
  test: TestCase;
  actualOutput: string;
  passed: boolean;
  status: string;
  statusId: number;
  stderr: string;
  compileOutput: string;
  message: string;
  time?: string;
}
