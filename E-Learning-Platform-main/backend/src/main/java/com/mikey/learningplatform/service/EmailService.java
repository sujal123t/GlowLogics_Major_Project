package com.mikey.learningplatform.service;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendCertificateEmail(String toEmail, String studentName, String courseName, String certId) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        
        // The 'true' flag indicates we want to create a multipart message (to support attachments)
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        
        helper.setTo(toEmail);
        helper.setSubject("Your Certificate of Completion - " + courseName);
        
        String body = "Congratulations " + studentName + "!\n\n"
                    + "You have successfully completed the course: " + courseName + ".\n\n"
                    + "Please find your official Certificate of Completion attached to this email as a PDF.\n\n"
                    + "Certificate Verification ID: " + certId + "\n\n"
                    + "Keep learning and building amazing things!\n"
                    + "- Best Free Courses Team";
                    
        helper.setText(body);

        // 1. Generate the PDF dynamically in memory
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, baos);
        document.open();

        // Set up professional fonts and colors
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, Color.BLACK);
        Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 16, Color.DARK_GRAY);
        Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 36, new Color(56, 189, 248));
        Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 14, Color.BLACK);

        Paragraph title = new Paragraph("CERTIFICATE OF COMPLETION", titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        title.setSpacingAfter(30);
        document.add(title);

        Paragraph subtitle = new Paragraph("This certificate is proudly awarded to", subtitleFont);
        subtitle.setAlignment(Paragraph.ALIGN_CENTER);
        subtitle.setSpacingAfter(20);
        document.add(subtitle);

        Paragraph name = new Paragraph(studentName, nameFont);
        name.setAlignment(Paragraph.ALIGN_CENTER);
        name.setSpacingAfter(20);
        document.add(name);

        Paragraph text = new Paragraph("for successfully completing the course:\n\n", textFont);
        text.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(text);

        Paragraph course = new Paragraph(courseName, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, Color.BLACK));
        course.setAlignment(Paragraph.ALIGN_CENTER);
        course.setSpacingAfter(50);
        document.add(course);

        Paragraph footer = new Paragraph("Certificate Verification ID: " + certId + "\nAwarded by: Best Free Courses", textFont);
        footer.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(footer);

        document.close();

        // 2. Attach the generated PDF to the email
        ByteArrayResource pdfAttachment = new ByteArrayResource(baos.toByteArray());
        String fileName = studentName.replaceAll("\\s+", "_") + "_Certificate.pdf";
        helper.addAttachment(fileName, pdfAttachment);

        // 3. Send the email
        mailSender.send(message);
    }

    public void sendEnrollmentInvoice(String toEmail, String studentName, String courseName) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        
        helper.setTo(toEmail);
        helper.setSubject("Enrollment Receipt - " + courseName);
        
        String body = "Hi " + studentName + ",\n\n"
                    + "Thank you for enrolling in: " + courseName + ".\n"
                    + "Your enrollment was successful and your video progress will now be tracked automatically.\n\n"
                    + "Please find your official enrollment invoice attached.\n\n"
                    + "- Best Free Courses Team";
        helper.setText(body);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, baos);
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, Color.BLACK);
        Paragraph title = new Paragraph("ENROLLMENT INVOICE", titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        document.add(new Paragraph("Student Name: " + studentName));
        document.add(new Paragraph("Course Enrolled: " + courseName));
        document.add(new Paragraph("Amount Paid: $0.00 (Free Tier)"));
        document.add(new Paragraph("Status: PAID IN FULL\n\nThank you for learning with us!"));
        document.close();

        ByteArrayResource pdfAttachment = new ByteArrayResource(baos.toByteArray());
        helper.addAttachment("Enrollment_Invoice.pdf", pdfAttachment);
        mailSender.send(message);
    }
}