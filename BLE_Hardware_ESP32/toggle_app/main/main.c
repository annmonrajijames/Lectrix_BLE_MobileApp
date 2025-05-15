#include <stdio.h>
#include "driver/gpio.h"
#include "i2c_oled.h"
#include "gatt_server.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#define BUTTON_GPIO 18

void app_main(void)
{
    // 1) GPIO init
    gpio_reset_pin(BUTTON_GPIO);
    gpio_set_direction(BUTTON_GPIO, GPIO_MODE_INPUT);
    gpio_set_pull_mode(BUTTON_GPIO, GPIO_PULLUP_ONLY);

    // 2) Init both subsystems
    i2c_oled_init();
    gatt_server_init();

    // 3) Main dispatch loop
    while (1) {
        int lvl = gpio_get_level(BUTTON_GPIO);
        if (lvl == 0) {
            printf(">> OLED mode\n");
            run_oled_mode(BUTTON_GPIO);
        } else {
            printf(">> BLE mode\n");
            run_ble_mode(BUTTON_GPIO);
        }
        // tiny pause before re-checking mode
        vTaskDelay(pdMS_TO_TICKS(50));
    }
}
