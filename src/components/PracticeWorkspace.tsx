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
  Zap,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Lightbulb,
  Flame,
  Trophy,
  RotateCcw,
  FileSpreadsheet,
  Layers,
  Clock,
  Sparkles,
  CheckCheck,
} from "lucide-react";

interface PracticeWorkspaceProps {
  skill: SkillDefinition;
  nextSkill?: SkillDefinition;
  progress: ProgressMap;
  onUpdateProgress: (next: ProgressMap) => void;
  onBackToCurriculum: () => void;
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
  onSelectSkill,
}: PracticeWorkspaceProps) {
  const [practiceMode, setPracticeMode] = useState<"drill" | "worksheet">("drill");

  // --- Infinite Drill State ---
  const [problemCount, setProblemCount] = useState<number>(1);
  const [currentProblem, setCurrentProblem] = useState<GeneratedProblem>(() =>
    generateProblem(skill.id, 1)
  );
  const [userInput, setUserInput] = useState<string>("");
  const [checkResult, setCheckResult] = useState<AnswerCheckResult | null>(null);
  const [showSteps, setShowSteps] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [sessionSolved, setSessionSolved] = useState<number>(0);
  const [sessionAttempted, setSessionAttempted] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Worksheet Mode State ---
  const [worksheetSize, setWorksheetSize] = useState<10 | 20>(10);
  const [worksheetSetNumber, setWorksheetSetNumber] = useState<number>(1);
  const [worksheetItems, setWorksheetItems] = useState<WorksheetItemState[]>([]);
  const [showAllWorksheetKeys, setShowAllWorksheetKeys] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);

  const skillProgress = progress[skill.id] || {
    skillId: skill.id,
    totalSolved: 0,
    totalAttempted: 0,
    currentStreak: 0,
    bestStreak: 0,
    mastered: false,
  };

  // Reset when skill changes
  useEffect(() => {
    const firstProb = generateProblem(skill.id, 1);
    setProblemCount(1);
    setCurrentProblem(firstProb);
    setUserInput("");
    setCheckResult(null);
    setShowSteps(false);
    setShowHint(false);
    setSessionSolved(0);
    setSessionAttempted(0);
    setElapsedSeconds(0);
    setTimerRunning(true);
    buildNewWorksheet(skill.id, worksheetSize, 1);
    setTimeout(() => inputRef.current?.focus(), 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skill.id]);

  // Timer effect
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

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
    setElapsedSeconds(0);
    setTimerRunning(true);
  }

  function handleDrillSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    // If already checked and correct, pressing Enter advances to the next infinite problem
    if (checkResult?.isCorrect) {
      handleNextDrillProblem();
      return;
    }

    const res = checkAnswer(userInput, currentProblem);
    setCheckResult(res);

    if (!res.isUnreducedFraction) {
      setSessionAttempted((prev) => prev + 1);
      if (res.isCorrect) {
        setSessionSolved((prev) => prev + 1);
      }
      const updated = recordAttempt(
        progress,
        skill.id,
        res.isCorrect,
        skill.masteryStreak
      );
      onUpdateProgress(updated);
    }

    // Automatically open the efficient solution walkthrough when answered so user reinforces the best method
    setShowSteps(true);
  }

  function handleNextDrillProblem() {
    const nextNum = problemCount + 1;
    setProblemCount(nextNum);
    setCurrentProblem(generateProblem(skill.id, nextNum));
    setUserInput("");
    setCheckResult(null);
    setShowSteps(false);
    setShowHint(false);
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
      setSessionAttempted((prev) => prev + 1);
      if (res.isCorrect) setSessionSolved((prev) => prev + 1);
      const updated = recordAttempt(progress, skill.id, res.isCorrect, skill.masteryStreak);
      onUpdateProgress(updated);
    }
  }

  function handleGradeEntireWorksheet() {
    let nextMap = { ...progress };
    let newlySolved = 0;
    let newlyAttempted = 0;

    const updatedItems = worksheetItems.map((item) => {
      if (item.result?.isCorrect) return item;
      const res = checkAnswer(item.userInput, item.problem);
      if (item.userInput.trim().length > 0 && !res.isUnreducedFraction) {
        newlyAttempted++;
        if (res.isCorrect) newlySolved++;
        nextMap = recordAttempt(nextMap, skill.id, res.isCorrect, skill.masteryStreak);
      }
      return {
        ...item,
        result: res,
        showSteps: !res.isCorrect ? true : item.showSteps,
      };
    });

    setWorksheetItems(updatedItems);
    if (newlyAttempted > 0) {
      setSessionAttempted((p) => p + newlyAttempted);
      setSessionSolved((p) => p + newlySolved);
      onUpdateProgress(nextMap);
    }
    setTimerRunning(false);
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

  function formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  const streakPercent = Math.min(
    100,
    Math.round((skillProgress.currentStreak / skill.masteryStreak) * 100)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar: Navigation + Mode Toggle + Session Stats */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <button
            onClick={onBackToCurriculum}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Curriculum
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-600 text-white tracking-wide">
                {skill.code}
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">{skill.title}</h1>
              {skillProgress.mastered && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  Mastered
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{skill.subtitle}</p>
          </div>
        </div>

        {/* Mode Switcher: Interactive Drill vs Kumon Worksheet */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setPracticeMode("drill")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                practiceMode === "drill"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-4 h-4" />
              Infinite Drill
            </button>
            <button
              onClick={() => setPracticeMode("worksheet")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                practiceMode === "worksheet"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Worksheet (10–20)
            </button>
          </div>

          {nextSkill && (
            <button
              onClick={() => onSelectSkill(nextSkill)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
              title={`Move to next skill: ${nextSkill.code} ${nextSkill.title}`}
            >
              Next Session ({nextSkill.code})
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Kumon Core Efficiency Banner & Mastery Streak Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-gradient-to-r from-indigo-50 via-blue-50 to-slate-50 rounded-2xl border border-indigo-100 p-4 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
            <Zap className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-sm">
            <div className="font-bold text-indigo-950 flex items-center gap-2">
              <span>Kumon Efficiency Method</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                SCT: {Math.floor(skill.targetTimeSeconds / 60)}m{" "}
                {skill.targetTimeSeconds % 60 > 0 ? `${skill.targetTimeSeconds % 60}s` : ""} / 10 probs
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed">{skill.efficiencySummary}</p>
            <div className="pt-1 text-xs text-indigo-900 bg-white/80 inline-block px-3 py-1 rounded-lg border border-indigo-100">
              <span className="font-semibold mr-2">Model Example:</span>
              <MathDisplay latex={skill.exampleLatex} />
            </div>
          </div>
        </div>

        {/* Live Session & Mastery Progress Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame
                className={`w-5 h-5 ${
                  skillProgress.currentStreak > 0 ? "text-orange-500" : "text-slate-400"
                }`}
              />
              <div>
                <div className="text-xs text-slate-500 font-medium">Mastery Streak</div>
                <div className="text-base font-bold text-slate-900">
                  {skillProgress.currentStreak} / {skill.masteryStreak} in a row
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">Session Score</div>
              <div className="text-base font-bold text-slate-900">
                {sessionSolved} / {sessionAttempted}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${streakPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Total Solved: {skillProgress.totalSolved}</span>
              <span>Best Streak: {skillProgress.bestStreak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODE 1: INFINITE DRILL MODE (ONE BY ONE WITH INSTANT SOLUTION KEY)   */}
      {/* ===================================================================== */}
      {practiceMode === "drill" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Problem Header */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 text-xs font-bold">
                Problem #{problemCount} (Infinite Session)
              </span>
              <span className="text-sm font-medium text-slate-600">
                {currentProblem.promptText}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(elapsedSeconds)}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                {showHint ? "Hide Hint" : "Hint"}
              </button>
              <button
                type="button"
                onClick={() => setShowSteps((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition"
              >
                {showSteps ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showSteps ? "Hide Efficient Answer Key" : "Show Efficient Answer Key"}
              </button>
            </div>
          </div>

          {/* Main Problem Display & Answer Input */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="py-6 px-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-center min-h-[120px]">
              <div className="text-2xl sm:text-4xl font-semibold text-slate-900 text-center overflow-x-auto">
                <MathDisplay latex={currentProblem.questionLatex} block />
              </div>
            </div>

            {showHint && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Quick Hint: </span>
                  {currentProblem.hint}
                </div>
              </div>
            )}

            {/* Answer Form */}
            <form onSubmit={handleDrillSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your answer (e.g., 12, 3/4, 1 1/2, or 4x + 7)..."
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 focus:border-indigo-600 focus:outline-none text-lg font-mono text-slate-900 bg-white"
                  />
                  {currentProblem.unitSuffix && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                      {currentProblem.unitSuffix}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
                  >
                    {checkResult?.isCorrect ? (
                      <>
                        Next Problem
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Check Answer
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleNextDrillProblem}
                    className="px-4 py-3.5 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-sm"
                    title="Skip or generate a new problem"
                  >
                    Skip / Next
                  </button>
                </div>
              </div>

              {/* Helper formatting symbols for fractions / algebra */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span>Quick insert:</span>
                  {["/", "x", "-", "."].map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => {
                        setUserInput((prev) => prev + sym);
                        inputRef.current?.focus();
                      }}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-semibold border border-slate-200"
                    >
                      {sym}
                    </button>
                  ))}
                  <span className="text-slate-400 ml-1">
                    Tip: Enter fractions as <code className="text-slate-600">a/b</code> (e.g.{" "}
                    <code className="text-slate-600">3/4</code>). Press Enter to submit & advance!
                  </span>
                </div>
              </div>
            </form>

            {/* Feedback Banner */}
            {checkResult && (
              <div
                className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                  checkResult.isCorrect
                    ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                    : checkResult.isUnreducedFraction
                    ? "bg-amber-50 border-amber-200 text-amber-950"
                    : "bg-rose-50 border-rose-200 text-rose-950"
                }`}
              >
                <div className="flex items-start gap-3">
                  {checkResult.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-sm">
                    <div className="font-bold">{checkResult.feedbackMessage}</div>
                    {!checkResult.isCorrect && (
                      <div className="text-xs opacity-90 flex items-center gap-2">
                        <span>Correct Answer:</span>
                        <span className="font-bold px-2 py-0.5 bg-white rounded border">
                          <MathDisplay latex={currentProblem.answerLatex} />
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextDrillProblem}
                  className="shrink-0 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-900 border shadow-sm transition"
                >
                  Next Problem
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Step-by-Step Most Efficient Solution Key */}
            {showSteps && (
              <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/40 overflow-hidden">
                <div className="bg-indigo-600 text-white px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Answer Key & Most Efficient Solution Method</span>
                  </div>
                  <div className="text-xs font-semibold bg-indigo-700 px-2.5 py-1 rounded-md">
                    Answer: <MathDisplay latex={currentProblem.answerLatex} />
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-950 text-xs sm:text-sm flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Why this way is fastest: </span>
                      {currentProblem.efficiencyTip}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentProblem.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2"
                      >
                        <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                          {step.title}
                        </div>
                        <div className="py-2 px-3 bg-slate-50 rounded-lg border border-slate-100 text-base sm:text-lg overflow-x-auto">
                          <MathDisplay latex={step.latex} />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600">{step.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODE 2: KUMON WORKSHEET MODE (10 OR 20 PROBLEMS ON A SINGLE SHEET)    */}
      {/* ===================================================================== */}
      {practiceMode === "worksheet" && (
        <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm overflow-hidden">
          {/* Classic Kumon Paper Sheet Header */}
          <div className="bg-slate-50 border-b-2 border-slate-300 p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded bg-slate-900 text-white font-mono font-bold text-sm">
                    {skill.code}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Set #{worksheetSetNumber} • Endless Worksheet Generator
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{skill.title}</h2>
                <p className="text-xs text-slate-600">{skill.efficiencySummary}</p>
              </div>

              {/* Kumon Time & Controls Box */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Time</div>
                    <div className="font-mono font-bold text-sm text-slate-800">
                      {formatTime(elapsedSeconds)}
                    </div>
                  </div>
                </div>

                <div className="inline-flex rounded-xl bg-slate-200/70 p-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setWorksheetSize(10);
                      buildNewWorksheet(skill.id, 10, worksheetSetNumber);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg transition ${
                      worksheetSize === 10 ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                    }`}
                  >
                    10 Probs
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWorksheetSize(20);
                      buildNewWorksheet(skill.id, 20, worksheetSetNumber);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg transition ${
                      worksheetSize === 20 ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                    }`}
                  >
                    20 Probs
                  </button>
                </div>

                <button
                  type="button"
                  onClick={toggleAllWorksheetKeys}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition"
                >
                  {showAllWorksheetKeys ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                  {showAllWorksheetKeys ? "Hide All Keys" : "Show All Efficient Keys"}
                </button>

                <button
                  type="button"
                  onClick={handleGradeEntireWorksheet}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
                >
                  <CheckCheck className="w-4 h-4" />
                  Grade Worksheet
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nextSet = worksheetSetNumber + 1;
                    setWorksheetSetNumber(nextSet);
                    buildNewWorksheet(skill.id, worksheetSize, nextSet);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New Sheet (Set #{worksheetSetNumber + 1})
                </button>
              </div>
            </div>
          </div>

          {/* 2-Column Kumon Worksheet Grid */}
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {worksheetItems.map((item, idx) => {
              const isCorrect = item.result?.isCorrect;
              const isWrong = item.result && !item.result.isCorrect;

              return (
                <div
                  key={item.problem.id}
                  className={`rounded-xl border p-4 transition flex flex-col justify-between gap-3 ${
                    isCorrect
                      ? "bg-emerald-50/40 border-emerald-300"
                      : isWrong
                      ? "bg-rose-50/40 border-rose-300"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                        ({idx + 1})
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleWorksheetItemSteps(idx)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {item.showSteps ? "Hide Key" : "Efficient Key"}
                      </button>
                    </div>

                    <div className="py-2 px-3 rounded-lg bg-slate-50 border border-slate-100 text-lg font-medium text-slate-900 overflow-x-auto">
                      <MathDisplay latex={item.problem.questionLatex} />
                    </div>
                  </div>

                  <div className="space-y-2">
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
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-600 focus:outline-none font-mono text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleCheckSingleWorksheetItem(idx)}
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        Check
                      </button>
                    </div>

                    {item.result && (
                      <div
                        className={`text-xs font-semibold flex items-center justify-between px-2.5 py-1.5 rounded-lg ${
                          item.result.isCorrect
                            ? "bg-emerald-100/80 text-emerald-900"
                            : "bg-rose-100/80 text-rose-900"
                        }`}
                      >
                        <span>
                          {item.result.isCorrect ? "✓ Correct!" : item.result.feedbackMessage}
                        </span>
                        {!item.result.isCorrect && (
                          <span className="font-mono font-bold ml-2">
                            Ans: {item.problem.canonicalAnswer}
                          </span>
                        )}
                      </div>
                    )}

                    {item.showSteps && (
                      <div className="mt-2 p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/80 space-y-2 text-xs">
                        <div className="flex items-center justify-between font-bold text-indigo-950 border-b border-indigo-200/60 pb-1.5">
                          <span>Fastest Method Key</span>
                          <span>
                            Ans: <MathDisplay latex={item.problem.answerLatex} />
                          </span>
                        </div>
                        <p className="text-amber-900 bg-amber-50 px-2.5 py-1.5 rounded border border-amber-200/70">
                          <strong>Tip:</strong> {item.problem.efficiencyTip}
                        </p>
                        {item.problem.steps.map((st, sIdx) => (
                          <div
                            key={sIdx}
                            className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1"
                          >
                            <div className="font-semibold text-indigo-700">{st.title}</div>
                            <div className="overflow-x-auto py-1">
                              <MathDisplay latex={st.latex} />
                            </div>
                            <div className="text-slate-600">{st.explanation}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Worksheet Footer Actions */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              Finished this sheet? Generate another fresh sheet of {worksheetSize} problems or
              advance to the next curriculum skill!
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleGradeEntireWorksheet}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
              >
                <CheckCheck className="w-4 h-4" />
                Grade All Problems
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextSet = worksheetSetNumber + 1;
                  setWorksheetSetNumber(nextSet);
                  buildNewWorksheet(skill.id, worksheetSize, nextSet);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
              >
                <RotateCcw className="w-4 h-4" />
                Generate Next {worksheetSize} Problems
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

