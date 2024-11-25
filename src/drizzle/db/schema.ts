

import { relations } from "drizzle-orm";

import { pgTable, text, timestamp, boolean, uuid,  varchar, index,  pgEnum, AnyPgColumn, primaryKey, integer, jsonb, numeric,  } from "drizzle-orm/pg-core";
			
export const roleEnum = pgEnum('role', [ 'customer', 'merchant']);

export const user = pgTable("user", {
 id: text("id").primaryKey(),
 name: text('name').notNull(),
 email: text('email').notNull().unique(),
 emailVerified: boolean('emailVerified').notNull(),
 image: text('image'),
 createdAt: timestamp('createdAt').notNull(),
 updatedAt: timestamp('updatedAt').notNull(),
 role: roleEnum().default("customer"),
 customerId: text("customer_id").references(():AnyPgColumn => user.id)
				});


export const session = pgTable("session", {
 id: text("id").primaryKey(),
 expiresAt: timestamp('expiresAt').notNull(),
 ipAddress: text('ipAddress'),
 userAgent: text('userAgent'),
 userId: text('userId').notNull().references(()=> user.id)
				});

export const account = pgTable("account", {
 id: text("id").primaryKey(),
 accountId: text('accountId').notNull(),
 providerId: text('providerId').notNull(),
 userId: text('userId').notNull().references(()=> user.id),
 accessToken: text('accessToken'),
 refreshToken: text('refreshToken'),
 idToken: text('idToken'),
 expiresAt: timestamp('expiresAt'),
 password: text('password')
				});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expiresAt').notNull()
});
			
export const profile = pgTable("profile",{
	id: uuid("id").primaryKey().notNull(),
	type: text("type"),
	instagram: varchar("instagram",{length: 255}),
	telegram: varchar("telegram",{length: 255}),
	facebook: varchar("facebook",{length: 255}),
	x: varchar("x"),
	description: varchar("description"),
	userId: text("userId").notNull().references(() => user.id),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	imageFile: varchar("Imagefile").notNull(),
	updatedAt: timestamp("updatedAt"),
	companyName: text("companyName"),
	phoneNumber1: text("phoneNumber1"),
	phoneNumber2: text("phoneNumber2")
})

export const profileSeen = pgTable("ProfileSeen",{
	id: uuid("id").primaryKey().notNull(),
	userId: text("userId").notNull().references(() => user.id),
	profileId: uuid("profileId").notNull().references(() => profile.id),
	count: integer("count").notNull(),
})

export const catagories = pgTable("catagories",{
	id: uuid("id").primaryKey().notNull(),
	categories: text("categories").notNull().unique(),
	Imagefile: varchar("Imagefile").notNull(),
	description: text("description"),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt")
}
)

export const post = pgTable("post",{
	id: uuid("id").notNull().primaryKey(),
	title: varchar("title", {length: 100}).notNull(),
	file: jsonb("file").notNull().default('[]'),
	profileId: uuid("profileId").notNull().references(() => profile.id),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt"),
	userId: text("userId").notNull().references(() => user.id),
	catagory: text("catagory").notNull().references(() => catagories.categories),
	isSold: boolean("isSold").default(false),
	description : text("description"),
	price: numeric("price").notNull()

	
},(table) => {
	return {
		post_index: index("post_index").on(table.title),
		catagory_index: index("catagory_index").on(table.catagory),
		user_index: index("user_index").on(table.userId),
	}
})

export const postSeen = pgTable("postSeen",{
	id: uuid("id").notNull().primaryKey(),
	postId: uuid("postId").notNull().references(() => post.id),
	userId: text("userId").notNull().references(() => user.id),
	count: integer("count").notNull()
})


export const comment = pgTable("comment",{
	id: uuid("id").notNull().primaryKey(),
	content: text("content").notNull(),
	userId: text("userId").notNull().references(() => user.id),
	postId: uuid("postId").notNull().references(() => post.id),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt"),
})
export const reply = pgTable("reply",{
	content: text("content").notNull(),
	userId: text("userId").notNull().references(() => user.id),
	commentId: uuid("commentId").notNull().references(() => comment.id),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt")
}, (t) => ({
	pk: primaryKey({columns: [t.commentId, t.userId]})
}))
export const likeEnum = pgEnum("like",["like","dislike"])
export const likeAndDislike = pgTable("likeAndDislike",{
	id: uuid("id").primaryKey().notNull(),
	like: likeEnum(),
	userId: text("userId").notNull().references(() => user.id),
	postId: uuid("postId").notNull().references(() => post.id),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt").notNull().defaultNow()
})
export const message = pgTable("message",{
	id: uuid("id").primaryKey().notNull(),
	content: text("text"),
	imageFile: varchar("imageFile"),
	senderId: text("senderId").notNull().references(() => user.id),
	recipientId: text("recipientId").notNull().references(() => user.id),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt")
}, (table) => ({
	message_index: index("message_index").on(table.content)
}))

export const Inbox = pgTable("Inbox",{
	lastMessageId: uuid("lastMessageId").notNull().references(() => message.id),
	lastSentUser: text("lastSentUser").notNull().references(() => user.id)
},(t) => ({
	pk: primaryKey({columns: [t.lastMessageId, t.lastSentUser]})

}))

export const catagoryWithPost = pgTable("catagoryWithPost", {
	postId: uuid("postId").notNull().references(() => post.id),
	catagoryName: text("catagoryName").notNull().references(() => catagories.categories)
},(t) => ({
	pk: primaryKey({columns: [t.catagoryName, t.postId]})
}))

export const profileWithCatagory = pgTable("profileWithCatagory", {
	profileId: uuid("profileId").notNull().references(() => profile.id),
	catagoryName: text("catagoryName").notNull().references(() => catagories.categories) 
},(t) => ({
	pk: primaryKey({columns: [t.catagoryName, t.profileId]})
}))

// relation 
export const userRelation = relations(user, ({one,many}) => ({
	userContent: one(profile,{
		fields: [user.id],
		references: [profile.userId]
	}),
	lastSentUser: many(Inbox),
	messageUser: many(message),
	postUser: many(post),
	likeAndDislikeUSer: many(likeAndDislike),
	userReply: many(reply),
	profileSeenUser: many(profileSeen),
	userSeenPost: many(postSeen)

}))

export const postRelation = relations(post, ({one,many}) => ({
	author: one(user, {
		fields: [post.userId],
		references: [user.id]
	}),
	postCatagory: many(catagoryWithPost),
	likeAndDislikePost: many(likeAndDislike),
	postProfile: one(profile, {
		fields: [post.profileId],
		references:[profile.id]
	}),
	catagory : one(catagories,{
		fields: [post.catagory],
		references: [catagories.categories]
	}),
	postSeen: many(postSeen)
	
}))

export const postSeenRelation = relations(postSeen, ({one})=>({
	userSeenPost: one(user, {
		fields: [postSeen.userId],
		references: [user.id]
	}),
	postSeen: one(post, {
		fields: [postSeen.postId],
		references: [post.id]
	})
}))

export const catagoryRelation = relations(catagories, ({many}) => ({
	catagoryPost: many(catagoryWithPost)
}))

export const catagortWithPostRelation = relations(catagoryWithPost, ({one}) => ({
	post : one(post, {
		fields: [catagoryWithPost.postId],
		references: [post.id]
	}),
	catagory: one(catagories, {
		fields: [catagoryWithPost.catagoryName],
		references: [catagories.categories]
	})
}))
export const messageRelation = relations(message, ({many, one}) => ({
	lastMessage: many(Inbox),
	senderUser: one(user, {
		fields: [message.senderId],
		references: [user.id]
	}),
	recipientUser: one(user, {
		fields: [message.recipientId],
		references: [user.id]
	}
	)
	
}))

export const inboxRelation = relations(Inbox, ({one}) => ({
	lastUser : one(user, {
		fields : [Inbox.lastSentUser],
		references: [user.id]
	}),
	lastMessage: one(message, {
		fields: [Inbox.lastMessageId], 
		references: [message.id]
	})
}))

export const likeAndDislikeRelation = relations(likeAndDislike, ({one}) => ({
	likeAndDislikeUSer: one(user, {
		fields: [likeAndDislike.userId],
		references: [user.id]
	}),
	likeAndDislikePost: one(post, {
		fields: [likeAndDislike.postId],
		references: [post.id]
	})
}))

export const replyRelation = relations(reply, ({one}) => ({
	userReply: one(user, {
		fields: [reply.userId],
		references: [user.id]
	}),
	commentReply: one(comment, {
		fields : [reply.commentId],
		references: [comment.id]
	})
}))

export const commentRelation = relations(comment, ({one, many}) => ({
	replyComment: many(reply),
	commentedUser: one(user, {
		fields: [comment.userId],
		references: [user.id]
	}),
	commentedPost : one(post, {
		fields: [comment.postId],
		references: [post.id]
	})
}))

export const profileRelation = relations(profile, ({one, many}) => ({
	userContent: one(user, {
		fields: [profile.userId],
		references: [user.id]
	}),
	postProfile: many(post),
	profileWithcatagory: many(profileWithCatagory),
	profileSeen: many(profileSeen)
}))

export const profileSeenRelation = relations(profileSeen, ({one})=>({
	userProfileSeen: one(user, {
		fields: [profileSeen.userId],
		references: [user.id] 
	}),
	profileSeen: one(profile, {
		fields: [profileSeen.profileId],
		references: [profile.id]
	})
})) 

export const catagoriesRelation = relations(catagories,({many}) => ({
	catagoryPost: many(post),
	profileWithCatagory: many(profileWithCatagory)
}))

export const profileWithCatagoryRelation = relations(profileWithCatagory, ({one}) => ({
	profile: one(profile, {
		fields: [profileWithCatagory.profileId],
		references: [profile.id]
	}),
	catagory: one(catagories, {
		fields: [profileWithCatagory.catagoryName],
		references: [catagories.categories]
	})
}))