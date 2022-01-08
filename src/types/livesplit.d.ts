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
	time?: number;
	state?: 'aheadGaining' | 'aheadLosing' | 'behindGaining' | 'behindLosing' | 'best';
	delta?: string;
	bestSplit: number;
	bestRun: number;
	splitTime?: number;
	splitHistory: number[];
}

export interface RunMetadata {
	category?: string;
	pb?: number;
	sumOfBest?: number;
	attempts: number;
	successfulAttempts: number;
	previousRuns: PreviousRun[];
}

interface PreviousRun {
	start: Date;
	end: Date;
	time: number;
	finished: boolean;
}
