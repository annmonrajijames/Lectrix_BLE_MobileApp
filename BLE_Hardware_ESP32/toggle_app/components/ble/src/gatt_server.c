#include "gatt_server.h"
#include "nvs_flash.h"
#include "esp_log.h"
#include "esp_bt.h"
#include "esp_bt_main.h"
#include "esp_bt_device.h"
#include "esp_gap_ble_api.h"
#include "esp_gatts_api.h"
#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

static const char* TAG = "GATTS";

#define GATTS_DEVICE_NAME     "ESP32_TOGGLE"
#define GATTS_SERVICE_UUID    0x00FF
#define GATTS_CHAR_UUID       0xFF01
#define GATTS_ADV_INTERVAL_MS 100

void gatt_server_init(void)
{
    ESP_ERROR_CHECK(nvs_flash_init());
    ESP_ERROR_CHECK(esp_bt_controller_mem_release(ESP_BT_MODE_CLASSIC_BT));
    esp_bt_controller_config_t cfg = BT_CONTROLLER_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_bt_controller_init(&cfg));
    ESP_ERROR_CHECK(esp_bt_controller_enable(ESP_BT_MODE_BLE));
    ESP_ERROR_CHECK(esp_bluedroid_init());
    ESP_ERROR_CHECK(esp_bluedroid_enable());

    ESP_LOGI(TAG, "BLE init, name=%s", GATTS_DEVICE_NAME);
    ESP_ERROR_CHECK(esp_ble_gap_set_device_name(GATTS_DEVICE_NAME));

    // TODO: register GAP/GATTS callbacks, create service+char
}

void gatt_server_run(void)
{
    ESP_LOGI(TAG, "GATTS: one-shot run");
    // TODO: start advertising or send a notification
}

void run_ble_mode(int button_gpio)
{
    // stay in BLE mode while button is released (level=1)
    while (gpio_get_level(button_gpio) == 1) {
        gatt_server_run();
        vTaskDelay(pdMS_TO_TICKS(200));  // give CPU + debounce
    }
}
