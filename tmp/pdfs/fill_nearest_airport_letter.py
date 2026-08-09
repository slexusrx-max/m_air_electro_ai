from io import BytesIO

from PIL import Image
from pypdf import PdfReader, PdfWriter
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

SOURCE = r"C:\Users\PC\Downloads\Nearest Airport - Acknowlegement Letter 001 Copy.pdf"
SIGNATURE_SOURCE = r"tmp\pdfs\source-image-1.png"
OUTPUT = r"output\pdf\Nearest Airport - Acknowledgement Letter - Stanislav Zavizion.pdf"


def clean_signature() -> BytesIO:
    image = Image.open(SIGNATURE_SOURCE).convert("RGB")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue = pixels[x, y]
            # Retain dark blue ink and replace the pale blue scan background with pure white.
            if blue - red > 20 and blue - green > 5 and blue < 210:
                pixels[x, y] = (0, 52, 101)
            else:
                pixels[x, y] = (255, 255, 255)
    output = BytesIO()
    image.save(output, format="PNG")
    output.seek(0)
    return output


signature = clean_signature()
overlay_buffer = BytesIO()
page_width, page_height = 595.32, 842.04
overlay = canvas.Canvas(overlay_buffer, pagesize=(page_width, page_height))
overlay.setFillColorRGB(1, 1, 1)

# White-out only the fillable-line areas before adding typed text.
for x, y, width, height in [
    (101, 678, 170, 18),
    (75, 620, 251, 18),
    (158, 578, 240, 18),
    (65, 348, 350, 26),
    (65, 270, 350, 60),
    (101, 247, 170, 18),
]:
    overlay.rect(x, y, width, height, fill=1, stroke=0)

overlay.setFillColorRGB(0, 0, 0)
overlay.setFont("Times-Roman", 12)
overlay.drawString(102, 683, "22 July 2026")
overlay.drawString(83, 625, "Stanislav Zavizion")
overlay.setFont("Times-Roman", 8)
overlay.drawString(160, 583, "Mihail Kogalniceanu Intl. Airport, Constanta, Romania")
overlay.drawString(102, 252, "22 July 2026")

overlay.setFont("Times-Bold", 12)
overlay.drawString(71, 359, "Crew Name:")
overlay.setFont("Times-Roman", 12)
overlay.drawString(141, 358, "Stanislav Zavizion")

# Rebuild the airport-code and signature rows after removing the original scan.
overlay.setFont("Times-Bold", 12)
overlay.drawString(71, 299, "Declared Nearest Airport (IATA Code):")
overlay.setFont("Times-Roman", 12)
overlay.drawString(307, 299, "CND")
overlay.setFont("Times-Bold", 12)
overlay.drawString(71, 276, "Signature:")
overlay.setLineWidth(0.5)
overlay.line(130, 273, 368, 273)

# Fresh white signature image, kept below the airport-code row.
overlay.drawImage(ImageReader(signature), 143, 265, width=166, height=29, mask="auto")
overlay.save()
overlay_buffer.seek(0)

reader = PdfReader(SOURCE)
overlay_page = PdfReader(overlay_buffer).pages[0]
page = reader.pages[0]
page.merge_page(overlay_page)
writer = PdfWriter()
writer.add_page(page)
with open(OUTPUT, "wb") as file:
    writer.write(file)
