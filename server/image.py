import cv2
from PIL import Image, ImageOps
import numpy as np
import base64
from io import BytesIO

def process_image(image):
    """Detect faces in the image using OpenCV."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = faceCascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=3, minSize=(30, 30))
    return faces

def get_encoded_img(image):
    """Convert PIL image to base64-encoded string."""
    img_byte_arr = BytesIO()
    image.save(img_byte_arr, format='JPEG')
    encoded_img = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')
    return encoded_img

def crop_face(image_path):
    # Load the image using PIL
    image = Image.open('server/Ravi.jpeg')

    # Correct the orientation if needed
    image = ImageOps.exif_transpose(image)

    # Convert to numpy array for OpenCV processing
    image_np = np.array(image)

    # Resize the image to (480, 480)
    image_resize = cv2.resize(image_np, dsize=(480, 480), interpolation=cv2.INTER_CUBIC)

    # Detect faces in the resized image
    faces = process_image(image_resize)

    if len(faces) == 1:
        # If a single face is detected, crop it
        x, y, w, h = faces[0]
        roi_color = image_resize[y:y+h, x:x+w]
        crop_face_area = Image.fromarray(roi_color, mode='RGB')
    else:
        # If no face or multiple faces are detected, use the original resized image
        crop_face_area = Image.fromarray(image_resize)

    # Save the cropped face
    cropped_face_path = 'cropped_face.jpg'
    crop_face_area.save(cropped_face_path)

    # Encode the cropped face image to base64
    base64_string = get_encoded_img(crop_face_area)

    # Save the base64 string to a text file
    base64_text_path = 'face_base64.txt'
    with open(base64_text_path, "w") as text_file:
        text_file.write(base64_string)

    return cropped_face_path, base64_text_path

# Usage example
image_path = 'your_image.jpg'  # Replace with your local image path
cropped_face_path, base64_text_path = crop_face(image_path)
print("Cropped face saved at:", cropped_face_path)
print("Base64 text saved at:", base64_text_path)
