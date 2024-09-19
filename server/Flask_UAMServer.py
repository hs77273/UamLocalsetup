from flask import Flask, request, jsonify
import mysql.connector
from datetime import datetime
from io import BytesIO
import base64
from PIL import Image, ImageOps
import numpy as np
import requests
import cv2
import tempfile

app = Flask(__name__)
db_config = {
    'host': '127.0.0.1',
    'port': 3306,
    'user': 'root',
    'password': '0319692001@Cyient',
    'database': 'aerodb',
}

connection = mysql.connector.connect(**db_config)
@app.route("/api/register_passenger", methods=["POST"])
def register_passenger():
    try:
        request_data = request.get_json()
        seatSelection = request_data.get("seatSelection")

        cursor = connection.cursor()
        select_sql = "SELECT * FROM passengerdetails WHERE passengerSeat = %s"
        cursor.execute(select_sql, (seatSelection,))
        existing_data = cursor.fetchall()

        for row in existing_data:
            delete_sql = "DELETE FROM passengerdetails WHERE passengerSeat = %s"
            cursor.execute(delete_sql, (seatSelection,))
            connection.commit()

        passengerName = request_data.get("passengerName")
        passengerAge = int(request_data.get("passengerAge"))
        passengerGender = request_data.get("passengerGender")
        fromPlace = request_data.get("fromPlace")
        toPlace = request_data.get("toPlace")
        journeyDate = datetime.strptime(
            request_data.get("journeyDate"), "%Y-%m-%d"
        ).strftime("%Y-%m-%d")
        imageData = base64.b64decode(request_data.get("imageData"))
        image = Image.open(BytesIO(imageData))
        password = request_data.get("password")

        image = ImageOps.exif_transpose(image)
        image_np = np.array(image)
        image_resize = cv2.resize(image_np, dsize=(480, 480), interpolation=cv2.INTER_CUBIC)
        faces = process_image(image_resize)
        print("faces",len(faces),faces)

        if len(faces) == 1:
            x, y, w, h = faces[0]
            roi_color = image_resize[y:y + h, x:x + w]
            crop_face_area = Image.fromarray(roi_color, mode='RGB')
        else:
            crop_face_area = image

        image_base64 = get_encoded_img(crop_face_area)

        insert_sql = """
            INSERT INTO passengerdetails (passengerName, passengerAge, passengerGender, fromPlace, toPlace, journeyDate, personImage, passengerSeat, password)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(
            insert_sql,
            (
                passengerName,
                passengerAge,
                passengerGender,
                fromPlace,
                toPlace,
                journeyDate,
                image_base64,
                seatSelection,
                password,
            ),
        )
        connection.commit()
        cursor.close()

        return jsonify({"message": "Passenger registered successfully"}), 200

    except Exception as e:
        print("MySQL Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/login", methods=["POST"])
def login():
    try:
        username = request.args.get("username")
        password = request.args.get("password")
        
        cursor = connection.cursor()
        cursor.execute(
            "SELECT * FROM passengerdetails WHERE passengerName = %s AND password = %s",
            (username, password),
        )
        user = cursor.fetchall()
        cursor.close()
        
        if user:
            return jsonify({"message": "Login successful"})
        else:
            return jsonify({"message": "Login failed. Invalid username or password"})

    except Exception as e:
        print("MySQL Error:", e)
        return jsonify({"message": str(e)}), 500

@app.route("/api/fetch_passenger_details", methods=["POST"])
def fetch_passenger_details():
    try:
        data = request.get_json() 
        username = data.get("username")
        password = data.get("password")

        cursor = connection.cursor()
        cursor.execute(
            "SELECT * FROM passengerdetails WHERE password = %s", (password,)
        )
        passenger_data = cursor.fetchall()

        if not passenger_data:
            return jsonify({"message": "No data found for the provided username and password"}), 404

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
            
        return jsonify({"passenger_details": response_data}), 200

    except Exception as e:
        print("MySQL Error:", e)
        return jsonify({"message": str(e)}), 500


def get_encoded_img(image):
    img_byte_arr = BytesIO()
    image.save(img_byte_arr, format="JPEG")
    my_encoded_img = base64.b64encode(img_byte_arr.getvalue()).decode("utf-8")  
    return my_encoded_img


def process_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faceCascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    faces = faceCascade.detectMultiScale(
        gray, scaleFactor=1.3, minNeighbors=3, minSize=(30, 30)
    )
    return faces


@app.route("/api", methods=["POST", "GET"])
def index():
    image_path = "cropped_face.jpg"  # point to your image location
    encoded_img = get_encoded_img(image_path)
    return jsonify({"image_url": encoded_img})
    # return jsonify(
    #     {"image:": encoded_img, "Greeting Message": f"I am running {datetime.now()}"}
    # )


@app.route("/")
def home():
    return """
                <!DOCTYPE html>
            <html>

            <body>

                <canvas id="myCanvas" width="480" height="480" style="z-index: 1;">Your browser does not support the HTML canvas tag.</canvas>
                <button name="getMask" id="getMask"> Show Mask </button>

                <script>
                    const canvasMask = document.getElementById('myCanvas');
                                const ctxcanvasMask = canvasMask.getContext('2d');

                                document.getElementById("getMask").addEventListener('click', () => {
                                    var xhr = new XMLHttpRequest();

                                    // Setup our listener to process compeleted requests
                                    xhr.onreadystatechange = function () {
                                        // Only run if the request is complete
                                        if (xhr.readyState !== 4) return;

                                        // Process our return data
                                        if (xhr.status >= 200 && xhr.status < 300) {
                                            // What do when the request is successful
                                            console.log("I got the image");
                                            
                                            let data = JSON.parse(xhr.responseText);

                                            console.log(data.image_url);

                                            var img = new Image();
                                            img.src = 'data:image/jpeg;base64,' + data.image_url;
                                            
                                            img.onload = function () {
                                                ctxcanvasMask.drawImage(img, 0, 0);
                                            }
                                        }
                                    };
                                    // Create and send a GET request
                                    // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
                                    // The second argument is the endpoint URL
                                    xhr.open('GET', '/api');
                                    xhr.send();
                                });
                </script>

            </body>

            </html>
                    
        """


@app.route("/api/crop_face", methods=["POST"])
def crop_face(show=False):
    print("*_*_*_*" * 50)
    try:
        if "image" in request.files:
            image_data = request.files["image"].read()
            image = Image.open(BytesIO(image_data))
        else:
            url = request.params.get("url")
            response = requests.get(url)
            image = Image.open(BytesIO(response.content))

        # Image Face detection Logic logic
        image = ImageOps.exif_transpose(image)  # Correct image orientation
        image_np = np.array(image)
        image_resize = cv2.resize(image_np,dsize=(480, 480), interpolation=cv2.INTER_CUBIC)
        faces = process_image(image_resize)


        print("faces", len(faces))

        if len(faces) == 1:
            x, y, w, h = faces[0]
            roi_color = image_resize[y : y + h, x : x + w]
            crop_face_area = Image.fromarray(roi_color,mode='RGB')
            if show:
                # Window name in which image is displayed
                window_name = "face_window"
                cv2.imshow(window_name, roi_color[:,:,::-1])
                cv2.waitKey(0)
                cv2.destroyAllWindows()


            return jsonify(
                {
                    "num_faces": len(faces),
                    "image_url": get_encoded_img(crop_face_area),
                }
            )

        else:
            return jsonify({"num_faces": len(faces), "image_url": ""},)

    except Exception as e:
        return jsonify({"message": f"Failed to process the image {e}"})



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7071, debug=True)
