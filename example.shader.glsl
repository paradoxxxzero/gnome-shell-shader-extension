uniform int height;
uniform sampler2D tex;
uniform int width;


float r = 2.;
float sn = .25;
vec2 resolution = 1 / vec2(width, height);

void main(void) {
  vec2 col = cogl_tex_coord_in[0].xy;
  vec4 sum = vec4(0);

  for (float i = -r; i < r; i++) {
    if (i != 0) {
      float d = sn / (i * i);
      sum += (texture2D(tex, col + vec2(i, 0) * resolution) + texture2D(tex, col + vec2(0, i) * resolution)) * d;
    }
  }
  cogl_color_out = (texture2D(tex, col) + sum);
  cogl_color_out.a *= .25;
}
