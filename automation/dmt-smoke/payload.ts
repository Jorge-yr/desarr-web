import { getMaturityLevel, QUESTIONS } from "../../src/lib/det-data";

export const DMT_SMOKE_TEST_EMAIL = "prueba_automatica@dmt.com";

const SMOKE_ANSWER_INDEX = 2;

export function buildDmtSmokeTestPayload(runDate = new Date()) {
  const answers = QUESTIONS.map((question) => {
    const option = question.options[SMOKE_ANSWER_INDEX];

    return {
      questionId: question.id,
      questionTitle: question.title,
      selectedLabel: option.label,
      score: option.score,
    };
  });

  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
  const maturity = getMaturityLevel(totalScore);
  const runLabel = runDate.toISOString().slice(0, 10);

  return {
    lead: {
      fullName: `Prueba Automática DMT (${runLabel})`,
      company: "Desarr QA Automatizado",
      email: DMT_SMOKE_TEST_EMAIL,
      phone: "+5493794000000",
      country: "Argentina",
      state: "Corrientes",
      companyTypes: ["Industrial"],
      otherCompanyType: "",
    },
    score: totalScore,
    maturityLevel: `Nivel ${maturity.level} - ${maturity.name}`,
    answers,
    recommendations: maturity.recommendations,
    wantsAdvisorContact: false,
    confirmed: true,
  };
}
