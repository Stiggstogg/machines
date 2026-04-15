// Song and pattern types
export interface Pattern {
    patternKey: string;
    markerName: string;
    lightColors: string[];
}

export type Song = Pattern[];

// Pattern including combinations (based on pattern plus combinations of it); additionally numbers are used instead of strings where possible
export interface PatternCombination extends Pattern {
    lightsInSync: boolean;
}

// Rule and rule set types
export interface Rule extends PatternCombination {
    danceKey: string;
}

export type RuleSet = Rule[];