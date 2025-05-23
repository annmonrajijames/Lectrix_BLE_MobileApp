# toggle_app/components/oled/CMakeLists.txt
idf_component_register(
  SRCS         "src/oled.c"
  INCLUDE_DIRS "include"
  REQUIRES     driver log esp_lcd
)
