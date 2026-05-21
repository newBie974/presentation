import readingTime from "reading-time";
import { READING_WORDS_PER_MIN } from "./constants";

export function computeReadingTime(body: string): {
  minutes: number;
  words: number;
} {
  const result = readingTime(body, { wordsPerMinute: READING_WORDS_PER_MIN });
  return {
    minutes: Math.max(1, Math.ceil(result.minutes)),
    words: result.words,
  };
}
