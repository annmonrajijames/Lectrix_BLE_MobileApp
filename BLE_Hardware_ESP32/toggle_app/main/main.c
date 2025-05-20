#include <stdio.h>
#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "i2c_oled.h"
#include "gatt_server.h"

#define BUTTON_GPIO 18

void app_main(void)
{
    // 1) Button GPIO setup
    gpio_reset_pin(BUTTON_GPIO);
    gpio_set_direction(BUTTON_GPIO, GPIO_MODE_INPUT);
    gpio_set_pull_mode(BUTTON_GPIO, GPIO_PULLUP_ONLY);

    while (1) {
        int lvl = gpio_get_level(BUTTON_GPIO);
        if (lvl == 0) {
            printf(">> ENTER OLED MODE\n");
            oled_app(BUTTON_GPIO);
        } else {
            printf(">> ENTER BLE MODE\n");
            ble_app(BUTTON_GPIO);
        }
        // small pause before re-checking mode
        vTaskDelay(pdMS_TO_TICKS(50));
    }
}
