CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`url` text NOT NULL,
	`created_at` integer NOT NULL
);
