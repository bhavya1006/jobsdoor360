import { NextRequest, NextResponse } from 'next/server';
import { withAuth, isEmployer } from '@/lib/auth/middleware';
import { FileService } from '@/lib/services/fileService';

export async function POST(request: NextRequest) {
  return withAuth()(request, async (req) => {
    try {
      const user = (req as any).user;
      
      // Only employers can upload company logos
      if (!isEmployer(user.role)) {
        return NextResponse.json(
          { success: false, error: 'Only employers can upload company logos' },
          { status: 403 }
        );
      }

      const formData = await req.formData();
      const file = formData.get('file') as File;
      const companyId = formData.get('companyId') as string;
      
      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided' },
          { status: 400 }
        );
      }

      if (!companyId) {
        return NextResponse.json(
          { success: false, error: 'Company ID is required' },
          { status: 400 }
        );
      }

      const uploadedFile = await FileService.uploadCompanyLogo(file, companyId, file.name);

      return NextResponse.json({
        success: true,
        data: uploadedFile,
      });
    } catch (error: any) {
      console.error('Company logo upload error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Failed to upload company logo' 
        },
        { status: error.statusCode || 500 }
      );
    }
  });
}
