/**
 * Curriculum registry + lazy loaders for level content.
 *
 * Each loader returns a `LevelContent` object (see `src/content/schema.js`).
 */

/** @type {const} */
export const CURRICULUM = {
  commoncore: "commoncore",
  igcse: "igcse",
  ib: "ib",
  alevel: "alevel",
};

/** @type {Record<string, {id:string,title:string,levels:{id:string,title:string}[]}>} */
export const curriculumCatalog = {
  [CURRICULUM.commoncore]: {
    id: CURRICULUM.commoncore,
    title: "US Common Core",
    levels: [{ id: "grade-7", title: "Grade 7" }],
  },
  [CURRICULUM.igcse]: {
    id: CURRICULUM.igcse,
    title: "Cambridge IGCSE",
    levels: [{ id: "core", title: "Core" }],
  },
  [CURRICULUM.ib]: {
    id: CURRICULUM.ib,
    title: "IB Mathematics",
    levels: [{ id: "aa-sl", title: "AA SL" }],
  },
  [CURRICULUM.alevel]: {
    id: CURRICULUM.alevel,
    title: "A-Levels",
    levels: [{ id: "math", title: "Mathematics" }],
  },
};

/** @type {Record<string, Record<string, () => Promise<any>>>} */
const levelLoaders = {
  [CURRICULUM.commoncore]: {
    "grade-7": () => import("./commoncore/grade-7.js"),
  },
  [CURRICULUM.igcse]: {
    core: () => import("./igcse/core.js"),
  },
  [CURRICULUM.ib]: {
    "aa-sl": () => import("./ib/aa-sl.js"),
  },
  [CURRICULUM.alevel]: {
    math: () => import("./alevel/math.js"),
  },
};

export function getDefaultSelection() {
  return { curriculumId: CURRICULUM.commoncore, levelId: "grade-7" };
}

/**
 * @param {string} curriculumId
 * @param {string} levelId
 * @returns {Promise<import("./schema.js").LevelContent>}
 */
export async function loadLevelContent(curriculumId, levelId) {
  const loader = levelLoaders[curriculumId]?.[levelId];
  if (!loader) throw new Error(`Unknown curriculum/level: ${curriculumId}/${levelId}`);
  const mod = await loader();
  return mod.default ?? mod.levelContent ?? mod;
}

