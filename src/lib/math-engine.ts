export interface SolutionStep {
  title: string;
  latex: string;
  explanation: string;
}

export interface GeneratedProblem {
  id: string;
  skillId: string;
  problemNumber: number;
  promptText: string;
  questionLatex: string;
  answerLatex: string;
  canonicalAnswer: string;
  acceptedAnswers: string[];
  requireSimplifiedFraction?: boolean;
  unitSuffix?: string;
  efficiencyTip: string;
  hint: string;
  steps: SolutionStep[];
}

export interface SkillDefinition {
  id: string;
  code: string; // e.g. "1.1"
  title: string;
  subtitle: string;
  unitId: string;
  grade: number;
  targetTimeSeconds: number;
  masteryStreak: number;
  efficiencySummary: string;
  exampleLatex: string;
}

export interface CurriculumUnit {
  id: string;
  code: string;
  title: string;
  description: string;
  grade: number;
  skills: SkillDefinition[];
}

export interface GradeInfo {
  grade: number;
  label: string;
  description: string;
}

// Math utility helpers
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function formatFractionLatex(num: number, den: number): string {
  if (den === 1) return `${num}`;
  if (num < 0) return `-\\frac{${Math.abs(num)}}{${den}}`;
  return `\\frac{${num}}{${den}}`;
}

export function formatMixedAnswerStrings(num: number, den: number): string[] {
  const g = gcd(num, den);
  const sNum = num / g;
  const sDen = den / g;
  if (sDen === 1) return [`${sNum}`];
  const answers = [`${sNum}/${sDen}`];
  if (Math.abs(sNum) > sDen) {
    const sign = sNum < 0 ? "-" : "";
    const absNum = Math.abs(sNum);
    const whole = Math.floor(absNum / sDen);
    const rem = absNum % sDen;
    if (rem > 0) {
      answers.push(`${sign}${whole} ${rem}/${sDen}`);
    }
  }
  return answers;
}

export const GRADES: GradeInfo[] = [
  {
    grade: 6,
    label: "6th Grade",
    description: "6 Units • 18 Core Topics",
  },
];

export const CURRICULUM_UNITS: CurriculumUnit[] = [
  {
    id: "g6-u1",
    code: "Unit 1",
    title: "Factors, Multiples & Exponents",
    description: "GCF, LCM, and Order of Operations",
    grade: 6,
    skills: [
      {
        id: "g6-gcf",
        code: "1.1",
        title: "Greatest Common Factor (GCF)",
        subtitle: "Find the largest factor shared by two numbers",
        unitId: "g6-u1",
        grade: 6,
        targetTimeSeconds: 120,
        masteryStreak: 10,
        efficiencySummary: "The GCF always divides the difference (b − a) between the two numbers.",
        exampleLatex: "\\text{GCF}(36, 48) = 12",
      },
      {
        id: "g6-lcm",
        code: "1.2",
        title: "Least Common Multiple (LCM)",
        subtitle: "Find the smallest common multiple of two numbers",
        unitId: "g6-u1",
        grade: 6,
        targetTimeSeconds: 150,
        masteryStreak: 10,
        efficiencySummary: "Divide one number by the GCF first, then multiply by the other: (a ÷ GCF) × b.",
        exampleLatex: "\\text{LCM}(12, 18) = 36",
      },
      {
        id: "g6-exponents",
        code: "1.3",
        title: "Order of Operations with Exponents",
        subtitle: "Evaluate expressions with powers and parentheses",
        unitId: "g6-u1",
        grade: 6,
        targetTimeSeconds: 180,
        masteryStreak: 10,
        efficiencySummary: "Evaluate parentheses and exponents first before multiplying and adding.",
        exampleLatex: "3^2 + 4 \\times (10 - 3) = 37",
      },
    ],
  },
  {
    id: "g6-u2",
    code: "Unit 2",
    title: "Fractions",
    description: "Adding, subtracting, multiplying, and dividing fractions",
    grade: 6,
    skills: [
      {
        id: "g6-frac-add-sub",
        code: "2.1",
        title: "Adding & Subtracting Unlike Fractions",
        subtitle: "Combine fractions using the Least Common Denominator (LCD)",
        unitId: "g6-u2",
        grade: 6,
        targetTimeSeconds: 180,
        masteryStreak: 10,
        efficiencySummary: "Use the Least Common Multiple (LCD) of the denominators so numbers stay small.",
        exampleLatex: "\\frac{5}{6} - \\frac{3}{8} = \\frac{11}{24}",
      },
      {
        id: "g6-frac-mult",
        code: "2.2",
        title: "Multiplying Fractions (Cross-Cancellation)",
        subtitle: "Simplify diagonal factors before multiplying",
        unitId: "g6-u2",
        grade: 6,
        targetTimeSeconds: 150,
        masteryStreak: 10,
        efficiencySummary: "Cross-cancel common factors diagonally before multiplying straight across.",
        exampleLatex: "\\frac{8}{15} \\times \\frac{9}{16} = \\frac{3}{10}",
      },
      {
        id: "g6-frac-div",
        code: "2.3",
        title: "Dividing Fractions",
        subtitle: "Multiply by the reciprocal and simplify",
        unitId: "g6-u2",
        grade: 6,
        targetTimeSeconds: 160,
        masteryStreak: 10,
        efficiencySummary: "Flip the second fraction to its reciprocal and cross-cancel before multiplying.",
        exampleLatex: "\\frac{9}{14} \\div \\frac{6}{7} = \\frac{3}{4}",
      },
    ],
  },
  {
    id: "g6-u3",
    code: "Unit 3",
    title: "Decimals & Conversions",
    description: "Decimal multiplication, division, and fraction-to-decimal conversion",
    grade: 6,
    skills: [
      {
        id: "g6-dec-mult",
        code: "3.1",
        title: "Multiplying Decimals",
        subtitle: "Multiply whole numbers and place the decimal point",
        unitId: "g6-u3",
        grade: 6,
        targetTimeSeconds: 140,
        masteryStreak: 10,
        efficiencySummary: "Multiply as whole numbers first, then shift the decimal left by total decimal places.",
        exampleLatex: "0.06 \\times 0.8 = 0.048",
      },
      {
        id: "g6-dec-div",
        code: "3.2",
        title: "Dividing by Decimals",
        subtitle: "Shift the decimal point to divide by a whole number",
        unitId: "g6-u3",
        grade: 6,
        targetTimeSeconds: 150,
        masteryStreak: 10,
        efficiencySummary: "Multiply both numbers by 10 or 100 to clear the divisor's decimal first.",
        exampleLatex: "4.8 \\div 0.12 = 40",
      },
      {
        id: "g6-frac-dec-conv",
        code: "3.3",
        title: "Converting Fractions to Decimals",
        subtitle: "Scale denominators to 10, 100, or 1000",
        unitId: "g6-u3",
        grade: 6,
        targetTimeSeconds: 120,
        masteryStreak: 10,
        efficiencySummary: "Scale the denominator to 10, 100, or 1000 instead of using long division.",
        exampleLatex: "\\frac{17}{25} = \\frac{68}{100} = 0.68",
      },
    ],
  },
  {
    id: "g6-u4",
    code: "Unit 4",
    title: "Ratios, Rates & Percentages",
    description: "Proportions, mental percentages, and finding the whole",
    grade: 6,
    skills: [
      {
        id: "g6-unit-rate",
        code: "4.1",
        title: "Equivalent Ratios & Proportions",
        subtitle: "Solve for the missing value in a proportion",
        unitId: "g6-u4",
        grade: 6,
        targetTimeSeconds: 130,
        masteryStreak: 10,
        efficiencySummary: "Reduce the known ratio first, then scale across to find x.",
        exampleLatex: "\\frac{12}{15} = \\frac{x}{35} \\implies x = 28",
      },
      {
        id: "g6-percent-of",
        code: "4.2",
        title: "Percent of a Number",
        subtitle: "Use 10% / 5% blocks and benchmark fractions",
        unitId: "g6-u4",
        grade: 6,
        targetTimeSeconds: 130,
        masteryStreak: 10,
        efficiencySummary: "Break percentages into 10% + 5% or use benchmark fractions (25% = 1/4).",
        exampleLatex: "15\\% \\text{ of } 80 = 12",
      },
      {
        id: "g6-percent-find-whole",
        code: "4.3",
        title: "Finding the Whole from a Percent",
        subtitle: "Find 10% first to solve for 100%",
        unitId: "g6-u4",
        grade: 6,
        targetTimeSeconds: 160,
        masteryStreak: 10,
        efficiencySummary: "Divide to find 10% first, then multiply by 10 to find the whole (100%).",
        exampleLatex: "30\\% \\text{ of } N = 27 \\implies N = 90",
      },
    ],
  },
  {
    id: "g6-u5",
    code: "Unit 5",
    title: "Integers & Algebraic Expressions",
    description: "Negative numbers, substitution, and combining like terms",
    grade: 6,
    skills: [
      {
        id: "g6-int-ops",
        code: "5.1",
        title: "Adding & Subtracting Integers",
        subtitle: "Operations with positive and negative integers",
        unitId: "g6-u5",
        grade: 6,
        targetTimeSeconds: 120,
        masteryStreak: 10,
        efficiencySummary: "Rewrite double negatives as addition (−(−a) = +a), then group same signs.",
        exampleLatex: "-14 - (-9) + (-6) = -11",
      },
      {
        id: "g6-eval-expr",
        code: "5.2",
        title: "Evaluating Algebraic Expressions",
        subtitle: "Substitute values for variables and simplify",
        unitId: "g6-u5",
        grade: 6,
        targetTimeSeconds: 150,
        masteryStreak: 10,
        efficiencySummary: "Substitute negative numbers inside parentheses and compute exponents first.",
        exampleLatex: "2x^2 - 5y \\;(x=3, y=2) = 8",
      },
      {
        id: "g6-combine-like",
        code: "5.3",
        title: "Distributive Property & Like Terms",
        subtitle: "Expand parentheses and combine x-terms and constants",
        unitId: "g6-u5",
        grade: 6,
        targetTimeSeconds: 160,
        masteryStreak: 10,
        efficiencySummary: "Multiply across the parentheses first, then group x-terms and constants.",
        exampleLatex: "3(2x + 4) - 2x - 5 = 4x + 7",
      },
    ],
  },
  {
    id: "g6-u6",
    code: "Unit 6",
    title: "Equations & Geometry",
    description: "One-step equations, two-step equations, and area formulas",
    grade: 6,
    skills: [
      {
        id: "g6-one-step-eq",
        code: "6.1",
        title: "One-Step Equations",
        subtitle: "Solve fractional and linear one-step equations",
        unitId: "g6-u6",
        grade: 6,
        targetTimeSeconds: 110,
        masteryStreak: 10,
        efficiencySummary: "Multiply by the reciprocal and cancel common factors before multiplying.",
        exampleLatex: "\\frac{3}{4}x = 18 \\implies x = 24",
      },
      {
        id: "g6-two-step-eq",
        code: "6.2",
        title: "Two-Step Equations (ax + b = c)",
        subtitle: "Isolate x by moving the constant first",
        unitId: "g6-u6",
        grade: 6,
        targetTimeSeconds: 150,
        masteryStreak: 10,
        efficiencySummary: "Move the constant across '=' first, then divide by the coefficient of x.",
        exampleLatex: "5x - 13 = 27 \\implies x = 8",
      },
      {
        id: "g6-area-volume",
        code: "6.3",
        title: "Area of Triangles & Trapezoids",
        subtitle: "Apply area formulas efficiently",
        unitId: "g6-u6",
        grade: 6,
        targetTimeSeconds: 150,
        masteryStreak: 10,
        efficiencySummary: "Halve the even number first in A = ½bh so the multiplication stays simple.",
        exampleLatex: "A = \\frac{1}{2} \\times 14 \\times 9 = 63",
      },
    ],
  },
];

export function getSkillById(skillId: string): SkillDefinition | undefined {
  for (const unit of CURRICULUM_UNITS) {
    const found = unit.skills.find((s) => s.id === skillId);
    if (found) return found;
  }
  return undefined;
}

export function getUnitsByGrade(grade: number): CurriculumUnit[] {
  return CURRICULUM_UNITS.filter((u) => u.grade === grade);
}

// ============================================================================
// INFINITE PROBLEM GENERATOR ENGINE (WITH STEP-BY-STEP EFFICIENT SOLUTIONS)
// ============================================================================

export function generateProblem(skillId: string, problemNumber: number = 1): GeneratedProblem {
  const id = `${skillId}-${problemNumber}-${Math.random().toString(36).substring(2, 8)}`;

  switch (skillId) {
    // ------------------------------------------------------------------------
    // GRADE 5 SKILLS
    // ------------------------------------------------------------------------
    case "g5-frac-same-den": {
      const den = pickOne([6, 8, 9, 10, 12, 14, 15, 16, 18, 20]);
      // Choose n1 + n2 so that gcd(n1 + n2, den) > 1
      let n1 = randInt(1, den - 2);
      let n2 = randInt(1, den - 1 - n1);
      for (let tries = 0; tries < 25; tries++) {
        const c1 = randInt(1, den - 2);
        const c2 = randInt(1, den - 1 - c1);
        if (gcd(c1 + c2, den) > 1) {
          n1 = c1;
          n2 = c2;
          break;
        }
      }
      const sumNum = n1 + n2;
      const g = gcd(sumNum, den);
      const sNum = sumNum / g;
      const sDen = den / g;
      const accepted = formatMixedAnswerStrings(sNum, sDen);

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Add and simplify to lowest terms:",
        questionLatex: `\\frac{${n1}}{${den}} + \\frac{${n2}}{${den}}`,
        answerLatex: formatFractionLatex(sNum, sDen),
        canonicalAnswer: accepted[0],
        acceptedAnswers: accepted,
        requireSimplifiedFraction: true,
        efficiencyTip: `Add numerators directly over ${den}, then divide both top and bottom by their GCF (${g}) in one step.`,
        hint: `First add ${n1} + ${n2} = ${sumNum} over ${den}. What is the largest number that divides both ${sumNum} and ${den}?`,
        steps: [
          {
            title: "Step 1: Add the numerators over the common denominator",
            latex: `\\frac{${n1} + ${n2}}{${den}} = \\frac{${sumNum}}{${den}}`,
            explanation: `Because both fractions already have denominator ${den}, simply add the numerators.`,
          },
          {
            title: `Step 2: Divide numerator and denominator by GCF = ${g}`,
            latex: `\\frac{${sumNum} \\div ${g}}{${den} \\div ${g}} = ${formatFractionLatex(sNum, sDen)}`,
            explanation: `Dividing by the Greatest Common Factor (${g}) reduces the fraction in a single step.`,
          },
        ],
      };
    }

    case "g5-mental-mult": {
      const tens = randInt(2, 9) * 10;
      const ones = randInt(3, 9);
      const num = tens + ones;
      const mult = randInt(4, 9);
      const part1 = tens * mult;
      const part2 = ones * mult;
      const ans = part1 + part2;

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Multiply mentally using left-to-right splitting:",
        questionLatex: `${num} \\times ${mult}`,
        answerLatex: `${ans}`,
        canonicalAnswer: `${ans}`,
        acceptedAnswers: [`${ans}`],
        efficiencyTip: `Split ${num} into ${tens} + ${ones}. Multiply from left to right (${tens} × ${mult} = ${part1}) so you can hold the running total in your head!`,
        hint: `Compute ${tens} × ${mult} first, then add ${ones} × ${mult}.`,
        steps: [
          {
            title: "Step 1: Split the 2-digit number into tens and ones",
            latex: `${num} \\times ${mult} = (${tens} + ${ones}) \\times ${mult}`,
            explanation: `Think of ${num} as ${tens} + ${ones}.`,
          },
          {
            title: "Step 2: Multiply left-to-right and add mentally",
            latex: `${part1} + ${part2} = ${ans}`,
            explanation: `${tens} × ${mult} = ${part1}, and ${ones} × ${mult} = ${part2}. Adding ${part1} + ${part2} gives ${ans}.`,
          },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // UNIT F1: NUMBER THEORY, FACTORS & EXPONENTS
    // ------------------------------------------------------------------------
    case "g6-gcf": {
      const baseGcf = pickOne([4, 6, 7, 8, 9, 11, 12, 14, 15, 16, 18]);
      const pairs: [number, number][] = [
        [2, 3],
        [3, 4],
        [3, 5],
        [4, 5],
        [2, 5],
        [3, 7],
        [4, 7],
        [5, 6],
      ];
      const [m1, m2] = pickOne(pairs);
      const a = baseGcf * m1;
      const b = baseGcf * m2;
      const diff = Math.abs(b - a);

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Find the Greatest Common Factor (GCF):",
        questionLatex: `\\text{GCF}(${a},\\, ${b})`,
        answerLatex: `${baseGcf}`,
        canonicalAnswer: `${baseGcf}`,
        acceptedAnswers: [`${baseGcf}`],
        efficiencyTip:
          "Shortcut: The GCF of two numbers NEVER exceeds their difference (b − a), and must be a factor of that difference!",
        hint: `Subtract the numbers: ${b} - ${a} = ${diff}. Check if ${diff} (or a factor of ${diff}) divides both ${a} and ${b}.`,
        steps: [
          {
            title: "Step 1: Use the Difference Shortcut to narrow down candidates",
            latex: `${b} - ${a} = ${diff}`,
            explanation: `Any common factor of ${a} and ${b} must also divide their difference (${diff}).`,
          },
          {
            title: "Step 2: Check the largest factor of the difference that divides both",
            latex: `${a} = ${baseGcf} \\times ${m1}, \\quad ${b} = ${baseGcf} \\times ${m2} \\implies \\text{GCF} = ${baseGcf}`,
            explanation: `Since ${m1} and ${m2} share no common factors (GCF(${m1}, ${m2}) = 1), the Greatest Common Factor is ${baseGcf}.`,
          },
        ],
      };
    }

    case "g6-lcm": {
      const baseGcf = pickOne([3, 4, 5, 6, 8, 9, 10, 12]);
      const pairs: [number, number][] = [
        [2, 3],
        [3, 4],
        [2, 5],
        [3, 5],
        [4, 5],
        [2, 7],
      ];
      const [m1, m2] = pickOne(pairs);
      const a = baseGcf * m1;
      const b = baseGcf * m2;
      const ans = baseGcf * m1 * m2;

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Find the Least Common Multiple (LCM):",
        questionLatex: `\\text{LCM}(${a},\\, ${b})`,
        answerLatex: `${ans}`,
        canonicalAnswer: `${ans}`,
        acceptedAnswers: [`${ans}`],
        efficiencyTip: `Don't write long lists of multiples! Divide one number by GCF(${a}, ${b}) = ${baseGcf} first, then multiply by the other number.`,
        hint: `First find GCF(${a}, ${b}) = ${baseGcf}. Then compute (${a} ÷ ${baseGcf}) × ${b}.`,
        steps: [
          {
            title: "Step 1: Find the GCF of the two numbers",
            latex: `\\text{GCF}(${a},\\, ${b}) = ${baseGcf}`,
            explanation: `${a} = ${baseGcf} × ${m1} and ${b} = ${baseGcf} × ${m2}.`,
          },
          {
            title: "Step 2: Divide one number by the GCF, then multiply by the other",
            latex: `\\text{LCM} = (${a} \\div ${baseGcf}) \\times ${b} = ${m1} \\times ${b} = ${ans}`,
            explanation: `Dividing ${a} by ${baseGcf} gives ${m1}. Then ${m1} × ${b} = ${ans} easily in your head!`,
          },
        ],
      };
    }

    case "g6-exponents": {
      const variant = randInt(1, 3);
      if (variant === 1) {
        const base = randInt(2, 5);
        const exp = base <= 3 ? randInt(2, 3) : 2;
        const mult = randInt(2, 6);
        const p1 = randInt(6, 14);
        const p2 = randInt(2, p1 - 2);
        const powVal = Math.pow(base, exp);
        const parenDiff = p1 - p2;
        const prod = mult * parenDiff;
        const ans = powVal + prod;

        return {
          id,
          skillId,
          problemNumber,
          promptText: "Evaluate using the Order of Operations (PEMDAS):",
          questionLatex: `${base}^{${exp}} + ${mult} \\times (${p1} - ${p2})`,
          answerLatex: `${ans}`,
          canonicalAnswer: `${ans}`,
          acceptedAnswers: [`${ans}`],
          efficiencyTip:
            "Evaluate the parentheses and independent exponent simultaneously in your first line, then multiply before adding.",
          hint: `First find (${p1} - ${p2}) = ${parenDiff} and ${base}^${exp} = ${powVal}.`,
          steps: [
            {
              title: "Step 1: Evaluate parentheses and the exponent at the same time",
              latex: `${base}^{${exp}} + ${mult} \\times (${p1} - ${p2}) = ${powVal} + ${mult} \\times ${parenDiff}`,
              explanation: `${base}^${exp} = ${powVal} and (${p1} - ${p2}) = ${parenDiff}. Because they are separated by '+', we can compute both in one step.`,
            },
            {
              title: "Step 2: Multiply before adding",
              latex: `${powVal} + ${prod} = ${ans}`,
              explanation: `Multiply ${mult} × ${parenDiff} = ${prod} first, then add ${powVal} + ${prod} = ${ans}.`,
            },
          ],
        };
      } else if (variant === 2) {
        const a = randInt(3, 6);
        const b = randInt(2, a - 1);
        const diff = a - b;
        const sq = diff * diff;
        const mult = randInt(2, 5);
        const addend = randInt(4, 15);
        const ans = mult * sq + addend;

        return {
          id,
          skillId,
          problemNumber,
          promptText: "Evaluate using the Order of Operations (PEMDAS):",
          questionLatex: `${mult} \\times (${a} - ${b})^2 + ${addend}`,
          answerLatex: `${ans}`,
          canonicalAnswer: `${ans}`,
          acceptedAnswers: [`${ans}`],
          efficiencyTip:
            "Never distribute into parentheses that have an exponent! Simplify inside the parentheses first, square it, then multiply.",
          hint: `Compute (${a} - ${b}) = ${diff}, then square it to get ${sq} before multiplying by ${mult}.`,
          steps: [
            {
              title: "Step 1: Simplify inside the parentheses and apply the exponent",
              latex: `${mult} \\times (${diff})^2 + ${addend} = ${mult} \\times ${sq} + ${addend}`,
              explanation: `Inside the parentheses, ${a} - ${b} = ${diff}. Squaring ${diff} gives ${sq}.`,
            },
            {
              title: "Step 2: Multiply, then add",
              latex: `${mult * sq} + ${addend} = ${ans}`,
              explanation: `${mult} × ${sq} = ${mult * sq}, and ${mult * sq} + ${addend} = ${ans}.`,
            },
          ],
        };
      } else {
        const b1 = randInt(4, 8);
        const b2 = randInt(2, b1 - 1);
        const sq1 = b1 * b1;
        const sq2 = b2 * b2;
        const ans = sq1 - sq2;
        const sum = b1 + b2;
        const diff = b1 - b2;

        return {
          id,
          skillId,
          problemNumber,
          promptText: "Evaluate the expression:",
          questionLatex: `${b1}^2 - ${b2}^2`,
          answerLatex: `${ans}`,
          canonicalAnswer: `${ans}`,
          acceptedAnswers: [`${ans}`],
          efficiencyTip: `Compute ${b1}² = ${sq1} and ${b2}² = ${sq2} directly (or use the Difference of Squares shortcut: (${b1} + ${b2})(${b1} − ${b2}) = ${sum} × ${diff} = ${ans}).`,
          hint: `${b1}² is ${sq1} and ${b2}² is ${sq2}. Subtract them!`,
          steps: [
            {
              title: "Step 1: Evaluate each square",
              latex: `${b1}^2 - ${b2}^2 = ${sq1} - ${sq2}`,
              explanation: `${b1} × ${b1} = ${sq1}, and ${b2} × ${b2} = ${sq2}.`,
            },
            {
              title: "Step 2: Subtract (or verify with Difference of Squares)",
              latex: `${sq1} - ${sq2} = ${ans} \\quad \\text{[Shortcut: } (${b1}+${b2})(${b1}-${b2}) = ${sum} \\times ${diff} = ${ans}\\text{]}`,
              explanation: `Subtracting gives ${ans}.`,
            },
          ],
        };
      }
    }

    // ------------------------------------------------------------------------
    // UNIT F2: KUMON LEVEL F FRACTIONS
    // ------------------------------------------------------------------------
    case "g6-frac-add-sub": {
      const denPairs: [number, number][] = [
        [4, 6],
        [6, 8],
        [6, 9],
        [8, 12],
        [6, 10],
        [9, 12],
        [4, 10],
        [8, 10],
      ];
      const [d1, d2] = pickOne(denPairs);
      const lcd = lcm(d1, d2);
      const isAdd = Math.random() < 0.55;

      let n1 = randInt(1, d1 - 1);
      while (gcd(n1, d1) > 1) n1 = randInt(1, d1 - 1);
      let n2 = randInt(1, d2 - 1);
      while (gcd(n2, d2) > 1) n2 = randInt(1, d2 - 1);

      const m1 = lcd / d1;
      const m2 = lcd / d2;
      let scaled1 = n1 * m1;
      let scaled2 = n2 * m2;

      if (!isAdd && scaled1 <= scaled2) {
        // swap fractions so result is positive
        const tmpN = n1,
          tmpD = d1,
          tmpM = m1,
          tmpS = scaled1;
        n1 = n2;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        scaled1 = scaled2;
        scaled2 = tmpS;
        return generateFractionAddSubHelper(id, skillId, problemNumber, n2, d2, tmpN, tmpD, false);
      }
      return generateFractionAddSubHelper(id, skillId, problemNumber, n1, d1, n2, d2, isAdd);
    }

    case "g6-frac-mult": {
      // Construct a cross-cancellable fraction multiplication problem:
      // (a * k1) / (b * k2)  *  (c * k2) / (d * k1)
      // where gcd(a, b) = 1, gcd(c, d) = 1, gcd(a, d) = 1, gcd(c, b) = 1
      const k1 = randInt(2, 6);
      const k2 = randInt(2, 6);
      const coprimePairs: [number, number][] = [
        [1, 2],
        [1, 3],
        [2, 3],
        [1, 4],
        [3, 4],
        [2, 5],
        [3, 5],
      ];
      const [a, b] = pickOne(coprimePairs);
      let [c, d] = pickOne(coprimePairs);
      // Avoid trivial 1/1 * 1/1
      if (a === d && b === c) {
        c = 1;
        d = 3;
      }

      const num1 = a * k1;
      const den1 = b * k2;
      const num2 = c * k2;
      const den2 = d * k1;

      const rawNum = a * c;
      const rawDen = b * d;
      const finalG = gcd(rawNum, rawDen);
      const sNum = rawNum / finalG;
      const sDen = rawDen / finalG;
      const accepted = formatMixedAnswerStrings(sNum, sDen);

      const gDiag1 = gcd(num1, den2);
      const gDiag2 = gcd(num2, den1);

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Multiply using cross-cancellation and write in simplest form:",
        questionLatex: `\\frac{${num1}}{${den1}} \\times \\frac{${num2}}{${den2}}`,
        answerLatex: formatFractionLatex(sNum, sDen),
        canonicalAnswer: accepted[0],
        acceptedAnswers: accepted,
        requireSimplifiedFraction: true,
        efficiencyTip: `Cross-cancel BEFORE multiplying! Cancel ${num1} and ${den2} by ${gDiag1}, and cancel ${num2} and ${den1} by ${gDiag2}.`,
        hint: `Look diagonally: ${num1} and ${den2} are both divisible by ${gDiag1}; ${num2} and ${den1} are both divisible by ${gDiag2}.`,
        steps: [
          {
            title: "Step 1: Cross-cancel common factors diagonally",
            latex: `\\frac{${num1} \\div ${gDiag1}}{${den1} \\div ${gDiag2}} \\times \\frac{${num2} \\div ${gDiag2}}{${den2} \\div ${gDiag1}} = \\frac{${num1 / gDiag1}}{${den1 / gDiag2}} \\times \\frac{${num2 / gDiag2}}{${den2 / gDiag1}}`,
            explanation: `Divide ${num1} and ${den2} by ${gDiag1}, and divide ${num2} and ${den1} by ${gDiag2}. This avoids multiplying ${num1} × ${num2} = ${num1 * num2}!`,
          },
          {
            title: "Step 2: Multiply the small remaining numbers",
            latex: `\\frac{${num1 / gDiag1} \\times ${num2 / gDiag2}}{${den1 / gDiag2} \\times ${den2 / gDiag1}} = ${formatFractionLatex(sNum, sDen)}`,
            explanation: `Multiply straight across to get the simplified answer immediately.`,
          },
        ],
      };
    }

    case "g6-frac-div": {
      // (a * k1) / (b * k2) ÷ (d * k1) / (c * k2)
      // When flipped: (a * k1) / (b * k2) × (c * k2) / (d * k1)
      const k1 = randInt(2, 5);
      const k2 = randInt(2, 5);
      const coprimePairs: [number, number][] = [
        [1, 2],
        [2, 3],
        [3, 4],
        [1, 3],
        [2, 5],
        [3, 5],
      ];
      const [a, b] = pickOne(coprimePairs);
      const [c, d] = pickOne(coprimePairs);

      const num1 = a * k1;
      const den1 = b * k2;
      const divNum = d * k1;
      const divDen = c * k2;

      // Reciprocal is divDen / divNum
      const gDiag1 = gcd(num1, divNum);
      const gDiag2 = gcd(divDen, den1);

      const rawNum = (num1 / gDiag1) * (divDen / gDiag2);
      const rawDen = (den1 / gDiag2) * (divNum / gDiag1);
      const finalG = gcd(rawNum, rawDen);
      const sNum = rawNum / finalG;
      const sDen = rawDen / finalG;
      const accepted = formatMixedAnswerStrings(sNum, sDen);

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Divide and write your answer in simplest form (e.g., a/b):",
        questionLatex: `\\frac{${num1}}{${den1}} \\div \\frac{${divNum}}{${divDen}}`,
        answerLatex: formatFractionLatex(sNum, sDen),
        canonicalAnswer: accepted[0],
        acceptedAnswers: accepted,
        requireSimplifiedFraction: true,
        efficiencyTip: `Flip the second fraction to its reciprocal (${divDen}/${divNum}), then cross-cancel by ${gDiag1} and ${gDiag2} before multiplying!`,
        hint: `Rewrite as (${num1}/${den1}) × (${divDen}/${divNum}), then cancel diagonal factors.`,
        steps: [
          {
            title: "Step 1: Multiply by the reciprocal of the divisor",
            latex: `\\frac{${num1}}{${den1}} \\div \\frac{${divNum}}{${divDen}} = \\frac{${num1}}{${den1}} \\times \\frac{${divDen}}{${divNum}}`,
            explanation: `Keep the first fraction and invert the second fraction.`,
          },
          {
            title: "Step 2: Cross-cancel diagonal common factors",
            latex: `\\frac{${num1} \\div ${gDiag1}}{${den1} \\div ${gDiag2}} \\times \\frac{${divDen} \\div ${gDiag2}}{${divNum} \\div ${gDiag1}} = \\frac{${num1 / gDiag1}}{${den1 / gDiag2}} \\times \\frac{${divDen / gDiag2}}{${divNum / gDiag1}}`,
            explanation: `Cancel ${num1} and ${divNum} by ${gDiag1}, and cancel ${divDen} and ${den1} by ${gDiag2}.`,
          },
          {
            title: "Step 3: Multiply straight across",
            latex: `${formatFractionLatex(sNum, sDen)}`,
            explanation: `Multiply the reduced numerators and denominators.`,
          },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // UNIT F3: DECIMALS & CONVERSIONS
    // ------------------------------------------------------------------------
    case "g6-dec-mult": {
      const w1 = randInt(2, 12);
      const w2 = randInt(3, 9);
      const places1 = pickOne([1, 2]);
      const places2 = pickOne([1, 2]);
      const totalPlaces = places1 + places2;

      const d1 = (w1 / Math.pow(10, places1)).toFixed(places1);
      const d2 = (w2 / Math.pow(10, places2)).toFixed(places2);
      const wholeProd = w1 * w2;
      const rawAns = Number((wholeProd / Math.pow(10, totalPlaces)).toFixed(totalPlaces));
      const ansStr = `${rawAns}`;

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Multiply the decimals:",
        questionLatex: `${d1} \\times ${d2}`,
        answerLatex: `${ansStr}`,
        canonicalAnswer: ansStr,
        acceptedAnswers: [ansStr, ansStr.replace(/^0\./, ".")],
        efficiencyTip: `Multiply the whole numbers ${w1} × ${w2} = ${wholeProd} first, then move the decimal point ${totalPlaces} places to the left (${places1} + ${places2} = ${totalPlaces} places).`,
        hint: `${w1} × ${w2} = ${wholeProd}. Count the total digits after the decimal point in both factors (${totalPlaces}).`,
        steps: [
          {
            title: "Step 1: Ignore the decimals and multiply as whole numbers",
            latex: `${w1} \\times ${w2} = ${wholeProd}`,
            explanation: `Treat ${d1} as ${w1} and ${d2} as ${w2}.`,
          },
          {
            title: `Step 2: Count total decimal places (${places1} + ${places2} = ${totalPlaces})`,
            latex: `${d1} \\times ${d2} = ${ansStr}`,
            explanation: `Shift the decimal point in ${wholeProd} left by ${totalPlaces} places to get ${ansStr}.`,
          },
        ],
      };
    }

    case "g6-dec-div": {
      const divisorWhole = pickOne([3, 4, 5, 6, 7, 8, 9, 12, 15]);
      const quotient = pickOne([4, 6, 7, 8, 9, 11, 12, 15, 20, 25, 30]);
      const divisorPlaces = pickOne([1, 2]);
      const shiftFactor = Math.pow(10, divisorPlaces);

      const divisorDec = (divisorWhole / shiftFactor).toFixed(divisorPlaces);
      const shiftedDividend = divisorWhole * quotient;
      const dividendDec = Number((shiftedDividend / shiftFactor).toFixed(divisorPlaces));

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Divide by shifting the decimal point first:",
        questionLatex: `${dividendDec} \\div ${divisorDec}`,
        answerLatex: `${quotient}`,
        canonicalAnswer: `${quotient}`,
        acceptedAnswers: [`${quotient}`],
        efficiencyTip: `Multiply both numbers by ${shiftFactor} (shift the decimal ${divisorPlaces} place${divisorPlaces > 1 ? "s" : ""} right) so you divide by the whole number ${divisorWhole}!`,
        hint: `Shift the decimal point ${divisorPlaces} place(s) to the right in both numbers: ${shiftedDividend} ÷ ${divisorWhole}.`,
        steps: [
          {
            title: `Step 1: Shift the decimal point ${divisorPlaces} place${divisorPlaces > 1 ? "s" : ""} right (multiply both by ${shiftFactor})`,
            latex: `${dividendDec} \\div ${divisorDec} = ${shiftedDividend} \\div ${divisorWhole}`,
            explanation: `Clearing the decimal from ${divisorDec} turns the problem into whole-number division.`,
          },
          {
            title: "Step 2: Divide the whole numbers",
            latex: `${shiftedDividend} \\div ${divisorWhole} = ${quotient}`,
            explanation: `${divisorWhole} goes into ${shiftedDividend} exactly ${quotient} times.`,
          },
        ],
      };
    }

    case "g6-frac-dec-conv": {
      const configs: { den: number; mult: number; targetDen: number }[] = [
        { den: 4, mult: 25, targetDen: 100 },
        { den: 5, mult: 2, targetDen: 10 },
        { den: 20, mult: 5, targetDen: 100 },
        { den: 25, mult: 4, targetDen: 100 },
        { den: 50, mult: 2, targetDen: 100 },
        { den: 8, mult: 125, targetDen: 1000 },
      ];
      const cfg = pickOne(configs);
      let num = randInt(1, cfg.den - 1);
      while (gcd(num, cfg.den) > 1) {
        num = randInt(1, cfg.den - 1);
      }
      const scaledNum = num * cfg.mult;
      const ansNum = scaledNum / cfg.targetDen;
      const ansStr = `${ansNum}`;

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Convert the fraction to a decimal without long division:",
        questionLatex: `\\frac{${num}}{${cfg.den}}`,
        answerLatex: `${ansStr}`,
        canonicalAnswer: ansStr,
        acceptedAnswers: [ansStr, ansStr.replace(/^0\./, ".")],
        efficiencyTip: `Skip long division! Multiply top and bottom by ${cfg.mult} to make the denominator ${cfg.targetDen}.`,
        hint: `Since ${cfg.den} × ${cfg.mult} = ${cfg.targetDen}, multiply the numerator ${num} by ${cfg.mult}.`,
        steps: [
          {
            title: `Step 1: Scale denominator ${cfg.den} to ${cfg.targetDen} by multiplying by ${cfg.mult}`,
            latex: `\\frac{${num}}{${cfg.den}} = \\frac{${num} \\times ${cfg.mult}}{${cfg.den} \\times ${cfg.mult}} = \\frac{${scaledNum}}{${cfg.targetDen}}`,
            explanation: `Because ${cfg.den} × ${cfg.mult} = ${cfg.targetDen}, we can convert directly to place value.`,
          },
          {
            title: "Step 2: Write as a decimal directly from the power of 10",
            latex: `\\frac{${scaledNum}}{${cfg.targetDen}} = ${ansStr}`,
            explanation: `Dividing ${scaledNum} by ${cfg.targetDen} gives ${ansStr} immediately.`,
          },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // UNIT F4: RATIOS, UNIT RATES & RAPID PERCENTAGES
    // ------------------------------------------------------------------------
    case "g6-unit-rate": {
      // Solve a / b = x / d where a/b reduces to sA/sB and d = sB * k
      const coprimes: [number, number][] = [
        [2, 3],
        [3, 4],
        [2, 5],
        [3, 5],
        [4, 5],
        [3, 7],
        [5, 6],
      ];
      const [sA, sB] = pickOne(coprimes);
      const k1 = randInt(2, 4);
      let k2 = randInt(5, 9);
      if (k2 % k1 === 0) k2 += 1;

      const a = sA * k1;
      const b = sB * k1;
      const d = sB * k2;
      const x = sA * k2;

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Solve the proportion for x:",
        questionLatex: `\\frac{${a}}{${b}} = \\frac{x}{${d}}`,
        answerLatex: `${x}`,
        canonicalAnswer: `${x}`,
        acceptedAnswers: [`${x}`, `x=${x}`, `x = ${x}`],
        efficiencyTip: `Don't cross-multiply ${a} × ${d}! Reduce ${a}/${b} to ${sA}/${sB} first, then scale by ×${k2}.`,
        hint: `Simplify ${a}/${b} to ${sA}/${sB}. Then notice ${sB} × ${k2} = ${d}.`,
        steps: [
          {
            title: `Step 1: Reduce the known ratio ${a}/${b} by dividing by ${k1}`,
            latex: `\\frac{${a}}{${b}} = \\frac{${sA}}{${sB}}`,
            explanation: `Simplifying first keeps the numbers small and reveals the scale factor.`,
          },
          {
            title: `Step 2: Scale from denominator ${sB} to ${d} (multiply by ${k2})`,
            latex: `\\frac{${sA} \\times ${k2}}{${sB} \\times ${k2}} = \\frac{${x}}{${d}} \\implies x = ${x}`,
            explanation: `Since ${sB} × ${k2} = ${d}, multiply the numerator ${sA} by ${k2} to get x = ${x}.`,
          },
        ],
      };
    }

    case "g6-percent-of": {
      const mode = pickOne(["15pct", "35pct", "benchmark"]);
      if (mode === "15pct") {
        const whole = randInt(2, 16) * 20; // e.g. 40, 60, 80, ..., 320
        const tenPct = whole / 10;
        const fivePct = tenPct / 2;
        const ans = tenPct + fivePct;

        return {
          id,
          skillId,
          problemNumber,
          promptText: "Calculate mentally using 10% + 5% decomposition:",
          questionLatex: `15\\% \\text{ of } ${whole}`,
          answerLatex: `${ans}`,
          canonicalAnswer: `${ans}`,
          acceptedAnswers: [`${ans}`],
          efficiencyTip: `15% is just 10% + 5% (half of 10%). Find 10% of ${whole} (${tenPct}), take half of it (${fivePct}), and add them!`,
          hint: `10% of ${whole} is ${tenPct}. Half of that (5%) is ${fivePct}. Add them together.`,
          steps: [
            {
              title: "Step 1: Find 10% by shifting the decimal one place left",
              latex: `10\\% \\text{ of } ${whole} = ${tenPct}`,
              explanation: `Dividing ${whole} by 10 gives ${tenPct}.`,
            },
            {
              title: "Step 2: Find 5% (half of 10%) and add",
              latex: `5\\% \\text{ of } ${whole} = ${fivePct} \\implies 15\\% = ${tenPct} + ${fivePct} = ${ans}`,
              explanation: `Half of ${tenPct} is ${fivePct}. Adding ${tenPct} + ${fivePct} gives ${ans}.`,
            },
          ],
        };
      } else if (mode === "35pct") {
        const whole = randInt(2, 12) * 20;
        const tenPct = whole / 10;
        const thirtyPct = tenPct * 3;
        const fivePct = tenPct / 2;
        const ans = thirtyPct + fivePct;

        return {
          id,
          skillId,
          problemNumber,
          promptText: "Calculate the percentage mentally:",
          questionLatex: `35\\% \\text{ of } ${whole}`,
          answerLatex: `${ans}`,
          canonicalAnswer: `${ans}`,
          acceptedAnswers: [`${ans}`],
          efficiencyTip: `Break 35% into 30% + 5%. Since 10% is ${tenPct}, 30% is ${thirtyPct} and 5% is ${fivePct}!`,
          hint: `10% of ${whole} = ${tenPct}, so 30% = ${thirtyPct} and 5% = ${fivePct}.`,
          steps: [
            {
              title: "Step 1: Use 10% as your mental building block",
              latex: `10\\% \\text{ of } ${whole} = ${tenPct} \\implies 30\\% = 3 \\times ${tenPct} = ${thirtyPct}`,
              explanation: `Triple the 10% value to get 30%.`,
            },
            {
              title: "Step 2: Add 5% (half of 10%)",
              latex: `35\\% = ${thirtyPct} + ${fivePct} = ${ans}`,
              explanation: `Adding 30% (${thirtyPct}) + 5% (${fivePct}) = ${ans}.`,
            },
          ],
        };
      } else {
        const benchmarks: { pct: number; num: number; den: number }[] = [
          { pct: 25, num: 1, den: 4 },
          { pct: 75, num: 3, den: 4 },
          { pct: 20, num: 1, den: 5 },
          { pct: 40, num: 2, den: 5 },
          { pct: 60, num: 3, den: 5 },
          { pct: 80, num: 4, den: 5 },
        ];
        const b = pickOne(benchmarks);
        const unitPart = randInt(4, 18);
        const whole = unitPart * b.den;
        const ans = unitPart * b.num;

        return {
          id,
          skillId,
          problemNumber,
          promptText: "Use benchmark fractions to compute:",
          questionLatex: `${b.pct}\\% \\text{ of } ${whole}`,
          answerLatex: `${ans}`,
          canonicalAnswer: `${ans}`,
          acceptedAnswers: [`${ans}`],
          efficiencyTip: `Convert ${b.pct}% to its simplest fraction (${b.num}/${b.den}), divide ${whole} by ${b.den} first (${unitPart}), then multiply by ${b.num}!`,
          hint: `${b.pct}% = ${b.num}/${b.den}. First divide ${whole} by ${b.den}.`,
          steps: [
            {
              title: `Step 1: Replace ${b.pct}% with the benchmark fraction ${b.num}/${b.den}`,
              latex: `${b.pct}\\% \\text{ of } ${whole} = \\frac{${b.num}}{${b.den}} \\times ${whole}`,
              explanation: `Memorizing ${b.pct}% = ${b.num}/${b.den} avoids decimal multiplication.`,
            },
            {
              title: `Step 2: Divide by ${b.den} first, then multiply by ${b.num}`,
              latex: `(${whole} \\div ${b.den}) \\times ${b.num} = ${unitPart} \\times ${b.num} = ${ans}`,
              explanation: `${whole} ÷ ${b.den} = ${unitPart}, and ${unitPart} × ${b.num} = ${ans}.`,
            },
          ],
        };
      }
    }

    case "g6-percent-find-whole": {
      const pctTens = pickOne([2, 3, 4, 6, 7, 8, 9]);
      const pct = pctTens * 10;
      const tenPctValue = randInt(3, 15);
      const part = pctTens * tenPctValue;
      const whole = tenPctValue * 10;

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Find the whole number N:",
        questionLatex: `${pct}\\% \\text{ of } N = ${part}`,
        answerLatex: `${whole}`,
        canonicalAnswer: `${whole}`,
        acceptedAnswers: [`${whole}`, `N=${whole}`, `n=${whole}`],
        efficiencyTip: `Unitary 10% Shortcut: Divide ${part} by ${pctTens} to find 10% of N (${tenPctValue}), then multiply by 10 to get 100%!`,
        hint: `If ${pct}% is ${part}, divide by ${pctTens} to find what 10% is.`,
        steps: [
          {
            title: `Step 1: Scale down by ÷${pctTens} to find 10% of N`,
            latex: `10\\% \\text{ of } N = ${part} \\div ${pctTens} = ${tenPctValue}`,
            explanation: `Since ${pct}% = ${pctTens} × 10%, dividing ${part} by ${pctTens} gives 10% of N.`,
          },
          {
            title: "Step 2: Multiply by 10 to find 100% (N)",
            latex: `100\\% \\text{ of } N = ${tenPctValue} \\times 10 = ${whole}`,
            explanation: `Multiplying 10% by 10 gives the whole number N = ${whole}.`,
          },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // UNIT G1: INTEGERS & ALGEBRAIC EXPRESSIONS
    // ------------------------------------------------------------------------
    case "g6-int-ops": {
      const a = randInt(6, 19);
      const b = randInt(4, 15);
      const c = randInt(3, 14);
      const ans = -a + b - c;

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Compute the integer expression:",
        questionLatex: `-${a} - (-${b}) + (-${c})`,
        answerLatex: `${ans}`,
        canonicalAnswer: `${ans}`,
        acceptedAnswers: [`${ans}`],
        efficiencyTip: `Clear double signs first: -(-${b}) becomes +${b} and +(-${c}) becomes -${c}. Then combine the negatives (-${a} - ${c} = -${a + c}) before adding ${b}!`,
        hint: `Rewrite without parentheses: -${a} + ${b} - ${c}.`,
        steps: [
          {
            title: "Step 1: Clear parentheses using sign rules",
            latex: `-${a} - (-${b}) + (-${c}) = -${a} + ${b} - ${c}`,
            explanation: `Subtracting a negative is adding (+${b}), and adding a negative is subtracting (-${c}).`,
          },
          {
            title: "Step 2: Combine same-sign terms, then take the difference",
            latex: `(-${a} - ${c}) + ${b} = -${a + c} + ${b} = ${ans}`,
            explanation: `Group the negative terms first (-${a} and -${c} make -${a + c}), then add ${b} to get ${ans}.`,
          },
        ],
      };
    }

    case "g6-eval-expr": {
      const a = randInt(2, 4);
      const x = randInt(2, 5);
      const b = randInt(2, 6);
      const y = randInt(-4, -2);
      // Evaluate a*x^2 - b*y (note y is negative so - b*y becomes positive!)
      const xSq = x * x;
      const term1 = a * xSq;
      const term2 = -b * y; // positive
      const ans = term1 + term2;

      return {
        id,
        skillId,
        problemNumber,
        promptText: `Evaluate the expression when x = ${x} and y = ${y}:`,
        questionLatex: `${a}x^2 - ${b}y \\quad (x = ${x},\\; y = ${y})`,
        answerLatex: `${ans}`,
        canonicalAnswer: `${ans}`,
        acceptedAnswers: [`${ans}`],
        efficiencyTip: `Wrap negative substitutions in parentheses: -${b}(${y}) becomes +${term2} immediately!`,
        hint: `Substitute (${x}) for x and (${y}) for y: ${a}(${x})² - ${b}(${y}). Watch the double negative!`,
        steps: [
          {
            title: "Step 1: Substitute values in parentheses",
            latex: `${a}(${x})^2 - ${b}(${y})`,
            explanation: `Using parentheses prevents sign errors with y = ${y}.`,
          },
          {
            title: "Step 2: Evaluate the exponent and products, then combine",
            latex: `${a}(${xSq}) + ${term2} = ${term1} + ${term2} = ${ans}`,
            explanation: `(${x})² = ${xSq}, so ${a} × ${xSq} = ${term1}. Meanwhile, -${b} × (${y}) = +${term2}. Sum = ${ans}.`,
          },
        ],
      };
    }

    case "g6-combine-like": {
      const k = randInt(2, 5);
      const a = randInt(2, 4);
      const b = randInt(2, 6);
      const c = randInt(1, k * a - 2);
      const d = randInt(2, 9);

      // k(ax + b) - cx - d
      const distX = k * a;
      const distConst = k * b;
      const finalX = distX - c;
      const finalConst = distConst - d;

      const constSign = finalConst >= 0 ? "+" : "-";
      const absConst = Math.abs(finalConst);
      const canonical =
        finalConst === 0
          ? `${finalX === 1 ? "" : finalX}x`
          : `${finalX === 1 ? "" : finalX}x ${constSign} ${absConst}`;

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Expand and simplify by combining like terms (write in ax + b form):",
        questionLatex: `${k}(${a}x + ${b}) - ${c}x - ${d}`,
        answerLatex: canonical,
        canonicalAnswer: canonical,
        acceptedAnswers: [
          canonical,
          canonical.replace(/\s+/g, ""),
          `${finalConst} + ${finalX === 1 ? "" : finalX}x`,
          `${finalConst}+${finalX === 1 ? "" : finalX}x`,
        ],
        efficiencyTip: `Distribute ${k} across both terms inside the parentheses first (${distX}x + ${distConst}), then group x-terms and constants mentally.`,
        hint: `First expand ${k}(${a}x + ${b}) = ${distX}x + ${distConst}. Then subtract ${c}x and ${d}.`,
        steps: [
          {
            title: `Step 1: Distribute ${k} across (${a}x + ${b})`,
            latex: `${k}(${a}x + ${b}) - ${c}x - ${d} = ${distX}x + ${distConst} - ${c}x - ${d}`,
            explanation: `Multiply ${k} × ${a}x = ${distX}x and ${k} × ${b} = ${distConst}.`,
          },
          {
            title: "Step 2: Group and combine like terms",
            latex: `(${distX} - ${c})x + (${distConst} - ${d}) = ${canonical}`,
            explanation: `Combine the x-coefficients (${distX} - ${c} = ${finalX}) and the constants (${distConst} - ${d} = ${finalConst}).`,
          },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // UNIT G2: LINEAR EQUATIONS & GEOMETRY
    // ------------------------------------------------------------------------
    case "g6-one-step-eq": {
      // Fractional coefficient equation: (a/b)x = c where c is a multiple of a!
      const pairs: [number, number][] = [
        [2, 3],
        [3, 4],
        [2, 5],
        [3, 5],
        [4, 5],
        [3, 7],
        [5, 6],
      ];
      const [a, b] = pickOne(pairs);
      const k = randInt(3, 9);
      const rhs = a * k;
      const ans = b * k;

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Solve for x:",
        questionLatex: `\\frac{${a}}{${b}}x = ${rhs}`,
        answerLatex: `${ans}`,
        canonicalAnswer: `${ans}`,
        acceptedAnswers: [`${ans}`, `x=${ans}`, `x = ${ans}`],
        efficiencyTip: `Multiply by the reciprocal (${b}/${a}) and cancel ${rhs} ÷ ${a} = ${k} BEFORE multiplying by ${b}!`,
        hint: `Divide ${rhs} by ${a} first (${k}), then multiply by ${b}.`,
        steps: [
          {
            title: `Step 1: Multiply both sides by the reciprocal ${b}/${a}`,
            latex: `x = ${rhs} \\times \\frac{${b}}{${a}}`,
            explanation: `Multiplying by the reciprocal isolates x in a single step.`,
          },
          {
            title: `Step 2: Divide ${rhs} by ${a} first, then multiply by ${b}`,
            latex: `x = (${rhs} \\div ${a}) \\times ${b} = ${k} \\times ${b} = ${ans}`,
            explanation: `Cancel ${rhs} and ${a} to get ${k}, then compute ${k} × ${b} = ${ans}.`,
          },
        ],
      };
    }

    case "g6-two-step-eq": {
      const a = randInt(3, 9);
      const x = randInt(3, 12);
      const b = randInt(5, 25);
      const isMinus = Math.random() < 0.6;
      const c = isMinus ? a * x - b : a * x + b;

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Solve the two-step equation for x:",
        questionLatex: `${a}x ${isMinus ? "-" : "+"} ${b} = ${c}`,
        answerLatex: `${x}`,
        canonicalAnswer: `${x}`,
        acceptedAnswers: [`${x}`, `x=${x}`, `x = ${x}`],
        efficiencyTip: `Move ${isMinus ? `-${b}` : `+${b}`} across the '=' sign as ${isMinus ? `+${b}` : `-${b}`} (${a}x = ${a * x}), then divide by ${a}.`,
        hint: `First ${isMinus ? "add" : "subtract"} ${b} on the right side to get ${a}x = ${a * x}.`,
        steps: [
          {
            title: `Step 1: Transpose the constant term to the right side`,
            latex: `${a}x = ${c} ${isMinus ? "+" : "-"} ${b} = ${a * x}`,
            explanation: `Moving ${isMinus ? `-${b}` : `+${b}`} across '=' flips its sign, giving ${a}x = ${a * x}.`,
          },
          {
            title: `Step 2: Divide both sides by the coefficient ${a}`,
            latex: `x = \\frac{${a * x}}{${a}} = ${x}`,
            explanation: `${a * x} ÷ ${a} = ${x}.`,
          },
        ],
      };
    }

    case "g6-area-volume": {
      const isTriangle = Math.random() < 0.65;
      if (isTriangle) {
        const halfBase = randInt(4, 12);
        const base = halfBase * 2; // Guaranteed even!
        const height = randInt(5, 15);
        const ans = halfBase * height;

        return {
          id,
          skillId,
          problemNumber,
          promptText: "Find the area of the triangle (halve the even dimension first):",
          questionLatex: `\\text{Triangle with base } b = ${base}\\text{ cm, height } h = ${height}\\text{ cm}`,
          answerLatex: `${ans}`,
          canonicalAnswer: `${ans}`,
          acceptedAnswers: [`${ans}`, `${ans} cm^2`, `${ans}cm^2`],
          unitSuffix: "cm²",
          efficiencyTip: `Never multiply ${base} × ${height} first and then divide by 2! Halve the even number (${base} ÷ 2 = ${halfBase}) FIRST, then multiply ${halfBase} × ${height}.`,
          hint: `Area = ½ × base × height. Take half of ${base} first (${halfBase}), then multiply by ${height}.`,
          steps: [
            {
              title: "Step 1: Write the triangle area formula and halve the even number first",
              latex: `A = \\frac{1}{2} \\times ${base} \\times ${height} = ${halfBase} \\times ${height}`,
              explanation: `Taking half of ${base} first (${halfBase}) keeps the multiplication small and mental.`,
            },
            {
              title: "Step 2: Multiply to find the area",
              latex: `A = ${halfBase} \\times ${height} = ${ans}\\text{ cm}^2`,
              explanation: `${halfBase} × ${height} = ${ans}.`,
            },
          ],
        };
      } else {
        // Trapezoid: A = 1/2 (b1 + b2) * h where h is even
        const b1 = randInt(5, 14);
        const b2 = randInt(6, 16);
        const halfH = randInt(3, 8);
        const h = halfH * 2;
        const sumBases = b1 + b2;
        const ans = sumBases * halfH;

        return {
          id,
          skillId,
          problemNumber,
          promptText: "Find the area of the trapezoid:",
          questionLatex: `\\text{Trapezoid with bases } b_1 = ${b1},\\; b_2 = ${b2}\\text{ and height } h = ${h}`,
          answerLatex: `${ans}`,
          canonicalAnswer: `${ans}`,
          acceptedAnswers: [`${ans}`],
          unitSuffix: "units²",
          efficiencyTip: `In A = ½(b₁ + b₂)h, add the bases (${b1} + ${b2} = ${sumBases}) and take half of the even height (${h} ÷ 2 = ${halfH}) BEFORE multiplying!`,
          hint: `Add the bases (${b1} + ${b2} = ${sumBases}) and multiply by half the height (${h} ÷ 2 = ${halfH}).`,
          steps: [
            {
              title: "Step 1: Add the parallel bases and halve the even height",
              latex: `A = \\frac{1}{2}(${b1} + ${b2}) \\times ${h} = (${sumBases}) \\times ${halfH}`,
              explanation: `${b1} + ${b2} = ${sumBases}, and ½ × ${h} = ${halfH}.`,
            },
            {
              title: "Step 2: Multiply the two results",
              latex: `A = ${sumBases} \\times ${halfH} = ${ans}`,
              explanation: `${sumBases} × ${halfH} = ${ans}.`,
            },
          ],
        };
      }
    }

    // ------------------------------------------------------------------------
    // GRADE 7 EXTENSION SKILLS
    // ------------------------------------------------------------------------
    case "g7-eq-both-sides": {
      const x = randInt(2, 11);
      const c2 = randInt(2, 6);
      const diffC = randInt(2, 6);
      const c1 = c2 + diffC;
      const b1 = randInt(3, 18);
      const b2 = diffC * x - b1;
      // Equation: c1*x - b1 = c2*x + b2
      const b2Sign = b2 >= 0 ? "+" : "-";
      const absB2 = Math.abs(b2);

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Solve for x by transposing variables to the left and constants to the right:",
        questionLatex: `${c1}x - ${b1} = ${c2}x ${b2Sign} ${absB2}`,
        answerLatex: `${x}`,
        canonicalAnswer: `${x}`,
        acceptedAnswers: [`${x}`, `x=${x}`, `x = ${x}`],
        efficiencyTip: `Simultaneous Transposition: Move ${c2}x to the left (as -${c2}x) and -${b1} to the right (as +${b1}) in one step!`,
        hint: `Subtract ${c2}x from both sides and add ${b1} to both sides at the same time.`,
        steps: [
          {
            title: "Step 1: Transpose variable terms left and constants right simultaneously",
            latex: `${c1}x - ${c2}x = ${b2} + ${b1} \\implies ${diffC}x = ${diffC * x}`,
            explanation: `Subtract ${c2}x and add ${b1} in a single line.`,
          },
          {
            title: `Step 2: Divide by ${diffC}`,
            latex: `x = \\frac{${diffC * x}}{${diffC}} = ${x}`,
            explanation: `Dividing ${diffC * x} by ${diffC} gives x = ${x}.`,
          },
        ],
      };
    }

    case "g7-percent-change":
    default: {
      const price = randInt(3, 15) * 20;
      const discountPct = pickOne([15, 20, 25, 30]);
      const discountAmt = (price * discountPct) / 100;
      const finalPrice = price - discountAmt;

      return {
        id,
        skillId,
        problemNumber,
        promptText: "Find the final sale price after the discount:",
        questionLatex: `\\$${price} \\text{ item with a } ${discountPct}\\% \\text{ discount}`,
        answerLatex: `${finalPrice}`,
        canonicalAnswer: `${finalPrice}`,
        acceptedAnswers: [`${finalPrice}`, `$${finalPrice}`],
        unitSuffix: "$",
        efficiencyTip: `Either subtract the mental discount (${discountPct}% of ${price} = ${discountAmt}) OR multiply ${price} by ${100 - discountPct}% directly.`,
        hint: `Find ${discountPct}% of ${price} (${discountAmt}), then subtract from ${price}.`,
        steps: [
          {
            title: `Step 1: Compute the ${discountPct}% discount mentally`,
            latex: `${discountPct}\\% \\text{ of } ${price} = ${discountAmt}`,
            explanation: `10% of ${price} is ${price / 10}, so ${discountPct}% is ${discountAmt}.`,
          },
          {
            title: "Step 2: Subtract the discount from the original price",
            latex: `${price} - ${discountAmt} = ${finalPrice}`,
            explanation: `The final sale price is $${finalPrice}.`,
          },
        ],
      };
    }
  }
}

function generateFractionAddSubHelper(
  id: string,
  skillId: string,
  problemNumber: number,
  n1: number,
  d1: number,
  n2: number,
  d2: number,
  isAdd: boolean
): GeneratedProblem {
  const lcd = lcm(d1, d2);
  const m1 = lcd / d1;
  const m2 = lcd / d2;
  const scaled1 = n1 * m1;
  const scaled2 = n2 * m2;
  const rawNum = isAdd ? scaled1 + scaled2 : scaled1 - scaled2;
  const g = gcd(rawNum, lcd);
  const sNum = rawNum / g;
  const sDen = lcd / g;
  const accepted = formatMixedAnswerStrings(sNum, sDen);
  const op = isAdd ? "+" : "-";

  const steps: SolutionStep[] = [
    {
      title: `Step 1: Rewrite using the Least Common Denominator (LCD = ${lcd})`,
      latex: `\\frac{${n1} \\times ${m1}}{${d1} \\times ${m1}} ${op} \\frac{${n2} \\times ${m2}}{${d2} \\times ${m2}} = \\frac{${scaled1} ${op} ${scaled2}}{${lcd}}`,
      explanation: `Instead of multiplying ${d1} × ${d2} = ${d1 * d2}, use LCD(${d1}, ${d2}) = ${lcd}. Multiply the first fraction by ${m1}/${m1} and the second by ${m2}/${m2}.`,
    },
    {
      title: `Step 2: ${isAdd ? "Add" : "Subtract"} the numerators${g > 1 ? ` and reduce by GCF = ${g}` : ""}`,
      latex:
        g > 1
          ? `\\frac{${rawNum}}{${lcd}} = \\frac{${rawNum} \\div ${g}}{${lcd} \\div ${g}} = ${formatFractionLatex(sNum, sDen)}`
          : `\\frac{${rawNum}}{${lcd}} = ${formatFractionLatex(sNum, sDen)}`,
      explanation:
        g > 1
          ? `${scaled1} ${op} ${scaled2} = ${rawNum}. Divide top and bottom by ${g} to get simplest form.`
          : `${scaled1} ${op} ${scaled2} = ${rawNum}. Since GCF(${rawNum}, ${lcd}) = 1, it is already in simplest form.`,
    },
  ];

  return {
    id,
    skillId,
    problemNumber,
    promptText: `${isAdd ? "Add" : "Subtract"} using the Least Common Denominator (LCD) and simplify:`,
    questionLatex: `\\frac{${n1}}{${d1}} ${op} \\frac{${n2}}{${d2}}`,
    answerLatex: formatFractionLatex(sNum, sDen),
    canonicalAnswer: accepted[0],
    acceptedAnswers: accepted,
    requireSimplifiedFraction: true,
    efficiencyTip: `Use LCD(${d1}, ${d2}) = ${lcd} instead of ${d1} × ${d2} = ${d1 * d2} so your numbers stay small!`,
    hint: `The smallest number both ${d1} and ${d2} divide into is ${lcd}. Convert both fractions to denominator ${lcd}.`,
    steps,
  };
}

// ============================================================================
// SMART ANSWER VERIFICATION (HANDLES FRACTIONS, MIXED NUMBERS, ALGEBRA, UNITS)
// ============================================================================

export interface AnswerCheckResult {
  isCorrect: boolean;
  isUnreducedFraction?: boolean;
  feedbackMessage: string;
}

function parseNumericOrFraction(raw: string): { value: number; num?: number; den?: number } | null {
  const cleaned = raw.trim().replace(/^\$/, "").replace(/\s+/g, " ");
  if (!cleaned) return null;

  // Mixed number e.g. "1 2/3" or "-1 2/3"
  const mixedMatch = cleaned.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const num = parseInt(mixedMatch[2], 10);
    const den = parseInt(mixedMatch[3], 10);
    if (den === 0) return null;
    const sign = whole < 0 ? -1 : 1;
    const improperNum = sign * (Math.abs(whole) * den + num);
    return { value: improperNum / den, num: improperNum, den };
  }

  // Simple fraction e.g. "10/9" or "-3/4"
  const fracMatch = cleaned.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (fracMatch) {
    const num = parseInt(fracMatch[1], 10);
    const den = parseInt(fracMatch[2], 10);
    if (den === 0) return null;
    return { value: num / den, num, den };
  }

  // Standard number or decimal
  if (/^-?\d*\.?\d+$/.test(cleaned)) {
    const val = parseFloat(cleaned);
    if (!isNaN(val)) return { value: val };
  }

  return null;
}

export function checkAnswer(userInput: string, problem: GeneratedProblem): AnswerCheckResult {
  const raw = userInput.trim();
  if (!raw) {
    return { isCorrect: false, feedbackMessage: "Please enter an answer." };
  }

  const normalizedInput = raw.toLowerCase().replace(/\s+/g, "");
  for (const accepted of problem.acceptedAnswers) {
    if (normalizedInput === accepted.toLowerCase().replace(/\s+/g, "")) {
      return { isCorrect: true, feedbackMessage: "Correct! Great job using the efficient method." };
    }
  }

  // Check numeric / fraction equivalence
  const userParsed = parseNumericOrFraction(raw.replace(/^[a-zA-Z]\s*=\s*/, ""));
  const canonicalParsed = parseNumericOrFraction(problem.canonicalAnswer);

  if (userParsed && canonicalParsed) {
    const isSameValue = Math.abs(userParsed.value - canonicalParsed.value) < 1e-7;
    if (isSameValue) {
      // Check if fraction needed reduction
      if (
        problem.requireSimplifiedFraction &&
        userParsed.num !== undefined &&
        userParsed.den !== undefined
      ) {
        const g = gcd(userParsed.num, userParsed.den);
        if (g > 1 && userParsed.den !== 1) {
          return {
            isCorrect: false,
            isUnreducedFraction: true,
            feedbackMessage: `Almost! Your fraction (${raw}) is equal to the answer, but divide top and bottom by ${g} to write it in simplest form (${problem.canonicalAnswer}).`,
          };
        }
      }
      return { isCorrect: true, feedbackMessage: "Correct!" };
    }
  }

  return {
    isCorrect: false,
    feedbackMessage: `Not quite. Review the efficient step-by-step key below to see how to get ${problem.canonicalAnswer}.`,
  };
}

