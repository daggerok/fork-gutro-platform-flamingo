export type CampaignDetailsProps = {
	campaignId: string | null;
	handleClose: () => void;
};

export type CampaignDetails = {
	campaignId: string;
	createDate: number;
	state: string;
	customerPromotions: Array<CustomerPromotionDetails>;
}

export type CustomerPromotionDetails = {
	customerPromotionId: string;
	campaignId: string;
	promotionId: string;
	playerId: string;
	state: string;
	createDate: number;
	updateDate: number;
	scheduleDate: number;
	brand: string;
	currency: string;
	amount: string;
}

export type ConfirmAbortDetails = {
	campaign: boolean;
	customerPromotionId?: string;
	playerId?: string;
}

export type CustomerPromotionTableColumnsProps = {
	abortCustomerPromotion: (id: string) => void;
}
