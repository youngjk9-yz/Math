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

export interface MathDefinition {
  term: string;
  meaning: string;
  exampleLatex?: string;
}

export interface WorkedExample {
  title: string;
  questionLatex: string;
  answerLatex: string;
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
  definitions: MathDefinition[];
  workedExamples: WorkedExample[];
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
        definitions: [
          {
            term: "Factor",
            meaning: "A whole number that divides evenly into another number with no remainder.",
            exampleLatex: "\\text{Factors of } 12: 1, 2, 3, 4, 6, 12",
          },
          {
            term: "Common Factor",
            meaning: "A number that is a factor of two or more numbers at the same time.",
            exampleLatex: "\\text{Common factors of } 12 \\text{ and } 18: 1, 2, 3, 6",
          },
          {
            term: "Greatest Common Factor (GCF)",
            meaning: "The largest whole number that divides evenly into both numbers.",
            exampleLatex: "\\text{GCF}(12, 18) = 6",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Finding GCF Using the Difference Method",
            questionLatex: "\\text{Find } \\text{GCF}(36, 48)",
            answerLatex: "12",
            steps: [
              {
                title: "Step 1: Subtract the smaller number from the larger number",
                latex: "48 - 36 = 12",
                explanation: "A key rule of number theory is that the Greatest Common Factor (GCF) of two numbers can never be larger than the difference between them, and must divide that difference evenly.",
              },
              {
                title: "Step 2: Test if the difference (12) divides the first number (36)",
                latex: "36 \\div 12 = 3 \\quad (\\text{no remainder})",
                explanation: "Divide 36 by 12. Because 12 × 3 = 36 with zero remainder, 12 is a factor of 36.",
              },
              {
                title: "Step 3: Test if 12 also divides the second number (48)",
                latex: "48 \\div 12 = 4 \\quad (\\text{no remainder})",
                explanation: "Divide 48 by 12. Because 12 × 4 = 48 with zero remainder, 12 is also a factor of 48.",
              },
              {
                title: "Step 4: State the Greatest Common Factor",
                latex: "\\text{GCF}(36, 48) = 12",
                explanation: "Since 12 divides both 36 and 48 evenly—and no common factor can exceed the difference of 12—12 is the Greatest Common Factor.",
              },
            ],
          },
          {
            title: "Example 2: When the Difference Needs Factoring",
            questionLatex: "\\text{Find } \\text{GCF}(28, 49)",
            answerLatex: "7",
            steps: [
              {
                title: "Step 1: Find the difference between the two numbers",
                latex: "49 - 28 = 21",
                explanation: "Subtract 49 − 28 = 21. The GCF must be one of the factors of 21.",
              },
              {
                title: "Step 2: List the factors of the difference (21) from largest to smallest",
                latex: "\\text{Factors of } 21: 21, 7, 3, 1",
                explanation: "Instead of listing all factors of 28 and 49, we only need to test the factors of 21 starting from the largest.",
              },
              {
                title: "Step 3: Test 21, then test the next largest factor (7)",
                latex: "28 \\div 21 \\text{ (not whole)}, \\quad 28 \\div 7 = 4 \\text{ and } 49 \\div 7 = 7",
                explanation: "21 does not divide 28 evenly. Moving to the next largest factor, 7 divides both 28 (7 × 4) and 49 (7 × 7) with no remainder.",
              },
              {
                title: "Step 4: Conclude the GCF",
                latex: "\\text{GCF}(28, 49) = 7",
                explanation: "Because 7 is the largest factor of 21 that divides both numbers evenly, GCF(28, 49) = 7.",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Multiple",
            meaning: "The product of a number and any positive whole number (1, 2, 3, ...).",
            exampleLatex: "\\text{Multiples of } 6: 6, 12, 18, 24, 30, \\dots",
          },
          {
            term: "Least Common Multiple (LCM)",
            meaning: "The smallest positive number that is a multiple of two or more numbers.",
            exampleLatex: "\\text{LCM}(12, 18) = 36",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Finding LCM Using the GCF Shortcut",
            questionLatex: "\\text{Find } \\text{LCM}(12, 18)",
            answerLatex: "36",
            steps: [
              {
                title: "Step 1: Find the Greatest Common Factor (GCF) of 12 and 18",
                latex: "\\text{GCF}(12, 18) = 6",
                explanation: "Both 12 and 18 are divisible by 6 (12 = 6 × 2 and 18 = 6 × 3). Finding the GCF first lets us avoid writing out long lists of multiples.",
              },
              {
                title: "Step 2: Divide the first number by the GCF",
                latex: "12 \\div 6 = 2",
                explanation: "Dividing 12 by the shared factor 6 leaves the unique factor 2. Doing division first keeps the numbers small.",
              },
              {
                title: "Step 3: Multiply that result by the second number",
                latex: "2 \\times 18 = 36",
                explanation: "Multiply 2 by 18 to get 36. Notice that 36 is divisible by both 12 (12 × 3 = 36) and 18 (18 × 2 = 36), so LCM(12, 18) = 36.",
              },
            ],
          },
          {
            title: "Example 2: Finding LCM of 15 and 20",
            questionLatex: "\\text{Find } \\text{LCM}(15, 20)",
            answerLatex: "60",
            steps: [
              {
                title: "Step 1: Identify the GCF of 15 and 20",
                latex: "\\text{GCF}(15, 20) = 5",
                explanation: "The difference is 20 − 15 = 5, and 5 divides both 15 and 20 evenly.",
              },
              {
                title: "Step 2: Divide the first number (15) by the GCF (5)",
                latex: "15 \\div 5 = 3",
                explanation: "Divide 15 by 5 to get 3.",
              },
              {
                title: "Step 3: Multiply by the second number (20)",
                latex: "3 \\times 20 = 60",
                explanation: "Multiply 3 × 20 = 60. Thus, 60 is the smallest positive number that both 15 and 20 divide into evenly.",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Exponent (Power)",
            meaning: "Shows how many times a base number is multiplied by itself.",
            exampleLatex: "3^2 = 3 \\times 3 = 9, \\quad 2^3 = 2 \\times 2 \\times 2 = 8",
          },
          {
            term: "Order of Operations (PEMDAS)",
            meaning: "The standard rule for evaluating math expressions: (1) Parentheses, (2) Exponents, (3) Multiplication & Division (left to right), (4) Addition & Subtraction (left to right).",
            exampleLatex: "\\text{P} \\to \\text{E} \\to \\text{M/D} \\to \\text{A/S}",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Expression with Exponent and Parentheses",
            questionLatex: "3^2 + 4 \\times (10 - 3)",
            answerLatex: "37",
            steps: [
              {
                title: "Step 1: Evaluate inside the Parentheses (P)",
                latex: "3^2 + 4 \\times (10 - 3) = 3^2 + 4 \\times 7",
                explanation: "Following PEMDAS, always start inside the parentheses: subtract 10 − 3 = 7.",
              },
              {
                title: "Step 2: Evaluate the Exponent (E)",
                latex: "3^2 + 4 \\times 7 = 9 + 4 \\times 7",
                explanation: "Next, compute the power: 3² means 3 × 3 = 9 (be careful not to do 3 × 2 = 6).",
              },
              {
                title: "Step 3: Perform Multiplication before Addition (M before A)",
                latex: "9 + (4 \\times 7) = 9 + 28",
                explanation: "In PEMDAS, multiplication comes before addition, so multiply 4 × 7 = 28 before adding 9.",
              },
              {
                title: "Step 4: Add the remaining numbers (A)",
                latex: "9 + 28 = 37",
                explanation: "Finally, add 9 + 28 to get the final answer of 37.",
              },
            ],
          },
          {
            title: "Example 2: Squaring a Parenthesis",
            questionLatex: "3 \\times (6 - 2)^2 + 5",
            answerLatex: "53",
            steps: [
              {
                title: "Step 1: Simplify inside the Parentheses first (P)",
                latex: "3 \\times (6 - 2)^2 + 5 = 3 \\times (4)^2 + 5",
                explanation: "Compute 6 − 2 = 4 inside the parentheses first. Never multiply 3 into the parentheses before applying the exponent.",
              },
              {
                title: "Step 2: Evaluate the Exponent on the parentheses result (E)",
                latex: "3 \\times 4^2 + 5 = 3 \\times 16 + 5",
                explanation: "Square 4: 4² = 4 × 4 = 16.",
              },
              {
                title: "Step 3: Multiply before adding (M)",
                latex: "3 \\times 16 + 5 = 48 + 5",
                explanation: "Multiply 3 × 16 = 48.",
              },
              {
                title: "Step 4: Add the final constant (A)",
                latex: "48 + 5 = 53",
                explanation: "Add 48 + 5 = 53.",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Numerator & Denominator",
            meaning: "In a fraction a/b, the top number (a) is the numerator (parts counted) and the bottom number (b) is the denominator (size of each part).",
            exampleLatex: "\\frac{\\text{Numerator}}{\\text{Denominator}} = \\frac{5}{6}",
          },
          {
            term: "Least Common Denominator (LCD)",
            meaning: "The Least Common Multiple (LCM) of two denominators, used to rewrite unlike fractions with the same bottom number.",
            exampleLatex: "\\text{LCD of } \\frac{5}{6} \\text{ and } \\frac{3}{8} \\text{ is } \\text{LCM}(6, 8) = 24",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Subtracting Unlike Fractions Using the LCD",
            questionLatex: "\\frac{5}{6} - \\frac{3}{8}",
            answerLatex: "\\frac{11}{24}",
            steps: [
              {
                title: "Step 1: Find the Least Common Denominator (LCD) of 6 and 8",
                latex: "\\text{LCM}(6, 8) = 24",
                explanation: "We cannot subtract fractions with different denominators directly. The smallest multiple shared by 6 and 8 is 24 (6 × 4 = 24 and 8 × 3 = 24).",
              },
              {
                title: "Step 2: Convert each fraction into an equivalent fraction with denominator 24",
                latex: "\\frac{5 \\times 4}{6 \\times 4} = \\frac{20}{24}, \\quad \\frac{3 \\times 3}{8 \\times 3} = \\frac{9}{24}",
                explanation: "Multiply top and bottom of 5/6 by 4 to get 20/24. Multiply top and bottom of 3/8 by 3 to get 9/24.",
              },
              {
                title: "Step 3: Subtract the numerators and keep the common denominator",
                latex: "\\frac{20}{24} - \\frac{9}{24} = \\frac{20 - 9}{24} = \\frac{11}{24}",
                explanation: "Once the denominators match, subtract the top numbers (20 − 9 = 11) and keep 24 on the bottom. Since 11 is prime, 11/24 is already in simplest form.",
              },
            ],
          },
          {
            title: "Example 2: Adding Unlike Fractions and Reducing to Simplest Form",
            questionLatex: "\\frac{1}{6} + \\frac{3}{10}",
            answerLatex: "\\frac{7}{15}",
            steps: [
              {
                title: "Step 1: Find the LCD of 6 and 10",
                latex: "\\text{LCM}(6, 10) = 30",
                explanation: "Instead of multiplying 6 × 10 = 60, use the smallest common multiple: 30 (since 6 × 5 = 30 and 10 × 3 = 30).",
              },
              {
                title: "Step 2: Rewrite both fractions with denominator 30",
                latex: "\\frac{1 \\times 5}{6 \\times 5} + \\frac{3 \\times 3}{10 \\times 3} = \\frac{5}{30} + \\frac{9}{30}",
                explanation: "Scale 1/6 by 5/5 to get 5/30, and scale 3/10 by 3/3 to get 9/30.",
              },
              {
                title: "Step 3: Add the numerators over 30",
                latex: "\\frac{5 + 9}{30} = \\frac{14}{30}",
                explanation: "Add the numerators: 5 + 9 = 14 over the common denominator 30.",
              },
              {
                title: "Step 4: Simplify the result by dividing by GCF(14, 30) = 2",
                latex: "\\frac{14 \\div 2}{30 \\div 2} = \\frac{7}{15}",
                explanation: "Both 14 and 30 are even numbers. Divide top and bottom by 2 to get the simplest form 7/15.",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Cross-Cancellation",
            meaning: "Dividing a numerator and a diagonal denominator by their common factor BEFORE multiplying two fractions.",
            exampleLatex: "\\frac{8}{15} \\times \\frac{9}{16} = \\frac{8 \\div 8}{15 \\div 3} \\times \\frac{9 \\div 3}{16 \\div 8} = \\frac{1}{5} \\times \\frac{3}{2}",
          },
          {
            term: "Simplest Form (Lowest Terms)",
            meaning: "A fraction where the numerator and denominator share no common factors other than 1.",
            exampleLatex: "\\frac{3}{10} \\text{ is in simplest form}",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Two-Way Cross-Cancellation",
            questionLatex: "\\frac{8}{15} \\times \\frac{9}{16}",
            answerLatex: "\\frac{3}{10}",
            steps: [
              {
                title: "Step 1: Cancel the first diagonal pair (8 and 16) by their GCF of 8",
                latex: "\\frac{8 \\div 8}{15} \\times \\frac{9}{16 \\div 8} = \\frac{1}{15} \\times \\frac{9}{2}",
                explanation: "Look diagonally at numerator 8 and denominator 16. Both are divisible by 8: 8 ÷ 8 = 1 and 16 ÷ 8 = 2.",
              },
              {
                title: "Step 2: Cancel the second diagonal pair (9 and 15) by their GCF of 3",
                latex: "\\frac{1}{15 \\div 3} \\times \\frac{9 \\div 3}{2} = \\frac{1}{5} \\times \\frac{3}{2}",
                explanation: "Look at the other diagonal: numerator 9 and denominator 15 are both divisible by 3 (9 ÷ 3 = 3 and 15 ÷ 3 = 5).",
              },
              {
                title: "Step 3: Multiply the simplified numerators and denominators straight across",
                latex: "\\frac{1 \\times 3}{5 \\times 2} = \\frac{3}{10}",
                explanation: "Multiply the remaining small numbers: 1 × 3 = 3 on top and 5 × 2 = 10 on the bottom. Because we simplified first, 3/10 is automatically in lowest terms!",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Reciprocal (Multiplicative Inverse)",
            meaning: "A fraction flipped upside down so the numerator and denominator swap places. The product of a fraction and its reciprocal is 1.",
            exampleLatex: "\\text{Reciprocal of } \\frac{6}{7} \\text{ is } \\frac{7}{6}",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Multiply by the Reciprocal and Cross-Cancel",
            questionLatex: "\\frac{9}{14} \\div \\frac{6}{7}",
            answerLatex: "\\frac{3}{4}",
            steps: [
              {
                title: "Step 1: Keep, Change, Flip (Multiply by the reciprocal)",
                latex: "\\frac{9}{14} \\div \\frac{6}{7} = \\frac{9}{14} \\times \\frac{7}{6}",
                explanation: "Dividing by a fraction is the same as multiplying by its reciprocal. Keep the first fraction (9/14), change ÷ to ×, and flip the second fraction (6/7 becomes 7/6).",
              },
              {
                title: "Step 2: Cross-cancel common factors diagonally",
                latex: "\\frac{9 \\div 3}{14 \\div 7} \\times \\frac{7 \\div 7}{6 \\div 3} = \\frac{3}{2} \\times \\frac{1}{2}",
                explanation: "Divide 9 and 6 by their common factor 3 (leaving 3 and 2), and divide 7 and 14 by their common factor 7 (leaving 1 and 2).",
              },
              {
                title: "Step 3: Multiply straight across",
                latex: "\\frac{3 \\times 1}{2 \\times 2} = \\frac{3}{4}",
                explanation: "Multiply the simplified numerators (3 × 1 = 3) and denominators (2 × 2 = 4) to get 3/4.",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Decimal Places",
            meaning: "The number of digits to the right of the decimal point.",
            exampleLatex: "0.06 \\text{ has } 2 \\text{ decimal places; } 0.8 \\text{ has } 1 \\text{ decimal place}",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Multiplying Two Decimals",
            questionLatex: "0.06 \\times 0.8",
            answerLatex: "0.048",
            steps: [
              {
                title: "Step 1: Ignore the decimal points and multiply as whole numbers",
                latex: "6 \\times 8 = 48",
                explanation: "Temporarily remove the decimal points from 0.06 and 0.8, leaving the whole numbers 6 and 8. Multiply 6 × 8 = 48.",
              },
              {
                title: "Step 2: Count the total number of decimal places in both original numbers",
                latex: "\\underbrace{0.06}_{2\\text{ places}} \\times \\underbrace{0.8}_{1\\text{ place}} \\implies 2 + 1 = 3\\text{ decimal places}",
                explanation: "0.06 has 2 digits after the decimal point, and 0.8 has 1 digit after the decimal point. Together, the answer must have 2 + 1 = 3 decimal places.",
              },
              {
                title: "Step 3: Shift the decimal point 3 places to the left (add a placeholder zero)",
                latex: "48. \\xrightarrow{\\text{shift 3 places left}} 0.048",
                explanation: "Starting from 48., moving the decimal 3 places to the left requires placing a zero in front of the 4, giving 0.048.",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Dividend & Divisor",
            meaning: "In a ÷ b, the first number (a) is the dividend (number being divided) and the second number (b) is the divisor.",
            exampleLatex: "\\text{In } 4.8 \\div 0.12, \\; 4.8 \\text{ is the dividend and } 0.12 \\text{ is the divisor}",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Shifting the Decimal Point in Both Numbers",
            questionLatex: "4.8 \\div 0.12",
            answerLatex: "40",
            steps: [
              {
                title: "Step 1: Count decimal places in the divisor (0.12) to make it a whole number",
                latex: "0.12 \\times 100 = 12 \\quad (\\text{shift 2 places right})",
                explanation: "Dividing is much easier when the divisor (second number) is a whole number. Since 0.12 has 2 decimal places, we shift its decimal point 2 places to the right (multiply by 100) to get 12.",
              },
              {
                title: "Step 2: Shift the decimal point in the dividend (4.8) by the exact same 2 places",
                latex: "4.8 \\times 100 = 480 \\implies 4.8 \\div 0.12 = 480 \\div 12",
                explanation: "To keep the division answer unchanged, we must also shift 4.8 two places to the right (adding one zero at the end to make 480).",
              },
              {
                title: "Step 3: Divide the whole numbers",
                latex: "480 \\div 12 = 40",
                explanation: "Since 48 ÷ 12 = 4, it follows that 480 ÷ 12 = 40.",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Equivalent Fraction",
            meaning: "Fractions that have different numerators and denominators but represent the exact same value.",
            exampleLatex: "\\frac{17}{25} = \\frac{68}{100}",
          },
          {
            term: "Power of 10 Denominator",
            meaning: "A denominator such as 10 (tenths), 100 (hundredths), or 1000 (thousandths) that can be written directly as a decimal.",
            exampleLatex: "\\frac{68}{100} = 0.68",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Scaling the Denominator to 100",
            questionLatex: "\\text{Convert } \\frac{17}{25} \\text{ to a decimal}",
            answerLatex: "0.68",
            steps: [
              {
                title: "Step 1: Find the multiplier that turns the denominator (25) into 100",
                latex: "25 \\times 4 = 100",
                explanation: "Instead of doing long division (17 ÷ 25), notice that 25 divides evenly into 100 when multiplied by 4.",
              },
              {
                title: "Step 2: Multiply both the numerator and denominator by 4",
                latex: "\\frac{17 \\times 4}{25 \\times 4} = \\frac{68}{100}",
                explanation: "Multiplying top and bottom by 4 creates the equivalent fraction 68/100 (68 hundredths).",
              },
              {
                title: "Step 3: Write the hundredths fraction directly as a decimal",
                latex: "\\frac{68}{100} = 0.68",
                explanation: "Dividing 68 by 100 shifts the decimal point 2 places to the left, giving 0.68.",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Ratio",
            meaning: "A comparison of two quantities by division, written as a:b or a/b.",
            exampleLatex: "\\frac{12}{15} = \\frac{4}{5}",
          },
          {
            term: "Proportion",
            meaning: "An equation stating that two ratios are equal.",
            exampleLatex: "\\frac{4}{5} = \\frac{28}{35}",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Reduce First, Then Scale Across",
            questionLatex: "\\frac{12}{15} = \\frac{x}{35}",
            answerLatex: "28",
            steps: [
              {
                title: "Step 1: Simplify the known ratio (12/15) by dividing by its GCF of 3",
                latex: "\\frac{12 \\div 3}{15 \\div 3} = \\frac{4}{5} \\implies \\frac{4}{5} = \\frac{x}{35}",
                explanation: "Instead of cross-multiplying large numbers (12 × 35), reduce 12/15 to simplest form first by dividing top and bottom by 3.",
              },
              {
                title: "Step 2: Find the scale factor between the denominators (5 to 35)",
                latex: "35 \\div 5 = 7 \\quad (\\text{scale factor is } \\times 7)",
                explanation: "Compare the new denominator 5 to the target denominator 35. Since 5 × 7 = 35, the scale factor is 7.",
              },
              {
                title: "Step 3: Multiply the simplified numerator (4) by the same scale factor (7)",
                latex: "x = 4 \\times 7 = 28",
                explanation: "To keep the ratios equal, multiply the top number 4 by 7, which gives x = 28.",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Percent (%)",
            meaning: "Parts per hundred (out of 100). For example, 15% means 15/100.",
            exampleLatex: "10\\% = \\frac{1}{10}, \\quad 25\\% = \\frac{1}{4}, \\quad 50\\% = \\frac{1}{2}",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Using 10% + 5% Mental Decomposition",
            questionLatex: "15\\% \\text{ of } 80",
            answerLatex: "12",
            steps: [
              {
                title: "Step 1: Break 15% into friendly mental blocks (10% + 5%)",
                latex: "15\\% \\text{ of } 80 = (10\\% \\text{ of } 80) + (5\\% \\text{ of } 80)",
                explanation: "15% is made of 10% plus 5%, which are both very easy to calculate mentally.",
              },
              {
                title: "Step 2: Find 10% of 80 by dividing by 10",
                latex: "10\\% \\text{ of } 80 = 80 \\div 10 = 8",
                explanation: "To find 10% of any number, simply divide it by 10 (or move the decimal point 1 place to the left).",
              },
              {
                title: "Step 3: Find 5% of 80 by taking half of the 10% value",
                latex: "5\\% \\text{ of } 80 = 8 \\div 2 = 4",
                explanation: "Because 5% is half of 10%, half of 8 is 4.",
              },
              {
                title: "Step 4: Add the 10% part and the 5% part together",
                latex: "8 + 4 = 12",
                explanation: "Add 8 + 4 = 12. So 15% of 80 is 12.",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Part, Whole & Percent",
            meaning: "In '30% of N = 27', 30% is the percent, 27 is the part, and N is the whole (100%).",
            exampleLatex: "100\\% \\text{ of } N = N",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Unitary 10% Method",
            questionLatex: "30\\% \\text{ of } N = 27",
            answerLatex: "90",
            steps: [
              {
                title: "Step 1: Express 30% as a multiple of 10%",
                latex: "30\\% = 3 \\times 10\\%",
                explanation: "Think of 30% as 3 blocks of 10%. If 3 blocks equal 27, we can easily find the value of 1 block (10%).",
              },
              {
                title: "Step 2: Divide both sides by 3 to find 10% of N",
                latex: "10\\% \\text{ of } N = 27 \\div 3 = 9",
                explanation: "Dividing 27 by 3 tells us that 10% of N is 9.",
              },
              {
                title: "Step 3: Multiply by 10 to scale from 10% up to 100% (the whole N)",
                latex: "100\\% \\text{ of } N = 9 \\times 10 = 90 \\implies N = 90",
                explanation: "Since the whole number N is 100% (which is 10 × 10%), multiply 9 × 10 to get N = 90.",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Integers",
            meaning: "All positive and negative whole numbers, including zero (..., −3, −2, −1, 0, 1, 2, 3, ...).",
            exampleLatex: "-14, \\; -6, \\; 0, \\; 9",
          },
          {
            term: "Additive Inverse (Opposite)",
            meaning: "Subtracting a negative number is the same as adding its positive opposite: −(−a) = +a.",
            exampleLatex: "-(-9) = +9",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Clearing Double Signs and Grouping",
            questionLatex: "-14 - (-9) + (-6)",
            answerLatex: "-11",
            steps: [
              {
                title: "Step 1: Rewrite double signs to remove parentheses",
                latex: "-14 - (-9) + (-6) = -14 + 9 - 6",
                explanation: "Subtracting a negative is the same as adding a positive: −(−9) becomes +9. Adding a negative is the same as subtracting: +(−6) becomes −6.",
              },
              {
                title: "Step 2: Group the numbers with the same sign (both negatives) together",
                latex: "(-14 - 6) + 9 = -20 + 9",
                explanation: "Combine −14 and −6 first by adding their magnitudes (14 + 6 = 20) and keeping the negative sign to get −20.",
              },
              {
                title: "Step 3: Combine −20 and +9 by taking the difference",
                latex: "-20 + 9 = -(20 - 9) = -11",
                explanation: "When adding numbers with opposite signs (−20 and +9), subtract the smaller absolute value from the larger (20 − 9 = 11) and keep the sign of the larger (−20), giving −11.",
              },
            ],
          },
        ],
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
        exampleLatex: "2x^2 - 5y \\;(x=3, y=-2) = 28",
        definitions: [
          {
            term: "Variable",
            meaning: "A letter (such as x or y) used to represent a number in an expression or equation.",
            exampleLatex: "x = 3, \\quad y = -2",
          },
          {
            term: "Substitution",
            meaning: "Replacing each variable in an algebraic expression with its given numerical value.",
            exampleLatex: "2x^2 - 5y \\to 2(3)^2 - 5(-2)",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Substituting Positive and Negative Values",
            questionLatex: "\\text{Evaluate } 2x^2 - 5y \\text{ when } x = 3, \\; y = -2",
            answerLatex: "28",
            steps: [
              {
                title: "Step 1: Replace each variable with its value inside parentheses",
                latex: "2(3)^2 - 5(-2)",
                explanation: "Substitute 3 for x and −2 for y. Wrapping substituted numbers (especially negative ones like −2) in parentheses prevents sign errors.",
              },
              {
                title: "Step 2: Evaluate the exponent first (PEMDAS)",
                latex: "2(9) - 5(-2)",
                explanation: "Compute 3² = 9 before multiplying by 2.",
              },
              {
                title: "Step 3: Perform both multiplications (watch the negative signs)",
                latex: "18 + 10",
                explanation: "Multiply 2 × 9 = 18. Next, multiplying −5 by −2 gives +10 because a negative times a negative is positive.",
              },
              {
                title: "Step 4: Add the two results",
                latex: "18 + 10 = 28",
                explanation: "Add 18 + 10 to get 28.",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Distributive Property",
            meaning: "Multiplying a number outside parentheses by every term inside the parentheses: a(b + c) = ab + ac.",
            exampleLatex: "3(2x + 4) = 3(2x) + 3(4) = 6x + 12",
          },
          {
            term: "Like Terms",
            meaning: "Terms that have the exact same variable and exponent (such as 6x and −2x, or constants 12 and −5).",
            exampleLatex: "6x - 2x = 4x",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Distribute and Combine Like Terms",
            questionLatex: "3(2x + 4) - 2x - 5",
            answerLatex: "4x + 7",
            steps: [
              {
                title: "Step 1: Apply the Distributive Property to clear the parentheses",
                latex: "3(2x) + 3(4) - 2x - 5 = 6x + 12 - 2x - 5",
                explanation: "Multiply the outside number 3 by BOTH terms inside the parentheses: 3 × 2x = 6x and 3 × 4 = 12.",
              },
              {
                title: "Step 2: Group the variable terms (x-terms) and constant terms together",
                latex: "(6x - 2x) + (12 - 5)",
                explanation: "Bring the like terms next to each other, making sure to carry the sign in front of each term (−2x and −5).",
              },
              {
                title: "Step 3: Combine each group of like terms",
                latex: "4x + 7",
                explanation: "Subtract the x-coefficients (6 − 2 = 4, giving 4x) and subtract the constants (12 − 5 = 7) to get 4x + 7.",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Equation",
            meaning: "A mathematical statement that two expressions are equal, separated by an '=' sign.",
            exampleLatex: "\\frac{3}{4}x = 18",
          },
          {
            term: "Coefficient",
            meaning: "The number multiplied by a variable. In (3/4)x, the coefficient is 3/4.",
            exampleLatex: "\\text{To clear } \\frac{3}{4}, \\text{ multiply both sides by } \\frac{4}{3}",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Solving a Fractional Coefficient Equation",
            questionLatex: "\\frac{3}{4}x = 18",
            answerLatex: "24",
            steps: [
              {
                title: "Step 1: Multiply both sides of the equation by the reciprocal (4/3)",
                latex: "\\left(\\frac{4}{3}\\right) \\cdot \\frac{3}{4}x = 18 \\times \\frac{4}{3} \\implies x = 18 \\times \\frac{4}{3}",
                explanation: "Because (4/3) × (3/4) = 1, multiplying both sides by the reciprocal 4/3 isolates x on the left side.",
              },
              {
                title: "Step 2: Divide 18 by the denominator 3 first (Cross-Cancel)",
                latex: "x = (18 \\div 3) \\times 4 = 6 \\times 4",
                explanation: "Instead of multiplying 18 × 4 = 72 first, divide 18 by 3 to get 6. This keeps the arithmetic small.",
              },
              {
                title: "Step 3: Multiply the remaining numbers",
                latex: "x = 6 \\times 4 = 24",
                explanation: "Multiply 6 × 4 = 24. Check: (3/4) of 24 is 18!",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Constant Term",
            meaning: "A fixed number in an equation that has no variable attached to it (such as −13 or 27).",
            exampleLatex: "5x - 13 = 27 \\quad (-13 \\text{ and } 27 \\text{ are constants})",
          },
          {
            term: "Inverse Operations",
            meaning: "Opposite operations that undo each other: addition undoes subtraction, and division undoes multiplication.",
            exampleLatex: "5x - 13 = 27 \\implies 5x = 27 + 13",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Solving a Two-Step Equation",
            questionLatex: "5x - 13 = 27",
            answerLatex: "8",
            steps: [
              {
                title: "Step 1: Undo subtraction by adding 13 to both sides",
                latex: "5x - 13 + 13 = 27 + 13",
                explanation: "Our first goal is to get the variable term (5x) by itself. Since 13 is subtracted from 5x, we do the inverse operation and add 13 to both sides.",
              },
              {
                title: "Step 2: Simplify both sides of the equation",
                latex: "5x = 40",
                explanation: "On the left, −13 + 13 cancels to 0, leaving 5x. On the right, 27 + 13 = 40.",
              },
              {
                title: "Step 3: Undo multiplication by dividing both sides by the coefficient 5",
                latex: "x = \\frac{40}{5} = 8",
                explanation: "Since x is multiplied by 5, divide both sides by 5 to isolate x: 40 ÷ 5 = 8.",
              },
            ],
          },
        ],
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
        definitions: [
          {
            term: "Area of a Triangle",
            meaning: "Half the product of its base (b) and perpendicular height (h).",
            exampleLatex: "A = \\frac{1}{2} \\times b \\times h",
          },
          {
            term: "Area of a Trapezoid",
            meaning: "Half the sum of the two parallel bases (b₁ + b₂) multiplied by the height (h).",
            exampleLatex: "A = \\frac{1}{2}(b_1 + b_2) \\times h",
          },
        ],
        workedExamples: [
          {
            title: "Example 1: Triangle Area (Halving the Even Dimension First)",
            questionLatex: "\\text{Find the area of a triangle with base } b = 14\\text{ cm and height } h = 9\\text{ cm}",
            answerLatex: "63\\text{ cm}^2",
            steps: [
              {
                title: "Step 1: Substitute the base (14) and height (9) into the triangle area formula",
                latex: "A = \\frac{1}{2} \\times b \\times h = \\frac{1}{2} \\times 14 \\times 9",
                explanation: "Write the formula A = ½ × base × height and plug in b = 14 and h = 9.",
              },
              {
                title: "Step 2: Take half of the even number (14) first",
                latex: "A = (14 \\div 2) \\times 9 = 7 \\times 9",
                explanation: "Instead of multiplying 14 × 9 = 126 and then dividing by 2, take half of 14 first (14 ÷ 2 = 7). This turns the problem into a single-digit multiplication!",
              },
              {
                title: "Step 3: Multiply by the height to get the final area",
                latex: "A = 7 \\times 9 = 63\\text{ cm}^2",
                explanation: "Multiply 7 × 9 = 63 square centimeters.",
              },
            ],
          },
        ],
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
            title: "Step 1: Subtract the smaller number from the larger number",
            latex: `${b} - ${a} = ${diff}`,
            explanation: `A key rule of number theory is that any common factor of ${a} and ${b} must also divide their difference (${diff}).`,
          },
          {
            title: `Step 2: Factor both numbers using the greatest factor of ${diff} that divides them`,
            latex: `${a} = ${baseGcf} \\times ${m1}, \\quad ${b} = ${baseGcf} \\times ${m2}`,
            explanation: `Check the factors of ${diff}: ${baseGcf} divides evenly into ${a} (${m1} times) and into ${b} (${m2} times).`,
          },
          {
            title: "Step 3: State the Greatest Common Factor",
            latex: `\\text{GCF}(${a},\\, ${b}) = ${baseGcf}`,
            explanation: `Since the remaining factors ${m1} and ${m2} share no common factors other than 1, ${baseGcf} is the Greatest Common Factor.`,
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
            title: `Step 1: Find the Greatest Common Factor (GCF) of ${a} and ${b}`,
            latex: `\\text{GCF}(${a},\\, ${b}) = ${baseGcf}`,
            explanation: `Both ${a} (${baseGcf} × ${m1}) and ${b} (${baseGcf} × ${m2}) share a greatest common factor of ${baseGcf}.`,
          },
          {
            title: `Step 2: Divide the first number (${a}) by the GCF (${baseGcf})`,
            latex: `${a} \\div ${baseGcf} = ${m1}`,
            explanation: `Dividing by the GCF first removes the overlapping factor and keeps the arithmetic small.`,
          },
          {
            title: `Step 3: Multiply that result (${m1}) by the second number (${b})`,
            latex: `\\text{LCM}(${a},\\, ${b}) = ${m1} \\times ${b} = ${ans}`,
            explanation: `Multiply ${m1} × ${b} = ${ans}. Both ${a} and ${b} divide evenly into ${ans}.`,
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
              title: "Step 1: Simplify inside the Parentheses first (P)",
              latex: `${base}^{${exp}} + ${mult} \\times (${p1} - ${p2}) = ${base}^{${exp}} + ${mult} \\times ${parenDiff}`,
              explanation: `Following PEMDAS, start inside the parentheses: ${p1} − ${p2} = ${parenDiff}.`,
            },
            {
              title: "Step 2: Evaluate the Exponent (E)",
              latex: `${base}^{${exp}} + ${mult} \\times ${parenDiff} = ${powVal} + ${mult} \\times ${parenDiff}`,
              explanation: `Compute the power ${base}^${exp} = ${powVal}.`,
            },
            {
              title: "Step 3: Perform Multiplication before Addition (M)",
              latex: `${powVal} + (${mult} \\times ${parenDiff}) = ${powVal} + ${prod}`,
              explanation: `Multiply ${mult} × ${parenDiff} = ${prod} before adding ${powVal}.`,
            },
            {
              title: "Step 4: Add the two values (A)",
              latex: `${powVal} + ${prod} = ${ans}`,
              explanation: `Add ${powVal} + ${prod} = ${ans}.`,
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
              title: "Step 1: Simplify inside the Parentheses (P)",
              latex: `${mult} \\times (${a} - ${b})^2 + ${addend} = ${mult} \\times (${diff})^2 + ${addend}`,
              explanation: `Subtract inside the parentheses first: ${a} − ${b} = ${diff}.`,
            },
            {
              title: "Step 2: Apply the Exponent to the parentheses result (E)",
              latex: `${mult} \\times (${diff})^2 + ${addend} = ${mult} \\times ${sq} + ${addend}`,
              explanation: `Square ${diff}: ${diff} × ${diff} = ${sq}.`,
            },
            {
              title: "Step 3: Multiply before adding (M)",
              latex: `${mult * sq} + ${addend}`,
              explanation: `Multiply ${mult} × ${sq} = ${mult * sq}.`,
            },
            {
              title: "Step 4: Add the final constant (A)",
              latex: `${mult * sq} + ${addend} = ${ans}`,
              explanation: `Add ${mult * sq} + ${addend} = ${ans}.`,
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
              title: `Step 1: Evaluate the first square (${b1}²)`,
              latex: `${b1}^2 = ${b1} \\times ${b1} = ${sq1}`,
              explanation: `Multiply the base ${b1} by itself to get ${sq1}.`,
            },
            {
              title: `Step 2: Evaluate the second square (${b2}²)`,
              latex: `${b2}^2 = ${b2} \\times ${b2} = ${sq2}`,
              explanation: `Multiply the base ${b2} by itself to get ${sq2}.`,
            },
            {
              title: "Step 3: Subtract the second square from the first",
              latex: `${sq1} - ${sq2} = ${ans}`,
              explanation: `Subtract ${sq1} − ${sq2} = ${ans}. (Bonus check: (${b1} + ${b2})(${b1} − ${b2}) = ${sum} × ${diff} = ${ans}.)`,
            },
          ],
        };
      }
    }

    // ------------------------------------------------------------------------
    // UNIT 2: FRACTIONS
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
            title: `Step 1: Cross-cancel the first diagonal pair (${num1} and ${den2}) by ${gDiag1}`,
            latex: `\\frac{${num1} \\div ${gDiag1}}{${den1}} \\times \\frac{${num2}}{${den2} \\div ${gDiag1}} = \\frac{${num1 / gDiag1}}{${den1}} \\times \\frac{${num2}}{${den2 / gDiag1}}`,
            explanation: `Divide numerator ${num1} and diagonal denominator ${den2} by their Greatest Common Factor (${gDiag1}), leaving ${num1 / gDiag1} and ${den2 / gDiag1}.`,
          },
          {
            title: `Step 2: Cross-cancel the second diagonal pair (${num2} and ${den1}) by ${gDiag2}`,
            latex: `\\frac{${num1 / gDiag1}}{${den1} \\div ${gDiag2}} \\times \\frac{${num2} \\div ${gDiag2}}{${den2 / gDiag1}} = \\frac{${num1 / gDiag1}}{${den1 / gDiag2}} \\times \\frac{${num2 / gDiag2}}{${den2 / gDiag1}}`,
            explanation: `Divide numerator ${num2} and diagonal denominator ${den1} by their Greatest Common Factor (${gDiag2}), leaving ${num2 / gDiag2} and ${den1 / gDiag2}.`,
          },
          {
            title: "Step 3: Multiply the simplified numerators and denominators straight across",
            latex: `\\frac{${num1 / gDiag1} \\times ${num2 / gDiag2}}{${den1 / gDiag2} \\times ${den2 / gDiag1}} = ${formatFractionLatex(sNum, sDen)}`,
            explanation: `Multiply the reduced top numbers (${num1 / gDiag1} × ${num2 / gDiag2}) and bottom numbers (${den1 / gDiag2} × ${den2 / gDiag1}) to get the answer in simplest form.`,
          },
        ],
      };
    }

    case "g6-frac-div": {
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
            title: "Step 1: Keep, Change, Flip (Multiply by the reciprocal of the divisor)",
            latex: `\\frac{${num1}}{${den1}} \\div \\frac{${divNum}}{${divDen}} = \\frac{${num1}}{${den1}} \\times \\frac{${divDen}}{${divNum}}`,
            explanation: `Keep the first fraction (${num1}/${den1}), change ÷ to ×, and flip the second fraction (${divNum}/${divDen} becomes ${divDen}/${divNum}).`,
          },
          {
            title: "Step 2: Cross-cancel diagonal common factors",
            latex: `\\frac{${num1} \\div ${gDiag1}}{${den1} \\div ${gDiag2}} \\times \\frac{${divDen} \\div ${gDiag2}}{${divNum} \\div ${gDiag1}} = \\frac{${num1 / gDiag1}}{${den1 / gDiag2}} \\times \\frac{${divDen / gDiag2}}{${divNum / gDiag1}}`,
            explanation: `Cancel ${num1} and ${divNum} by their GCF of ${gDiag1}, and cancel ${divDen} and ${den1} by their GCF of ${gDiag2}.`,
          },
          {
            title: "Step 3: Multiply straight across",
            latex: `\\frac{${num1 / gDiag1} \\times ${divDen / gDiag2}}{${den1 / gDiag2} \\times ${divNum / gDiag1}} = ${formatFractionLatex(sNum, sDen)}`,
            explanation: `Multiply the simplified numerators and denominators to get the final answer.`,
          },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // UNIT 3: DECIMALS & CONVERSIONS
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
            title: "Step 1: Ignore the decimal points and multiply as whole numbers",
            latex: `${w1} \\times ${w2} = ${wholeProd}`,
            explanation: `Temporarily remove the decimal points so ${d1} becomes ${w1} and ${d2} becomes ${w2}. Multiply ${w1} × ${w2} = ${wholeProd}.`,
          },
          {
            title: "Step 2: Count the total decimal places in both factors",
            latex: `\\underbrace{${d1}}_{${places1}\\text{ place(s)}} \\times \\underbrace{${d2}}_{${places2}\\text{ place(s)}} \\implies ${places1} + ${places2} = ${totalPlaces}\\text{ decimal places}`,
            explanation: `${d1} has ${places1} digit(s) after the decimal and ${d2} has ${places2} digit(s) after the decimal, giving ${totalPlaces} decimal places in total.`,
          },
          {
            title: `Step 3: Shift the decimal point ${totalPlaces} places to the left`,
            latex: `${wholeProd}. \\xrightarrow{\\text{shift ${totalPlaces} places left}} ${ansStr}`,
            explanation: `Move the decimal point in ${wholeProd} left by ${totalPlaces} places to get ${ansStr}.`,
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
            title: `Step 1: Make the divisor (${divisorDec}) a whole number by multiplying by ${shiftFactor}`,
            latex: `${divisorDec} \\times ${shiftFactor} = ${divisorWhole}`,
            explanation: `Shift the decimal point ${divisorPlaces} place${divisorPlaces > 1 ? "s" : ""} to the right in ${divisorDec} so we can divide by the whole number ${divisorWhole}.`,
          },
          {
            title: `Step 2: Shift the dividend (${dividendDec}) by the exact same ${divisorPlaces} place${divisorPlaces > 1 ? "s" : ""} right`,
            latex: `${dividendDec} \\times ${shiftFactor} = ${shiftedDividend} \\implies ${dividendDec} \\div ${divisorDec} = ${shiftedDividend} \\div ${divisorWhole}`,
            explanation: `Multiplying both dividend and divisor by ${shiftFactor} keeps the division value unchanged.`,
          },
          {
            title: "Step 3: Divide the whole numbers",
            latex: `${shiftedDividend} \\div ${divisorWhole} = ${quotient}`,
            explanation: `Divide ${shiftedDividend} by ${divisorWhole} to get ${quotient}.`,
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
            title: `Step 1: Find the multiplier that scales the denominator (${cfg.den}) to ${cfg.targetDen}`,
            latex: `${cfg.den} \\times ${cfg.mult} = ${cfg.targetDen}`,
            explanation: `Instead of using long division, notice that multiplying ${cfg.den} by ${cfg.mult} produces a power of 10 (${cfg.targetDen}).`,
          },
          {
            title: `Step 2: Multiply both numerator and denominator by ${cfg.mult}`,
            latex: `\\frac{${num} \\times ${cfg.mult}}{${cfg.den} \\times ${cfg.mult}} = \\frac{${scaledNum}}{${cfg.targetDen}}`,
            explanation: `Multiply the top number ${num} by ${cfg.mult} to get the equivalent fraction ${scaledNum}/${cfg.targetDen}.`,
          },
          {
            title: "Step 3: Write the power-of-10 fraction directly as a decimal",
            latex: `\\frac{${scaledNum}}{${cfg.targetDen}} = ${ansStr}`,
            explanation: `Dividing ${scaledNum} by ${cfg.targetDen} gives the decimal ${ansStr}.`,
          },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // UNIT 4: RATIOS, UNIT RATES & PERCENTAGES
    // ------------------------------------------------------------------------
    case "g6-unit-rate": {
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
            title: `Step 1: Reduce the known ratio (${a}/${b}) by dividing by its GCF of ${k1}`,
            latex: `\\frac{${a} \\div ${k1}}{${b} \\div ${k1}} = \\frac{${sA}}{${sB}} \\implies \\frac{${sA}}{${sB}} = \\frac{x}{${d}}`,
            explanation: `Simplifying ${a}/${b} to ${sA}/${sB} first avoids large cross-multiplication.`,
          },
          {
            title: `Step 2: Find the scale factor from denominator ${sB} to ${d}`,
            latex: `${d} \\div ${sB} = ${k2} \\quad (\\text{scale factor is } \\times ${k2})`,
            explanation: `Since ${sB} × ${k2} = ${d}, the second fraction is scaled up by a factor of ${k2}.`,
          },
          {
            title: `Step 3: Multiply the simplified numerator (${sA}) by ${k2}`,
            latex: `x = ${sA} \\times ${k2} = ${x}`,
            explanation: `Multiply ${sA} by ${k2} to keep the ratios equivalent, giving x = ${x}.`,
          },
        ],
      };
    }

    case "g6-percent-of": {
      const mode = pickOne(["15pct", "35pct", "benchmark"]);
      if (mode === "15pct") {
        const whole = randInt(2, 16) * 20;
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
              title: "Step 1: Find 10% of the number by dividing by 10",
              latex: `10\\% \\text{ of } ${whole} = ${whole} \\div 10 = ${tenPct}`,
              explanation: `Dividing ${whole} by 10 gives 10% = ${tenPct}.`,
            },
            {
              title: "Step 2: Find 5% by taking half of the 10% value",
              latex: `5\\% \\text{ of } ${whole} = ${tenPct} \\div 2 = ${fivePct}`,
              explanation: `Since 5% is half of 10%, half of ${tenPct} is ${fivePct}.`,
            },
            {
              title: "Step 3: Add the 10% part and the 5% part together",
              latex: `15\\% \\text{ of } ${whole} = ${tenPct} + ${fivePct} = ${ans}`,
              explanation: `Add ${tenPct} + ${fivePct} = ${ans}.`,
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
              title: "Step 1: Find 10% by dividing by 10, then triple it to get 30%",
              latex: `10\\% \\text{ of } ${whole} = ${tenPct} \\implies 30\\% = 3 \\times ${tenPct} = ${thirtyPct}`,
              explanation: `10% of ${whole} is ${tenPct}, so 30% is 3 × ${tenPct} = ${thirtyPct}.`,
            },
            {
              title: "Step 2: Find 5% by taking half of 10%",
              latex: `5\\% \\text{ of } ${whole} = ${tenPct} \\div 2 = ${fivePct}`,
              explanation: `Half of ${tenPct} is ${fivePct}.`,
            },
            {
              title: "Step 3: Add 30% and 5% to get 35%",
              latex: `35\\% = ${thirtyPct} + ${fivePct} = ${ans}`,
              explanation: `Adding ${thirtyPct} + ${fivePct} gives ${ans}.`,
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
              title: `Step 1: Convert ${b.pct}% into its simplest benchmark fraction (${b.num}/${b.den})`,
              latex: `${b.pct}\\% \\text{ of } ${whole} = \\frac{${b.num}}{${b.den}} \\times ${whole}`,
              explanation: `Since ${b.pct}/100 reduces to ${b.num}/${b.den}, rewrite the percentage problem as a fraction of ${whole}.`,
            },
            {
              title: `Step 2: Divide ${whole} by the denominator (${b.den}) first`,
              latex: `${whole} \\div ${b.den} = ${unitPart}`,
              explanation: `Dividing ${whole} into ${b.den} equal parts gives ${unitPart} per part.`,
            },
            {
              title: `Step 3: Multiply by the numerator (${b.num})`,
              latex: `${unitPart} \\times ${b.num} = ${ans}`,
              explanation: `Multiply ${unitPart} × ${b.num} = ${ans}.`,
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
            title: `Step 1: Express ${pct}% as ${pctTens} blocks of 10%`,
            latex: `${pct}\\% = ${pctTens} \\times 10\\%`,
            explanation: `Think of ${pct}% as ${pctTens} equal units of 10%.`,
          },
          {
            title: `Step 2: Divide ${part} by ${pctTens} to find 10% of N`,
            latex: `10\\% \\text{ of } N = ${part} \\div ${pctTens} = ${tenPctValue}`,
            explanation: `Dividing the part (${part}) by ${pctTens} tells us that 10% of N is ${tenPctValue}.`,
          },
          {
            title: "Step 3: Multiply by 10 to scale from 10% up to 100% (the whole N)",
            latex: `N = ${tenPctValue} \\times 10 = ${whole}`,
            explanation: `Since 100% is 10 times 10%, multiply ${tenPctValue} × 10 to get N = ${whole}.`,
          },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // UNIT 5: INTEGERS & ALGEBRAIC EXPRESSIONS
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
            title: "Step 1: Rewrite double signs to remove parentheses",
            latex: `-${a} - (-${b}) + (-${c}) = -${a} + ${b} - ${c}`,
            explanation: `Subtracting a negative −(−${b}) becomes +${b}, and adding a negative +(−${c}) becomes −${c}.`,
          },
          {
            title: "Step 2: Group and combine the negative numbers first",
            latex: `(-${a} - ${c}) + ${b} = -${a + c} + ${b}`,
            explanation: `Combine −${a} and −${c} by adding their magnitudes (${a} + ${c} = ${a + c}) and keeping the negative sign (−${a + c}).`,
          },
          {
            title: `Step 3: Add +${b} to −${a + c}`,
            latex: `-${a + c} + ${b} = ${ans}`,
            explanation: `Take the difference between ${a + c} and ${b}, keeping the sign of the larger magnitude to get ${ans}.`,
          },
        ],
      };
    }

    case "g6-eval-expr": {
      const a = randInt(2, 4);
      const x = randInt(2, 5);
      const b = randInt(2, 6);
      const y = randInt(-4, -2);
      const xSq = x * x;
      const term1 = a * xSq;
      const term2 = -b * y;
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
            title: "Step 1: Substitute each variable inside parentheses",
            latex: `${a}(${x})^2 - ${b}(${y})`,
            explanation: `Replace x with ${x} and y with ${y}. Wrapping ${y} in parentheses prevents sign mistakes.`,
          },
          {
            title: "Step 2: Evaluate the exponent first (PEMDAS)",
            latex: `${a}(${xSq}) - ${b}(${y})`,
            explanation: `Compute (${x})² = ${xSq} before multiplying by ${a}.`,
          },
          {
            title: "Step 3: Perform both multiplications (watch the negative signs)",
            latex: `${term1} + ${term2}`,
            explanation: `Multiply ${a} × ${xSq} = ${term1}, and multiply −${b} × (${y}) = +${term2} (a negative times a negative is positive).`,
          },
          {
            title: "Step 4: Add the two results",
            latex: `${term1} + ${term2} = ${ans}`,
            explanation: `Add ${term1} + ${term2} = ${ans}.`,
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
            title: `Step 1: Distribute ${k} across every term inside (${a}x + ${b})`,
            latex: `${k}(${a}x) + ${k}(${b}) - ${c}x - ${d} = ${distX}x + ${distConst} - ${c}x - ${d}`,
            explanation: `Multiply ${k} × ${a}x = ${distX}x and ${k} × ${b} = ${distConst}.`,
          },
          {
            title: "Step 2: Group the variable terms (x-terms) and constant terms together",
            latex: `(${distX}x - ${c}x) + (${distConst} - ${d})`,
            explanation: `Bring like terms next to each other while keeping the sign in front of each term.`,
          },
          {
            title: "Step 3: Combine each pair of like terms",
            latex: `${canonical}`,
            explanation: `Combine the x-terms (${distX} − ${c} = ${finalX}) and the constants (${distConst} − ${d} = ${finalConst}) to get ${canonical}.`,
          },
        ],
      };
    }

    // ------------------------------------------------------------------------
    // UNIT 6: LINEAR EQUATIONS & GEOMETRY
    // ------------------------------------------------------------------------
    case "g6-one-step-eq": {
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
            title: `Step 1: Multiply both sides by the reciprocal (${b}/${a})`,
            latex: `\\left(\\frac{${b}}{${a}}\\right) \\cdot \\frac{${a}}{${b}}x = ${rhs} \\times \\frac{${b}}{${a}} \\implies x = ${rhs} \\times \\frac{${b}}{${a}}`,
            explanation: `Multiplying by the reciprocal ${b}/${a} turns the coefficient of x into 1, isolating x.`,
          },
          {
            title: `Step 2: Divide ${rhs} by the denominator ${a} first`,
            latex: `x = (${rhs} \\div ${a}) \\times ${b} = ${k} \\times ${b}`,
            explanation: `Since ${a} divides evenly into ${rhs} (${rhs} ÷ ${a} = ${k}), divide first to keep the numbers small.`,
          },
          {
            title: `Step 3: Multiply ${k} by ${b}`,
            latex: `x = ${k} \\times ${b} = ${ans}`,
            explanation: `Multiply ${k} × ${b} = ${ans}.`,
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
            title: `Step 1: Undo ${isMinus ? "subtraction" : "addition"} by ${isMinus ? "adding" : "subtracting"} ${b} on both sides`,
            latex: `${a}x ${isMinus ? "-" : "+"} ${b} ${isMinus ? "+" : "-"} ${b} = ${c} ${isMinus ? "+" : "-"} ${b}`,
            explanation: `Isolate the variable term (${a}x) first by applying the inverse operation (${isMinus ? `+ ${b}` : `− ${b}`}) to both sides.`,
          },
          {
            title: "Step 2: Simplify both sides of the equation",
            latex: `${a}x = ${a * x}`,
            explanation: `The constant on the left cancels out, and ${c} ${isMinus ? "+" : "−"} ${b} = ${a * x} on the right.`,
          },
          {
            title: `Step 3: Divide both sides by the coefficient ${a}`,
            latex: `x = \\frac{${a * x}}{${a}} = ${x}`,
            explanation: `Divide ${a * x} by ${a} to isolate x = ${x}.`,
          },
        ],
      };
    }

    case "g6-area-volume": {
      const isTriangle = Math.random() < 0.65;
      if (isTriangle) {
        const halfBase = randInt(4, 12);
        const base = halfBase * 2;
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
              title: "Step 1: Substitute base and height into the triangle area formula",
              latex: `A = \\frac{1}{2} \\times b \\times h = \\frac{1}{2} \\times ${base} \\times ${height}`,
              explanation: `Write the triangle area formula A = ½bh with b = ${base} and h = ${height}.`,
            },
            {
              title: `Step 2: Take half of the even base (${base} ÷ 2 = ${halfBase}) first`,
              latex: `A = (${base} \\div 2) \\times ${height} = ${halfBase} \\times ${height}`,
              explanation: `Halving the even number (${base}) before multiplying keeps the arithmetic small.`,
            },
            {
              title: `Step 3: Multiply ${halfBase} by the height (${height})`,
              latex: `A = ${halfBase} \\times ${height} = ${ans}\\text{ cm}^2`,
              explanation: `Multiply ${halfBase} × ${height} = ${ans} cm².`,
            },
          ],
        };
      } else {
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
              title: "Step 1: Add the two parallel bases inside the parentheses",
              latex: `b_1 + b_2 = ${b1} + ${b2} = ${sumBases}`,
              explanation: `In the trapezoid formula A = ½(b₁ + b₂)h, first add the two bases: ${b1} + ${b2} = ${sumBases}.`,
            },
            {
              title: `Step 2: Take half of the even height (${h} ÷ 2 = ${halfH})`,
              latex: `\\frac{1}{2} \\times ${h} = ${halfH}`,
              explanation: `Dividing the even height ${h} by 2 gives ${halfH}.`,
            },
            {
              title: "Step 3: Multiply the sum of the bases by half the height",
              latex: `A = ${sumBases} \\times ${halfH} = ${ans}`,
              explanation: `Multiply ${sumBases} × ${halfH} = ${ans} square units.`,
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
      title: `Step 1: Find the Least Common Denominator (LCD) of ${d1} and ${d2}`,
      latex: `\\text{LCM}(${d1},\\, ${d2}) = ${lcd}`,
      explanation: `Instead of multiplying ${d1} × ${d2} = ${d1 * d2}, use the smallest common multiple of ${d1} and ${d2}, which is ${lcd}.`,
    },
    {
      title: `Step 2: Convert both fractions to denominator ${lcd}`,
      latex: `\\frac{${n1} \\times ${m1}}{${d1} \\times ${m1}} ${op} \\frac{${n2} \\times ${m2}}{${d2} \\times ${m2}} = \\frac{${scaled1}}{${lcd}} ${op} \\frac{${scaled2}}{${lcd}}`,
      explanation: `Multiply the first fraction by ${m1}/${m1} and the second fraction by ${m2}/${m2} so both have denominator ${lcd}.`,
    },
    {
      title: `Step 3: ${isAdd ? "Add" : "Subtract"} the numerators over ${lcd}`,
      latex: `\\frac{${scaled1} ${op} ${scaled2}}{${lcd}} = \\frac{${rawNum}}{${lcd}}`,
      explanation: `Keep the common denominator ${lcd} and ${isAdd ? "add" : "subtract"} the top numbers: ${scaled1} ${op} ${scaled2} = ${rawNum}.`,
    },
  ];

  if (g > 1) {
    steps.push({
      title: `Step 4: Simplify by dividing top and bottom by GCF = ${g}`,
      latex: `\\frac{${rawNum} \\div ${g}}{${lcd} \\div ${g}} = ${formatFractionLatex(sNum, sDen)}`,
      explanation: `Both ${rawNum} and ${lcd} are divisible by ${g}. Divide both by ${g} to write the fraction in simplest form.`,
    });
  }

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

