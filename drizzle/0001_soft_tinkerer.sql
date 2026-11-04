CREATE TABLE `applause` (
	`project_id` text NOT NULL,
	`visitor` text NOT NULL,
	`kind` text NOT NULL,
	PRIMARY KEY(`project_id`, `visitor`, `kind`),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `projects` ADD `members` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `mascot` text DEFAULT 'ghost' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `screenshot` text DEFAULT '' NOT NULL;