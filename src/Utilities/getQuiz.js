import axios from "axios";

const Base_URL = "http://127.0.0.1:8000/api/v1/";

const fetchQuiz = async (courseSlug, quizSlug) => {
  try {
    const quizResponse = await axios.get(
      `${Base_URL}quiz/courses/${courseSlug}/quiz/${quizSlug}/`,
      { withCredentials: true }
    );
    const questionsResponse = await axios.get(
      `${Base_URL}quiz/courses/${courseSlug}/quiz/${quizSlug}/questions/`,
      { withCredentials: true }
    );

    const questions = questionsResponse.data.data;
    const questionDetails = await Promise.all(
      questions.map(async (question) => {
        let questionDetail;
        if (question.question_type === "essay") {
          questionDetail = await axios.get(
            `${Base_URL}quiz/courses/${courseSlug}/quiz/${quizSlug}/questions/${question.id}/essay_types/`,
            { withCredentials: true }
          );
        } else if (question.question_type === "boolean") {
          questionDetail = await axios.get(
            `${Base_URL}quiz/courses/${courseSlug}/quiz/${quizSlug}/questions/${question.id}/tf_types/`,
            { withCredentials: true }
          );
        } else if (question.question_type === "multi-choice") {
          questionDetail = await axios.get(
            `${Base_URL}quiz/courses/${courseSlug}/quiz/${quizSlug}/questions/${question.id}/mtp_types/`,
            { withCredentials: true }
          );
        }

        return { ...question, details: questionDetail.data.data[0] || {} };
      })
    );
    // console.log("quiz", quizResponse.data.data);
    // console.log("question", questionDetails);
    return {
      quiz: quizResponse.data.data,
      questions: questionDetails,
    };
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    return null;
  }
};

export default fetchQuiz;
