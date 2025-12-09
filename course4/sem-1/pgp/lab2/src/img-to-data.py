from PIL import Image
import os


def uint32_le_hex(value):
  return value.to_bytes(4, 'little').hex()


def convert_img_to_data(in_filename, out_filename):
  in_image = Image.open(in_filename)
  in_pixels = list(in_image.getdata())
  [img_w, img_h] = in_image.size
  img_data = [[0] * img_w for _ in range(img_h)]
  for i in range(img_h):
    for j in range(img_w):
      r, g, b = in_pixels[i * img_w + j]
      img_data[i][j] = f'{r:02x}{g:02x}{b:02x}00'
  
  with open(out_filename, 'wb') as output:
    output.write(img_w.to_bytes(4, 'little'))
    output.write(img_h.to_bytes(4, 'little'))
    output.write(in_image.convert('RGBA').tobytes())


def convert_data_to_img(in_data_filename, out_image_filename):
  with open(in_data_filename, 'rb') as input_file:
    img_w = int.from_bytes(input_file.read(4), 'little')
    img_h = int.from_bytes(input_file.read(4), 'little')
    raw_pixel_data = input_file.read()

  rgb_data = bytearray()
  for i in range(0, len(raw_pixel_data), 4):
    rgb_data.extend(raw_pixel_data[i: i + 3])

  restored_image = Image.frombytes(
    mode='RGB',
    size=(img_w, img_h),
    data=bytes(rgb_data)
  )

  restored_image.save(out_image_filename)


def convert_folder_to_data(folder_path, out_folder_path):
  for filename in os.listdir(folder_path):
    convert_img_to_data(os.path.join(folder_path, filename), os.path.join(out_folder_path, filename.split('.')[0] + '.data'))



def convert_folder_to_img(folder_path, out_folder_path):
  for filename in os.listdir(folder_path):
    convert_data_to_img(os.path.join(folder_path, filename), os.path.join(out_folder_path, filename.split('.')[0] + '.jpg'))

# convert_folder_to_data('../in', '../out')
convert_folder_to_img('../processed', '../result')
# convert_data_to_img('./mash2.data', './res-mash2.jpg')
# convert_img_to_data('../out/mash2.jpg', '../out/mash2.data')
