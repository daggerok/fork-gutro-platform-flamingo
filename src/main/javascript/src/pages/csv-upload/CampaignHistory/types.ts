export type CampaignHistoryProps = {
    shouldUpdate: number | null;
    showCampaignDetails: (id: string) => void;
};

export type HistoryTableColumnsProps = {
    showCampaignDetails: (id: string) => void;
}

export type EventValue<DateType> = DateType | null;
export type RangeValue<DateType> = [EventValue<DateType>, EventValue<DateType>] | null;