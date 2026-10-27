CREATE TABLE `policy_scenarios` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`adjustments` text NOT NULL,
	`result` text NOT NULL,
	`created_at` text NOT NULL
);
