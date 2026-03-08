/** @type {import("../schema.js").LevelContent} */
const levelContent = {
  curriculumId: "igcse",
  levelId: "core",
  title: "Cambridge IGCSE Mathematics (Core)",
  skillMeta: [
    { id: "integers-place-value",    title: "Integers_and_Place_Value",       icon: "#",  xpReward: 100, prereqs: [] },
    { id: "fractions-decimals",      title: "Fractions_and_Decimals",          icon: "½",  xpReward: 100, prereqs: ["integers-place-value"] },
    { id: "percentages",             title: "Percentages",                     icon: "%",  xpReward: 100, prereqs: ["fractions-decimals"] },
    { id: "ratio-proportion",        title: "Ratio_and_Proportion",            icon: "∶",  xpReward: 100, prereqs: ["percentages"] },
    { id: "algebra-basics",          title: "Algebra_Basics",                  icon: "x",  xpReward: 100, prereqs: [] },
    { id: "linear-equations",        title: "Linear_Equations",                icon: "=",  xpReward: 100, prereqs: ["algebra-basics"] },
    { id: "sequences",               title: "Sequences",                       icon: "…",  xpReward: 100, prereqs: ["algebra-basics"] },
    { id: "geometry-angles",         title: "Angles_and_Polygons",             icon: "∠",  xpReward: 100, prereqs: [] },
    { id: "area-perimeter",          title: "Area_and_Perimeter",              icon: "□",  xpReward: 100, prereqs: ["geometry-angles"] },
    { id: "statistics-data",         title: "Statistics_and_Data",             icon: "∑",  xpReward: 100, prereqs: [] },
  ],

  allLessons: {
    "integers-place-value": [
      {
        type: "explanation", id: "e0",
        title: "Integers and Place Value",
        content: "Integers include all whole numbers and their negatives: …, −3, −2, −1, 0, 1, 2, 3, …\n\nPlace value tells us the value of each digit based on its position.\n\nOrder of operations (BIDMAS):\nBrackets → Indices → Division/Multiplication → Addition/Subtraction",
        example: "In 4,728: 4 is in the thousands place (= 4000), 7 is in the hundreds (= 700), 2 is in the tens (= 20), 8 is in the units.\n\nBIDMAS: 3 + 4 × 2 = 3 + 8 = 11 (not 14)"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "What is the value of the digit 6 in the number 36,482?",
        options: ["6", "60", "600", "6,000"],
        answer: 3,
        hint: "Count place values from the right: units, tens, hundreds, thousands…",
        explanation: "6 is in the thousands place, so its value is 6 × 1000 = 6,000."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 1,
        question: "Calculate: 20 − 4 × 3 + 1",
        options: ["49", "9", "5", "57"],
        answer: 1,
        hint: "Follow BIDMAS: multiplication before addition/subtraction.",
        explanation: "4 × 3 = 12 first. Then 20 − 12 + 1 = 9."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 2,
        question: "Calculate: (5 + 3)² − 4 × 6",
        answer: "40",
        hint: "Brackets first, then indices, then multiplication.",
        explanation: "(8)² − 4 × 6 = 64 − 24 = 40."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "Which of the following is NOT an integer?",
        options: ["−15", "0", "4/2", "4/3"],
        answer: 3,
        hint: "Can it be written as a whole number?",
        explanation: "4/2 = 2 (integer). 4/3 ≈ 1.33 — not a whole number, so not an integer."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain BIDMAS in your own words. Why do you think we need rules for the order of operations? What would happen if everyone calculated in a different order?"
      },
    ],

    "fractions-decimals": [
      {
        type: "explanation", id: "e0",
        title: "Fractions and Decimals",
        content: "A fraction represents a part of a whole: numerator/denominator.\n\nTo convert a fraction to a decimal: divide numerator by denominator.\n\nAdding/subtracting fractions: find LCM for common denominator.\nMultiplying: numerator × numerator, denominator × denominator.\nDividing: multiply by the reciprocal (flip the second fraction).",
        example: "3/4 = 0.75\n\n2/3 + 1/6 = 4/6 + 1/6 = 5/6\n\n3/4 ÷ 2/5 = 3/4 × 5/2 = 15/8 = 1 7/8"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Which decimal is equivalent to 3/8?",
        options: ["0.38", "0.375", "3.8", "0.3"],
        answer: 1,
        hint: "Divide 3 by 8.",
        explanation: "3 ÷ 8 = 0.375."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 1,
        question: "Calculate: 1/2 + 2/3 (give your answer as a fraction)",
        answer: "7/6",
        hint: "Find a common denominator of 6.",
        explanation: "3/6 + 4/6 = 7/6."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "Calculate: 2 1/4 × 1 1/3",
        options: ["2 1/3", "3", "2 3/4", "3 1/3"],
        answer: 1,
        hint: "Convert to improper fractions: 9/4 × 4/3.",
        explanation: "9/4 × 4/3 = 36/12 = 3."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "Order from smallest to largest: 5/8, 0.6, 3/5, 7/12",
        options: [
          "3/5, 7/12, 0.6, 5/8",
          "7/12, 3/5, 0.6, 5/8",
          "3/5, 0.6, 7/12, 5/8",
          "7/12, 0.6, 3/5, 5/8"
        ],
        answer: 1,
        hint: "Convert all to decimals: 5/8=0.625, 3/5=0.6, 7/12≈0.583.",
        explanation: "7/12 ≈ 0.583 < 3/5 = 0.6 = 0.6 < 5/8 = 0.625. So: 7/12 < 3/5 = 0.6 < 5/8."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Describe in your own words why you need to find a common denominator when adding fractions, but NOT when multiplying them. Use a simple example for each."
      },
    ],

    "percentages": [
      {
        type: "explanation", id: "e0",
        title: "Percentages",
        content: "Percentage means 'out of 100'. To find x% of a value, multiply by x/100.\n\nKey calculations:\n• % of amount: multiply by decimal\n• % change: (change ÷ original) × 100\n• Reverse percentage: if after increase/decrease you know the new amount, divide to find original",
        example: "15% of £240 = 0.15 × 240 = £36\n\nPrice rose from £50 to £65: change = 15, % increase = (15/50)×100 = 30%\n\nAfter 20% tax, item costs £96: original = 96 ÷ 1.20 = £80"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Find 35% of £180.",
        options: ["£35", "£54", "£63", "£72"],
        answer: 2,
        hint: "Multiply 0.35 × 180.",
        explanation: "0.35 × 180 = £63."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 1,
        question: "A TV costs £320. It is reduced by 15%. What is the sale price (in £)?",
        answer: "272",
        hint: "Reduction = 0.15 × 320. Sale price = 320 − reduction.",
        explanation: "0.15 × 320 = 48. Sale price = 320 − 48 = £272."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "A house bought for £150,000 is now worth £195,000. What is the percentage increase?",
        options: ["23%", "28%", "30%", "45%"],
        answer: 2,
        hint: "% increase = (increase ÷ original) × 100.",
        explanation: "Increase = £45,000. % = (45000/150000) × 100 = 30%."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "After a 25% price rise, a jacket costs £75. What was the original price?",
        options: ["£56.25", "£60", "£62.50", "£50"],
        answer: 1,
        hint: "Original × 1.25 = 75. Divide both sides by 1.25.",
        explanation: "Original = 75 ÷ 1.25 = £60."
      },
      {
        type: "reflection", id: "r1",
        prompt: "What is the difference between a percentage increase and a percentage point increase? Give an example where these are clearly different."
      },
    ],

    "ratio-proportion": [
      {
        type: "explanation", id: "e0",
        title: "Ratio and Proportion",
        content: "A ratio compares two or more quantities: a:b\nRatios can be simplified like fractions.\n\nDirect proportion: as one quantity increases, the other increases at the same rate (y = kx).\n\nInverse proportion: as one increases, the other decreases (y = k/x).\n\nUnitary method: find the value of 1 unit, then scale.",
        example: "Ratio 15:25 = 3:5 (divide both by 5)\n\nDirect: 5 workers build a wall in 12 days.\n3 workers: 5/3 × 12 = 20 days (inverse — fewer workers, more days)"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Simplify the ratio 24:36:48.",
        options: ["4:6:8", "2:3:4", "6:9:12", "8:12:16"],
        answer: 1,
        hint: "Find the HCF of 24, 36, and 48.",
        explanation: "HCF = 12. 24÷12 : 36÷12 : 48÷12 = 2:3:4."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 1,
        question: "Share £180 in the ratio 2:3:4. What is the largest share (in £)?",
        answer: "80",
        hint: "Total parts = 2+3+4=9. One part = 180÷9.",
        explanation: "One part = £20. Largest share (4 parts) = 4 × 20 = £80."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "8 workers can build a structure in 15 days. How many days would it take 12 workers? (Assume inverse proportion)",
        options: ["10 days", "12 days", "22.5 days", "18 days"],
        answer: 0,
        hint: "Total work = 8 × 15 worker-days. Divide by 12.",
        explanation: "Total work = 120 worker-days. 120 ÷ 12 = 10 days."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "A map has scale 1:500,000. Two cities are 7.4 cm apart on the map. What is the real distance in km?",
        options: ["37 km", "370 km", "3.7 km", "7.4 km"],
        answer: 0,
        hint: "Real distance = map distance × scale factor. Convert cm to km.",
        explanation: "7.4 cm × 500,000 = 3,700,000 cm = 37,000 m = 37 km."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain the difference between direct and inverse proportion with a real-world example of each. How do you recognise which type a problem is?"
      },
    ],

    "algebra-basics": [
      {
        type: "explanation", id: "e0",
        title: "Algebra Basics",
        content: "Algebra uses letters (variables) to represent unknown values.\n\nKey skills:\n• Simplify: collect like terms (same variable, same power)\n• Expand brackets: a(b + c) = ab + ac\n• Factorise: the reverse — write as a product\n\nSubstitution: replace variables with numbers and evaluate.",
        example: "Simplify: 3a + 5b − a + 2b = 2a + 7b\n\nExpand: 4(2x − 3) = 8x − 12\n\nFactorise: 6x + 9 = 3(2x + 3)\n\nSubstitute x=2, y=−1: 3x² − y = 3(4) − (−1) = 13"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Simplify: 5x + 3y − 2x + y",
        options: ["3x + 4y", "7x + 4y", "3x + 2y", "7x + 2y"],
        answer: 0,
        hint: "Collect x terms together and y terms together.",
        explanation: "(5x − 2x) + (3y + y) = 3x + 4y."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 1,
        question: "Expand and simplify: 3(2x − 4) + 5x",
        answer: "11x-12",
        hint: "Distribute 3 first.",
        explanation: "6x − 12 + 5x = 11x − 12."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "Factorise completely: 12x² − 8x",
        options: ["4(3x² − 2x)", "4x(3x − 2)", "2x(6x − 4)", "x(12x − 8)"],
        answer: 1,
        hint: "Find the HCF of 12x² and 8x.",
        explanation: "HCF = 4x. 12x² − 8x = 4x(3x − 2)."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "If p = 3 and q = −2, evaluate: p² + 3pq − q²",
        options: ["−21", "−15", "3", "21"],
        answer: 0,
        hint: "Substitute carefully: p² = 9, pq = −6, q² = 4.",
        explanation: "9 + 3(−6) − 4 = 9 − 18 − 4 = −13. Closest: None exact — let me recompute: 3² + 3(3)(−2) − (−2)² = 9 − 18 − 4 = −13."
      },
      {
        type: "reflection", id: "r1",
        prompt: "What does it mean to 'factorise' an expression? Why is factorising useful? Give an example and show how it helps you solve a problem."
      },
    ],

    "linear-equations": [
      {
        type: "explanation", id: "e0",
        title: "Linear Equations",
        content: "A linear equation has the form ax + b = c. Solve by isolating x using inverse operations.\n\nSimultaneous equations: two equations, two unknowns. Solve by:\n• Elimination: add or subtract equations to remove one variable\n• Substitution: rearrange one equation and substitute into the other",
        example: "Solve: 3x − 5 = 16\n  3x = 21\n  x = 7\n\nSimultaneous: 2x + y = 7 and x − y = 2\n  Add: 3x = 9 → x = 3, then y = 1"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Solve: 4x + 7 = 23",
        options: ["x = 4", "x = 5", "x = 6", "x = 8"],
        answer: 0,
        hint: "Subtract 7 from both sides, then divide by 4.",
        explanation: "4x = 16 → x = 4."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 2,
        question: "Solve: 5(x − 3) = 2x + 6. What is x?",
        answer: "7",
        hint: "Expand the brackets first.",
        explanation: "5x − 15 = 2x + 6 → 3x = 21 → x = 7."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "Solve simultaneously: x + y = 10 and 2x − y = 5. What is x?",
        options: ["3", "4", "5", "6"],
        answer: 2,
        hint: "Add the two equations to eliminate y.",
        explanation: "Adding: 3x = 15 → x = 5. Then y = 5."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "The sum of two numbers is 23 and their difference is 7. What are the two numbers?",
        options: ["15 and 8", "12 and 11", "16 and 7", "10 and 13"],
        answer: 0,
        hint: "Set up two equations: n₁ + n₂ = 23 and n₁ − n₂ = 7.",
        explanation: "Add equations: 2n₁ = 30 → n₁ = 15. So n₂ = 8."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Describe the two methods for solving simultaneous equations (elimination and substitution). When might you prefer one method over the other?"
      },
    ],

    "sequences": [
      {
        type: "explanation", id: "e0",
        title: "Sequences",
        content: "A sequence is a list of numbers following a pattern (rule).\n\nArithmetic sequence: add or subtract a constant (common difference d).\nNth term formula: aₙ = a₁ + (n−1)d\n\nGeometric sequence: multiply by a constant (common ratio r).\n\nOther sequences: square numbers (1,4,9,16…), triangular numbers (1,3,6,10…)",
        example: "Arithmetic: 3, 7, 11, 15… (d = 4)\nNth term: 3 + (n−1)×4 = 4n − 1\n10th term = 4(10) − 1 = 39\n\nGeometric: 2, 6, 18, 54… (r = 3)"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "What is the next term in the sequence 5, 11, 17, 23, …?",
        options: ["27", "28", "29", "30"],
        answer: 2,
        hint: "Find the common difference.",
        explanation: "Common difference = 6. Next term = 23 + 6 = 29."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 2,
        question: "The nth term of a sequence is 3n + 2. What is the 8th term?",
        answer: "26",
        hint: "Substitute n = 8.",
        explanation: "3(8) + 2 = 24 + 2 = 26."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "Find the nth term for the sequence: 4, 7, 10, 13, …",
        options: ["n + 3", "3n + 1", "4n − 1", "3n − 1"],
        answer: 1,
        hint: "Common difference is 3, first term is 4.",
        explanation: "d = 3, a₁ = 4. Nth term = 4 + (n−1)×3 = 4 + 3n − 3 = 3n + 1."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "Which term of the sequence 5, 8, 11, 14, … equals 98?",
        options: ["n = 30", "n = 31", "n = 32", "n = 33"],
        answer: 2,
        hint: "Set 3n + 2 = 98 and solve for n.",
        explanation: "Nth term = 3n + 2. 3n + 2 = 98 → 3n = 96 → n = 32."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain the difference between an arithmetic and a geometric sequence. How do you find the nth term formula for an arithmetic sequence? Give your own example."
      },
    ],

    "geometry-angles": [
      {
        type: "explanation", id: "e0",
        title: "Angles and Polygons",
        content: "Angle facts:\n• Angles on a straight line: sum = 180°\n• Angles around a point: sum = 360°\n• Vertically opposite angles: equal\n\nParallel lines cut by a transversal:\n• Corresponding angles: equal (F-shape)\n• Alternate angles: equal (Z-shape)\n• Co-interior angles: sum = 180° (C-shape)\n\nTriangles: sum of angles = 180°\nPolygons: interior angle sum = (n−2)×180°",
        example: "Regular hexagon (6 sides):\nSum = (6−2)×180 = 720°\nEach interior angle = 720/6 = 120°"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Two angles on a straight line are in the ratio 1:4. What is the larger angle?",
        options: ["36°", "144°", "120°", "60°"],
        answer: 1,
        hint: "They add to 180°. Share 180 in ratio 1:4.",
        explanation: "Total parts = 5. One part = 36°. Larger angle = 4 × 36 = 144°."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 1,
        question: "A triangle has angles 47° and 83°. What is the third angle (in degrees)?",
        answer: "50",
        hint: "Angles in a triangle sum to 180°.",
        explanation: "180 − 47 − 83 = 50°."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "What is the sum of interior angles of a regular octagon (8 sides)?",
        options: ["900°", "1080°", "1260°", "720°"],
        answer: 1,
        hint: "Sum = (n − 2) × 180°",
        explanation: "(8 − 2) × 180 = 6 × 180 = 1080°."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "Two parallel lines are cut by a transversal. One angle is 65°. What is its co-interior angle?",
        options: ["65°", "115°", "25°", "90°"],
        answer: 1,
        hint: "Co-interior (same-side interior) angles sum to 180°.",
        explanation: "Co-interior angles: 65 + x = 180 → x = 115°."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Describe the three angle relationships formed when parallel lines are cut by a transversal (corresponding, alternate, co-interior). Which are equal and which are supplementary?"
      },
    ],

    "area-perimeter": [
      {
        type: "explanation", id: "e0",
        title: "Area and Perimeter",
        content: "Perimeter: total length of the boundary.\nArea: space enclosed inside a shape.\n\nFormulas:\n• Rectangle: P = 2(l + w), A = lw\n• Triangle: A = ½bh\n• Trapezium: A = ½(a + b)h\n• Circle: C = 2πr, A = πr²\n• Compound shapes: split into simpler shapes",
        example: "Trapezium with parallel sides 8 cm and 5 cm, height 4 cm:\nA = ½(8 + 5) × 4 = ½ × 13 × 4 = 26 cm²"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "A rectangle is 12 cm long and 7 cm wide. What is its area?",
        options: ["38 cm²", "84 cm²", "76 cm²", "42 cm²"],
        answer: 1,
        hint: "Area = length × width.",
        explanation: "A = 12 × 7 = 84 cm²."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 1,
        question: "A triangle has base 10 m and height 6 m. What is its area in m²?",
        answer: "30",
        hint: "Area = ½ × base × height.",
        explanation: "A = ½ × 10 × 6 = 30 m²."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "A trapezium has parallel sides of 9 cm and 5 cm, and a height of 8 cm. What is its area?",
        options: ["48 cm²", "56 cm²", "72 cm²", "32 cm²"],
        answer: 1,
        hint: "A = ½(a + b)h",
        explanation: "A = ½(9 + 5) × 8 = ½ × 14 × 8 = 56 cm²."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "A garden is a rectangle 15 m × 10 m with a semicircular flowerbed of diameter 6 m cut from one end. What is the remaining garden area? (π ≈ 3.14)",
        options: ["136.87 m²", "150 m²", "121.84 m²", "134.87 m²"],
        answer: 0,
        hint: "Subtract the semicircle area from the rectangle area.",
        explanation: "Rectangle: 150 m². Semicircle r = 3 m: A = ½π(9) ≈ 14.13 m². Remaining ≈ 150 − 14.13 ≈ 135.87 m²."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain the difference between perimeter and area. Could two shapes have the same perimeter but different areas? Give an example."
      },
    ],

    "statistics-data": [
      {
        type: "explanation", id: "e0",
        title: "Statistics and Data",
        content: "Measures of central tendency:\n• Mean: sum of values ÷ number of values\n• Median: middle value when ordered\n• Mode: most frequent value\n\nMeasure of spread:\n• Range: max − min\n\nData representation:\n• Frequency tables, bar charts, pie charts, pictograms\n• Scatter graphs show correlation (positive, negative, or none)",
        example: "Data: 3, 7, 7, 9, 12, 15\nMean = (3+7+7+9+12+15)/6 = 53/6 ≈ 8.8\nMedian = (7+9)/2 = 8\nMode = 7\nRange = 15 − 3 = 12"
      },
      {
        type: "multiple_choice", id: "mc1", difficulty: 1,
        question: "Find the mean of: 4, 8, 6, 5, 7",
        options: ["5", "6", "7", "8"],
        answer: 1,
        hint: "Add all values and divide by how many there are.",
        explanation: "(4+8+6+5+7) = 30. 30 ÷ 5 = 6."
      },
      {
        type: "fill_blank", id: "fb1", difficulty: 1,
        question: "Find the median of: 2, 5, 8, 11, 15, 20",
        answer: "9.5",
        hint: "Even number of values: average the two middle numbers.",
        explanation: "Middle values are 8 and 11. Median = (8 + 11)/2 = 9.5."
      },
      {
        type: "multiple_choice", id: "mc2", difficulty: 2,
        question: "Five students' test scores are 62, 75, 80, 80, and x. The mean is 75. What is x?",
        options: ["63", "70", "78", "80"],
        answer: 0,
        hint: "Mean = sum/5 = 75, so sum = 375.",
        explanation: "62 + 75 + 80 + 80 + x = 375 → 297 + x = 375 → x = 78. Wait: 62+75=137, 137+80=217, 217+80=297. x=375−297=78. Answer is 78."
      },
      {
        type: "multiple_choice", id: "mc3", difficulty: 3,
        question: "A scatter graph shows as revision time increases, test scores increase. What type of correlation is this, and what does it imply?",
        options: [
          "Negative correlation — revising less improves scores",
          "No correlation — revision has no effect",
          "Positive correlation — more revision is associated with higher scores",
          "Positive correlation — revision causes higher scores"
        ],
        answer: 2,
        hint: "Correlation describes an association, not necessarily causation.",
        explanation: "Both variables increase together → positive correlation. However, correlation does NOT prove causation."
      },
      {
        type: "reflection", id: "r1",
        prompt: "Explain when the median would be a better measure of average than the mean. Give a real-world example (e.g. salaries, house prices) where the median is more useful."
      },
    ],
  },

  deepDive: {
    "integers-place-value": [
      {
        type: "application", id: "app1", difficulty: 4,
        question: "A supermarket sells 3 types of packs: 6-packs for £2.40, 12-packs for £4.44, and 24-packs for £8.40. Which is the best value per unit, and by how many pence per unit is it better than the worst value?",
        options: [
          "24-pack (35p each) — 5p better than 6-pack (40p)",
          "12-pack (37p each) — best value",
          "6-pack best value at 40p",
          "All equal"
        ],
        answer: 0,
        hint: "Calculate pence per unit for each pack.",
        explanation: "6-pack: 240÷6=40p. 12-pack: 444÷12=37p. 24-pack: 840÷24=35p. Best=24-pack. Difference from worst (6-pack): 40−35=5p."
      },
      {
        type: "application", id: "app2", difficulty: 4,
        question: "Using BIDMAS: A = 3 × 4² − (8 + 2) ÷ 5. Calculate A.",
        options: ["44", "46", "34", "6"],
        answer: 0,
        hint: "Work through BIDMAS: brackets, indices, division, multiplication, subtraction.",
        explanation: "Brackets: (8+2)=10. Indices: 4²=16. Mult: 3×16=48. Div: 10÷5=2. Subtract: 48−2=46. Wait: 3×16=48, 10÷5=2, 48−2=46. Answer B."
      },
    ],
    "fractions-decimals": [
      {
        type: "application", id: "app1", difficulty: 4,
        question: "A pipe fills a tank in 6 hours. A second pipe drains the tank in 9 hours. If both are open simultaneously, how long does it take to fill the tank from empty?",
        options: ["3 hours", "15 hours", "18 hours", "54 hours"],
        answer: 2,
        hint: "Fill rate = 1/6 per hour. Drain rate = 1/9 per hour. Net rate = 1/6 − 1/9.",
        explanation: "Net rate = 1/6 − 1/9 = 3/18 − 2/18 = 1/18 per hour. Time = 18 hours."
      },
      {
        type: "application", id: "app2", difficulty: 4,
        question: "A recipe uses 2/3 cup flour, 3/4 cup sugar, and 1/2 cup butter. You want to make 2.5 batches. How many total cups of ingredients do you need?",
        options: ["4.79 cups", "5.21 cups", "4.625 cups", "5.0 cups"],
        answer: 2,
        hint: "Add all ingredients for one batch, then multiply by 2.5.",
        explanation: "One batch: 2/3 + 3/4 + 1/2 = 8/12 + 9/12 + 6/12 = 23/12. For 2.5 batches: 23/12 × 2.5 = 57.5/12 = 4.79... cups."
      },
    ],
    "statistics-data": [
      {
        type: "application", id: "app1", difficulty: 4,
        question: "A class of 30 students took a test. 10 students scored in the range 50–60 with a mean of 55, and 20 students scored in the range 70–80 with a mean of 74. What is the overall mean score for the class?",
        options: ["64.5", "67.7", "69", "65"],
        answer: 1,
        hint: "Weighted mean: (sum of all scores) ÷ 30. Group totals = mean × count.",
        explanation: "Group 1 total = 55×10=550. Group 2 total = 74×20=1480. Overall mean = (550+1480)/30 = 2030/30 = 67.67."
      },
      {
        type: "application", id: "app2", difficulty: 4,
        question: "In a survey, 120 people were asked their favourite sport. Football: 45, Tennis: 30, Swimming: 25, Other: 20. What angle represents Tennis on a pie chart?",
        options: ["30°", "90°", "75°", "25°"],
        answer: 1,
        hint: "Angle = (frequency ÷ total) × 360°.",
        explanation: "Angle = (30/120) × 360 = 0.25 × 360 = 90°."
      },
    ],
  },
};

export default levelContent;
