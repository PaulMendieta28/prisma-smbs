import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const topicSchema = z.object({
	topic_name: z.string().min(1, "Topic name is required"),
	description: z.string().min(1, "Description is required"),
});

export async function GET(req: NextRequest) {
	const topics = await prisma.topic.findMany();
	return NextResponse.json(topics);
}

export async function POST(req: NextRequest) {
	const body = await req.json();
	const parsed = topicSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(parsed.error, { status: 400 });
	}

	const { topic_name, description } = parsed.data;
	const newTopic = await prisma.topic.create({
		data: {
			topic_name,
			description,
		},
	});
	return NextResponse.json(newTopic);
}