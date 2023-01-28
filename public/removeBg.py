from rembg import remove
import sys
# from pathlib import Path
# print(Path.cwd())
# input_path = str(Path.cwd())+"/src/images.png"
# output_path = str(Path.cwd())+"/src/output1.png"
input_path = sys.argv[1]
output_path = sys.argv[2]

with open(input_path, 'rb') as i:
    with open(output_path, 'wb') as o:
        input = i.read()
        output = remove(input)
        o.write(output)
        print("done")