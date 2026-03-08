/**
 * Content schema (JSDoc types) for curricula/levels/lessons.
 * Kept as plain JS to match this project’s current setup.
 */

/**
 * @typedef {"explanation"|"multiple_choice"|"fill_blank"|"reflection"|"application"} QuestionType
 */

/**
 * @typedef {Object} ExplanationQuestion
 * @property {"explanation"} type
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string=} example
 */

/**
 * @typedef {Object} MultipleChoiceQuestion
 * @property {"multiple_choice"} type
 * @property {string} id
 * @property {number=} difficulty
 * @property {string} question
 * @property {string[]} options
 * @property {number} answer
 * @property {string=} hint
 * @property {string} explanation
 */

/**
 * @typedef {Object} FillBlankQuestion
 * @property {"fill_blank"} type
 * @property {string} id
 * @property {number=} difficulty
 * @property {string} question
 * @property {string|number} answer
 * @property {string=} hint
 * @property {string} explanation
 */

/**
 * @typedef {Object} ReflectionQuestion
 * @property {"reflection"} type
 * @property {string} id
 * @property {string} prompt
 */

/**
 * @typedef {Object} ApplicationQuestion
 * @property {"application"} type
 * @property {string} id
 * @property {4} difficulty
 * @property {string} question
 * @property {string[]=} options
 * @property {number=} answer
 * @property {string=} fill_answer
 * @property {string=} hint
 * @property {string} explanation
 */

/**
 * @typedef {ExplanationQuestion|MultipleChoiceQuestion|FillBlankQuestion|ReflectionQuestion|ApplicationQuestion} Question
 */

/**
 * @typedef {Object} Lesson
 * @property {string} id
 * @property {string} title
 * @property {string=} description
 * @property {Question[]} questions
 */

/**
 * @typedef {Object} Unit
 * @property {string} id
 * @property {string} title
 * @property {Lesson[]} lessons
 */

/**
 * @typedef {Object} SkillMeta
 * @property {string} id
 * @property {string} title
 * @property {string} icon
 * @property {number} xpReward
 * @property {string[]} prereqs
 */

/**
 * @typedef {Object} LevelContent
 * @property {string} curriculumId
 * @property {string} levelId
 * @property {string} title
 * @property {SkillMeta[]} skillMeta
 * @property {Record<string, Question[]>} allLessons
 * @property {Unit[]=} units
 * @property {Record<string, Question[]>=} deepDive
 */

export {};
