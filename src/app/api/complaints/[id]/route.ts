import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/complaints/[id] - Get a specific complaint
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: {
        id: params.id
      }
    });
    
    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaint' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH /api/complaints/[id] - Update a complaint
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    // Update the complaint
    const complaint = await prisma.complaint.update({
      where: {
        id: params.id
      },
      data: {
        status: data.status,
        response: data.response,
        responseDate: data.responseDate ? new Date(data.responseDate) : undefined,
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json(complaint);
  } catch (error) {
    console.error('Error updating complaint:', error);
    return NextResponse.json(
      { error: 'Failed to update complaint' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/complaints/[id] - Delete a complaint
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.complaint.delete({
      where: {
        id: params.id
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    return NextResponse.json(
      { error: 'Failed to delete complaint' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
