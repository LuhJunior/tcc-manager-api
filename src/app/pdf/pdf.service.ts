import { Injectable } from '@nestjs/common';
import * as PDFDocument  from 'pdfkit';

function createPdfLetterBuffer(professorName: string, professorEmail: string, projectTitle: string, studentName: string): Promise<Buffer> {
  return new Promise ((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });

    doc
      .fontSize(14)
      .text('CARTA DE ACEITAÇÃO DE ORIENTAÇÃO', { align: 'center' });

    doc.moveDown(2);

    doc
      .fontSize(10)
      .text(`Eu, ${professorName}, professor da Universidade do Estado da Bahia (UNEB), e-mail: ${professorEmail} comprometo-me a orientar o Trabalho de Conclusão de Curso com título provisório: ${projectTitle} que será executado pelo(a) aluno(a) ${studentName}. Confirmo que irei estar disponível de forma regular para orientar o(a) referido(a) aluno até a conclusão deste projeto, seguindo todas as normas definidas nas disciplinas Trabalho de Conclusão de Curso I e II. Desta forma, assino este documento como prova do compromisso assumido.`)

    doc.moveDown(4);

    doc
      .fontSize(10)
      .text('Salvador, xx de xxxxx de 20xx.', { align: 'center' });

    doc.moveDown(4);

    doc
      .fontSize(10)
      .text('_____________________________________          _____________________________________', { align: 'center' });

      doc.moveDown();

      doc
        .fontSize(8)
        .text('Assinatura do Orientador                                                                     Assinatura do Discente', { align: 'center' });

    doc.end();
  });
}

@Injectable()
export class PdfService {
  async createPdf() {

    return createPdfLetterBuffer('Ana', 'ana@uneb.com.br', 'A project', 'Yan');
  }
}
