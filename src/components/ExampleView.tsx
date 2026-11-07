"use client";

import React, { useState } from "react";
import {
  SkillDefinition,
  WorkedExample,
  generateProblem,
} from "@/lib/math-engine";
import { MathDisplay } from "./MathDisplay";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ListChecks,
  PlusCircle,
} from "lucide-react";

interface ExampleViewProps {
  skill: SkillDefinition;
  onBackToCurriculum: () => void;
  onGoToQuestions: () => void;
}

export function ExampleView({
  skill,
  onBackToCurriculum,
  onGoToQuestions,
}: ExampleViewProps) {
  const [extraExamples, setExtraExamples] = useState<WorkedExample[]>([]);

  function handleAddGeneratedExample() {
    const nextIdx = skill.workedExamples.length + extraExamples.length + 1;
    const generated = generateProblem(skill.id, nextIdx);
    const newWorked: WorkedExample = {
      title: `Example ${nextIdx}: ${generated.promptText.replace(/:$/, "")}`,
      questionLatex: generated.questionLatex,
      answerLatex: generated.answerLatex,
      steps: generated.steps,
    };
    setExtraExamples((prev) => [...prev, newWorked]);
  }

  const allExamples = [...skill.workedExamples, ...extraExamples];

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
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
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-mono font-bold">
              {skill.code}
            </span>
            <h1 className="text-sm sm:text-base font-bold text-slate-900">
              {skill.title} — Examples & Definitions
            </h1>
          </div>
        </div>

        <button
          onClick={onGoToQuestions}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          Go to Questions
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Section 1: Mathematical Definitions */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm sm:text-base font-bold">
            Mathematical Definitions
          </h2>
        </div>

        <div className="divide-y divide-slate-200">
          {skill.definitions.map((def, idx) => (
            <div key={idx} className="p-5 space-y-2">
              <div className="text-sm sm:text-base font-bold text-indigo-700">
                {def.term}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {def.meaning}
              </p>
              {def.exampleLatex && (
                <div className="inline-block bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-800 mt-1">
                  <MathDisplay latex={def.exampleLatex} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Step-by-Step Worked Examples */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Step-by-Step Worked Examples
            </h2>
          </div>

          <button
            type="button"
            onClick={handleAddGeneratedExample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Show Another Example
          </button>
        </div>

        {/* Key Method Summary */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs sm:text-sm text-indigo-950">
          <span className="font-bold">Key Method: </span>
          {skill.efficiencySummary}
        </div>

        <div className="space-y-5">
          {allExamples.map((ex, exIdx) => (
            <div
              key={exIdx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
            >
              {/* Example Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-900">
                  {ex.title}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Final Answer: <MathDisplay latex={ex.answerLatex} />
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Question Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Question
                  </span>
                  <div className="text-lg sm:text-xl font-bold text-slate-900 overflow-x-auto">
                    <MathDisplay latex={ex.questionLatex} />
                  </div>
                </div>

                {/* Step-by-Step Breakdown */}
                <div className="space-y-3">
                  {ex.steps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="rounded-xl border border-slate-200 p-4 space-y-2 bg-white"
                    >
                      <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                        {step.title}
                      </div>
                      <div className="py-2 px-3 rounded-lg bg-slate-50 border border-slate-100 text-base font-medium text-slate-900 overflow-x-auto">
                        <MathDisplay latex={step.latex} />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {step.explanation}
                      </p>
                    </div>
                  ))}
                </div>

                {/* End-of-Example Action Footer */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">
                    Want to see another worked problem like this?
                  </span>
                  <button
                    type="button"
                    onClick={handleAddGeneratedExample}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Show Another Example
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleAddGeneratedExample}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            Generate Another Worked Example
          </button>

          <button
            type="button"
            onClick={onGoToQuestions}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
          >
            Start Questions for {skill.code}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
