"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  SkillDefinition,
  GeneratedProblem,
  generateProblem,
  checkAnswer,
  AnswerCheckResult,
} from "@/lib/math-engine";
import { ProgressMap, recordAttempt } from "@/lib/progress-store";
import { MathDisplay } from "./MathDisplay";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCheck,
} from "lucide-react";

interface PracticeWorkspaceProps {
  skill: SkillDefinition;
  nextSkill?: SkillDefinition;
  progress: ProgressMap;
  onUpdateProgress: (next: ProgressMap) => void;
  onBackToCurriculum: () => void;
  onOpenExamples?: () => void;
  onSelectSkill: (skill: SkillDefinition) => void;
}

interface WorksheetItemState {
  problem: GeneratedProblem;
  userInput: string;
  result: AnswerCheckResult | null;
  showSteps: boolean;
}

export function PracticeWorkspace({
  skill,
  nextSkill,
  progress,
  onUpdateProgress,
  onBackToCurriculum,
  onOpenExamples,
  onSelectSkill,
}: PracticeWorkspaceProps) {
  const [practiceMode, setPracticeMode] = useState<"drill" | "worksheet">("drill");

  // Single Problem Mode State
  const [problemCount, setProblemCount] = useState<number>(1);
  const [currentProblem, setCurrentProblem] = useState<GeneratedProblem>(() =>
    generateProblem(skill.id, 1)
  );
  const [userInput, setUserInput] = useState<string>("");
  const [checkResult, setCheckResult] = useState<AnswerCheckResult | null>(null);
  const [showSteps, setShowSteps] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Worksheet Mode State
  const [worksheetSize, setWorksheetSize] = useState<10 | 20>(10);
  const [worksheetSetNumber, setWorksheetSetNumber] = useState<number>(1);
  const [worksheetItems, setWorksheetItems] = useState<WorksheetItemState[]>([]);
  const [showAllWorksheetKeys, setShowAllWorksheetKeys] = useState<boolean>(false);

  const skillProgress = progress[skill.id] || {
    skillId: skill.id,
    totalSolved: 0,
    totalAttempted: 0,
    currentStreak: 0,
    bestStreak: 0,
    mastered: false,
  };

  useEffect(() => {
    const firstProb = generateProblem(skill.id, 1);
    setProblemCount(1);
    setCurrentProblem(firstProb);
    setUserInput("");
    setCheckResult(null);
    setShowSteps(false);
    buildNewWorksheet(skill.id, worksheetSize, 1);
    setTimeout(() => inputRef.current?.focus(), 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skill.id]);

  function buildNewWorksheet(skillId: string, count: 10 | 20, setNum: number) {
    const startNum = (setNum - 1) * count + 1;
    const items: WorksheetItemState[] = Array.from({ length: count }, (_, idx) => ({
      problem: generateProblem(skillId, startNum + idx),
      userInput: "",
      result: null,
      showSteps: false,
    }));
    setWorksheetItems(items);
    setShowAllWorksheetKeys(false);
  }

  function handleDrillSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (checkResult?.isCorrect) {
      handleNextDrillProblem();
      return;
    }

    const res = checkAnswer(userInput, currentProblem);
    setCheckResult(res);

    if (!res.isUnreducedFraction) {
      const updated = recordAttempt(
        progress,
        skill.id,
        res.isCorrect,
        skill.masteryStreak
      );
      onUpdateProgress(updated);
    }

    setShowSteps(true);
  }

  function handleNextDrillProblem() {
    const nextNum = problemCount + 1;
    setProblemCount(nextNum);
    setCurrentProblem(generateProblem(skill.id, nextNum));
    setUserInput("");
    setCheckResult(null);
    setShowSteps(false);
    setTimeout(() => inputRef.current?.focus(), 30);
  }

  function handleWorksheetInputChange(index: number, value: string) {
    setWorksheetItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, userInput: value } : item))
    );
  }

  function handleCheckSingleWorksheetItem(index: number) {
    const target = worksheetItems[index];
    if (!target) return;
    const res = checkAnswer(target.userInput, target.problem);
    const wasAlreadyCorrect = target.result?.isCorrect;

    setWorksheetItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, result: res, showSteps: !res.isCorrect || item.showSteps } : item
      )
    );

    if (!wasAlreadyCorrect && !res.isUnreducedFraction) {
      const updated = recordAttempt(progress, skill.id, res.isCorrect, skill.masteryStreak);
      onUpdateProgress(updated);
    }
  }

  function handleGradeEntireWorksheet() {
    let nextMap = { ...progress };
    let changed = false;

    const updatedItems = worksheetItems.map((item) => {
      if (item.result?.isCorrect) return item;
      const res = checkAnswer(item.userInput, item.problem);
      if (item.userInput.trim().length > 0 && !res.isUnreducedFraction) {
        changed = true;
        nextMap = recordAttempt(nextMap, skill.id, res.isCorrect, skill.masteryStreak);
      }
      return {
        ...item,
        result: res,
        showSteps: !res.isCorrect ? true : item.showSteps,
      };
    });

    setWorksheetItems(updatedItems);
    if (changed) {
      onUpdateProgress(nextMap);
    }
  }

  function toggleWorksheetItemSteps(index: number) {
    setWorksheetItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, showSteps: !item.showSteps } : item))
    );
  }

  function toggleAllWorksheetKeys() {
    const nextState = !showAllWorksheetKeys;
    setShowAllWorksheetKeys(nextState);
    setWorksheetItems((prev) => prev.map((item) => ({ ...item, showSteps: nextState })));
  }

  return (
    <div className="space-y-4">
      {/* Compact Top Bar */}
      <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCurriculum}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Curriculum
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-600">
              {skill.code}
            </span>
            <h1 className="text-sm sm:text-base font-bold text-slate-900">
              {skill.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenExamples && (
            <button
              type="button"
              onClick={onOpenExamples}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition"
            >
              Example & Guide
            </button>
          )}
          <span className="text-xs text-slate-500 font-medium">
            Streak: <strong className="text-slate-900">{skillProgress.currentStreak}/{skill.masteryStreak}</strong>
          </span>

          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setPracticeMode("drill")}
              className={`px-2.5 py-1 rounded-md transition ${
                practiceMode === "drill"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Single
            </button>
            <button
              onClick={() => setPracticeMode("worksheet")}
              className={`px-2.5 py-1 rounded-md transition ${
                practiceMode === "worksheet"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Worksheet
            </button>
          </div>

          {nextSkill && (
            <button
              onClick={() => onSelectSkill(nextSkill)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              Next ({nextSkill.code})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* MODE 1: SINGLE PROBLEM DRILL */}
      {practiceMode === "drill" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
            <span>Problem #{problemCount} • { currentProblem.promptText }</span>
            <button
              type="button"
              onClick={() => setShowSteps((prev) => !prev)}
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
            >
              {showSteps ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showSteps ? "Hide Solution" : "Show Solution"}
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Math Expression */}
            <div className="py-8 px-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center">
              <div className="text-2xl sm:text-3xl font-semibold text-slate-900 text-center overflow-x-auto">
                <MathDisplay latex={currentProblem.questionLatex} block />
              </div>
            </div>

            {/* Answer Input */}
            <form onSubmit={handleDrillSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter answer..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-600 focus:outline-none text-base font-mono text-slate-900"
                />
                {currentProblem.unitSuffix && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    {currentProblem.unitSuffix}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  {checkResult?.isCorrect ? "Next Problem →" : "Check"}
                </button>
                <button
                  type="button"
                  onClick={handleNextDrillProblem}
                  className="px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Next
                </button>
              </div>
            </form>

            {/* Result Banner */}
            {checkResult && (
              <div
                className={`p-3.5 rounded-lg border text-sm flex items-center justify-between gap-3 ${
                  checkResult.isCorrect
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : checkResult.isUnreducedFraction
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  {checkResult.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span className="font-medium">{checkResult.feedbackMessage}</span>
                </div>
                {!checkResult.isCorrect && (
                  <span className="text-xs font-semibold bg-white px-2.5 py-1 rounded border">
                    Ans: <MathDisplay latex={currentProblem.answerLatex} />
                  </span>
                )}
              </div>
            )}

            {/* Concise Step-by-Step Solution */}
            {showSteps && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Solution Steps</span>
                  <span>
                    Answer: <MathDisplay latex={currentProblem.answerLatex} />
                  </span>
                </div>
                <p className="text-xs text-indigo-900 bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-lg">
                  <strong>Tip:</strong> {currentProblem.efficiencyTip}
                </p>
                <div className="space-y-2">
                  {currentProblem.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg p-3 border border-slate-200 space-y-1"
                    >
                      <div className="text-xs font-semibold text-slate-500">
                        {step.title}
                      </div>
                      <div className="text-sm sm:text-base py-1 overflow-x-auto">
                        <MathDisplay latex={step.latex} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: WORKSHEET (10 OR 20 PROBLEMS) */}
      {practiceMode === "worksheet" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-600">
              Set #{worksheetSetNumber} ({worksheetSize} Problems)
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-lg bg-slate-200/70 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setWorksheetSize(10);
                    buildNewWorksheet(skill.id, 10, worksheetSetNumber);
                  }}
                  className={`px-2 py-1 rounded-md ${
                    worksheetSize === 10 ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                  }`}
                >
                  10
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWorksheetSize(20);
                    buildNewWorksheet(skill.id, 20, worksheetSetNumber);
                  }}
                  className={`px-2 py-1 rounded-md ${
                    worksheetSize === 20 ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                  }`}
                >
                  20
                </button>
              </div>

              <button
                type="button"
                onClick={toggleAllWorksheetKeys}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
              >
                {showAllWorksheetKeys ? "Hide Answers" : "Show Answers"}
              </button>

              <button
                type="button"
                onClick={handleGradeEntireWorksheet}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Grade All
              </button>

              <button
                type="button"
                onClick={() => {
                  const nextSet = worksheetSetNumber + 1;
                  setWorksheetSetNumber(nextSet);
                  buildNewWorksheet(skill.id, worksheetSize, nextSet);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                New Sheet
              </button>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {worksheetItems.map((item, idx) => {
              const isCorrect = item.result?.isCorrect;
              const isWrong = item.result && !item.result.isCorrect;

              return (
                <div
                  key={item.problem.id}
                  className={`rounded-lg border p-3.5 flex flex-col justify-between gap-2.5 ${
                    isCorrect
                      ? "bg-emerald-50/40 border-emerald-300"
                      : isWrong
                      ? "bg-rose-50/40 border-rose-300"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleWorksheetItemSteps(idx)}
                      className="text-xs font-medium text-indigo-600 hover:underline"
                    >
                      {item.showSteps ? "Hide" : "Solution"}
                    </button>
                  </div>

                  <div className="py-2 px-3 rounded bg-slate-50 text-base font-medium text-slate-900 overflow-x-auto">
                    <MathDisplay latex={item.problem.questionLatex} />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.userInput}
                      onChange={(e) => handleWorksheetInputChange(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCheckSingleWorksheetItem(idx);
                        }
                      }}
                      placeholder="Answer..."
                      className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 focus:border-indigo-600 focus:outline-none font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleCheckSingleWorksheetItem(idx)}
                      className="px-2.5 py-1.5 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      Check
                    </button>
                  </div>

                  {item.result && (
                    <div
                      className={`text-xs font-semibold flex items-center justify-between px-2 py-1 rounded ${
                        item.result.isCorrect
                          ? "bg-emerald-100/80 text-emerald-900"
                          : "bg-rose-100/80 text-rose-900"
                      }`}
                    >
                      <span>{item.result.isCorrect ? "✓ Correct" : "✗ Incorrect"}</span>
                      {!item.result.isCorrect && (
                        <span className="font-mono">Ans: {item.problem.canonicalAnswer}</span>
                      )}
                    </div>
                  )}

                  {item.showSteps && (
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                      <div className="font-semibold text-slate-700">
                        Ans: <MathDisplay latex={item.problem.answerLatex} />
                      </div>
                      {item.problem.steps.map((st, sIdx) => (
                        <div key={sIdx} className="bg-white p-2 rounded border border-slate-100">
                          <MathDisplay latex={st.latex} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
