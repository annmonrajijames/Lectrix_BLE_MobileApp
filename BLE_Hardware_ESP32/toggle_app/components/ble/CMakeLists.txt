# components/ble/CMakeLists.txt

idf_component_register(
  SRCS         "src/gatt_server.c"
  INCLUDE_DIRS "include"
  REQUIRES     bt nvs_flash log driver
)
