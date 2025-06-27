export function parsePrescriptionText(text) {
  const cleanText = text
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const nameMatch = cleanText.match(/(?:Patient\s*Name\s*[:\-]?\s*)([A-Za-z\s]+)/i);
  const doctorMatch = cleanText.match(/(?:Dr\.?\s*[A-Za-z]+\s+[A-Za-z]+)/i);
  const dateMatch = cleanText.match(/(?:Date\s*[:\-]?\s*)(\d{1,2}\/\d{1,2}\/\d{2,4})/i);
  const bpMatch = cleanText.match(/(?:BP|Blood Pressure)[:\s]*(\d{2,3}\/\d{2,3})/i);
  const spo2Match = cleanText.match(/(?:SPO2|SpO2|SpOz)[:\s]*(\d{2,3})%?/i);
  const labMatch = cleanText.match(/Anant\s+Path\s+Lab/i);
  const contactMatch = cleanText.match(/(\d{10})/);

  // 1. Medicine Section Extraction
  let medicineSection = '';
  const rxIndex = cleanText.indexOf('Rx');
  if (rxIndex !== -1) {
      medicineSection = cleanText.substring(rxIndex + 2).trim(); // 2 chars to skip "Rx"
  }

  // 2. Medicines extraction from only medicineSection
  const medicines = [];
  if (medicineSection) {
      const medicineLines = medicineSection.split(/[\.\;\,]/);  // split by dot, semicolon, comma
      for (let line of medicineLines) {
          line = line.trim();
          if (line.length > 2 && /^[A-Za-z]/.test(line)) { // line should start with letter
              medicines.push(line);
          }
      }
  }

  return {
    patientName: nameMatch ? nameMatch[1].trim() : 'Not Found',
    doctor: doctorMatch ? doctorMatch[0].trim() : 'Not Found',
    date: dateMatch ? dateMatch[1] : 'Not Found',
    bp: bpMatch ? bpMatch[1] : 'Not Found',
    spo2: spo2Match ? spo2Match[1] : 'Not Found',
    labName: labMatch ? "Anant Path Lab" : 'Not Found',
    contact: contactMatch ? contactMatch[1] : 'Not Found',
    medicines: medicines.length ? medicines : ['Not Found']
  };
}
