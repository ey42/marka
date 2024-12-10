DO $$ BEGIN
 CREATE TYPE "public"."like" AS ENUM('like', 'dislike');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('customer', 'merchant');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Inbox" (
	"lastMessageId" uuid NOT NULL,
	"lastSentUser" text NOT NULL,
	CONSTRAINT "Inbox_lastMessageId_lastSentUser_pk" PRIMARY KEY("lastMessageId","lastSentUser")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"expiresAt" timestamp,
	"password" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catagories" (
	"id" uuid PRIMARY KEY NOT NULL,
	"categories" text NOT NULL,
	"Imagefile" varchar NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	CONSTRAINT "catagories_categories_unique" UNIQUE("categories")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catagoryWithPost" (
	"postId" uuid NOT NULL,
	"catagoryName" text NOT NULL,
	CONSTRAINT "catagoryWithPost_catagoryName_postId_pk" PRIMARY KEY("catagoryName","postId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"userId" text NOT NULL,
	"postId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "likeAndDislike" (
	"id" uuid PRIMARY KEY NOT NULL,
	"like" "like",
	"userId" text NOT NULL,
	"postId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "message" (
	"id" uuid PRIMARY KEY NOT NULL,
	"text" text,
	"imageFile" varchar,
	"senderId" text NOT NULL,
	"recipientId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"file" jsonb DEFAULT '[]' NOT NULL,
	"profileId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"userId" text NOT NULL,
	"catagory" text NOT NULL,
	"isSold" boolean DEFAULT false,
	"description" text,
	"price" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "postSeen" (
	"id" uuid PRIMARY KEY NOT NULL,
	"postId" uuid NOT NULL,
	"userId" text NOT NULL,
	"count" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" text,
	"instagram" varchar(255),
	"telegram" varchar(255),
	"facebook" varchar(255),
	"x" varchar,
	"description" varchar,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"Imagefile" varchar NOT NULL,
	"updatedAt" timestamp,
	"companyName" text,
	"phoneNumber1" text,
	"phoneNumber2" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ProfileSeen" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"profileId" uuid NOT NULL,
	"count" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profileWithCatagory" (
	"profileId" uuid NOT NULL,
	"catagoryName" text NOT NULL,
	CONSTRAINT "profileWithCatagory_catagoryName_profileId_pk" PRIMARY KEY("catagoryName","profileId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reply" (
	"content" text NOT NULL,
	"userId" text NOT NULL,
	"commentId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	CONSTRAINT "reply_commentId_userId_pk" PRIMARY KEY("commentId","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"role" "role" DEFAULT 'customer',
	"customer_id" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_lastMessageId_message_id_fk" FOREIGN KEY ("lastMessageId") REFERENCES "public"."message"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_lastSentUser_user_id_fk" FOREIGN KEY ("lastSentUser") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catagoryWithPost" ADD CONSTRAINT "catagoryWithPost_postId_post_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catagoryWithPost" ADD CONSTRAINT "catagoryWithPost_catagoryName_catagories_categories_fk" FOREIGN KEY ("catagoryName") REFERENCES "public"."catagories"("categories") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_postId_post_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likeAndDislike" ADD CONSTRAINT "likeAndDislike_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likeAndDislike" ADD CONSTRAINT "likeAndDislike_postId_post_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_senderId_user_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message" ADD CONSTRAINT "message_recipientId_user_id_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_profileId_profile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_catagory_catagories_categories_fk" FOREIGN KEY ("catagory") REFERENCES "public"."catagories"("categories") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postSeen" ADD CONSTRAINT "postSeen_postId_post_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postSeen" ADD CONSTRAINT "postSeen_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile" ADD CONSTRAINT "profile_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ProfileSeen" ADD CONSTRAINT "ProfileSeen_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ProfileSeen" ADD CONSTRAINT "ProfileSeen_profileId_profile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profileWithCatagory" ADD CONSTRAINT "profileWithCatagory_profileId_profile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profileWithCatagory" ADD CONSTRAINT "profileWithCatagory_catagoryName_catagories_categories_fk" FOREIGN KEY ("catagoryName") REFERENCES "public"."catagories"("categories") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reply" ADD CONSTRAINT "reply_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reply" ADD CONSTRAINT "reply_commentId_comment_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."comment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_customer_id_user_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_index" ON "message" USING btree ("text");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_index" ON "post" USING btree ("title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "catagory_index" ON "post" USING btree ("catagory");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_index" ON "post" USING btree ("userId");