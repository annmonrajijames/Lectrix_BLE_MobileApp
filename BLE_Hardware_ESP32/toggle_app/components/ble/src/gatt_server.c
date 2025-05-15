#include "gatt_server.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "esp_bt.h"
#include "esp_bt_main.h"        // for esp_bluedroid_init/enable
#include "esp_bt_device.h"      // for device name APIs
#include "esp_gap_ble_api.h"    // for GAP functions
#include "esp_gatts_api.h"      // for GATT functions

static const char* TAG = "GATTS";

#define GATTS_DEVICE_NAME       "ESP32_TOGGLE"
#define GATTS_SERVICE_UUID      0x00FF
#define GATTS_CHAR_UUID         0xFF01
#define GATTS_ADV_INTERVAL_MS   100

void gatt_server_init(void)
{
    esp_err_t ret = nvs_flash_init();
    ESP_ERROR_CHECK(ret);
    ESP_ERROR_CHECK(esp_bt_controller_mem_release(ESP_BT_MODE_CLASSIC_BT));
    esp_bt_controller_config_t cfg = BT_CONTROLLER_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_bt_controller_init(&cfg));
    ESP_ERROR_CHECK(esp_bt_controller_enable(ESP_BT_MODE_BLE));
    ESP_ERROR_CHECK(esp_bluedroid_init());
    ESP_ERROR_CHECK(esp_bluedroid_enable());
    ESP_LOGI(TAG, "BLE initialized");

    // register GAP & GATTS callbacks, create service & characteristic...
    // use GATTS_SERVICE_UUID, GATTS_CHAR_UUID, etc.
}

void gatt_server_run(void)
{
    // e.g. esp_ble_gap_start_advertising(&adv_params);
    // handle notifications, etc.
    ESP_LOGI(TAG, "GATT server loop");
}
