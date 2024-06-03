import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const courseSchema = z.object({
	course_name: z.string().min(1, "Course name is required"),
	description: z.string().min(1, "Description is required"),
});

export async function GET(req: NextRequest) {
	const courses = await prisma.course.findMany();
	return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
	const body = await req.json();
	const parsed = courseSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json(parsed.error, { status: 400 });
	}

	const { course_name, description } = parsed.data;
	const newCourse = await prisma.course.create({
		data: {
			course_name,
			description,
		},
	});
	return NextResponse.json(newCourse);
}