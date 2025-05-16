#include <stdio.h>
#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "i2c_oled.h"
#include "gatt_server.h"

#define BUTTON_GPIO 18

void app_main(void)
{
    // init button
    gpio_reset_pin(BUTTON_GPIO);
    gpio_set_direction(BUTTON_GPIO, GPIO_MODE_INPUT);
    gpio_set_pull_mode(BUTTON_GPIO, GPIO_PULLUP_ONLY);

    // init peripherals
    i2c_oled_init();
    gatt_server_init();

    while (1) {
        if (gpio_get_level(BUTTON_GPIO) == 0) {
            printf(">> OLED mode\n");
            run_oled_mode(BUTTON_GPIO);
        } else {
            printf(">> BLE mode\n");
            // now hands off control to BLE; it will return when button pressed
            gatt_server_run(BUTTON_GPIO);
        }
        // small debounce
        vTaskDelay(pdMS_TO_TICKS(50));
    }
}
