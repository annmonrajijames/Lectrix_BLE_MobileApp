# components/oled/CMakeLists.txt

idf_component_register(
  SRCS         "src/i2c_oled.c"
  INCLUDE_DIRS "include"
  REQUIRES     driver log
)
