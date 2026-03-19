import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface SavedPdfResponse {
  success: boolean;
  fileName: string;
  relativePath: string;
}

@Injectable({ providedIn: 'root' })
export class PdfExportService {
  private readonly http = inject(HttpClient);

  async renderAndStorePdf(element: HTMLElement, fileName: string): Promise<SavedPdfResponse> {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: Math.max(2, window.devicePixelRatio || 1),
      useCORS: true,
      scrollX: 0,
      scrollY: -window.scrollY,
    });

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageWidth = pageWidth;
    const imageHeight = (canvas.height * imageWidth) / canvas.width;
    const imageData = canvas.toDataURL('image/png');

    pdf.addImage(imageData, 'PNG', 0, 0, imageWidth, imageHeight, undefined, 'FAST');

    let heightLeft = imageHeight - pageHeight;
    while (heightLeft > 0) {
      const yOffset = heightLeft - imageHeight;
      pdf.addPage();
      pdf.addImage(imageData, 'PNG', 0, yOffset, imageWidth, imageHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    const pdfBlob = pdf.output('blob');
    return firstValueFrom(
      this.http.post<SavedPdfResponse>(`/api/v1/documents?filename=${encodeURIComponent(fileName)}`, pdfBlob, {
        headers: {
          'Content-Type': 'application/pdf',
        },
      }),
    );
  }
}
