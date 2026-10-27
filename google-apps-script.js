// ===================================================================
// كود Google Apps Script لربط تأكيد الحضور بجوجل شيت (Google Sheets)
// ===================================================================
// 
// طريقة التركيب السهلة في دقيقة واحدة:
// 1. افتح Google Sheets جديد (أو شيت موجود).
// 2. اكتب في الصف الأول رؤوس الأعمدة التالية:
//    العمود A: التاريخ والوقت
//    العمود B: اسم الضيف
//    العمود C: حالة الحضور
//    العمود D: عدد المرافقين
//    العمود E: رسالة التهنئة
// 3. من القائمة العلوية اضغط: ملحقات (Extensions) -> Apps Script.
// 4. امسح أي كود موجود هناك، والصق هذا الكود بالكامل.
// 5. اضغط على زر "نشر" (Deploy) بالأزرق في أعلى اليمين -> نشر جديد (New deployment).
// 6. اختر نوع النشر: تطبيق ويب (Web app).
// 7. اجعل صلاحية الوصول (Who has access): أي شخص (Anyone) مهم جداً!
// 8. اضغط Deploy وانسخ الرابط (Web App URL) وضعه في ملف script.js في خانة GOOGLE_SHEET_URL.

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // استقبال البيانات المرسلة
    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }
    
    var timestamp = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
    var name = data.name || 'بدون اسم';
    var status = data.status || 'حاضر';
    var guests = data.guests || '1';
    var message = data.message || '';
    
    // إضافة صف جديد في الشيت
    sheet.appendRow([timestamp, name, status, guests, message]);
    
    // الرد بنجاح
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ "status": "active", "message": "Google Sheet Wedding RSVP Service is Running" }))
    .setMimeType(ContentService.MimeType.JSON);
}
