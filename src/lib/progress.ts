import { firstExerciseId } from "../data/curriculum";
import type { UserProgress } from "../types";
import { defaultJudge0Settings } from "./judge0";

const storageKey = "cpp-akademia-progress-v1";
const codeTemplateVersion = 2;
const legacyDefaultLanguageId = 54;

export function createEmptyProgress(): UserProgress {
  return {
    codeTemplateVersion,
    learnerName: "Uczen",
    selectedExerciseId: firstExerciseId,
    codeByExercise: {},
    customInputByExercise: {},
    exercises: {},
    settings: defaultJudge0Settings,
  };
}

export function loadProgress(): UserProgress {
  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      return createEmptyProgress();
    }

    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    const shouldResetSavedCode = parsed.codeTemplateVersion !== codeTemplateVersion;
    const settings = {
      ...defaultJudge0Settings,
      ...parsed.settings,
    };

    if (settings.languageId === legacyDefaultLanguageId) {
      settings.languageId = defaultJudge0Settings.languageId;
    }

    return {
      ...createEmptyProgress(),
      ...parsed,
      codeTemplateVersion,
      settings,
      codeByExercise: shouldResetSavedCode ? {} : (parsed.codeByExercise ?? {}),
      customInputByExercise: parsed.customInputByExercise ?? {},
      exercises: parsed.exercises ?? {},
    };
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(progress: UserProgress) {
  window.localStorage.setItem(storageKey, JSON.stringify(progress));
}

export function clearProgress() {
  window.localStorage.removeItem(storageKey);
}
