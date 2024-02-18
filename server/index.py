import asyncio
from websockets.server import serve
from PIL import Image
import base64
import io
from image_processing import create_prediction_from_image
import numpy as np
import cv2 as cv
import inference

model = inference.load_roboflow_model("card-classification-ne1gj/1")

def zach_func(image):
  return create_prediction_from_image(image)

def landry_func(image_bytes):
    # Convert the image bytes to a PIL Image object
    img = Image.open(io.BytesIO(image_bytes))

    # Get the dimensions of the image
    width, height = img.size

    # Calculate the coordinates for each quadrant
    dealer = (0, 0, width, height//2)
    p1_left = (0, height//2, width//3, height)
    p2_left = (width//3, height//2, width//3*2, height)
    p3_left = (width//3*2, height//2, width, height)

    # Crop the image into four quadrants
    dealer_img = img.crop(dealer)
    p1_left_img = img.crop(p1_left)
    p2_left_img = img.crop(p2_left)
    p3_left_img = img.crop(p3_left)

    dealer_img.save("./dealer.jpg")
    p1_left_img.save("./p1.jpg")
    p2_left_img.save("./p2.jpg")
    p3_left_img.save("./p3.jpg")

    dealer_cards = model.infer(image="./dealer.jpg")
    p1_cards = model.infer(image="./p1.jpg")
    p2_cards = model.infer(image="./p2.jpg")
    p3_cards = model.infer(image="./p3.jpg")

    return {
      dealer: dealer_cards,
      player1: p1_cards,
      player2: p2_cards,
      player3: p3_cards,
    }

def get_data_from_image(image_bytes):
    # Convert the image bytes to a PIL Image object
    img = Image.open(io.BytesIO(image_bytes))

    # Get the dimensions of the image
    width, height = img.size

    # Calculate the coordinates for each quadrant
    dealer = (0, 0, width, height//2)
    p1_left = (0, height//2, width//6, height)
    p1_right = (width//6, height//2, width//6*2, height)
    p2_left = (width//6*2, height//2, width//6*3, height)
    p2_right = (width//6*3, height//2, width//6*4, height)
    p3_left = (width//6*4, height//2, width//6*5, height)
    p3_right = (width//6*5, height//2, width//6*6, height)

    # Crop the image into four quadrants
    dealer_img = img.crop(dealer)
    p1_left_img = img.crop(p1_left)
    p1_right_img = img.crop(p1_right)
    p2_left_img = img.crop(p2_left)
    p2_right_img = img.crop(p2_right)
    p3_left_img = img.crop(p3_left)
    p3_right_img = img.crop(p3_right)

    dealer_img.save("./dealer.jpg")
    cv.imwrite("./dealer-2.jpg", cv.imread("./dealer.jpg"))
    dealer_cards = zach_func(cv.imread("./test_inputs/two_cards.jpg"))

    # p1_left_cards = zach_func(p1_left_img)
    # p1_right_cards = zach_func(p1_right_img)
    # p2_left_cards = zach_func(p2_left_img)
    # p2_right_cards = zach_func(p2_right_img)
    # p3_left_cards = zach_func(p3_left_img)
    # p3_right_cards = zach_func(p3_right_img)

async def get_data(websocket):
    async for message in websocket:
        await websocket.send(json.dumps(landry_func(message)))

async def main():
    async with serve(get_data, "localhost", 4444):
        await asyncio.Future()

print("starting server")
asyncio.run(main())
