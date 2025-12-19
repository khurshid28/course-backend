import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';

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

    // Border
    doc
      .lineWidth(10)
      .strokeColor('#4F46E5')
      .rect(30, 30, pageWidth - 60, pageHeight - 60)
      .stroke();

    doc
      .lineWidth(3)
      .strokeColor('#818CF8')
      .rect(45, 45, pageWidth - 90, pageHeight - 90)
      .stroke();

    // Title
    doc
      .fontSize(48)
      .fillColor('#4F46E5')
      .font('Helvetica-Bold')
      .text('SERTIFIKAT', 0, 120, {
        align: 'center',
      });

    // Subtitle
    doc
      .fontSize(16)
      .fillColor('#6B7280')
      .font('Helvetica')
      .text('Bu sertifikat quyidagini tasdiqLaydi', 0, 180, {
        align: 'center',
      });

    // User name
    doc
      .fontSize(36)
      .fillColor('#1F2937')
      .font('Helvetica-Bold')
      .text(certificateData.userName, 0, 230, {
        align: 'center',
      });

    // Course completion text
    doc
      .fontSize(18)
      .fillColor('#6B7280')
      .font('Helvetica')
      .text('quyidagi kursni muvaffaqiyatli yakunladi:', 0, 285, {
        align: 'center',
      });

    // Course name
    doc
      .fontSize(28)
      .fillColor('#4F46E5')
      .font('Helvetica-Bold')
      .text(certificateData.courseName, 0, 320, {
        align: 'center',
        width: pageWidth,
      });

    // Score
    doc
      .fontSize(18)
      .fillColor('#059669')
      .font('Helvetica-Bold')
      .text(`Natija: ${certificateData.score}%`, 0, 380, {
        align: 'center',
      });

    // Certificate number and date
    const dateStr = new Date(certificateData.issuedAt).toLocaleDateString(
      'uz-UZ',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    );

    doc
      .fontSize(12)
      .fillColor('#6B7280')
      .font('Helvetica')
      .text(`Sertifikat raqami: ${certificateData.certificateNo}`, 100, pageHeight - 100, {
        align: 'left',
      });

    doc.text(`Berilgan sana: ${dateStr}`, pageWidth - 300, pageHeight - 100, {
      align: 'right',
      width: 200,
    });

    // Finalize PDF
    doc.end();
  }
}
