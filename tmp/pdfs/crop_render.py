from PIL import Image

image = Image.open(r"tmp\pdfs\filled-nearest-airport-v2-1.png")
image.crop((80, 620, 1180, 1450)).save(r"tmp\pdfs\filled-nearest-airport-details.png")
