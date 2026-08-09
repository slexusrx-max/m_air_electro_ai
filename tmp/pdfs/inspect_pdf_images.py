from pypdf import PdfReader

reader = PdfReader(r"C:\Users\PC\Downloads\Nearest Airport - Acknowlegement Letter 001 Copy.pdf")
for index, image in enumerate(reader.pages[0].images):
    image.image.save(f"tmp/pdfs/source-image-{index}.png")
