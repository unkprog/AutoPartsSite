interface Window {
    date_parse(dateStr: string): Date;
    date_ddmmyyyy(date: Date): string;
    date_ddmmyyyy_withtime(date: Date): string;
    date_from_ddmmyyyy(dateStr: string): Date;
    numberToString(value: number, decimal: number): string;
    numberPadZero(value: number, length: number): string;
    numberRound(value: number, places: number): number;
    strToHashCode(str: string): number;
    WeekNamesByValue: Array<string>;
}


declare let nativeBridge: any;
