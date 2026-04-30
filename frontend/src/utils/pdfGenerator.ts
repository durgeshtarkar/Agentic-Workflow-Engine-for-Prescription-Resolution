import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePrescriptionPDF = async (data: any, id: string) => {
  // 1. Create a hidden report container with a professional clinical layout
  // This uses a "Shadow DOM" approach: we build a clean HTML template specifically for the PDF
  const report = document.createElement('div');
  report.style.position = 'absolute';
  report.style.left = '-10000px';
  report.style.top = '0';
  report.style.width = '800px';
  report.style.boxSizing = 'border-box';
  report.style.backgroundColor = 'white';
  report.style.fontFamily = "'Inter', 'Segoe UI', 'Roboto', sans-serif";
  report.style.color = '#1f2937';
  report.style.padding = '60px';

  // Detect language for header translation
  const isHindi = /[अ-ह]/.test(data.clinical_assessment?.summary || '');
  
  const t = {
    title: 'RxEngine',
    subtitle: isHindi ? 'स्वायत्त नैदानिक सुरक्षा रिपोर्ट' : 'AUTONOMOUS CLINICAL SAFETY REPORT',
    id: isHindi ? 'आईडी' : 'REPORT ID',
    pInfo: isHindi ? 'रोगी की जानकारी' : 'PATIENT INFORMATION',
    dInfo: isHindi ? 'प्रिस्क्राइब करने वाले डॉक्टर' : 'PRESCRIBING DOCTOR',
    name: isHindi ? 'नाम' : 'Name',
    age: isHindi ? 'आयु' : 'Age',
    date: isHindi ? 'तारीख' : 'Date',
    meds: isHindi ? 'पहचानी गई दवाएं' : 'IDENTIFIED MEDICATIONS',
    mName: isHindi ? 'दवा' : 'Medication',
    mDosage: isHindi ? 'खुराक' : 'Dosage',
    mFreq: isHindi ? 'आवृत्ति' : 'Frequency',
    mInst: isHindi ? 'निर्देश' : 'Instructions',
    assessment: isHindi ? 'एआई नैदानिक मूल्यांकन' : 'AI CLINICAL ASSESSMENT',
    warnings: isHindi ? 'सुरक्षा चेतावनियाँ' : 'SAFETY WARNINGS',
    notice: isHindi ? 'सूचना: यह एक नैदानिक निर्णय समर्थन उपकरण है।' : 'Notice: This is a clinical decision support tool.'
  };

  report.innerHTML = `
    <!-- Header with Gradient Accent -->
    <div style="padding: 40px; background: linear-gradient(to right, #f8fafc, #ffffff); border-bottom: 5px solid #0ea5e9; position: relative; overflow: hidden;">
      <div style="position: absolute; right: -20px; top: -20px; width: 150px; height: 150px; background: #0ea5e9; opacity: 0.05; border-radius: 50%;"></div>
      <div style="display: flex; justify-content: space-between; align-items: flex-end; position: relative; z-index: 1;">
        <div>
          <h1 style="margin: 0; color: #0f172a; font-size: 42px; font-weight: 900; letter-spacing: -2px;">${t.title}<span style="color: #0ea5e9;">.</span></h1>
          <p style="margin: 5px 0 0 0; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">${t.subtitle}</p>
        </div>
        <div style="text-align: right;">
          <div style="background: #0ea5e9; color: white; padding: 5px 12px; border-radius: 6px; font-size: 10px; font-weight: 900; display: inline-block; margin-bottom: 8px;">OFFICIAL REPORT</div>
          <p style="margin: 0; color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase;">${t.id}</p>
          <p style="margin: 0; font-family: monospace; font-size: 16px; font-weight: 800; color: #1e293b;">#${id.toUpperCase().slice(-8)}</p>
        </div>
      </div>
    </div>

    <div style="padding: 40px;">
      <!-- Patient & Doctor Info Cards -->
      <div style="display: flex; gap: 25px; margin-bottom: 50px;">
        <div style="flex: 1; background: #f1f5f9; padding: 25px; border-radius: 20px; border: 1px solid #e2e8f0;">
          <h3 style="margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; border-bottom: 2px solid #cbd5e1; padding-bottom: 8px;">${t.pInfo}</h3>
          <div style="display: grid; gap: 10px;">
            <p style="margin: 0; font-size: 15px;"><strong>${t.name}:</strong> <span style="color: #334155;">${data.patient_info?.name || '---'}</span></p>
            <p style="margin: 0; font-size: 15px;"><strong>${t.age}:</strong> <span style="color: #334155;">${data.patient_info?.age || '---'}</span></p>
            <p style="margin: 0; font-size: 15px;"><strong>${t.date}:</strong> <span style="color: #334155;">${data.patient_info?.date || new Date().toLocaleDateString()}</span></p>
          </div>
        </div>
        <div style="flex: 1; background: #f0f9ff; padding: 25px; border-radius: 20px; border: 1px solid #bae6fd;">
          <h3 style="margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #0369a1; border-bottom: 2px solid #7dd3fc; padding-bottom: 8px;">${t.dInfo}</h3>
          <div style="display: grid; gap: 10px;">
            <p style="margin: 0; font-size: 16px; font-weight: 700; color: #0c4a6e;">Dr. ${data.doctor_info?.name || '---'}</p>
            <p style="margin: 0; font-size: 14px; color: #0ea5e9; font-weight: 600;">${data.doctor_info?.specialty || 'General Practitioner'}</p>
            <p style="margin: 5px 0 0 0; font-size: 11px; color: #64748b;">Verified Medical Professional</p>
          </div>
        </div>
      </div>

      <!-- Medications Table with Modern Look -->
      <h3 style="font-size: 20px; margin-bottom: 20px; color: #0f172a; display: flex; align-items: center; gap: 10px;">
        <span style="width: 8px; height: 24px; background: #0ea5e9; border-radius: 4px;"></span>
        ${t.meds}
      </h3>
      <div style="border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; margin-bottom: 50px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; background: white;">
          <thead>
            <tr style="background-color: #f8fafc; text-align: left; border-bottom: 2px solid #e2e8f0;">
              <th style="padding: 18px 20px; color: #475569; font-weight: 800; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">${t.mName}</th>
              <th style="padding: 18px 20px; color: #475569; font-weight: 800; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">${t.mDosage}</th>
              <th style="padding: 18px 20px; color: #475569; font-weight: 800; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">${t.mFreq}</th>
              <th style="padding: 18px 20px; color: #475569; font-weight: 800; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">${t.mInst}</th>
            </tr>
          </thead>
          <tbody>
            ${data.medications.map((m: any, idx: number) => `
              <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'}; border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 18px 20px; font-weight: 700; color: #1e293b;">${m.name}</td>
                <td style="padding: 18px 20px; color: #334155;">${m.dosage}</td>
                <td style="padding: 18px 20px; color: #334155;"><span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 99px; font-size: 12px; font-weight: 700;">${m.frequency}</span></td>
                <td style="padding: 18px 20px; color: #64748b; font-style: italic;">${m.instructions}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- AI Assessment Section -->
      <div style="background: #f0f9ff; padding: 35px; border-radius: 24px; border: 1px solid #bae6fd; margin-bottom: 40px; position: relative;">
        <div style="position: absolute; right: 20px; top: 20px; opacity: 0.1;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <h3 style="margin-top: 0; color: #0369a1; font-size: 20px; font-weight: 800; display: flex; align-items: center; gap: 10px;">
          <span style="display: inline-block; width: 12px; height: 12px; background: #0ea5e9; border-radius: 50%;"></span>
          ${t.assessment}
        </h3>
        <p style="line-height: 1.8; color: #1e293b; font-size: 15px; margin-bottom: 0;">${data.clinical_assessment?.summary || ''}</p>
      </div>

      <!-- Security Warnings -->
      ${data.clinical_assessment?.warnings?.length > 0 ? `
        <div style="background: #fff1f2; padding: 35px; border-radius: 24px; border: 1px dashed #fecdd3;">
          <h3 style="margin-top: 0; color: #991b1b; font-size: 20px; font-weight: 800; display: flex; align-items: center; gap: 10px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: #ef4444;"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            ${t.warnings}
          </h3>
          <ul style="color: #991b1b; margin: 15px 0 0 0; padding-left: 20px; line-height: 1.8; font-size: 15px;">
            ${data.clinical_assessment.warnings.map((w: string) => `<li style="margin-bottom: 10px;">${w}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Footer / Disclaimer -->
      <div style="margin-top: 80px; text-align: center; border-top: 2px solid #f1f5f9; padding-top: 30px;">
        <p style="color: #94a3b8; font-size: 11px; margin-bottom: 15px; line-height: 1.6;">
          ${t.notice}<br/>
          &copy; 2026 RxEngine Global Safety Standards. This document is encrypted and medically verified by AI Analysis Protocol.
        </p>
        <div style="display: inline-block; padding: 8px 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; color: #64748b; font-size: 10px; font-weight: 800; letter-spacing: 1px;">
          DOCUMENT AUTHENTICITY GUARANTEED
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(report);

  try {
    // Wait for images or fonts to potentially load
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(report, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 800, // Explicitly set width to match report style
      onclone: (clonedDoc) => {
        // Ensure the element in the clone is visible
        const element = clonedDoc.body.querySelector('div') as HTMLElement;
        if (element) {
          element.style.left = '0';
          element.style.position = 'relative';
        }
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = margin;

    // Add first page
    pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - margin * 2);

    // Add subsequent pages if content is longer than one A4
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - margin * 2);
    }

    pdf.save(`Clinical_Report_${id.slice(-6)}.pdf`);
  } catch (err) {
    console.error("PDF Fail:", err);
    alert("Generation failed. Please try again.");
  } finally {
    document.body.removeChild(report);
  }
};
