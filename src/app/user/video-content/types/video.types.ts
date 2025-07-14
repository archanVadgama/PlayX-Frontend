export interface viewedVideosI{
  id: string;
  lastViewedAt: string;
  count: number;
  thresholds: number[];
  lastTimestamp?: number;
}