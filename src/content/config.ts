import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.date(),
        excerpt: z.string(),
        tags: z.array(z.string()).optional(),
    }),
});

const tech = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(),
        tagline: z.string(),
        category: z.array(z.string()),
        website: z.string().url(),
        rating: z.number().min(1).max(5),
        pricing: z.object({
            hasFree: z.boolean(),
            startsAt: z.number().optional(),
            currency: z.string().default('USD'),
        }),
        verdict: z.object({
            bestFor: z.string(),
            notFor: z.string(),
        }),
        pros: z.array(z.string()).optional(),
        cons: z.array(z.string()).optional(),
        openSource: z.boolean().optional(),
        affiliateUrl: z.string().url().optional(),
        date: z.date(),
        lastVerified: z.date(),
    }),
});

export const collections = { blog, tech };
