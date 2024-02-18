import cv2 as cv
import numpy as np
from Pillow import Image

def get_contours(image):

  # Converting to grayscale
  gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)

  # Applying Otsu's thresholding
  Retval, thresh = cv.threshold(gray, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)

  # Finding contours with RETR_EXTERNAL flag to get only the outer contours
  # (Stuff inside the cards will not be detected now.)
  cont, hier = cv.findContours(thresh, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE)
  # Creating a new binary image of the same size and drawing contours found with thickness -1.
  # This will colour the contours with white thus getting the outer portion of the cards.
  newthresh = np.zeros(thresh.shape, dtype=np.uint8)
  newthresh = cv.drawContours(newthresh, cont, -1, 255, -1)

  # Performing erosion->dilation to remove noise
  kernel = np.ones((3, 3), dtype=np.uint8)
  newthresh = cv.erode(newthresh, kernel, iterations=6)
  newthresh = cv.dilate(newthresh, kernel, iterations=6)

  # Again finding the final contours and drawing them on the image.
  cont, hier = cv.findContours(newthresh, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE)


  return cont

def create_contour_mask(image, contour):
  img_copy = np.zeros(shape=image.shape)
  cv.drawContours(img_copy, [contour], -1, (255, 255, 255), 1)
  gray_copy = cv.cvtColor(np.float32(img_copy), cv.COLOR_BGR2GRAY)
  return gray_copy

def filter_contours_by_area(contours, min_area):
  filtered_contours = []
  for contour in contours:
      area = cv.contourArea(contour)
      if area >= min_area:
          filtered_contours.append(contour)
  return filtered_contours

def extend_line(p1, p2, distance=10000):
    diff = np.arctan2(p1[1] - p2[1], p1[0] - p2[0])
    p3_x = int(p1[0] + distance*np.cos(diff))
    p3_y = int(p1[1] + distance*np.sin(diff))
    p4_x = int(p1[0] - distance*np.cos(diff))
    p4_y = int(p1[1] - distance*np.sin(diff))
    return ((p3_x, p3_y), (p4_x, p4_y))

def find_edges(image):
  edges = cv.Canny(np.uint8(image), 50, 150, apertureSize=3)
  line_bag = []
  all_lines_found = False


  n = 30
  while not all_lines_found and n > 0:
    edges = cv.Canny(np.uint8(image), 50, 150, apertureSize=3)
    lines = cv.HoughLinesP(edges, 1, np.pi/180, threshold=75, minLineLength=50, maxLineGap=25)
    if lines is not None:
      x1, y1, x2, y2 = lines[0][0]
      (save_point_1, save_point_2) = extend_line((x1, y1), (x2, y2))
      cv.line(image, save_point_1, save_point_2, (0, 0, 0), 30)

      line_bag.append((save_point_1,save_point_2))
      n= n-1
    else:
      all_lines_found = True

  return line_bag

def create_extended_lines_image(lines):
  extended_lines_image = np.zeros(shape=(img.shape))

  for line in lines:
    ((x1, y1), (x2, y2)) = line
    cv.line(extended_lines_image, (x1, y1), (x2, y2), (0, 255, 0), 6)
  return extended_lines_image

def is_within_image(point, image_shape):
    return 0 <= point[0] < image_shape[1] and 0 <= point[1] < image_shape[0]

def find_intersections(lines, image_shape):
    points = []
    for i in range(len(lines)):
        for j in range(i + 1, len(lines)):
            line1 = lines[i]
            line2 = lines[j]

            x1, y1 = line1[0]
            x2, y2 = line1[1]
            x3, y3 = line2[0]
            x4, y4 = line2[1]

            # Calculate the intersection point
            denominator = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4))
            if denominator != 0:
                intersect_x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator
                intersect_y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator

                intersect_point = intersect_x, intersect_y
                if is_within_image(intersect_point, image_shape):
                    points.append(intersect_point)

    return np.array(points, dtype=np.float32)

def create_all_intersections_from_image(img):
  contours = get_contours(img)
  large_enough_contours = filter_contours_by_area(contours, 200000)
  intersection_groups = []
  for contour in large_enough_contours:
    contour_mask = create_contour_mask(img, contour)
    lines = find_edges(contour_mask)
    intersections = find_intersections(lines,img.shape)
    intersection_groups.append(intersections)
  return intersection_groups

def sort_points_clockwise(points):
    # Convert points to NumPy array
    points = np.array(points)

    # Calculate centroid (mean of all points)
    centroid = np.mean(points, axis=0)

    # Calculate angles of points with respect to centroid
    angles = np.arctan2(points[:,1] - centroid[1], points[:,0] - centroid[0])

    # Sort points based on angles
    sorted_indices = np.argsort(angles)

    # Rearrange points in clockwise order
    sorted_points = points[sorted_indices]

    return sorted_points


def fix_perspective(img, corners):
    # Define the desired rectangle after transformation
    width = 200  # define your desired width
    height = 300  # define your desired height
    dst_corners = np.array([[0, 0], [width-1, 0], [width-1, height-1], [0, height-1]], dtype=np.float32)
    # Calculate the perspective transform matrix
    M = cv.getPerspectiveTransform(corners, dst_corners)

    # Apply the transformation
    warped_img = cv.warpPerspective(img, M, (width, height))

    return warped_img

def crop_array(array, percent_height, percent_width):
    height, width = array.shape[:2]
    cropped_height = int(percent_height * height)
    cropped_width = int(percent_width * width)
    cropped_array = array[:cropped_height, :cropped_width]
    return cropped_array

def orient_images_from_groups(image, groups):
  images = []
  for group in groups:
    group = np.array(group, dtype=np.float32)
    corners = sort_points_clockwise(group)
    oriented_image = fix_perspective(image,corners)
    images.append(oriented_image)
  return images

def split_image_into_number_and_suit(card_image):
    height, width = card_image.shape[:2]
    split_pos = int(height * 0.7)
    number_image = card_image[:split_pos, :]
    suit_image = card_image[split_pos:, :]
    return number_image, suit_image