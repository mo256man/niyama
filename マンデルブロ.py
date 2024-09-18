import numpy as np
import cv2
import time

def mandelbrot(width, height, zoom, move_x, move_y, max_iter):
	image = np.zeros((height, width, 3), dtype=np.uint8)
	for x in range(width):
		for y in range(height):
			zx, zy = x * (zoom / width) + move_x, y*(zoom/height)+move_y
			c = complex(zx, zy)
			z = complex(0, 0)
			for i in range(max_iter):
				if abs(z) > 2.0:
					break
				z = z * z + c
				hue = int(255 * i / max_iter)
				sat = 255
				val = 255 if i < max_iter else 0
				color = cv2.cvtColor(np.uint8([[[hue, sat, val]]]), cv2.COLOR_HSV2BGR)[0][0]
				image[y, x] = color
				#cv2.imshow("", image)
				#if cv2.waitKey(1) & 0xFF == ord("q"):
				#	return image
	return image

width, height = 400, 300
zoom = 1.0
move_x, move_y = -0.5, 0.0
max_iter = 100

start_time = time.time()
image = mandelbrot(width, height, zoom, move_x, move_y, max_iter)
end_time = time.time()
print(f"計算時間： {end_time - start_time}sec")

cv2.imshow("", image)
cv2.imwrite("mand.png", image)
cv2.waitKey(0)
cv2.destroyAllWindows()
