import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PdfService {
  async generateCertificate(
    certificateData: {
      certificateNo: string;
      userName: string;
      courseName: string;
      score: number;
      issuedAt: Date;
    },
    res: Response,
  ): Promise<void> {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 50,
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=certificate-${certificateData.certificateNo}.pdf`,
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Design certificate
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const centerX = pageWidth / 2;

    // ============ Logo ============
    const logoPath = path.join(process.cwd(), 'uploads', 'images', 'logo.png');
    if (fs.existsSync(logoPath)) {
      try {
        doc.image(logoPath, centerX - 40, 35, {
          width: 80,
          height: 80,
        });
      } catch (error) {
        console.error('Logo yuklanmadi:', error);
      }
    }

    // ============ Background Gradient Effect ============
    // Top left circle decoration
    doc
      .circle(80, 80, 120)
      .fillOpacity(0.08)
      .fill('#4F46E5');
    
    // Bottom right circle decoration
    doc
      .circle(pageWidth - 80, pageHeight - 80, 100)
      .fillOpacity(0.08)
      .fill('#7C3AED');
    
    // Top right small circle
    doc
      .circle(pageWidth - 150, 100, 50)
      .fillOpacity(0.05)
      .fill('#EC4899');

    doc.fillOpacity(1); // Reset opacity

    // ============ Elegant Border ============
    // Outer border - Gradient effect with multiple colors
    doc
      .lineWidth(8)
      .strokeColor('#4F46E5')
      .rect(25, 25, pageWidth - 50, pageHeight - 50)
      .stroke();

    // Middle border
    doc
      .lineWidth(2)
      .strokeColor('#818CF8')
      .rect(38, 38, pageWidth - 76, pageHeight - 76)
      .stroke();

    // Inner decorative border
    doc
      .lineWidth(1)
      .strokeColor('#C7D2FE')
      .rect(48, 48, pageWidth - 96, pageHeight - 96)
      .stroke();

    // ============ Corner Decorations ============
    const cornerSize = 30;
    const cornerOffset = 55;
    
    // Top-left corner
    doc.moveTo(cornerOffset, cornerOffset + cornerSize)
       .lineTo(cornerOffset, cornerOffset)
       .lineTo(cornerOffset + cornerSize, cornerOffset)
       .lineWidth(3)
       .strokeColor('#4F46E5')
       .stroke();
    
    // Top-right corner
    doc.moveTo(pageWidth - cornerOffset - cornerSize, cornerOffset)
       .lineTo(pageWidth - cornerOffset, cornerOffset)
       .lineTo(pageWidth - cornerOffset, cornerOffset + cornerSize)
       .stroke();
    
    // Bottom-left corner
    doc.moveTo(cornerOffset, pageHeight - cornerOffset - cornerSize)
       .lineTo(cornerOffset, pageHeight - cornerOffset)
       .lineTo(cornerOffset + cornerSize, pageHeight - cornerOffset)
       .stroke();
    
    // Bottom-right corner
    doc.moveTo(pageWidth - cornerOffset - cornerSize, pageHeight - cornerOffset)
       .lineTo(pageWidth - cornerOffset, pageHeight - cornerOffset)
       .lineTo(pageWidth - cornerOffset, pageHeight - cornerOffset - cornerSize)
       .stroke();

    // ============ Award Icon/Badge ============
    const badgeY = 130;
    const badgeSize = 25;
    doc
      .circle(centerX, badgeY, badgeSize)
      .lineWidth(3)
      .strokeColor('#F59E0B')
      .stroke();
    
    // Star in the badge
    doc
      .fontSize(20)
      .fillColor('#F59E0B')
      .text('★', centerX - 10, badgeY - 12);

    // ============ Title ============
    doc
      .fontSize(52)
      .fillColor('#4F46E5')
      .font('Helvetica-Bold')
      .text('SERTIFIKAT', 0, 165, {
        align: 'center',
        width: pageWidth,
      });

    // Decorative line under title
    doc
      .moveTo(centerX - 100, 225)
      .lineTo(centerX + 100, 225)
      .lineWidth(3)
      .strokeColor('#818CF8')
      .stroke();

    // ============ Subtitle ============
    doc
      .fontSize(15)
      .fillColor('#6B7280')
      .font('Helvetica')
      .text('Bu sertifikat quyidagi shaxsni tasdiqLaydi', 0, 240, {
        align: 'center',
        width: pageWidth,
      });

    // ============ User Name (Highlighted) ============
    // Background highlight box
    doc
      .roundedRect(centerX - 220, 275, 440, 55, 10)
      .fillOpacity(0.05)
      .fill('#4F46E5');
    
    doc.fillOpacity(1); // Reset opacity
    
    doc
      .fontSize(38)
      .fillColor('#1F2937')
      .font('Helvetica-Bold')
      .text(certificateData.userName, 0, 288, {
        align: 'center',
        width: pageWidth,
      });

    // ============ Achievement Text ============
    doc
      .fontSize(16)
      .fillColor('#6B7280')
      .font('Helvetica')
      .text('quyidagi kursni muvaffaqiyatli yakunladi va', 0, 320, {
        align: 'center',
        width: pageWidth,
      });
    
    doc
      .fontSize(16)
      .text('yuqori natijalarni ko\'rsatdi:', 0, 342, {
        align: 'center',
        width: pageWidth,
      });

    // ============ Course Name (Elegant Box) ============
    doc
      .roundedRect(100, 375, pageWidth - 200, 50, 8)
      .lineWidth(2)
      .strokeColor('#4F46E5')
      .fillOpacity(0.03)
      .fillAndStroke('#4F46E5', '#4F46E5');
    
    doc.fillOpacity(1); // Reset opacity
    
    doc
      .fontSize(26)
      .fillColor('#4F46E5')
      .font('Helvetica-Bold')
      .text(certificateData.courseName, 120, 390, {
        align: 'center',
        width: pageWidth - 240,
      });

    // ============ Score Badge ============
    const scoreY = 450;
    // Score circle background
    doc
      .circle(centerX, scoreY, 35)
      .fillColor('#10B981')
      .fill();
    
    doc
      .fontSize(22)
      .fillColor('#FFFFFF')
      .font('Helvetica-Bold')
      .text(`${certificateData.score}%`, centerX - 30, scoreY - 11, {
        width: 60,
        align: 'center',
      });
    
    doc
      .fontSize(13)
      .fillColor('#059669')
      .font('Helvetica')
      .text('Natija', 0, scoreY + 45, {
        align: 'center',
        width: pageWidth,
      });

    // ============ Footer Information ============
    const footerY = pageHeight - 80;
    
    // Certificate number and date
    const dateStr = new Date(certificateData.issuedAt).toLocaleDateString(
      'uz-UZ',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    );

    // Left side - Certificate number with icon
    doc
      .fontSize(11)
      .fillColor('#6B7280')
      .font('Helvetica')
      .text('📜 ', 80, footerY);
    
    doc
      .fontSize(11)
      .fillColor('#4B5563')
      .font('Helvetica-Bold')
      .text(`Sertifikat №: `, 95, footerY);
    
    doc
      .fontSize(11)
      .fillColor('#6B7280')
      .font('Helvetica')
      .text(certificateData.certificateNo, 185, footerY);

    // Right side - Date with icon
    doc
      .fontSize(11)
      .fillColor('#6B7280')
      .font('Helvetica')
      .text('📅 ', pageWidth - 250, footerY);
    
    doc
      .fontSize(11)
      .fillColor('#4B5563')
      .font('Helvetica-Bold')
      .text('Berilgan sana: ', pageWidth - 235, footerY);
    
    doc
      .fontSize(11)
      .fillColor('#6B7280')
      .font('Helvetica')
      .text(dateStr, pageWidth - 135, footerY);

    // ============ Bottom Decorative Line ============
    doc
      .moveTo(80, footerY - 15)
      .lineTo(pageWidth - 80, footerY - 15)
      .lineWidth(1)
      .strokeColor('#E5E7EB')
      .stroke();

    // ============ Signature Area ============
    const signatureY = pageHeight - 110;
    
    // Signature line
    doc
      .moveTo(pageWidth - 280, signatureY)
      .lineTo(pageWidth - 100, signatureY)
      .lineWidth(1)
      .strokeColor('#9CA3AF')
      .stroke();
    
    doc
      .fontSize(10)
      .fillColor('#6B7280')
      .font('Helvetica')
      .text('Rahbariyat', pageWidth - 250, signatureY + 8, {
        width: 120,
        align: 'center',
      });

    // Finalize PDF
    doc.end();
  }
}
