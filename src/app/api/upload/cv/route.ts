import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { FileService } from '@/lib/services/fileService';

export async function POST(request: NextRequest) {
  return withAuth()(request, async (req) => {
    try {
      const user = (req as any).user;
      const formData = await req.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided' },
          { status: 400 }
        );
      }

      const uploadedFile = await FileService.uploadCV(file, user.uid, file.name);

      return NextResponse.json({
        success: true,
        data: uploadedFile,
      });
    } catch (error: any) {
      console.error('CV upload error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to upload CV' 
        },
        { status: error.statusCode || 500 }
      );
    }
  });
}
