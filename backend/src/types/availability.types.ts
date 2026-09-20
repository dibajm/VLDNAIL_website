export type BusinessHour = {
	day_of_week: number;
	open_time: string | null;
	close_time: string | null;
	is_open: boolean;
	updated_at: string;
};

export type BlockedPeriod = {
	id: string;
	starts_at: string;
	ends_at: string;
	reason: string;
	created_at: string;
};