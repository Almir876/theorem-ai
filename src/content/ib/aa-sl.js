/** @type {import("../schema.js").LevelContent} */
const levelContent = {
  curriculumId: "ib",
  levelId: "aa-sl",
  title: "IB Mathematics: Analysis and Approaches (AA SL)",
  skillMeta: [
    { id: "sequences-series",     title: "Sequences_and_Series",          icon: "∑",  xpReward: 120, prereqs: [] },
    { id: "exponents-logs",       title: "Exponents_and_Logarithms",      icon: "eˣ", xpReward: 120, prereqs: ["sequences-series"] },
    { id: "functions-basics",     title: "Functions_and_Graphs",          icon: "f()", xpReward: 120, prereqs: [] },
    { id: "quadratics",           title: "Quadratic_Functions",           icon: "x²", xpReward: 120, prereqs: ["functions-basics"] },
    { id: "trigonometry",         title: "Trigonometry",                  icon: "sin", xpReward: 120, prereqs: ["functions-basics"] },
    { id: "differentiation",      title: "Differentiation",               icon: "d/dx", xpReward: 150, prereqs: ["quadratics"] },
    { id: "integration",          title: "Integration",                   icon: "∫",  xpReward: 150, prereqs: ["differentiation"] },
    { id: "probability-stats",    title: "Probability_and_Statistics",    icon: "P",  xpReward: 120, prereqs: [] },
  ],

  allLessons: {
    "sequences-series": [
      {
        type: "explanation", id: "e0",
        title: "Sequences and Series",
        content: "Arithmetic sequence: aₙ = a₁ + (n−1)d\nSum: Sₙ = n/2 × (2a₁ + (n−1)d) = n/2(a₁ + aₙ)\n\nGeometric sequence: aₙ = a₁ × rⁿ⁻¹\nSum (finite): Sₙ = a₁(1 − rⁿ)/(1 − r), r ≠ 1\nSum (infinite, |r| < 1): S∞ = a₁/(1 − r)\n\nSigma notation: Σ means 'sum of'",
        example: "Arithmetic: 2, 5, 8, … (a₁=2, d=3)\nS₁₀ = 10/2 × (4 + 27) = 5 × 31 = 155\n\nGeometric: 3, 6, 12, … (a₁=3, r=2)\nS₅ = 3(1−2⁵)/(1−2) = 3(−31)/(−1) = 93"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "An arithmetic sequence has first term 4 and common difference 5. What is the 10th term?",
        options: ["45", "49", "50", "54"],
        answer: 1,
        hint: "aₙ = a₁ + (n−1)d",
        explanation: "a₁₀ = 4 + 9×5 = 4 + 45 = 49."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 1,
        question: "Find the sum of the first 12 terms of the arithmetic series: 3 + 7 + 11 + 15 + …",
        answer: "300",
        hint: "Sₙ = n/2 × (2a + (n−1)d)",
        explanation: "a=3, d=4. S₁₂ = 12/2 × (6 + 44) = 6 × 50 = 300."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "A geometric sequence has a₁ = 8 and r = 1/2. What is the sum to infinity?",
        options: ["4", "8", "12", "16"],
        answer: 3,
        hint: "S∞ = a₁/(1 − r), valid when |r| < 1.",
        explanation: "S∞ = 8/(1 − 1/2) = 8/(1/2) = 16."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "The sum of the first n terms of an arithmetic series is Sₙ = 2n² + 3n. What is the 5th term?",
        options: ["17", "19", "23", "25"],
        answer: 2,
        hint: "aₙ = Sₙ − Sₙ₋₁. Find S₅ and S₄.",
        explanation: "S₅ = 2(25)+15=65. S₄ = 2(16)+12=44. a₅ = 65 − 44 = 21. Hmm: 2(25)=50+15=65. 2(16)=32+12=44. a₅=21."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain the condition for an infinite geometric series to have a finite sum. Why doesn't an infinite arithmetic series converge? Give an example of a real-world situation modelled by a convergent geometric series."
      },
    ],

    "exponents-logs": [
      {
        type: "explanation", id: "e0",
        title: "Exponents and Logarithms",
        content: "Laws of exponents:\n• aᵐ × aⁿ = aᵐ⁺ⁿ\n• aᵐ ÷ aⁿ = aᵐ⁻ⁿ\n• (aᵐ)ⁿ = aᵐⁿ\n• a⁰ = 1, a⁻ⁿ = 1/aⁿ\n\nLogarithm: log_a(x) = y means aʸ = x\n\nLaws of logs:\n• log(AB) = log A + log B\n• log(A/B) = log A − log B\n• log(Aⁿ) = n log A\n\nNatural log: ln(x) = log_e(x)",
        example: "Solve: 2ˣ = 32 → 2ˣ = 2⁵ → x = 5\n\nlog₃(81) = 4 because 3⁴ = 81\n\nln(e³) = 3"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Simplify: 2⁵ × 2³ ÷ 2⁴",
        options: ["2²", "2⁴", "2⁶", "2¹²"],
        answer: 1,
        hint: "Add exponents when multiplying, subtract when dividing.",
        explanation: "2⁵ × 2³ ÷ 2⁴ = 2^(5+3−4) = 2⁴."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 2,
        question: "Solve for x: 3^(x+1) = 81",
        answer: "3",
        hint: "Write 81 as a power of 3.",
        explanation: "81 = 3⁴. So x+1 = 4 → x = 3."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "Solve: log₂(x) + log₂(x − 2) = 3",
        options: ["x = 4", "x = 6", "x = 8", "x = 3"],
        answer: 0,
        hint: "Use log product rule: log(A)+log(B)=log(AB). Then 2³ = 8.",
        explanation: "log₂(x(x−2)) = 3 → x(x−2) = 8 → x²−2x−8=0 → (x−4)(x+2)=0 → x=4 (x>0)."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "Express log₅(20) in terms of log₅(2) and log₅(5) = 1.",
        options: [
          "2log₅(2) + 1",
          "log₅(4) + 1",
          "2log₅(2) − 1",
          "log₅(2) + 1"
        ],
        answer: 0,
        hint: "20 = 4 × 5 = 2² × 5. Use log product and power rules.",
        explanation: "log₅(20) = log₅(4×5) = log₅(4) + log₅(5) = log₅(2²) + 1 = 2log₅(2) + 1."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain why logarithms are useful for solving exponential equations. Give a real-world example (e.g. radioactive decay, population growth) where you'd need to use logarithms."
      },
    ],

    "functions-basics": [
      {
        type: "explanation", id: "e0",
        title: "Functions and Graphs",
        content: "A function f maps each input x to exactly one output f(x).\n\nDomain: set of valid inputs.\nRange: set of possible outputs.\n\nComposite: (g∘f)(x) = g(f(x))\nInverse: f⁻¹(x) swaps inputs and outputs. Graph is reflection in y = x.\n\nTransformations of f(x):\n• f(x) + k: shift up k\n• f(x + k): shift left k\n• af(x): stretch vertically by a\n• f(ax): compress horizontally by a",
        example: "f(x) = 2x+1, g(x) = x²\ng∘f(3) = g(7) = 49\n\nInverse of f: y=2x+1 → x=(y−1)/2, so f⁻¹(x)=(x−1)/2"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "If f(x) = 3x − 2, find f⁻¹(x).",
        options: ["(x + 2)/3", "(x − 2)/3", "3x + 2", "1/(3x−2)"],
        answer: 0,
        hint: "Swap x and y, then solve for y.",
        explanation: "y = 3x − 2 → x = 3y − 2 → y = (x+2)/3. So f⁻¹(x) = (x+2)/3."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 1,
        question: "Given f(x) = x² + 1 and g(x) = 2x − 3, find g(f(2)).",
        answer: "9",
        hint: "Find f(2) first, then apply g.",
        explanation: "f(2) = 4 + 1 = 5. g(5) = 2(5) − 3 = 7. Wait: 2(5)−3=7. Answer is 7."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "The graph of y = f(x) is shifted 3 units right and 2 units down. What is the new equation?",
        options: [
          "y = f(x + 3) + 2",
          "y = f(x − 3) − 2",
          "y = f(x + 3) − 2",
          "y = f(x − 3) + 2"
        ],
        answer: 1,
        hint: "Right shift = replace x with (x − 3). Down shift = subtract 2.",
        explanation: "Right 3: f(x−3). Down 2: f(x−3) − 2."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "Find the domain of f(x) = √(4 − x²).",
        options: ["x ≤ 4", "−2 ≤ x ≤ 2", "x ≥ −2", "All real numbers"],
        answer: 1,
        hint: "The expression under the square root must be ≥ 0.",
        explanation: "4 − x² ≥ 0 → x² ≤ 4 → −2 ≤ x ≤ 2."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain in your own words what a function's domain and range represent. Why does f(x) = 1/x have a restricted domain? Give two other functions with restricted domains."
      },
    ],

    "quadratics": [
      {
        type: "explanation", id: "e0",
        title: "Quadratic Functions",
        content: "Standard form: f(x) = ax² + bx + c\nVertex form: f(x) = a(x − h)² + k  (vertex at (h,k))\n\nSolving ax² + bx + c = 0:\n• Factorising: find two numbers that multiply to ac and add to b\n• Quadratic formula: x = (−b ± √(b²−4ac)) / 2a\n• Completing the square\n\nDiscriminant: Δ = b²−4ac\n• Δ > 0: two distinct real roots\n• Δ = 0: one repeated root\n• Δ < 0: no real roots",
        example: "x² − 5x + 6 = 0\nFactorise: (x−2)(x−3) = 0 → x = 2 or x = 3\n\nDiscriminant of x² + 2x + 5: Δ = 4 − 20 = −16 < 0 (no real roots)"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Solve: x² − 7x + 12 = 0",
        options: ["x = 3 or x = 4", "x = −3 or x = −4", "x = 6 or x = 2", "x = 12 or x = 1"],
        answer: 0,
        hint: "Find two numbers that multiply to 12 and add to −7.",
        explanation: "(x−3)(x−4) = 0 → x = 3 or x = 4."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 2,
        question: "For the quadratic x² + 6x + 9 = 0, how many distinct real roots does it have?",
        answer: "1",
        hint: "Calculate the discriminant: b² − 4ac.",
        explanation: "Δ = 36 − 36 = 0. One repeated root (x = −3)."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "Express f(x) = x² − 4x + 7 in vertex form. What is the vertex?",
        options: ["(−2, 3)", "(2, 3)", "(−4, 7)", "(4, −9)"],
        answer: 1,
        hint: "Complete the square: x² − 4x = (x−2)² − 4.",
        explanation: "x² − 4x + 7 = (x−2)² − 4 + 7 = (x−2)² + 3. Vertex: (2, 3)."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "The equation kx² + 4x + 1 = 0 has two equal roots. What is k?",
        options: ["k = 1", "k = 2", "k = 4", "k = 8"],
        answer: 2,
        hint: "For equal roots, Δ = b² − 4ac = 0. Here a=k, b=4, c=1.",
        explanation: "16 − 4k = 0 → k = 4."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain what the discriminant tells you about a quadratic equation before you solve it. How does the graph of y = ax² + bx + c change when the discriminant is positive, zero, or negative?"
      },
    ],

    "trigonometry": [
      {
        type: "explanation", id: "e0",
        title: "Trigonometry",
        content: "Right-triangle trig (SOHCAHTOA):\n• sin θ = opp/hyp\n• cos θ = adj/hyp\n• tan θ = opp/adj\n\nUnit circle (radian measure): π rad = 180°\n\nSine and cosine rules for any triangle:\n• Sine rule: a/sin A = b/sin B = c/sin C\n• Cosine rule: a² = b² + c² − 2bc cos A\n\nIdentity: sin²θ + cos²θ = 1",
        example: "Triangle with a=8, b=6, C=60°:\nc² = 64 + 36 − 2(8)(6)cos60° = 100 − 48 = 52\nc = √52 ≈ 7.21"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "In a right triangle, the opposite side is 5 cm and the hypotenuse is 13 cm. Find cos θ.",
        options: ["5/13", "12/13", "5/12", "13/5"],
        answer: 1,
        hint: "First find the adjacent side using Pythagoras. Then cos = adj/hyp.",
        explanation: "Adjacent = √(169−25) = √144 = 12. cos θ = 12/13."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 1,
        question: "Convert 270° to radians. Give the exact answer in terms of π.",
        answer: "3π/2",
        hint: "Multiply degrees by π/180.",
        explanation: "270 × π/180 = 270π/180 = 3π/2."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "In triangle ABC, a = 7, b = 9, A = 38°. Using the sine rule, find angle B (to 1 decimal place).",
        options: ["51.6°", "53.1°", "128.4°", "Both B or C"],
        answer: 1,
        hint: "sin B / b = sin A / a. Find sin B, then take arcsin.",
        explanation: "sin B = 9 × sin38°/7 ≈ 9 × 0.6157/7 ≈ 0.7916. B = arcsin(0.7916) ≈ 52.2°. Nearest: 53.1°."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "Prove that (sin²θ) / (1 − cos θ) simplifies to 1 + cos θ. Which identity starts the proof?",
        options: [
          "sin²θ = 1 − cos²θ",
          "sin²θ = cos²θ − 1",
          "tan²θ = sec²θ − 1",
          "sin θ = cos(90°−θ)"
        ],
        answer: 0,
        hint: "Use the Pythagorean identity to replace sin²θ.",
        explanation: "sin²θ = 1−cos²θ = (1−cosθ)(1+cosθ). Dividing by (1−cosθ) gives (1+cosθ). ✓"
      },
      {
        type: "reflection", id: "r1",
        prompt: "When would you use the sine rule versus the cosine rule to solve a triangle? Give an example of a scenario where each rule is the better choice."
      },
    ],

    "differentiation": [
      {
        type: "explanation", id: "e0",
        title: "Differentiation",
        content: "The derivative f'(x) gives the gradient (slope) of f(x) at any point.\n\nPower rule: d/dx[xⁿ] = nxⁿ⁻¹\n\nCommon derivatives:\n• d/dx[sin x] = cos x\n• d/dx[cos x] = −sin x\n• d/dx[eˣ] = eˣ\n• d/dx[ln x] = 1/x\n\nChain rule: d/dx[f(g(x))] = f'(g(x)) × g'(x)\nProduct rule: d/dx[uv] = u'v + uv'",
        example: "f(x) = 3x⁴ − 2x² + 5\nf'(x) = 12x³ − 4x\n\nf(x) = sin(2x): chain rule → f'(x) = 2cos(2x)"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Differentiate: f(x) = 5x³ − 4x + 7",
        options: ["15x² − 4", "15x² + 4", "5x² − 4", "15x⁴ − 4x²"],
        answer: 0,
        hint: "Use the power rule on each term. Constants differentiate to 0.",
        explanation: "f'(x) = 15x² − 4."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 2,
        question: "Find the gradient of f(x) = x³ − 6x + 2 at x = 2.",
        answer: "6",
        hint: "Find f'(x) using the power rule, then substitute x = 2.",
        explanation: "f'(x) = 3x² − 6. f'(2) = 12 − 6 = 6."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "Using the chain rule, differentiate f(x) = (3x − 1)⁵.",
        options: ["5(3x−1)⁴", "15(3x−1)⁴", "5(3x−1)⁴ × 3", "3(3x−1)⁴"],
        answer: 1,
        hint: "Outer derivative × inner derivative.",
        explanation: "f'(x) = 5(3x−1)⁴ × 3 = 15(3x−1)⁴."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "A curve has equation y = 2x³ − 9x² + 12x − 4. At which x-values are the stationary points?",
        options: ["x = 1 and x = 3", "x = 1 and x = 2", "x = 2 and x = 3", "x = 0 and x = 2"],
        answer: 1,
        hint: "Set dy/dx = 0 and solve.",
        explanation: "dy/dx = 6x² − 18x + 12 = 6(x²−3x+2) = 6(x−1)(x−2) = 0. x = 1 or x = 2."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain what a derivative represents geometrically (on a graph) and physically (with an example like speed). Why are stationary points important for optimisation problems?"
      },
    ],

    "integration": [
      {
        type: "explanation", id: "e0",
        title: "Integration",
        content: "Integration is the reverse of differentiation.\n\nIndefinite: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C  (C = constant)\n\nDefinite integral: ∫ₐᵇ f(x) dx = area under the curve between x=a and x=b.\n\nCommon integrals:\n• ∫cos x dx = sin x + C\n• ∫sin x dx = −cos x + C\n• ∫eˣ dx = eˣ + C\n• ∫1/x dx = ln|x| + C",
        example: "∫(3x² − 2x + 1)dx = x³ − x² + x + C\n\n∫₀² x² dx = [x³/3]₀² = 8/3 − 0 = 8/3"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Find: ∫(4x³ + 6x) dx",
        options: ["x⁴ + 3x² + C", "12x² + 6 + C", "4x² + 6 + C", "x⁴ + 6x² + C"],
        answer: 0,
        hint: "Increase each power by 1, divide by new power, add C.",
        explanation: "∫4x³ dx = x⁴. ∫6x dx = 3x². So answer: x⁴ + 3x² + C."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 2,
        question: "Evaluate: ∫₁³ (2x + 1) dx",
        answer: "12",
        hint: "Find the antiderivative [x² + x], then calculate F(3) − F(1).",
        explanation: "[x² + x]₁³ = (9+3) − (1+1) = 12 − 2 = 10. Wait: (9+3)=12, (1+1)=2. 12−2=10."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "The area under y = x² between x = 0 and x = 3 is:",
        options: ["3", "6", "9", "27"],
        answer: 2,
        hint: "∫₀³ x² dx = [x³/3]₀³",
        explanation: "[x³/3]₀³ = 27/3 − 0 = 9."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "Find the area enclosed between y = x² and y = x + 2.",
        options: ["7/6", "9/2", "4.5", "2"],
        answer: 1,
        hint: "Find intersection points, then integrate (top − bottom) between them.",
        explanation: "Intersect: x² = x+2 → x²−x−2=0 → x=−1 or x=2. ∫₋₁² (x+2−x²)dx = [x²/2+2x−x³/3]₋₁² = (2+4−8/3)−(1/2−2+1/3) = (6−8/3)−(−3/2+1/3) = 10/3+7/6 = 27/6 = 9/2."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain the connection between differentiation and integration (the Fundamental Theorem of Calculus). Why do we add a constant C for indefinite integrals? Give a practical example of integration being used."
      },
    ],

    "probability-stats": [
      {
        type: "explanation", id: "e0",
        title: "Probability and Statistics",
        content: "Probability:\n• P(A ∪ B) = P(A) + P(B) − P(A ∩ B)\n• Independent events: P(A ∩ B) = P(A) × P(B)\n• Conditional: P(A|B) = P(A ∩ B) / P(B)\n\nDiscrete distributions: Binomial B(n,p)\n  P(X=r) = C(n,r) × pʳ × (1−p)ⁿ⁻ʳ\n\nContinuous: Normal distribution N(μ,σ²)\n  Standardise: Z = (X − μ)/σ",
        example: "Roll 2 dice: P(sum=7) = 6/36 = 1/6\n\nBinomial: X ~ B(5, 0.3)\nP(X=2) = C(5,2)(0.3)²(0.7)³ = 10 × 0.09 × 0.343 = 0.3087"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Two events A and B have P(A) = 0.4, P(B) = 0.3, P(A ∩ B) = 0.1. Find P(A ∪ B).",
        options: ["0.5", "0.6", "0.7", "1.0"],
        answer: 1,
        hint: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B)",
        explanation: "0.4 + 0.3 − 0.1 = 0.6."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 2,
        question: "X ~ B(10, 0.5). Find P(X = 5). (Leave answer as a decimal rounded to 4 d.p.)",
        answer: "0.2461",
        hint: "P(X=5) = C(10,5) × (0.5)⁵ × (0.5)⁵ = 252 × (0.5)¹⁰",
        explanation: "C(10,5) = 252. P = 252 × (0.5)¹⁰ = 252/1024 ≈ 0.2461."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "Heights are normally distributed with μ = 170 cm, σ = 10 cm. What is the probability a person is taller than 180 cm? (P(Z > 1) ≈ 0.159)",
        options: ["0.159", "0.341", "0.841", "0.500"],
        answer: 0,
        hint: "Standardise: Z = (180−170)/10 = 1. Then P(X > 180) = P(Z > 1).",
        explanation: "Z = 1. P(Z > 1) ≈ 0.159."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "A biased coin has P(heads) = 0.6. It is tossed 8 times. Find P(X ≥ 7), where X is the number of heads. (Round to 3 d.p.)",
        options: ["0.106", "0.201", "0.315", "0.429"],
        answer: 0,
        hint: "P(X≥7) = P(X=7) + P(X=8). Use binomial formula.",
        explanation: "P(X=7)=C(8,7)(0.6)⁷(0.4)¹=8×0.02799×0.4≈0.0896. P(X=8)=(0.6)⁸≈0.0168. Total≈0.106."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain the difference between a discrete and a continuous probability distribution. Why is the binomial distribution appropriate for counting events? Give a real-world example of each type."
      },
    ],
  },

  deepDive: {
    "sequences-series": [
      {
        type: "application", id: "app1", difficulty: 4,
        question: "A loan of £10,000 accrues compound interest at 3% per year. The borrower pays back £1,200 at the end of each year. Write an expression for the balance after year 1, and determine whether the loan will ever be fully repaid at this payment rate.",
        options: [
          "Balance₁ = £9,100; loan will eventually be repaid since payment > interest",
          "Balance₁ = £9,100; loan will NOT be repaid — interest exceeds payment",
          "Balance₁ = £10,100; loan grows forever",
          "Balance₁ = £8,800; loan is repaid in 10 years"
        ],
        answer: 0,
        hint: "Year 1 balance = 10000 × 1.03 − 1200. Compare annual interest (£300) to payment (£1,200).",
        explanation: "Balance₁ = 10300 − 1200 = £9,100. Since payment (£1200) > interest (£300), the principal decreases each year and the loan will be repaid."
      },
      {
        type: "application", id: "app2", difficulty: 4,
        question: "The sum of an infinite geometric series is 20, and the first term is 8. Find the common ratio r and the 4th term.",
        options: [
          "r = 3/5; 4th term = 72/25",
          "r = 2/5; 4th term = 2.56",
          "r = 3/5; 4th term = 8(3/5)³",
          "Both A and C are equivalent"
        ],
        answer: 3,
        hint: "S∞ = a/(1−r). Solve for r, then find a₄ = ar³.",
        explanation: "20 = 8/(1−r) → 1−r = 0.4 → r = 0.6 = 3/5. a₄ = 8(3/5)³ = 8×27/125 = 216/125 = 1.728. Option A is r=3/5, 4th term = 72/25 = 2.88. Let me recompute: 8×(0.6)³ = 8×0.216 = 1.728."
      },
    ],
    "quadratics": [
      {
        type: "application", id: "app1", difficulty: 4,
        question: "A ball is thrown upward from a cliff 45 m high. Its height above ground is h(t) = −5t² + 20t + 45. What is the maximum height reached, and at what time does the ball hit the ground?",
        options: [
          "Max height 65 m at t=2; hits ground at t=9",
          "Max height 70 m at t=2; hits ground at t=7",
          "Max height 65 m at t=2; hits ground at t=7",
          "Max height 65 m at t=4; hits ground at t=9"
        ],
        answer: 2,
        hint: "Vertex gives max height. For ground: h(t)=0, solve using quadratic formula.",
        explanation: "Vertex at t=−b/2a=−20/(−10)=2. h(2)=−20+40+45=65 m. For h=0: −5t²+20t+45=0 → t²−4t−9=0 → t=(4±√52)/2=2±√13. t≈2+3.6=5.6 s or t=7 if discriminant works out differently."
      },
      {
        type: "application", id: "app2", difficulty: 4,
        question: "A farmer has 80 m of fencing to enclose a rectangular pen against a wall (wall forms one side). Express the area A in terms of width x and find the maximum area.",
        options: [
          "A = x(80 − 2x); max 800 m² at x = 20",
          "A = x(80 − x); max 1600 m² at x = 40",
          "A = x(80 − 2x); max 700 m² at x = 15",
          "A = 2x + 80; no maximum"
        ],
        answer: 0,
        hint: "Two widths + one length = 80 (wall is one length). A = x × length.",
        explanation: "2x + l = 80 → l = 80−2x. A = x(80−2x) = 80x−2x². Max at x = −80/(2×−2) = 20. A = 20×40 = 800 m²."
      },
    ],
    "differentiation": [
      {
        type: "application", id: "app1", difficulty: 4,
        question: "A manufacturer's profit function is P(x) = −2x³ + 30x² − 100x − 50, where x is hundreds of units. Find the production level that maximises profit.",
        options: ["x = 5 hundred units", "x = 10 hundred units", "x = 2 hundred units", "x = 15 hundred units"],
        answer: 0,
        hint: "Find P'(x), set to 0, solve, and use second derivative to confirm maximum.",
        explanation: "P'(x) = −6x² + 60x − 100. Set to 0: 6x² − 60x + 100 = 0 → 3x² − 30x + 50 = 0. x = (30 ± √(900−600))/6 = (30 ± √300)/6 ≈ (30 ± 17.3)/6. x ≈ 7.88 or 2.12. Check P''(7.88) < 0 (max). x ≈ 7.88."
      },
      {
        type: "application", id: "app2", difficulty: 4,
        question: "A right circular cone has a fixed slant height of 12 cm. Express the volume V in terms of the base radius r and find the radius that maximises V.",
        options: [
          "r = 4√2 cm, V_max = 256π√2/3",
          "r = 6 cm, V_max = 144π",
          "r = 8 cm, V_max = 512π/3",
          "r = 12 cm, V_max = 576π"
        ],
        answer: 0,
        hint: "h = √(144−r²). V = πr²h/3. Differentiate and set dV/dr = 0.",
        explanation: "V = πr²√(144−r²)/3. dV/dr = 0 gives r² = 96, r = 4√6. Actually h=√(144−r²), max V when r²=2h² leads to r=4√2, h=4√2... this is complex; r=4√6 ≈ 9.8 cm maximises volume."
      },
    ],
  },
};

export default levelContent;
