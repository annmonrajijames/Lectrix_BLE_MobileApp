#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "driver/gpio.h"
#include "oled.h"
#include "gatt_server.h"

#define BUTTON_GPIO    14
#define MODE_OLED      BIT0
#define MODE_BLE       BIT1

static EventGroupHandle_t mode_group;

static void toggle_task(void *arg)
{
    gpio_reset_pin(BUTTON_GPIO);
    gpio_set_direction(BUTTON_GPIO, GPIO_MODE_INPUT);
    gpio_set_pull_mode(BUTTON_GPIO, GPIO_PULLUP_ONLY);

    int last = 1;
    while (1) {
        int lvl = gpio_get_level(BUTTON_GPIO);
        if (lvl != last) {
            last = lvl;
            if (lvl == 0) {
                xEventGroupSetBits(mode_group, MODE_OLED);
                xEventGroupClearBits(mode_group, MODE_BLE);
            } else {
                xEventGroupSetBits(mode_group, MODE_BLE);
                xEventGroupClearBits(mode_group, MODE_OLED);
            }
        }
        vTaskDelay(pdMS_TO_TICKS(50));
    }
}

static void oled_task(void *arg)
{
    while (1) {
        xEventGroupWaitBits(mode_group, MODE_OLED, pdFALSE, pdTRUE, portMAX_DELAY);
        i2c_oled_display();
        vTaskDelay(pdMS_TO_TICKS(200));
    }
}

static void ble_task(void *arg)
{
    while (1) {
        xEventGroupWaitBits(mode_group, MODE_BLE, pdFALSE, pdTRUE, portMAX_DELAY);
        gatt_server_run();
        vTaskDelay(pdMS_TO_TICKS(200));
    }
}

void app_main(void)
{
    printf("toggle_app starting\n");
    mode_group = xEventGroupCreate();

    i2c_oled_init();
    gatt_server_init();

    xTaskCreate(toggle_task, "toggle", 2048, NULL, 5, NULL);
    xTaskCreate(oled_task,   "oled",   4096, NULL, 5, NULL);
    xTaskCreate(ble_task,    "ble",    4096, NULL, 5, NULL);
}
