import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/complaints/track?trackingId=XXX - Track a complaint by tracking ID
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const trackingId = searchParams.get('trackingId');
    
    if (!trackingId) {
      return NextResponse.json(
        { error: 'Tracking ID is required' },
        { status: 400 }
      );
    }
    
    const complaint = await prisma.complaint.findFirst({
      where: {
        trackingId: trackingId
      }
    });
    
    if (!complaint) {
      return NextResponse.json(
        { error: 'No complaint found with this tracking ID' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(complaint);
  } catch (error) {
    console.error('Error tracking complaint:', error);
    return NextResponse.json(
      { error: 'Failed to track complaint' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}