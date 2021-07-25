export type Commands = "starttimer" | "startorsplit" | "split" | "unsplit" | "skipsplit" | "pause" | "resume" | "reset" | "initgametime" | "pausegametime" | "unpausegametime";
export type Events = "start" | "split" | "pause" | "reset" | "resume" | "scroll_down" | "scroll_up" | "skip_split" | "switch_comparison_next" | "switch_comparison_previous" | "undo_all_pauses" | "undo_split";
export type Getters = 'getdelta';

export interface Timer {
	milliseconds: number;
	state: string;
	splitMilliseconds: number;
}

export interface Split {
	index: number;
	time?: GameRealTime;
	state?: 'aheadGaining' | 'aheadLosing' | 'behindGaining' | 'behindLosing' | 'best';
	delta?: string;
	bestSplit?: GameRealTime;
	bestRun?: GameRealTime;
	splitTime?: number;
}

interface GameRealTime {
	gameTime?: number;
	realTime?: number;
}
