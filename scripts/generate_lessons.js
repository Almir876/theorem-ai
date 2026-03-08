import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function slug(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function qid(prefix, idx) {
  return `${prefix}${idx}`;
}

function buildLessonQuestions(title, seed) {
  const safe = title.replace(/\s+/g, " ").trim();
  const a = (seed % 9) + 2;
  const b = ((seed + 3) % 8) + 1;
  const c = ((seed * 2) % 7) + 1;
  const sum = a + b;
  const diff = Math.abs(a - b);
  const product = a * c;

  return [
    // Concept overview
    {
      id: qid("e", 0),
      type: "explanation",
      title: safe,
      content: `In this lesson you’ll learn the key idea behind: ${safe}.\n\nWe start with simple numeric examples, then move on to short word problems and mixed practice questions.`,
      example: `Example: If a = ${a} and b = ${b}, then a + b = ${sum}.`,
    },
    // Worked multi-step example
    {
      id: qid("e", 1),
      type: "explanation",
      title: `${safe} — Worked example`,
      content:
        `Suppose a = ${a}, b = ${b} and c = ${c}.\n\n` +
        `1. First compute a + b = ${a} + ${b} = ${sum}.\n` +
        `2. Then compute a − b = ${a} − ${b} = ${a - b}.\n` +
        `3. Finally compute a × c = ${a} × ${c} = ${product}.\n\n` +
        `Being comfortable with these basic operations is essential before you tackle exam-style questions on ${safe}.`,
      example: `Check: ${a} + ${b} = ${sum}, ${a} − ${b} = ${a - b}, ${a} × ${c} = ${product}.`,
    },
    // Basic computation
    {
      id: qid("mc", 1),
      type: "multiple_choice",
      difficulty: 1,
      question: `If a = ${a} and b = ${b}, what is a + b?`,
      options: [`${sum - 1}`, `${sum}`, `${sum + 1}`, `${sum + 2}`],
      answer: 1,
      hint: "Add the two numbers.",
      explanation: `${a} + ${b} = ${sum}.`,
    },
    // Difference
    {
      id: qid("mc", 2),
      type: "multiple_choice",
      difficulty: 2,
      question: `If a = ${a} and b = ${b}, what is |a − b|?`,
      options: [
        `${diff - 1}`,
        `${diff}`,
        `${diff + 1}`,
        `${diff + 2}`,
      ],
      answer: 1,
      hint: "Subtract the smaller number from the larger one.",
      explanation: `|a − b| means the positive difference. Here |${a} − ${b}| = ${diff}.`,
    },
    // Word problem style
    {
      id: qid("mc", 3),
      type: "multiple_choice",
      difficulty: 2,
      question:
        `A box holds ${a} red counters and ${b} blue counters. How many counters are there in total?`,
      options: [`${sum}`, `${sum + 1}`, `${sum - 1}`, `${sum + 2}`],
      answer: 0,
      hint: "Total means add the two amounts.",
      explanation: `Total counters = ${a} + ${b} = ${sum}.`,
    },
    // Concept check (true statement)
    {
      id: qid("mc", 4),
      type: "multiple_choice",
      difficulty: 3,
      question: `Which statement about a, b and c is true?`,
      options: [
        `${a} + ${b} = ${sum + 2}`,
        `${a} × ${c} = ${product + 1}`,
        `${a} × ${c} = ${product}`,
        `${a} − ${b} = ${sum}`,
      ],
      answer: 2,
      hint: "Carefully compute each expression before deciding.",
      explanation: `Only ${a} × ${c} = ${product} is correct. The other options change the result.`,
    },
    // Fill-in: basic sum
    {
      id: qid("fb", 3),
      type: "fill_blank",
      difficulty: 1,
      question: `Fill in the blank: ${a} + ${b} = ____`,
      answer: String(sum),
      hint: "Add a and b.",
      explanation: `Adding gives ${sum}.`,
    },
    // Fill-in: product
    {
      id: qid("fb", 4),
      type: "fill_blank",
      difficulty: 2,
      question: `Fill in the blank: ${a} × ${c} = ____`,
      answer: String(product),
      hint: "Think repeated addition: add ${a} to itself ${c} times.",
      explanation: `${a} × ${c} = ${product}.`,
    },
  ];
}

/**
 * Outline format:
 * {
 *   "curriculumId": "commoncore",
 *   "levelId": "grade-7",
 *   "title": "Common Core Grade 7",
 *   "units": [
 *     { "title": "Unit name", "topics": ["Topic A", "Topic B"] }
 *   ]
 * }
 */
async function main() {
  const outlinePath = process.argv[2];
  if (!outlinePath) {
    console.error("Usage: node scripts/generate_lessons.js <outline.json>");
    process.exit(1);
  }

  const raw = await fs.readFile(outlinePath, "utf8");
  const outline = JSON.parse(raw);

  const curriculumId = outline.curriculumId;
  const levelId = outline.levelId;
  const title = outline.title || `${curriculumId} ${levelId}`;
  const units = Array.isArray(outline.units) ? outline.units : [];

  const allLessons = {};
  const skillMeta = [];

  let skillIdx = 0;
  for (const u of units) {
    const unitTitle = u.title || `Unit ${skillIdx + 1}`;
    const topics = Array.isArray(u.topics) ? u.topics : [];
    for (const t of topics) {
      const skillId = `${slug(unitTitle)}-${slug(t)}`;
      const questions = buildLessonQuestions(`${unitTitle}: ${t}`, skillIdx + 1);
      allLessons[skillId] = questions;
      skillMeta.push({
        id: skillId,
        title: t,
        icon: u.icon || "•",
        xpReward: 100,
        prereqs: [],
      });
      skillIdx += 1;
    }
  }

  const outObj = {
    curriculumId,
    levelId,
    title,
    skillMeta,
    allLessons,
  };

  const outDir = path.join(process.cwd(), "src", "content", curriculumId);
  const outFile = path.join(outDir, `${levelId}.js`);
  await fs.mkdir(outDir, { recursive: true });

  const contents =
`/** @type {import("../schema.js").LevelContent} */
const levelContent = ${JSON.stringify(outObj, null, 2)};

export default levelContent;
`;

  await fs.writeFile(outFile, contents, "utf8");
  console.log(`Wrote ${path.relative(process.cwd(), outFile)} (${skillMeta.length} lessons)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

