// Song and sections
export interface SongSection {
    albumName: string;
    trackName: string;
    lightColors: string[];
}

export type Song = SongSection[];

// Pattern including combinations (based on Song Sections plus combinations of it)
export interface Pattern extends SongSection {
    lightsInSync: boolean;
}

// Rule and rule set types
export interface Rule extends Pattern {
    danceKey: string;
}

export type RuleSet = Rule[];

// Parameters for the meter
export interface MeterParameters {
    maximum: number;
    wrongFactor: number;
    correctFactor: number;
}