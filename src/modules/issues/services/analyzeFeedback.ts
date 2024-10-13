import compromise from "compromise";
import { feedback } from "../../feedback/types";
import { negativeKeywords, positiveKeywords } from "../../../shared/constants";

interface feedbackAnalysis extends feedback {
  upvotes: number;
  downvotes: number;
}

async function analyzeFeedbacks(feedbacks: feedbackAnalysis[]) {
  const results = feedbacks.map((feedback) => {
    const doc = compromise(feedback.feedback);

    // Extracting nouns and adjectives as a simple analysis
    const nouns = doc.nouns().out("array");
    const adjectives = doc.adjectives().out("array");

    const sentimentScore = feedback.feedback
      .toLowerCase()
      .split(" ")
      .reduce((score, word) => {
        if (positiveKeywords.includes(word)) return score + 1;
        if (negativeKeywords.includes(word)) return score - 1;
        return score;
      }, 0);

    return {
      feedback: feedback.feedback,
      nouns,
      adjectives,
      sentimentScore, // Positive scores are better, negative scores are worse
    };
  });

  // Example: Determine overall sentiment
  const totalScore = results.reduce(
    (total, result) => total + result.sentimentScore,
    0
  );
  const overallSentiment =
    totalScore > 0 ? "Positive" : totalScore < 0 ? "Negative" : "Neutral";

  return {
    analyzedFeedbacks: results,
    overallSentiment,
  };
}

export default analyzeFeedbacks;
