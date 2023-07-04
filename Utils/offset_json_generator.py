import os, json
from PIL import Image, GifImagePlugin
import numpy as np
from glob import iglob

GifImagePlugin.LOADING_STRATEGY = GifImagePlugin.LoadingStrategy.RGB_ALWAYS
sprites_path = os.path.join("..", "Stream Tool", "Resources", "Assets", "play.pokemonshowdown.com", "sprites")
output_filename = os.path.join(sprites_path, "offsets.json")

def calculate_centers(image: Image):
    center = (image.width/2, image.height/2)

    average_center_of_mass = np.zeros(2)
    for i in range(image.n_frames):
        image.seek(i)
        image_array = np.asarray(image.getchannel("A"))
        center_of_mass = [ np.average(indices) for indices in np.where(image_array >= 1) ]
        average_center_of_mass += center_of_mass

    average_center_of_mass = average_center_of_mass[::-1]/image.n_frames
    return center, average_center_of_mass

sprite_dict = {}
for gif_file in iglob("**/*.gif", root_dir=sprites_path, recursive=True):
    image = Image.open(os.path.join(sprites_path, gif_file))
    center, average_center_of_mass = calculate_centers(image)
    offset = [round(x, 2) for x in (center - average_center_of_mass)]
    print(gif_file, offset)
    sprite_dict[gif_file] = offset

with open(output_filename, "w") as output_file:
    json.dump(sprite_dict, output_file, sort_keys=True, indent=4)