export interface WhisperResponse {
  start: number;
  end: number;
  text: string;
  speaker: string;
  words: {
    word: string;
    start: number;
    end: number;
    score: number;
    speaker: string;
  }[];
}
