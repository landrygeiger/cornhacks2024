import asyncio
import json
from websockets.server import serve
from PIL import Image
import base64
import io
from image_processing import create_prediction_from_image
import numpy as np
import cv2 as cv
import inference

model = inference.get_roboflow_model("card-classification-ne1gj/1")

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
    test_inputs = model.infer(image="./test_inputs/two_cards.jpg")

    print("dealer", dealer_cards)

    print("p1 stuff", p1_cards)
    print("p2 stuff", p2_cards)
    print("p3 stuff", p3_cards)

    print("test stuff", test_inputs)

    return "yooo"

    # return {
    #   "dealer": dealer_cards.predictions,
    #   "player1": p1_cards.predictions,
    #   "player2": p2_cards.predictions,
    #   "player3": p3_cards.predictions,
    # }

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
    p1_left_img.save("./p1_left.jpg")
    p1_right_img.save("./p1_right.jpg")
    p2_left_img.save("./p2_left.jpg")
    p2_right_img.save("./p2_right.jpg")
    p3_left_img.save("./p3_left.jpg")
    p3_right_img.save("./p3_right.jpg")

    dealer_cards = zach_func(cv.imread("./dealer.jpg"))
    p1_left_cards = zach_func(cv.imread("./p1_left.jpg"))
    p1_right_cards = zach_func(cv.imread("./p1_right.jpg"))
    p2_left_cards = zach_func(cv.imread("./p2_left.jpg"))
    p2_right_cards = zach_func(cv.imread("./p2_right.jpg"))
    p3_left_cards = zach_func(cv.imread("./p3_left.jpg"))
    p3_right_cards = zach_func(cv.imread("./p3_right.jpg"))

    def card_translator(card_code):
      codes = {
      'AH': {'suit': "hearts", 'rank': "ace"},
    '2H': {'suit': "hearts", 'rank': "2"},
    '3H': {'suit': "hearts", 'rank': "3"},
    '4H': {'suit': "hearts", 'rank': "4"},
    '5H': {'suit': "hearts", 'rank': "5"},
    '6H': {'suit': "hearts", 'rank': "6"},
    '7H': {'suit': "hearts", 'rank': "7"},
    '8H': {'suit': "hearts", 'rank': "8"},
    '9H': {'suit': "hearts", 'rank': "9"},
    '10H': {'suit': "hearts", 'rank': "10"},
    'JH': {'suit': "hearts", 'rank': "jack"},
    'QH': {'suit': "hearts", 'rank': "queen"},
    'KH': {'suit': "hearts", 'rank': "king"},
    'AD': {'suit': "diamonds", 'rank': "ace"},
    '2D': {'suit': "diamonds", 'rank': "2"},
    '3D': {'suit': "diamonds", 'rank': "3"},
    '4D': {'suit': "diamonds", 'rank': "4"},
    '5D': {'suit': "diamonds", 'rank': "5"},
    '6D': {'suit': "diamonds", 'rank': "6"},
    '7D': {'suit': "diamonds", 'rank': "7"},
    '8D': {'suit': "diamonds", 'rank': "8"},
    '9D': {'suit': "diamonds", 'rank': "9"},
    '10D': {'suit': "diamonds", 'rank': "10"},
    'JD': {'suit': "diamonds", 'rank': "jack"},
    'QD': {'suit': "diamonds", 'rank': "queen"},
    'KD': {'suit': "diamonds", 'rank': "king"},
    'AC': {'suit': "clubs", 'rank': "ace"},
    '2C': {'suit': "clubs", 'rank': "2"},
    '3C': {'suit': "clubs", 'rank': "3"},
    '4C': {'suit': "clubs", 'rank': "4"},
    '5C': {'suit': "clubs", 'rank': "5"},
    '6C': {'suit': "clubs", 'rank': "6"},
    '7C': {'suit': "clubs", 'rank': "7"},
    '8C': {'suit': "clubs", 'rank': "8"},
    '9C': {'suit': "clubs", 'rank': "9"},
    '10C': {'suit': "clubs", 'rank': "10"},
    'JC': {'suit': "clubs", 'rank': "jack"},
    'QC': {'suit': "clubs", 'rank': "queen"},
    'KC': {'suit': "clubs", 'rank': "king"},
    'AS': {'suit': "spades", 'rank': "ace"},
    '2S': {'suit': "spades", 'rank': "2"},
    '3S': {'suit': "spades", 'rank': "3"},
    '4S': {'suit': "spades", 'rank': "4"},
    '5S': {'suit': "spades", 'rank': "5"},
    '6S': {'suit': "spades", 'rank': "6"},
    '7S': {'suit': "spades", 'rank': "7"},
    '8S': {'suit': "spades", 'rank': "8"},
    '9S': {'suit': "spades", 'rank': "9"},
    '10S': {'suit': "spades", 'rank': "10"},
    'JS': {'suit': "spades", 'rank': "jack"},
    'QS': {'suit': "spades", 'rank': "queen"},
    'KS': {'suit': "spades", 'rank': "king"}
      }
      return codes[card_code]

    result = {}
    result["dealer"] = list(map(card_translator, dealer_cards))
    result["player1"] = []
    if p1_left_cards:
      result["player1"].append(list(map(card_translator, p1_left_cards)))
    if p1_right_cards:
      result["player1"].append(list(map(card_translator, p1_right_cards)))

    result["player2"] = []
    if p2_left_cards:
      result["player2"].append(list(map(card_translator, p2_left_cards)))
    if p2_right_cards:
      result["player2"].append(list(map(card_translator, p2_right_cards)))

    result["player3"] = []
    if p3_left_cards:
      result["player2"].append(list(map(card_translator, p3_left_cards)))
    if p3_right_cards:
      result["player2"].append(list(map(card_translator, p3_right_cards)))

    return result

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
    async with serve(get_data, "0.0.0.0", 4444):
        await asyncio.Future()

print("starting server")
asyncio.run(main())
