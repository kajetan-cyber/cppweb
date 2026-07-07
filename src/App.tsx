import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import {
  BadgeCheck,
  Braces,
  Check,
  CircleAlert,
  CircleHelp,
  ClipboardList,
  Code2,
  Download,
  Lightbulb,
  Moon,
  Play,
  RotateCcw,
  Settings,
  Sun,
  Terminal,
  User,
} from "lucide-react";
import { exercises, stages } from "./data/curriculum";
import { runExerciseTests, runSubmission } from "./lib/judge0";
import { clearProgress, createEmptyProgress, loadProgress, saveProgress } from "./lib/progress";
import type { Exercise, ExerciseProgress, TestResult, UserProgress } from "./types";

const defaultExerciseProgress: ExerciseProgress = {
  completed: false,
  attempts: 0,
  bestPassed: 0,
  hintsRevealed: 0,
};

type Theme = "light" | "dark";

const themeStorageKey = "cpp-akademia-theme";

function loadTheme(): Theme {
  try {
    return window.localStorage.getItem(themeStorageKey) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function exerciseProgress(progress: UserProgress, exerciseId: string): ExerciseProgress {
  return progress.exercises[exerciseId] ?? defaultExerciseProgress;
}

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function formatOutput(value: string) {
  return value.trim() ? value : "(brak wyjscia)";
}

function stageExercises(stageId: string) {
  return exercises.filter((exercise) => exercise.stageId === stageId);
}

function downloadProgress(progress: UserProgress) {
  const blob = new Blob([JSON.stringify(progress, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cpp-akademia-progress.json";
  link.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [theme, setTheme] = useState<Theme>(() => loadTheme());
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [isRunningCustom, setIsRunningCustom] = useState(false);
  const [runError, setRunError] = useState("");
  const [customOutput, setCustomOutput] = useState("");

  const selectedExercise =
    exercises.find((exercise) => exercise.id === progress.selectedExerciseId) ?? exercises[0];
  const selectedStage = stages.find((stage) => stage.id === selectedExercise.stageId) ?? stages[0];
  const selectedProgress = exerciseProgress(progress, selectedExercise.id);
  const selectedCode = progress.codeByExercise[selectedExercise.id] ?? selectedExercise.starterCode;
  const customInput =
    progress.customInputByExercise[selectedExercise.id] ?? selectedExercise.tests[0].input;

  const completedCount = useMemo(
    () => exercises.filter((exercise) => progress.exercises[exercise.id]?.completed).length,
    [progress.exercises],
  );

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  function patchProgress(recipe: (current: UserProgress) => UserProgress) {
    setProgress((current) => recipe(current));
  }

  function selectExercise(exercise: Exercise) {
    setResults([]);
    setRunError("");
    setCustomOutput("");
    patchProgress((current) => ({
      ...current,
      selectedExerciseId: exercise.id,
    }));
  }

  function selectStage(stageId: string) {
    const firstExercise = stageExercises(stageId)[0];

    if (firstExercise) {
      selectExercise(firstExercise);
    }
  }

  function updateCode(code: string) {
    patchProgress((current) => ({
      ...current,
      codeByExercise: {
        ...current.codeByExercise,
        [selectedExercise.id]: code,
      },
    }));
  }

  function handleCodeKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Tab") {
      return;
    }

    event.preventDefault();

    const indent = "    ";
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const nextCode = `${value.slice(0, start)}${indent}${value.slice(end)}`;
    const nextCursor = start + indent.length;

    updateCode(nextCode);

    window.requestAnimationFrame(() => {
      textarea.selectionStart = nextCursor;
      textarea.selectionEnd = nextCursor;
    });
  }

  function updateCustomInput(value: string) {
    patchProgress((current) => ({
      ...current,
      customInputByExercise: {
        ...current.customInputByExercise,
        [selectedExercise.id]: value,
      },
    }));
  }

  function revealHint() {
    patchProgress((current) => {
      const currentExercise = exerciseProgress(current, selectedExercise.id);

      return {
        ...current,
        exercises: {
          ...current.exercises,
          [selectedExercise.id]: {
            ...currentExercise,
            hintsRevealed: Math.min(
              selectedExercise.hints.length,
              currentExercise.hintsRevealed + 1,
            ),
          },
        },
      };
    });
  }

  function resetCode() {
    setResults([]);
    setRunError("");
    setCustomOutput("");
    updateCode(selectedExercise.starterCode);
  }

  async function handleRunTests() {
    setIsRunningTests(true);
    setResults([]);
    setRunError("");
    setCustomOutput("");

    try {
      const nextResults = await runExerciseTests(
        selectedCode,
        selectedExercise.tests,
        progress.settings,
        (result) => setResults((current) => [...current, result]),
      );
      const passedCount = nextResults.filter((result) => result.passed).length;
      const allPassed =
        nextResults.length === selectedExercise.tests.length &&
        nextResults.every((result) => result.passed);

      patchProgress((current) => {
        const currentExercise = exerciseProgress(current, selectedExercise.id);

        return {
          ...current,
          exercises: {
            ...current.exercises,
            [selectedExercise.id]: {
              ...currentExercise,
              completed: currentExercise.completed || allPassed,
              completedAt:
                currentExercise.completedAt ?? (allPassed ? new Date().toISOString() : undefined),
              attempts: currentExercise.attempts + 1,
              bestPassed: Math.max(currentExercise.bestPassed, passedCount),
              lastRunAt: new Date().toISOString(),
            },
          },
        };
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Nieznany blad kompilatora.";
      setRunError(message);

      patchProgress((current) => {
        const currentExercise = exerciseProgress(current, selectedExercise.id);

        return {
          ...current,
          exercises: {
            ...current.exercises,
            [selectedExercise.id]: {
              ...currentExercise,
              attempts: currentExercise.attempts + 1,
              lastRunAt: new Date().toISOString(),
            },
          },
        };
      });
    } finally {
      setIsRunningTests(false);
    }
  }

  async function handleRunCustomInput() {
    setIsRunningCustom(true);
    setRunError("");
    setCustomOutput("");

    try {
      const result = await runSubmission(selectedCode, customInput, progress.settings);
      const blocks = [
        result.stdout ? `stdout:\n${result.stdout}` : "",
        result.stderr ? `stderr:\n${result.stderr}` : "",
        result.compileOutput ? `kompilator:\n${result.compileOutput}` : "",
        result.message ? `wiadomosc:\n${result.message}` : "",
      ].filter(Boolean);

      setCustomOutput(blocks.join("\n\n") || `Status: ${result.status}`);
    } catch (error) {
      setCustomOutput(error instanceof Error ? error.message : "Nie udalo sie uruchomic kodu.");
    } finally {
      setIsRunningCustom(false);
    }
  }

  function resetProgress() {
    const confirmed = window.confirm("Usunac zapisany postep i kod z tej przegladarki?");

    if (!confirmed) {
      return;
    }

    clearProgress();
    setProgress(createEmptyProgress());
    setResults([]);
    setRunError("");
    setCustomOutput("");
  }

  const visibleExercises = stageExercises(selectedStage.id);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <Braces size={24} />
          </div>
          <div>
            <span className="eyebrow">Kurs C++ z kompilatorem</span>
            <h1>C++ Akademia</h1>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            type="button"
            aria-label={theme === "dark" ? "Wlacz tryb jasny" : "Wlacz tryb nocny"}
            title={theme === "dark" ? "Tryb jasny" : "Tryb nocny"}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            <span>{theme === "dark" ? "Jasny" : "Nocny"}</span>
          </button>
          <span className="completion-pill">
            <BadgeCheck size={17} />
            {completedCount}/{exercises.length} zadan
          </span>
          <label className="user-field">
            <User size={18} />
            <input
              value={progress.learnerName}
              onChange={(event) =>
                patchProgress((current) => ({
                  ...current,
                  learnerName: event.target.value,
                }))
              }
              aria-label="Nazwa uzytkownika"
            />
          </label>
        </div>
      </header>

      <main className="app-layout">
        <aside className="task-picker" aria-label="Wybierz zadanie">
          <div className="section-title">
            <ClipboardList size={18} />
            <h2>Zadania</h2>
          </div>

          <label className="select-field">
            <span>Etap</span>
            <select value={selectedStage.id} onChange={(event) => selectStage(event.target.value)}>
              {stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.title}
                </option>
              ))}
            </select>
          </label>

          <div className="simple-task-list">
            {visibleExercises.map((exercise, index) => {
              const itemProgress = exerciseProgress(progress, exercise.id);
              const isSelected = exercise.id === selectedExercise.id;

              return (
                <button
                  className={classNames("task-button", isSelected && "is-selected")}
                  key={exercise.id}
                  onClick={() => selectExercise(exercise)}
                  type="button"
                >
                  <span className="task-number">
                    {itemProgress.completed ? <Check size={14} /> : index + 1}
                  </span>
                  <span>
                    <strong>{exercise.title}</strong>
                    <small>{exercise.difficulty}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="content-stack">
          <article className="lesson-card">
            <div className="lesson-heading">
              <div>
                <span className="eyebrow">{selectedStage.title}</span>
                <h2>{selectedExercise.title}</h2>
              </div>
              <span className="difficulty-badge">{selectedExercise.difficulty}</span>
            </div>

            <div className="intro-box">
              <Lightbulb size={18} />
              <p>{selectedExercise.intro}</p>
            </div>

            <p className="task-text">{selectedExercise.task}</p>

            <div className="io-grid">
              <div>
                <span>Wejscie</span>
                <p>{selectedExercise.inputFormat}</p>
              </div>
              <div>
                <span>Wyjscie</span>
                <p>{selectedExercise.outputFormat}</p>
              </div>
            </div>

            <div className="concept-row" aria-label="Tematy">
              {selectedExercise.concepts.map((concept) => (
                <span key={concept}>{concept}</span>
              ))}
            </div>
          </article>

          <div className="work-grid">
            <section className="editor-card" aria-label="Edytor kodu C++">
              <div className="editor-toolbar">
                <div className="section-title">
                  <Code2 size={18} />
                  <h2>main.cpp</h2>
                </div>
                <div className="toolbar-actions">
                  <button
                    className="icon-button"
                    onClick={resetCode}
                    title="Przywroc starter"
                    type="button"
                  >
                    <RotateCcw size={17} />
                  </button>
                  <button
                    className="primary-button"
                    disabled={isRunningTests}
                    onClick={handleRunTests}
                    type="button"
                  >
                    <Play size={18} />
                    {isRunningTests ? "Testowanie..." : "Uruchom testy"}
                  </button>
                </div>
              </div>

              <textarea
                className="code-editor"
                spellCheck={false}
                value={selectedCode}
                onChange={(event) => updateCode(event.target.value)}
                onKeyDown={handleCodeKeyDown}
                aria-label="Kod C++"
              />

              {runError ? (
                <div className="error-banner">
                  <CircleAlert size={18} />
                  <span>{runError}</span>
                </div>
              ) : null}
            </section>

            <aside className="results-column">
              <section className="panel-card">
                <div className="section-title">
                  <BadgeCheck size={18} />
                  <h2>Testy</h2>
                </div>

                <div className="test-list">
                  {selectedExercise.tests.map((test, index) => {
                    const result = results[index];

                    return (
                      <div
                        className={classNames(
                          "test-card",
                          result?.passed && "is-pass",
                          result && !result.passed && "is-fail",
                        )}
                        key={test.name}
                      >
                        <div className="test-head">
                          <strong>{test.name}</strong>
                          {result ? (
                            <span>{result.passed ? "OK" : result.status}</span>
                          ) : (
                            <span>{test.hidden ? "Ukryty" : "Gotowy"}</span>
                          )}
                        </div>

                        <dl>
                          <div>
                            <dt>stdin</dt>
                            <dd>{test.hidden && !result ? "ukryte" : test.input}</dd>
                          </div>
                          <div>
                            <dt>oczekiwane</dt>
                            <dd>
                              {result && !test.hidden
                                ? formatOutput(test.expectedOutput)
                                : "ukryte do uruchomienia"}
                            </dd>
                          </div>
                          {result ? (
                            <div>
                              <dt>otrzymane</dt>
                              <dd>{formatOutput(result.actualOutput)}</dd>
                            </div>
                          ) : null}
                        </dl>

                        {result?.compileOutput || result?.stderr || result?.message ? (
                          <pre className="mini-console">
                            {result.compileOutput || result.stderr || result.message}
                          </pre>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="panel-card">
                <div className="section-title">
                  <CircleHelp size={18} />
                  <h2>Podpowiedzi</h2>
                </div>

                <div className="hint-list">
                  {selectedExercise.hints.map((hint, index) => {
                    const revealed = index < selectedProgress.hintsRevealed;

                    return (
                      <div className={classNames("hint-item", revealed && "is-open")} key={hint}>
                        <span>{index + 1}</span>
                        <p>{revealed ? hint : "Podpowiedz czeka na odblokowanie."}</p>
                      </div>
                    );
                  })}
                </div>

                <button
                  className="secondary-button full-width"
                  disabled={selectedProgress.hintsRevealed >= selectedExercise.hints.length}
                  onClick={revealHint}
                  type="button"
                >
                  <CircleHelp size={17} />
                  Pokaz podpowiedz
                </button>
              </section>
            </aside>
          </div>

          <section className="bottom-grid">
            <article className="panel-card">
              <div className="section-title">
                <Terminal size={18} />
                <h2>Wlasne wejscie</h2>
              </div>

              <textarea
                className="stdin-editor"
                value={customInput}
                onChange={(event) => updateCustomInput(event.target.value)}
                aria-label="Wlasne dane wejsciowe"
              />
              <button
                className="secondary-button"
                disabled={isRunningCustom}
                onClick={handleRunCustomInput}
                type="button"
              >
                <Play size={17} />
                {isRunningCustom ? "Uruchamianie..." : "Uruchom z tym stdin"}
              </button>
              {customOutput ? <pre className="console-output">{customOutput}</pre> : null}
            </article>

            <article className="panel-card compact-settings">
              <details>
                <summary>
                  <Settings size={18} />
                  Ustawienia i zapis
                </summary>

                <label className="settings-field">
                  <span>Endpoint Judge0</span>
                  <input
                    value={progress.settings.endpoint}
                    onChange={(event) =>
                      patchProgress((current) => ({
                        ...current,
                        settings: {
                          ...current.settings,
                          endpoint: event.target.value,
                        },
                      }))
                    }
                  />
                </label>
                <label className="settings-field">
                  <span>Language ID C++</span>
                  <input
                    type="number"
                    value={progress.settings.languageId}
                    onChange={(event) =>
                      patchProgress((current) => ({
                        ...current,
                        settings: {
                          ...current.settings,
                          languageId: Number(event.target.value),
                        },
                      }))
                    }
                  />
                </label>

                <div className="utility-actions">
                  <button
                    className="secondary-button"
                    onClick={() => downloadProgress(progress)}
                    type="button"
                  >
                    <Download size={17} />
                    Eksport postepu
                  </button>
                  <button className="danger-button" onClick={resetProgress} type="button">
                    <RotateCcw size={17} />
                    Wyczysc postep
                  </button>
                </div>
              </details>
            </article>
          </section>
        </section>
      </main>
    </div>
  );
}
