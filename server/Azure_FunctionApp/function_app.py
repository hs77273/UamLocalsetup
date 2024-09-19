import base64
from io import BytesIO
import json
import azure.functions as func
import logging
import mysql.connector
import numpy as np
import requests
from PIL import Image,ImageOps
import cv2


app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# Database connection details
db_config = {
    "host": "aeroregulatoriesdb.mysql.database.azure.com",
    "port": 3306,
    "user": "aerodbadmin",
    "password": "Internet@123",
    "database": "aerodb",
}


@app.route(route="test")
def TestServer(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )
    
@app.route(route="login",methods=["POST"])
def login(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Request data
        username = req.params.get("username")
        password = req.params.get("password")

        # Establish MySQL connection
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Check login credentials
        cursor.execute(
            "SELECT * FROM passengerdetails WHERE passengerName = %s AND password = %s",
            (username, password),
        )
        user = cursor.fetchall()
        cursor.close()
        connection.close()

        if user:
            return func.HttpResponse(
                json.dumps({'message': 'Login successful'}),
                mimetype="application/json",
                status_code=200,
            )
        else:
            return func.HttpResponse(
                json.dumps({'message': 'Login failed. Invalid username or password'}),
                mimetype="application/json",
                status_code=401,
            )
    except Exception as e:
        logging.error(f"MySQL Error: {str(e)}")
        return func.HttpResponse(
            f"{{'error': 'An error occurred: {str(e)}'}}",
            mimetype="application/json",
            status_code=500,
        )


@app.route(route="fetch_passenger_details",methods=["POST"])
def fetch_passenger_details(req: func.HttpRequest) -> func.HttpResponse:
    try:
        req_body = req.get_json()
        password = req_body.get("password")

        # Establish MySQL connection
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Fetch passenger details
        cursor.execute("SELECT * FROM passengerdetails WHERE password = %s", (password,))
        passenger_data = cursor.fetchall()

        cursor.close()
        connection.close()

        if not passenger_data:
            return func.HttpResponse(
                "No data found for the provided username and password", status_code=404
            )

        # Prepare response data
        response_data = []
        for row in passenger_data:
            image_base64 = base64.b64encode(row[6]).decode('utf-8')
            image_text = base64.b64decode(image_base64).decode('utf-8')
            data = {
                "passengerName": row[0],
                "passengerAge": row[1],
                "passengerGender": row[2],
                "fromPlace": row[3],
                "toPlace": row[4],
                "journeyDate": row[5].isoformat(),
                "passengerImage":image_text,
                "passengerSeat": row[7],
            }
            response_data.append(data)

        return func.HttpResponse(json.dumps({"passenger_details": response_data}),mimetype="application/json",status_code=200,)

    except Exception as e:
        return func.HttpResponse(f"MySQL Error: {str(e)}", mimetype="application/json", status_code=500)
    
@app.route("register_passenger", methods=["POST"])
def register_passenger(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Request data
        req_body = req.get_json()
        seatSelection = req_body.get('seatSelection')

        # Establish MySQL connection
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Check if seatSelection is already present
        select_sql = "SELECT * FROM passengerdetails WHERE passengerSeat = %s"
        cursor.execute(select_sql, (seatSelection,))
        existing_data = cursor.fetchall()

        for row in existing_data:
            # Delete each row with the matching seatSelection
            delete_sql = "DELETE FROM passengerdetails WHERE passengerSeat = %s"
            cursor.execute(delete_sql, (seatSelection,))
            connection.commit()

        # Request data
        passengerName = req_body.get('passengerName')
        passengerAge = int(req_body.get('passengerAge'))
        passengerGender = req_body.get('passengerGender')
        fromPlace = req_body.get('fromPlace')
        toPlace = req_body.get('toPlace')
        journeyDate = req_body.get('journeyDate')

        imageData = base64.b64decode(req_body.get("imageData"))
        image = Image.open(BytesIO(imageData))
        password = req_body.get("password")

        image = ImageOps.exif_transpose(image)
        image_np = np.array(image)
        image_resize = cv2.resize(image_np, dsize=(480, 480), interpolation=cv2.INTER_CUBIC)
        faces = process_image(image_resize)

        if len(faces) == 1:
            x, y, w, h = faces[0]
            roi_color = image_resize[y:y + h, x:x + w]
            crop_face_area = Image.fromarray(roi_color, mode='RGB')
        else:
            crop_face_area = image

        # Convert the image to base64 before storing it in the database
        image_base64 = get_encoded_img(crop_face_area)

        # Insert passenger details
        sql = """
            INSERT INTO passengerdetails (passengerName, passengerAge, passengerGender, fromPlace, toPlace, journeyDate, personImage, passengerSeat, password)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (passengerName, passengerAge, passengerGender, fromPlace, toPlace, journeyDate, image_base64, seatSelection, password))
        connection.commit()

        cursor.close()
        connection.close()
        return func.HttpResponse("Passenger registered successfully", status_code=200)
    except Exception as e:
        return func.HttpResponse(f"MySQL Error: {str(e)}", mimetype="application/json", status_code=500)

def get_encoded_img(image):
    img_byte_arr = BytesIO()
    image.save(img_byte_arr, format="JPEG")
    my_encoded_img = base64.b64encode(img_byte_arr.getvalue()).decode("utf-8")
    return my_encoded_img

def process_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.3,
        minNeighbors=3,
        minSize=(30, 30)
    )
    return faces

@app.route(route="crop_face",methods=["POST"])
def crop_face(req: func.HttpRequest) -> func.HttpResponse:
    try:
        if 'image' in req.files:
            image_data = req.files['image'].read()
            image = Image.open(BytesIO(image_data))
        else:
            url = req.params.get('url')
            response = requests.get(url)
            image = Image.open(BytesIO(response.content))

        # Image Face detection Logic logic
        image = ImageOps.exif_transpose(image)  # Correct image orientation
        image_np = np.array(image)
        image_resize = cv2.resize(image_np,dsize=(480, 480), interpolation=cv2.INTER_CUBIC)
        faces = process_image(image_resize)

        if len(faces) == 1:
            x, y, w, h = faces[0]
            roi_color = image_resize[y:y + h, x:x + w]
            crop_face_area = Image.fromarray(roi_color,mode='RGB')

         
            return func.HttpResponse(
            json.dumps({
                "num_faces": len(faces),
                "image_url": get_encoded_img(crop_face_area)
            }))

        else:
            return func.HttpResponse(
            json.dumps({"num_faces": len(faces),  "image_url":"" }))

    
    except Exception as e:
        return func.HttpResponse(str(e), status_code=500)