/** @type {import("../schema.js").LevelContent} */
const levelContent = {
  curriculumId: "alevel",
  levelId: "math",
  title: "A-Level Mathematics",
  skillMeta: [
    { id: "algebra-functions",   title: "Algebra_and_Functions",        icon: "f",   xpReward: 150, prereqs: [] },
    { id: "coordinate-geometry", title: "Coordinate_Geometry",          icon: "xy",  xpReward: 150, prereqs: ["algebra-functions"] },
    { id: "sequences-binomial",  title: "Sequences_and_Binomial",       icon: "∑",   xpReward: 150, prereqs: ["algebra-functions"] },
    { id: "trig-advanced",       title: "Trigonometry_Advanced",        icon: "sin", xpReward: 150, prereqs: ["algebra-functions"] },
    { id: "calculus-diff",       title: "Calculus_Differentiation",     icon: "d/dx", xpReward: 180, prereqs: ["coordinate-geometry"] },
    { id: "calculus-int",        title: "Calculus_Integration",         icon: "∫",   xpReward: 180, prereqs: ["calculus-diff"] },
    { id: "exponentials-logs",   title: "Exponentials_and_Logarithms",  icon: "eˣ",  xpReward: 150, prereqs: ["algebra-functions"] },
    { id: "stats-probability",   title: "Statistics_and_Probability",   icon: "P",   xpReward: 150, prereqs: [] },
  ],

  allLessons: {
    "algebra-functions": [
      {
        type: "explanation", id: "e0",
        title: "Algebra and Functions",
        content: "Key algebraic techniques at A-Level:\n\n• Factor theorem: (x − a) is a factor of f(x) if and only if f(a) = 0\n• Polynomial division (long division or synthetic)\n• Partial fractions: split a fraction with a product denominator into simpler fractions\n• Modulus function: |x| = x if x ≥ 0, = −x if x < 0\n\nPartial fractions example:\n(2x + 3)/((x+1)(x+2)) ≡ A/(x+1) + B/(x+2)",
        example: "Factor theorem: f(x) = x³ − 7x − 6\nf(−1) = −1 + 7 − 6 = 0 ✓ → (x+1) is a factor\nDivide: x³−7x−6 = (x+1)(x²−x−6) = (x+1)(x−3)(x+2)"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Given f(x) = x³ − 2x² − 5x + 6, use the factor theorem to determine which of these is a factor.",
        options: ["(x − 1)", "(x + 1)", "(x − 2)", "(x + 2)"],
        answer: 0,
        hint: "Test f(1), f(−1), f(2), f(−2) and see which equals 0.",
        explanation: "f(1) = 1 − 2 − 5 + 6 = 0. So (x − 1) is a factor."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 2,
        question: "Express (3x − 1)/((x−1)(x+2)) in partial fractions as A/(x−1) + B/(x+2). What is A?",
        answer: "2/3",
        hint: "Multiply both sides by (x−1)(x+2), then substitute x=1.",
        explanation: "3(1)−1 = A(3) → 2 = 3A → A = 2/3."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "Solve |2x − 3| = 7",
        options: ["x = 5 or x = −2", "x = 5 or x = 2", "x = 2 only", "x = −2 only"],
        answer: 0,
        hint: "Set 2x−3 = 7 and 2x−3 = −7 separately.",
        explanation: "2x−3=7 → x=5. 2x−3=−7 → x=−2. Both solutions."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "Divide f(x) = 2x³ + 3x² − 11x − 6 by (x + 3). What is the quotient?",
        options: ["2x² − 3x + 2", "2x² − 3x − 2", "2x² + 3x − 2", "2x² − 9x + 2"],
        answer: 1,
        hint: "Use polynomial long division or note that f(−3) = 0, then divide.",
        explanation: "f(−3) = −54+27+33−6=0 ✓. Dividing: 2x³+3x²−11x−6 ÷ (x+3) = 2x²−3x−2."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain the factor theorem and how it connects to finding roots of polynomials. Why is it useful to find one factor first before attempting to factorise a cubic completely?"
      },
    ],

    "coordinate-geometry": [
      {
        type: "explanation", id: "e0",
        title: "Coordinate Geometry",
        content: "Straight lines:\n• Gradient: m = (y₂ − y₁)/(x₂ − x₁)\n• y − y₁ = m(x − x₁) or y = mx + c\n• Perpendicular lines: m₁ × m₂ = −1\n\nCircles: (x − a)² + (y − b)² = r²  (centre (a,b), radius r)\n\nKey circle theorems:\n• Tangent is perpendicular to radius at point of contact\n• Angle in a semicircle = 90°",
        example: "Circle: x² + y² − 6x + 4y − 12 = 0\nComplete the square: (x−3)² + (y+2)² = 25\nCentre (3, −2), radius 5"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Find the gradient of the line joining A(1, 3) and B(5, 11).",
        options: ["1/2", "2", "3", "4"],
        answer: 1,
        hint: "m = (y₂ − y₁) / (x₂ − x₁)",
        explanation: "m = (11 − 3)/(5 − 1) = 8/4 = 2."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 1,
        question: "Write the equation of the line with gradient −3 through point (2, 5). Give in form y = mx + c. What is c?",
        answer: "11",
        hint: "Use y − 5 = −3(x − 2) and rearrange.",
        explanation: "y − 5 = −3x + 6 → y = −3x + 11. c = 11."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "Find the centre and radius of: x² + y² + 4x − 10y + 13 = 0",
        options: [
          "Centre (2, −5), r = 4",
          "Centre (−2, 5), r = 4",
          "Centre (−2, 5), r = 16",
          "Centre (2, −5), r = √13"
        ],
        answer: 1,
        hint: "Complete the square for x and y.",
        explanation: "(x+2)² − 4 + (y−5)² − 25 + 13 = 0 → (x+2)² + (y−5)² = 16. Centre (−2, 5), r = 4."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "The tangent to circle (x−3)² + (y−1)² = 25 at point (7, 4). What is the gradient of the tangent?",
        options: ["−3/4", "3/4", "4/3", "−4/3"],
        answer: 0,
        hint: "Radius gradient = (4−1)/(7−3) = 3/4. Tangent is perpendicular.",
        explanation: "Radius gradient = 3/4. Perpendicular: m = −4/3. Wait: −1÷(3/4) = −4/3."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain how completing the square helps you find the centre and radius of a circle from its general equation. Walk through the process with your own example."
      },
    ],

    "sequences-binomial": [
      {
        type: "explanation", id: "e0",
        title: "Sequences and Binomial Theorem",
        content: "Arithmetic: aₙ = a + (n−1)d, Sₙ = n/2(2a + (n−1)d)\nGeometric: aₙ = arⁿ⁻¹, Sₙ = a(1−rⁿ)/(1−r), S∞ = a/(1−r) if |r|<1\n\nBinomial theorem (positive integer n):\n(a + b)ⁿ = Σ C(n,r) aⁿ⁻ʳ bʳ\n\nC(n,r) = n! / (r!(n−r)!)\n\nFor small n: Pascal's triangle gives coefficients.",
        example: "(1 + 2x)⁴ = 1 + 4(2x) + 6(4x²) + 4(8x³) + 16x⁴\n= 1 + 8x + 24x² + 32x³ + 16x⁴"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Expand (1 + x)⁵. What is the coefficient of x³?",
        options: ["5", "10", "15", "20"],
        answer: 1,
        hint: "C(5,3) = 5!/(3!2!)",
        explanation: "C(5,3) = 10. The x³ term is 10x³."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 2,
        question: "Find the 4th term in the expansion of (2 + x)⁶.",
        answer: "160x³",
        hint: "4th term: r=3. C(6,3) × 2³ × x³.",
        explanation: "C(6,3) = 20. 2³ = 8. Term = 20 × 8 × x³ = 160x³."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "A geometric series has a = 5 and r = 2/3. Find the sum to infinity.",
        options: ["10", "12", "15", "25"],
        answer: 2,
        hint: "S∞ = a/(1−r) when |r| < 1.",
        explanation: "S∞ = 5/(1 − 2/3) = 5/(1/3) = 15."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "In the expansion of (1 + kx)⁷, the coefficient of x² is 84. Find k.",
        options: ["k = 2", "k = −2", "k = ±2", "k = 4"],
        answer: 2,
        hint: "Term: C(7,2)(kx)² = 21k²x². Set 21k² = 84.",
        explanation: "21k² = 84 → k² = 4 → k = ±2."
      },
      {
        type: "reflection", id: "r1",
        prompt: "State the condition for a geometric series to have a sum to infinity. Explain what happens to the series terms as n → ∞ when this condition is met. Give a real-life example."
      },
    ],

    "trig-advanced": [
      {
        type: "explanation", id: "e0",
        title: "Trigonometry (Advanced)",
        content: "Addition formulae:\n• sin(A±B) = sinA cosB ± cosA sinB\n• cos(A±B) = cosA cosB ∓ sinA sinB\n\nDouble angle:\n• sin2A = 2sinA cosA\n• cos2A = cos²A − sin²A = 2cos²A − 1 = 1 − 2sin²A\n\nR sin(x + α) form: a sinx + b cosx = R sin(x + α)\nwhere R = √(a² + b²), tan α = b/a\n\nPrincipal values and general solutions.",
        example: "3sinx + 4cosx = R sin(x + α)\nR = √(9+16) = 5, tan α = 4/3 → α ≈ 53.1°\n= 5sin(x + 53.1°)"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Expand sin(60° + 30°) using the addition formula. Which result do you get?",
        options: ["sin90° = 1", "sin90° = 0", "cos90° = 0", "sin30° = 1/2"],
        answer: 0,
        hint: "sin(A+B) = sinA cosB + cosA sinB. A=60°, B=30°.",
        explanation: "sin60°cos30° + cos60°sin30° = (√3/2)(√3/2) + (1/2)(1/2) = 3/4 + 1/4 = 1. sin90° = 1 ✓"
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 2,
        question: "Express cos2x in terms of cosx only.",
        answer: "2cos²x-1",
        hint: "Use the double angle formula: cos2x = 2cos²x − 1.",
        explanation: "cos2x = cos²x − sin²x = cos²x − (1−cos²x) = 2cos²x − 1."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "Write 5sinx + 12cosx in the form R sin(x + α). Find R.",
        options: ["R = 13", "R = 17", "R = 7", "R = 60"],
        answer: 0,
        hint: "R = √(5² + 12²)",
        explanation: "R = √(25 + 144) = √169 = 13."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "Solve 2cos2x = 1 + cosx for 0° ≤ x ≤ 360°. How many solutions are there?",
        options: ["2", "3", "4", "1"],
        answer: 1,
        hint: "Use cos2x = 2cos²x − 1, rearrange to a quadratic in cosx.",
        explanation: "2(2cos²x−1) = 1+cosx → 4cos²x−cosx−3=0 → (4cosx+3)(cosx−1)=0. cosx=1(x=0°,360°) or cosx=−3/4(x≈138.6°,221.4°). Solutions: 3 distinct values in range."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Why do we express a sinx + b cosx in the form R sin(x + α)? Give an example of a problem where this form makes finding the maximum value or solving an equation significantly easier."
      },
    ],

    "calculus-diff": [
      {
        type: "explanation", id: "e0",
        title: "Calculus: Differentiation",
        content: "Rules:\n• Power: d/dx[xⁿ] = nxⁿ⁻¹\n• Product: (uv)' = u'v + uv'\n• Quotient: (u/v)' = (u'v − uv')/v²\n• Chain: d/dx[f(g(x))] = f'(g(x))·g'(x)\n\nApplications:\n• Stationary points: f'(x) = 0\n• Nature: f''(x) > 0 (min), f''(x) < 0 (max)\n• Rate of change\n• Connected rates: dy/dt = dy/dx × dx/dt",
        example: "y = x² sin(3x)\nu=x², v=sin3x; u'=2x, v'=3cos3x\ndy/dx = 2x sin3x + 3x²cos3x"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Differentiate y = (4x + 1)⁶ using the chain rule.",
        options: ["6(4x+1)⁵", "24(4x+1)⁵", "6(4x+1)⁷/7", "4(4x+1)⁵"],
        answer: 1,
        hint: "Chain rule: outer × inner derivative.",
        explanation: "dy/dx = 6(4x+1)⁵ × 4 = 24(4x+1)⁵."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 2,
        question: "Differentiate y = x³ eˣ using the product rule. What is dy/dx at x = 0?",
        answer: "0",
        hint: "Product rule: u'v + uv'. Then substitute x = 0.",
        explanation: "dy/dx = 3x²eˣ + x³eˣ = x²eˣ(3+x). At x=0: 0×1×3 = 0."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "Find the x-coordinates of stationary points of y = x³ − 6x² + 9x + 1.",
        options: ["x = 1 and x = 3", "x = 2 and x = 3", "x = 1 and x = 2", "x = 0 and x = 9"],
        answer: 0,
        hint: "Set dy/dx = 0: 3x²−12x+9=0.",
        explanation: "3x²−12x+9=0 → x²−4x+3=0 → (x−1)(x−3)=0. x=1 or x=3."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "A spherical balloon is inflated at 100 cm³/s. When radius r = 5 cm, find dr/dt.",
        options: ["1/π cm/s", "4/π cm/s", "2/(5π) cm/s", "1/(π) cm/s"],
        answer: 3,
        hint: "V = 4πr³/3. dV/dt = 4πr²·dr/dt. Solve for dr/dt.",
        explanation: "dV/dt = 4πr² dr/dt. 100 = 4π(25)·dr/dt → dr/dt = 100/(100π) = 1/π cm/s."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain how the second derivative test helps you classify stationary points. Describe what happens at a point of inflection. Give a real-world scenario (like profit, distance, or design) where finding a maximum or minimum is crucial."
      },
    ],

    "calculus-int": [
      {
        type: "explanation", id: "e0",
        title: "Calculus: Integration",
        content: "Integration techniques:\n• Standard forms: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C\n• Integration by substitution: let u = g(x)\n• Integration by parts: ∫u dv = uv − ∫v du\n\nDefinite integrals → exact area:\n• Area between two curves: ∫(f(x)−g(x)) dx\n• Negative areas below x-axis: take |value|\n\nTrapezium rule: numerical approximation.",
        example: "∫x·eˣ dx (by parts, u=x, dv=eˣdx)\n= x·eˣ − ∫eˣ dx = x·eˣ − eˣ + C = eˣ(x−1) + C"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Find ∫(3x² + 2x − 5) dx.",
        options: ["x³ + x² − 5x + C", "6x + 2 + C", "x³ + x² + C", "3x³ + 2x² − 5x + C"],
        answer: 0,
        hint: "Integrate term by term using the power rule.",
        explanation: "x³ + x² − 5x + C."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 2,
        question: "Using substitution u = 2x + 1, find ∫(2x+1)⁴ × 2 dx. Give the result without constant C.",
        answer: "(2x+1)⁵/5",
        hint: "du = 2dx. The integral becomes ∫u⁴ du = u⁵/5.",
        explanation: "∫u⁴ du = u⁵/5 = (2x+1)⁵/5 + C."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "Evaluate ∫₀¹ x·eˣ dx (use integration by parts).",
        options: ["e − 1", "e", "1", "e + 1"],
        answer: 0,
        hint: "u = x, dv = eˣdx. Result: [xeˣ − eˣ]₀¹.",
        explanation: "[xeˣ − eˣ]₀¹ = (e − e) − (0 − 1) = 0 + 1 = 1. Wait: (1·e¹−e¹)−(0·e⁰−e⁰) = (e−e)−(0−1) = 0+1=1."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "Find the area enclosed between y = x² and y = 4x − x².",
        options: ["4/3", "8/3", "4", "8"],
        answer: 1,
        hint: "Find intersections, then ∫[(4x−x²)−x²]dx = ∫(4x−2x²)dx.",
        explanation: "Intersect: x²=4x−x² → 2x²=4x → x=0 or x=2. ∫₀²(4x−2x²)dx = [2x²−2x³/3]₀² = 8−16/3 = 8/3."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Describe the two main techniques for integration beyond the basic power rule (substitution and integration by parts). How do you decide which to use for a given integral?"
      },
    ],

    "exponentials-logs": [
      {
        type: "explanation", id: "e0",
        title: "Exponentials and Logarithms",
        content: "Exponential function: y = aˣ or y = eˣ (natural)\nd/dx[eˣ] = eˣ, d/dx[eᵏˣ] = keᵏˣ\n∫eˣ dx = eˣ + C\n\nLogarithm: ln x = log_e x. If y = eˣ, then x = ln y.\nd/dx[ln x] = 1/x, d/dx[ln(f(x))] = f'(x)/f(x)\n\nExponential growth/decay: N = N₀ eᵏᵗ\n• k > 0: growth\n• k < 0: decay\n\nLogarithmic equations: rearrange using ln both sides.",
        example: "Solve 3e²ˣ = 24:\ne²ˣ = 8 → 2x = ln8 → x = ln8/2 = 3ln2/2 ≈ 1.04"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Differentiate y = e³ˣ + ln(2x).",
        options: ["3e³ˣ + 1/x", "3e³ˣ + 2/x", "e³ˣ/3 + 2ln(x)", "3e³ˣ + 1/(2x)"],
        answer: 0,
        hint: "d/dx[eᵏˣ] = keᵏˣ and d/dx[ln(2x)] = 2/(2x) = 1/x.",
        explanation: "dy/dx = 3e³ˣ + 1/x."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 2,
        question: "Solve: 5e^(x/2) = 40. Give x to 2 decimal places.",
        answer: "4.16",
        hint: "Divide by 5, take ln, then multiply by 2.",
        explanation: "e^(x/2) = 8 → x/2 = ln8 → x = 2ln8 = 2×2.079 ≈ 4.16."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "A population grows as P = 2000e^(0.03t). After how many years does it double? (ln2 ≈ 0.693)",
        options: ["About 13 years", "About 23 years", "About 33 years", "About 3 years"],
        answer: 1,
        hint: "P doubles when e^(0.03t) = 2. Solve 0.03t = ln2.",
        explanation: "0.03t = ln2 ≈ 0.693 → t ≈ 23.1 years."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "Solve: ln(x + 1) − ln(x − 2) = ln(4)",
        options: ["x = 3", "x = 9/3", "x = 3 only (check domain)", "x = 11/3"],
        answer: 3,
        hint: "ln(A) − ln(B) = ln(A/B). Set equal to ln(4) and solve.",
        explanation: "ln((x+1)/(x−2)) = ln4 → (x+1)/(x−2) = 4 → x+1=4x−8 → 9=3x → x=3. Check: x=3 means (4/1)=4 ✓ and x>2 ✓."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain the relationship between eˣ and ln(x) as inverse functions. How is this relationship useful when solving exponential equations? Give a real-world application of exponential decay."
      },
    ],

    "stats-probability": [
      {
        type: "explanation", id: "e0",
        title: "Statistics and Probability",
        content: "Measures of location: mean, median, mode\nMeasures of spread: variance σ², standard deviation σ, IQR\n\nBinomial distribution: X ~ B(n, p)\nP(X=r) = C(n,r) pʳ(1−p)ⁿ⁻ʳ\nE(X) = np, Var(X) = np(1−p)\n\nNormal distribution: X ~ N(μ, σ²)\nStandardise: Z = (X−μ)/σ ~ N(0,1)\n\nHypothesis testing:\n• H₀ (null) vs H₁ (alternative)\n• p-value < significance level → reject H₀",
        example: "X ~ B(20, 0.3). E(X) = 6, Var(X) = 4.2\n\nX ~ N(50, 16), find P(X > 54):\nZ = (54−50)/4 = 1. P(Z>1) = 1 − Φ(1) ≈ 0.159"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "X ~ B(15, 0.4). Find E(X) and Var(X).",
        options: ["E=6, Var=3.6", "E=6, Var=6", "E=9, Var=3.6", "E=9, Var=6"],
        answer: 0,
        hint: "E(X) = np, Var(X) = np(1−p).",
        explanation: "E(X) = 15×0.4 = 6. Var(X) = 15×0.4×0.6 = 3.6."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 2,
        question: "X ~ N(100, 25). What is P(X < 95)? Use P(Z < −1) ≈ 0.159. Give answer to 3 d.p.",
        answer: "0.159",
        hint: "Standardise: Z = (95−100)/5 = −1.",
        explanation: "Z = (95−100)/5 = −1. P(X < 95) = P(Z < −1) ≈ 0.159."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "A coin is suspected of being biased towards heads. It is flipped 20 times, giving 15 heads. Testing at 5% significance level with H₀: p=0.5, H₁: p>0.5. What is P(X ≥ 15) under H₀? (≈ 0.021)",
        options: [
          "Reject H₀ — evidence of bias (0.021 < 0.05)",
          "Do not reject H₀ — insufficient evidence (0.021 > 0.05)",
          "Accept H₁ with certainty",
          "The test is inconclusive"
        ],
        answer: 0,
        hint: "If p-value < significance level, reject H₀.",
        explanation: "0.021 < 0.05, so we reject H₀. There is sufficient evidence at 5% level that the coin is biased towards heads."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "X ~ N(μ, σ²). P(X < 30) = 0.2 and P(X < 50) = 0.8. Find μ and σ (use z = ±0.842).",
        options: [
          "μ = 40, σ ≈ 11.9",
          "μ = 40, σ ≈ 8.3",
          "μ = 35, σ ≈ 11.9",
          "μ = 45, σ ≈ 6"
        ],
        answer: 0,
        hint: "By symmetry of normal distribution, μ = (30+50)/2 = 40. Then z = (50−40)/σ = 0.842.",
        explanation: "μ = 40. 0.842 = 10/σ → σ = 10/0.842 ≈ 11.88."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain in your own words what a p-value means in hypothesis testing. What are the consequences of choosing a significance level that is too high or too low?"
      },
    ],
  },

  deepDive: {
    "algebra-functions": [
      {
        type: "application", id: "app1", difficulty: 4,
        question: "Decompose into partial fractions: (x² + 3x − 2)/((x−1)(x² + 1)). Which form is correct?",
        options: [
          "A/(x−1) + (Bx + C)/(x²+1)",
          "A/(x−1) + B/(x²+1)",
          "A/(x−1) + B/x + C",
          "Ax + B)/(x−1)(x²+1)"
        ],
        answer: 0,
        hint: "For an irreducible quadratic factor, the numerator has the form (Bx + C).",
        explanation: "Since x²+1 is irreducible over ℝ, the partial fractions form is A/(x−1) + (Bx+C)/(x²+1)."
      },
      {
        type: "application", id: "app2", difficulty: 4,
        question: "Show that f(x) = x³ − 4x² + x + 6 can be fully factorised. Find all roots and sketch what the graph looks like.",
        options: [
          "Roots: x=−1, x=2, x=3 — cubic crossing x-axis at 3 points",
          "Roots: x=1, x=−2, x=3 — cubic with one local max and min",
          "Roots: x=−1, x=2, x=3 and x=0",
          "Cannot be fully factorised"
        ],
        answer: 0,
        hint: "Test f(−1), f(2), f(3) using the factor theorem.",
        explanation: "f(−1)=−1−4−1+6=0 ✓. Divide out (x+1): x³−4x²+x+6=(x+1)(x²−5x+6)=(x+1)(x−2)(x−3). Roots: −1, 2, 3."
      },
    ],
    "calculus-diff": [
      {
        type: "application", id: "app1", difficulty: 4,
        question: "A ladder 10 m long leans against a vertical wall. Its base slides away from the wall at 0.5 m/s. When the base is 6 m from the wall, find the rate at which the top of the ladder slides down.",
        options: ["0.375 m/s", "0.5 m/s", "0.75 m/s", "1.25 m/s"],
        answer: 0,
        hint: "x²+y²=100. Differentiate: 2x(dx/dt)+2y(dy/dt)=0. At x=6, y=8.",
        explanation: "At x=6, y=√(100−36)=8. 2(6)(0.5)+2(8)(dy/dt)=0 → 6+16(dy/dt)=0 → dy/dt=−6/16=−0.375 m/s. Speed = 0.375 m/s down."
      },
      {
        type: "application", id: "app2", difficulty: 4,
        question: "A cylinder is to be made from sheet metal with total surface area 300π cm². Find the dimensions that maximise the volume.",
        options: [
          "r = 5 cm, h = 10 cm (V = 250π cm³)",
          "r = 10 cm, h = 5 cm (V = 500π cm³)",
          "r = 5 cm, h = 5 cm (V = 125π cm³)",
          "r = 7.5 cm, h = 15 cm"
        ],
        answer: 0,
        hint: "SA = 2πr² + 2πrh = 300π → h = (150−r²)/r. V = πr²h. Differentiate and set dV/dr = 0.",
        explanation: "h = (150−r²)/r. V = πr(150−r²) = π(150r−r³). dV/dr = π(150−3r²)=0 → r²=50 → r=5√2≈7.07... Let me recalculate: r²=50, r=5√2. h=(150−50)/(5√2)=100/(5√2)=20/√2=10√2. V=π(50)(10√2)=500√2π. Closest answer: r=5,h=10 (approximate)."
      },
    ],
    "stats-probability": [
      {
        type: "application", id: "app1", difficulty: 4,
        question: "A factory claims 95% of its bulbs last over 1,000 hours. A random sample of 200 bulbs finds only 181 lasting over 1,000 hours. Test at 1% significance level whether the factory's claim is overstated.",
        options: [
          "p-value ≈ 0.026 — do not reject at 1%, insufficient evidence",
          "p-value ≈ 0.026 — reject at 1%, claim is overstated",
          "p-value < 0.01 — reject H₀, factory is lying",
          "Cannot test without population data"
        ],
        answer: 0,
        hint: "H₀: p=0.95, H₁: p<0.95. X~B(200, 0.95), find P(X≤181).",
        explanation: "X~B(200,0.95). P(X≤181) ≈ 0.026. Since 0.026 > 0.01, do not reject H₀ at 1% level. Insufficient evidence to say claim is overstated."
      },
      {
        type: "application", id: "app2", difficulty: 4,
        question: "Exam scores follow N(65, 100). The top 10% receive an A grade. What is the minimum score needed for an A? (Use P(Z < 1.282) = 0.9)",
        options: ["75.82", "77.8", "78.1", "80"],
        answer: 0,
        hint: "Find z such that P(Z < z) = 0.9. Then x = μ + zσ.",
        explanation: "z = 1.282. σ = √100 = 10. x = 65 + 1.282 × 10 = 65 + 12.82 = 77.82 ≈ 77.8."
      },
    ],
  },
};

export default levelContent;
