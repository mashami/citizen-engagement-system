/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/complaints/stats - Get complaint statistics
export async function GET(request: NextRequest) {
  try {
    // Get total count
    const total = await prisma.complaint.count();
    
    // Get counts by status
    const pending = await prisma.complaint.count({
      where: { status: 'PENDING' }
    });
    
    const inProgress = await prisma.complaint.count({
      where: { status: 'IN_PROGRESS' }
    });
    
    const resolved = await prisma.complaint.count({
      where: { status: 'RESOLVED' }
    });
    
    // Get counts by category
    const categoryCounts = await prisma.complaint.groupBy({
      by: ['category'],
      _count: {
        category: true
      },
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    });
    
    const categories = categoryCounts.map(item => ({
      name: item.category,
      count: item._count.category
    }));
    
    return NextResponse.json({
      total,
      pending,
      inProgress,
      resolved,
      categories
    });
  } catch (error) {
    console.error('Error fetching complaint stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaint statistics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
