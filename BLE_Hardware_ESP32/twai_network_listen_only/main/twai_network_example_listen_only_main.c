#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/twai.h"
#include "esp_log.h"

#define EXAMPLE_TAG "TWAI Receiver"
static const twai_timing_config_t t_config = TWAI_TIMING_CONFIG_500KBITS();
static const twai_filter_config_t f_config = TWAI_FILTER_CONFIG_ACCEPT_ALL();
static const twai_general_config_t g_config = {
    .mode = TWAI_MODE_NORMAL,
    .tx_io = GPIO_NUM_21,
    .rx_io = GPIO_NUM_22,
    .clkout_io = TWAI_IO_UNUSED,
    .bus_off_io = TWAI_IO_UNUSED,
    .tx_queue_len = 10,
    .rx_queue_len = 20,
    .alerts_enabled = TWAI_ALERT_ALL,
    .clkout_divider = 0
};

static void twai_receive_task(void *arg) {
    ESP_LOGI(EXAMPLE_TAG, "Starting TWAI receive task");
    twai_message_t message;
    while (1) {
        if (twai_receive(&message, pdMS_TO_TICKS(100)) == ESP_OK) {
            // Assuming VCU_msg is the identifier for messages that include DC current limit
            if (message.identifier == 0x18f20309) {  
                // Assuming byte 3 contains the DC current limit
                int DC_current_limit = message.data[3];
                printf("DC current limit: %d\n", DC_current_limit);
            }
        } else {
            ESP_LOGE(EXAMPLE_TAG, "Failed to receive message");
        }
        vTaskDelay(pdMS_TO_TICKS(100));  // Delay to prevent task from running too frequently
    }
}

void app_main(void) {
    ESP_ERROR_CHECK(twai_driver_install(&g_config, &t_config, &f_config));
    ESP_LOGI(EXAMPLE_TAG, "Driver installed");
    ESP_ERROR_CHECK(twai_start());
    ESP_LOGI(EXAMPLE_TAG, "Driver started");

    xTaskCreate(twai_receive_task, "twai_receive_task", 2048, NULL, 5, NULL);
    while (1) {
        vTaskDelay(pdMS_TO_TICKS(1000));  // Main loop does nothing, just keeps the task alive
    }
}
