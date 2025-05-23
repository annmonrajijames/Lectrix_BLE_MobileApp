#include <stdio.h>
#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "oled.h"
#include "gatt_server.h"
#include "esp_bt.h"  // Required for esp_bt_controller_mem_release()

#define BUTTON_GPIO 14

void app_main(void)
{
    // Release Classic BT memory (do this only once)
    esp_bt_controller_mem_release(ESP_BT_MODE_CLASSIC_BT);

    // Init button
    gpio_reset_pin(BUTTON_GPIO);
    gpio_set_direction(BUTTON_GPIO, GPIO_MODE_INPUT);
    gpio_set_pull_mode(BUTTON_GPIO, GPIO_PULLUP_ONLY);

    bool ble_mode_started = false;
    bool oled_mode_started = false;

    while (1) {
        if (gpio_get_level(BUTTON_GPIO) == 0) {
            if (!oled_mode_started) {
                printf(">> OLED mode\n");
                oled_mode_started = true;
                ble_mode_started = false;
                run_oled_mode(BUTTON_GPIO);  // Assuming blocking call or launches task
            }
        } else {
            if (!ble_mode_started) {
                printf(">> BLE mode\n");
                ble_mode_started = true;
                oled_mode_started = false;
                gatt_server_run(BUTTON_GPIO);  // Should init BLE once or manage state internally
            }
        }

        vTaskDelay(pdMS_TO_TICKS(100));  // debounce and CPU yield
    }
}
