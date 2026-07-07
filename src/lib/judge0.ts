import type { Judge0Settings, SubmissionResult, TestResult, TestCase } from "../types";
import { outputsMatch } from "./output";

export const defaultJudge0Settings: Judge0Settings = {
  endpoint: "https://ce.judge0.com",
  languageId: 54,
};

interface Judge0Response {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  status?: {
    id: number;
    description: string;
  };
  time?: string;
  memory?: number;
}

function endpointUrl(endpoint: string) {
  return `${endpoint.replace(/\/+$/, "")}/submissions?base64_encoded=false&wait=true`;
}

export async function runSubmission(
  sourceCode: string,
  stdin: string,
  settings: Judge0Settings,
): Promise<SubmissionResult> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(endpointUrl(settings.endpoint), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_code: sourceCode,
        stdin,
        language_id: settings.languageId,
        cpu_time_limit: 3,
        wall_time_limit: 8,
        memory_limit: 128000,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Judge0 zwrocil HTTP ${response.status}`);
    }

    const data = (await response.json()) as Judge0Response;
    return {
      stdout: data.stdout ?? "",
      stderr: data.stderr ?? "",
      compileOutput: data.compile_output ?? "",
      message: data.message ?? "",
      statusId: data.status?.id ?? 0,
      status: data.status?.description ?? "Nieznany status",
      time: data.time,
      memory: data.memory,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Kompilator nie odpowiedzial w limicie czasu.");
    }

    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function runExerciseTests(
  sourceCode: string,
  tests: TestCase[],
  settings: Judge0Settings,
  onProgress?: (result: TestResult) => void,
) {
  const results: TestResult[] = [];

  for (const test of tests) {
    const submission = await runSubmission(sourceCode, test.input, settings);
    const passed =
      submission.statusId === 3 && outputsMatch(submission.stdout, test.expectedOutput);

    const result: TestResult = {
      test,
      actualOutput: submission.stdout,
      passed,
      status: submission.status,
      statusId: submission.statusId,
      stderr: submission.stderr,
      compileOutput: submission.compileOutput,
      message: submission.message,
      time: submission.time,
    };

    results.push(result);
    onProgress?.(result);

    if ([5, 6, 7, 8, 9, 10, 11, 12].includes(submission.statusId)) {
      break;
    }
  }

  return results;
}
