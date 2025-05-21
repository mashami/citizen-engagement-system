import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

// GET /api/complaints - Get all complaints
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : undefined;
    
    const complaints = await prisma.complaint.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/complaints - Create a new complaint
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate a unique tracking ID
    const trackingId = nanoid(10).toUpperCase();
    
    // Create the complaint
    const complaint = await prisma.complaint.create({
      data: {
        trackingId,
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        agency: data.agency,
        status: 'PENDING'
      }
    });
    
    return NextResponse.json({ 
      id: complaint.id,
      trackingId: complaint.trackingId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating complaint:', error);
    return NextResponse.json(
      { error: 'Failed to create complaint' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}