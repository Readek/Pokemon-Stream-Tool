import os, json
from PIL import Image
from glob import iglob
sprites_path = os.path.join("..", "Stream Tool", "Resources", "Assets", "play.pokemonshowdown.com", "sprites")
output_filename = os.path.join(sprites_path, "offsets.json")

def calculate_centers(image: Image):
    center = (image.width/2, image.height/2)

    average_center = [0, 0]
    for i in range(image.n_frames):
        image.seek(i)
        bbox = image.getbbox()
        average_center[0] += bbox[0] + bbox[2]
        average_center[1] += bbox[1] + bbox[3]

    average_center = (average_center[0]/2/image.n_frames, average_center[1]/2/image.n_frames)
    return center, average_center

sprite_dict = {}
for gif_file in iglob("**/*.gif", root_dir=sprites_path, recursive=True):
    image = Image.open(os.path.join(sprites_path, gif_file))
    center, average_center = calculate_centers(image)
    offset = (-round(average_center[0] - center[0], 2), -round(average_center[1] - center[1], 2))
    print(gif_file, offset)
    sprite_dict[gif_file] = offset

with open(output_filename, "w") as output_file:
    json.dump(sprite_dict, output_file, sort_keys=True, indent=4)