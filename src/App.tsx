import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  BadgeCheck,
  BookOpen,
  Braces,
  Check,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  ClipboardList,
  Code2,
  Download,
  Gauge,
  Lightbulb,
  Play,
  RotateCcw,
  Settings,
  Sparkles,
  Terminal,
  Trophy,
  User,
} from "lucide-react";
import { exercises, stages } from "./data/curriculum";
import { runExerciseTests, runSubmission } from "./lib/judge0";
import { clearProgress, createEmptyProgress, loadProgress, saveProgress } from "./lib/progress";
import type { Exercise, ExerciseProgress, Stage, TestResult, UserProgress } from "./types";

const defaultProgress: ExerciseProgress = {
  completed: false,
  attempts: 0,
  bestPassed: 0,
  hintsRevealed: 0,
};

function exerciseProgress(progress: UserProgress, exerciseId: string): ExerciseProgress {
  return progress.exercises[exerciseId] ?? defaultProgress;
}

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function formatOutput(value: string) {
  return value.trim() ? value : "(brak wyjscia)";
}

function getStageExercises(stage: Stage) {
  return exercises.filter((exercise) => exercise.stageId === stage.id);
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
  const customInput = progress.customInputByExercise[selectedExercise.id] ?? selectedExercise.tests[0].input;

  const stats = useMemo(() => {
    const completed = exercises.filter((exercise) => progress.exercises[exercise.id]?.completed);
    const xp = completed.reduce((sum, exercise) => sum + exercise.xp, 0);
    const percent = Math.round((completed.length / exercises.length) * 100);

    return {
      completedCount: completed.length,
      totalCount: exercises.length,
      xp,
      percent,
    };
  }, [progress.exercises]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

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

  function updateCode(code: string) {
    patchProgress((current) => ({
      ...current,
      codeByExercise: {
        ...current.codeByExercise,
        [selectedExercise.id]: code,
      },
    }));
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

  const progressStyle = {
    "--progress": `${stats.percent * 3.6}deg`,
  } as CSSProperties;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <Braces size={24} />
          </div>
          <div>
            <span className="eyebrow">Roadmapa + kompilator</span>
            <h1>C++ Akademia</h1>
          </div>
        </div>

        <div className="topbar-stats" aria-label="Postep kursu">
          <div className="stat-pill">
            <Trophy size={18} />
            <span>{stats.xp} XP</span>
          </div>
          <div className="stat-pill">
            <BadgeCheck size={18} />
            <span>
              {stats.completedCount}/{stats.totalCount}
            </span>
          </div>
        </div>

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
      </header>

      <main className="workspace">
        <aside className="roadmap-panel" aria-label="Sciezka nauki C++">
          <div className="panel-heading">
            <BookOpen size={20} />
            <div>
              <h2>Droga nauki</h2>
              <p>Od pierwszego cout do samodzielnych zadan.</p>
            </div>
          </div>

          <div className="stage-list">
            {stages.map((stage) => {
              const stageExercises = getStageExercises(stage);
              const completed = stageExercises.filter(
                (exercise) => progress.exercises[exercise.id]?.completed,
              ).length;
              const stagePercent = Math.round((completed / stageExercises.length) * 100);

              return (
                <section
                  className="stage-group"
                  key={stage.id}
                  style={{ "--stage-accent": stage.accent } as CSSProperties}
                >
                  <div className="stage-summary">
                    <span className="stage-dot" aria-hidden="true" />
                    <div>
                      <h3>{stage.title}</h3>
                      <p>{stage.subtitle}</p>
                    </div>
                    <strong>{stagePercent}%</strong>
                  </div>

                  <div className="exercise-list">
                    {stageExercises.map((exercise) => {
                      const itemProgress = exerciseProgress(progress, exercise.id);
                      const isSelected = exercise.id === selectedExercise.id;

                      return (
                        <button
                          className={classNames("exercise-link", isSelected && "is-selected")}
                          key={exercise.id}
                          onClick={() => selectExercise(exercise)}
                          type="button"
                        >
                          <span className="status-dot">
                            {itemProgress.completed ? <Check size={13} /> : null}
                          </span>
                          <span>
                            <strong>{exercise.title}</strong>
                            <small>
                              {exercise.difficulty} · {exercise.xp} XP
                            </small>
                          </span>
                          <ChevronRight size={16} />
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </aside>

        <section className="lesson-panel" aria-labelledby="lesson-title">
          <div
            className="stage-banner"
            style={{ "--stage-accent": selectedStage.accent } as CSSProperties}
          >
            <div>
              <span className="eyebrow">{selectedStage.title}</span>
              <h2 id="lesson-title">{selectedExercise.title}</h2>
              <p>{selectedExercise.brief}</p>
            </div>
            <div className="difficulty-badge">{selectedExercise.difficulty}</div>
          </div>

          <div className="lesson-grid">
            <article className="task-panel">
              <div className="section-title">
                <ClipboardList size={18} />
                <h3>Zadanie</h3>
              </div>
              <div className="intro-box">
                <Lightbulb size={18} />
                <p>{selectedExercise.intro}</p>
              </div>
              <p>{selectedExercise.task}</p>

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

              {selectedExercise.stretch ? (
                <div className="stretch-box">
                  <Sparkles size={18} />
                  <p>{selectedExercise.stretch}</p>
                </div>
              ) : null}
            </article>

            <article className="checks-panel">
              <div className="section-title">
                <Gauge size={18} />
                <h3>Testy</h3>
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
                          <span>{test.hidden ? "Ukryty" : "Jawny"}</span>
                        )}
                      </div>

                      {test.hidden && !result ? (
                        <p className="muted">Dane testu sa ukryte do czasu uruchomienia.</p>
                      ) : (
                        <dl>
                          <div>
                            <dt>stdin</dt>
                            <dd>{test.hidden ? "ukryte" : test.input}</dd>
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
                      )}

                      {result?.compileOutput || result?.stderr || result?.message ? (
                        <pre className="mini-console">
                          {result.compileOutput || result.stderr || result.message}
                        </pre>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </section>

        <section className="editor-panel" aria-label="Edytor kodu C++">
          <div className="editor-toolbar">
            <div className="section-title">
              <Code2 size={18} />
              <h3>main.cpp</h3>
            </div>
            <div className="toolbar-actions">
              <button className="icon-button" onClick={resetCode} title="Przywroc starter" type="button">
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
            aria-label="Kod C++"
          />

          {runError ? (
            <div className="error-banner">
              <CircleAlert size={18} />
              <span>{runError}</span>
            </div>
          ) : null}

          <div className="custom-runner">
            <div className="section-title">
              <Terminal size={18} />
              <h3>Wlasne wejscie</h3>
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
          </div>
        </section>

        <aside className="assistant-panel" aria-label="Postep i podpowiedzi">
          <section className="progress-card">
            <div className="progress-dial" style={progressStyle}>
              <span>{stats.percent}%</span>
            </div>
            <div>
              <span className="eyebrow">Postep uzytkownika</span>
              <h2>{progress.learnerName || "Uczen"}</h2>
              <p>
                {stats.completedCount} z {stats.totalCount} zadan zaliczone.
              </p>
            </div>
          </section>

          <section className="side-section">
            <div className="section-title">
              <Lightbulb size={18} />
              <h3>Podpowiedzi</h3>
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
              Pokaz kolejna podpowiedz
            </button>
          </section>

          <section className="side-section">
            <div className="section-title">
              <BadgeCheck size={18} />
              <h3>Wynik zadania</h3>
            </div>
            <div className="metric-grid">
              <div>
                <span>Proby</span>
                <strong>{selectedProgress.attempts}</strong>
              </div>
              <div>
                <span>Najlepiej</span>
                <strong>
                  {selectedProgress.bestPassed}/{selectedExercise.tests.length}
                </strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{selectedProgress.completed ? "Zaliczone" : "W toku"}</strong>
              </div>
              <div>
                <span>Czas</span>
                <strong>{selectedExercise.minutes} min</strong>
              </div>
            </div>
          </section>

          <section className="side-section">
            <div className="section-title">
              <Settings size={18} />
              <h3>Kompilator</h3>
            </div>
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
            <p className="muted">
              Kod jest wysylany do ustawionego endpointu tylko podczas uruchamiania.
            </p>
          </section>

          <section className="side-section">
            <button
              className="secondary-button full-width"
              onClick={() => downloadProgress(progress)}
              type="button"
            >
              <Download size={17} />
              Eksport postepu
            </button>
            <button className="danger-button full-width" onClick={resetProgress} type="button">
              <RotateCcw size={17} />
              Wyczysc postep
            </button>
          </section>
        </aside>
      </main>
    </div>
  );
}
