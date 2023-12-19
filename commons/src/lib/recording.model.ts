export interface Recording {
  id: string;
  name: string;
  duration: number;
  speakers: string[];
  date: string;
  preview?: string;
}
