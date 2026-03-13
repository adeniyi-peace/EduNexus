import io
from django.core.files.base import ContentFile
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from django.conf import settings
import os

def generate_certificate_pdf(certificate):
    """
    Generates a PDF certificate and saves it to the certificate model's file field.
    """
    buffer = io.BytesIO()
    
    # Create the PDF object, using landscape A4
    p = canvas.Canvas(buffer, pagesize=landscape(A4))
    width, height = landscape(A4)

    # 1. Background and Borders
    # Primary Border (Emerald Green feel for EduNexus)
    p.setStrokeColor(HexColor("#10b981")) 
    p.setLineWidth(15)
    p.rect(20, 20, width-40, height-40)
    
    # Secondary Inner Border
    p.setStrokeColor(HexColor("#34d399"))
    p.setLineWidth(2)
    p.rect(35, 35, width-70, height-70)

    # 2. Header / Logo Placeholder
    p.setFont("Helvetica-Bold", 30)
    p.setFillColor(HexColor("#10b981"))
    p.drawCentredString(width/2, height - 80, "EDUNEXUS")
    
    # 3. Main Titles
    p.setFillColor(HexColor("#1f2937")) # Dark Slate
    p.setFont("Helvetica-Bold", 45)
    p.drawCentredString(width/2, height - 180, "CERTIFICATE")
    
    p.setFont("Helvetica", 20)
    p.drawCentredString(width/2, height - 220, "OF COMPLETION")

    # 4. Certification Text
    p.setFont("Helvetica", 18)
    p.drawCentredString(width/2, height - 280, "This is to certify that")

    # Student Name
    p.setFont("Helvetica-Bold", 40)
    p.setFillColor(HexColor("#10b981"))
    p.drawCentredString(width/2, height - 340, certificate.student.fullname.upper())

    # Description
    p.setFillColor(HexColor("#1f2937"))
    p.setFont("Helvetica", 18)
    p.drawCentredString(width/2, height - 390, "has successfully mastered the course")

    # Course Title
    p.setFont("Helvetica-Bold", 28)
    p.drawCentredString(width/2, height - 440, f"\"{certificate.course.title}\"")

    # 5. Bottom Metadata
    # Issue Date
    p.setFont("Helvetica", 14)
    p.drawCentredString(width/2, 120, f"Issued on {certificate.issued_at.strftime('%B %d, %Y')}")

    # Credential ID
    p.setFont("Helvetica-Oblique", 9)
    p.setFillColor(HexColor("#6b7280"))
    p.drawCentredString(width/2, 60, f"Credential ID: {certificate.certificate_id}")

    # 6. Signatory Section
    try:
        config = certificate.course.certificate_config
        # Signatory Name & Title on the right
        p.setFillColor(HexColor("#1f2937"))
        p.setFont("Helvetica-Bold", 14)
        p.drawString(width - 250, 150, config.signatory_name)
        
        p.setFont("Helvetica", 11)
        p.drawString(width - 250, 135, config.signatory_title)
        
        # Horizontal line for signature
        p.setStrokeColor(HexColor("#d1d5db"))
        p.setLineWidth(1)
        p.line(width - 250, 155, width - 50, 155)

        if config.signatory_signature:
            try:
                # Use the file system path if available
                img_path = config.signatory_signature.path
                if os.path.exists(img_path):
                    p.drawImage(img_path, width - 240, 160, width=120, height=40, preserveAspectRatio=True, mask='auto')
            except Exception as img_err:
                print(f"Error loading signature image: {img_err}")
    except:
        # If no config, we just skip the signature area or use a default one
        p.setFont("Helvetica-Bold", 14)
        p.drawString(width - 250, 150, "EduNexus Team")
        p.setFont("Helvetica", 11)
        p.drawString(width - 250, 135, "Certification Authority")
        p.line(width - 250, 155, width - 50, 155)

    # 7. Finalize Page
    p.showPage()
    p.save()

    # 8. Return the buffer
    buffer.seek(0)
    return buffer
