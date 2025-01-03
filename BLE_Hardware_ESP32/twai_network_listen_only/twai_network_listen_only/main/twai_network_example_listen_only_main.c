/*
 * SPDX-FileCopyrightText: 2010-2023 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: CC0-1.0
 */

/*
 * The following example demonstrates how to send and receive data through the TWAI interface.
 * The ESP32 listens for messages and can send the SOC data to the VCU when required.
 */
#include <stdio.h>
#include <stdlib.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "freertos/semphr.h"
#include "esp_err.h"
#include "esp_log.h"
#include "driver/twai.h"

/* --------------------- Definitions and static variables ------------------ */
// Example Configuration
#define NO_OF_ITERS                     3
#define RX_TASK_PRIO                    9
#define TX_GPIO_NUM                     CONFIG_EXAMPLE_TX_GPIO_NUM
#define RX_GPIO_NUM                     CONFIG_EXAMPLE_RX_GPIO_NUM
#define EXAMPLE_TAG                     "Srijanani"

#define ID_MASTER_STOP_CMD              0x0A0
#define ID_MASTER_START_CMD             0x0A1
#define ID_MASTER_PING                  0x0A2
#define ID_SLAVE_STOP_RESP              0x0B0
#define ID_SLAVE_DATA                   0x0B1
#define ID_SLAVE_PING_RESP              0x0B2

// SOC CAN ID (07 in hexadecimal)
#define ID_SOC                          0x07

static const twai_filter_config_t f_config = TWAI_FILTER_CONFIG_ACCEPT_ALL();
static const twai_timing_config_t t_config = TWAI_TIMING_CONFIG_25KBITS();
// Set TX queue length to 0 due to listen-only mode
static const twai_general_config_t g_config = {.mode = TWAI_MODE_LISTEN_ONLY,
                                               .tx_io = TX_GPIO_NUM, .rx_io = RX_GPIO_NUM,
                                               .clkout_io = TWAI_IO_UNUSED, .bus_off_io = TWAI_IO_UNUSED,
                                               .tx_queue_len = 0, .rx_queue_len = 5,
                                               .alerts_enabled = TWAI_ALERT_NONE,
                                               .clkout_divider = 0
                                              };

static SemaphoreHandle_t rx_sem;
static bool send_soc_data = false;  // Flag to indicate when to send SOC

/* --------------------------- Tasks and Functions -------------------------- */

static void twai_send_soc_data() {
    // SOC data to send (for example, 75%)
    uint8_t soc_data = 0x75;  // You can modify this as per your requirement
    twai_message_t tx_msg = {
        .identifier = ID_SOC,  // Set CAN ID to 0x07
        .data_length_code = 1, // 1 byte for SOC data
        .data = {0}
    };

    // Place SOC data in the 0th bit of the data field
    tx_msg.data[0] = soc_data;

    // Send the message over TWAI
    ESP_ERROR_CHECK(twai_transmit(&tx_msg, portMAX_DELAY));
    ESP_LOGI(EXAMPLE_TAG, "Sent SOC data: %d", soc_data);
}

static void twai_receive_task(void *arg)
{
    xSemaphoreTake(rx_sem, portMAX_DELAY);
    bool start_cmd = false;
    bool stop_resp = false;
    uint32_t iterations = 0;

    while (iterations < NO_OF_ITERS) {
        twai_message_t rx_msg;
        twai_receive(&rx_msg, portMAX_DELAY);
        if (rx_msg.identifier == ID_MASTER_PING) {
            ESP_LOGI(EXAMPLE_TAG, "Received master ping");
        } else if (rx_msg.identifier == ID_SLAVE_PING_RESP) {
            ESP_LOGI(EXAMPLE_TAG, "Received slave ping response");
        } else if (rx_msg.identifier == ID_MASTER_START_CMD) {
            ESP_LOGI(EXAMPLE_TAG, "Received master start command");
            start_cmd = true;
        } else if (rx_msg.identifier == ID_SLAVE_DATA) {
            uint32_t data = 0;
            for (int i = 0; i < rx_msg.data_length_code; i++) {
                data |= (rx_msg.data[i] << (i * 8));
            }
            ESP_LOGI(EXAMPLE_TAG, "Received data value %"PRIu32, data);
        } else if (rx_msg.identifier == ID_MASTER_STOP_CMD) {
            ESP_LOGI(EXAMPLE_TAG, "Received master stop command");
        } else if (rx_msg.identifier == ID_SLAVE_STOP_RESP) {
            ESP_LOGI(EXAMPLE_TAG, "Received slave stop response");
            stop_resp = true;
        }
        if (start_cmd && stop_resp) {
            // Each iteration is complete after a start command and stop response is received
            iterations++;
            start_cmd = 0;
            stop_resp = 0;
        }

        // Check if we need to send SOC data
        if (send_soc_data) {
            twai_send_soc_data();
            send_soc_data = false;  // Reset flag after sending data
        }
    }

    xSemaphoreGive(rx_sem);
    vTaskDelete(NULL);
}

void app_main(void)
{
    rx_sem = xSemaphoreCreateBinary();
    xTaskCreatePinnedToCore(twai_receive_task, "TWAI_rx", 4096, NULL, RX_TASK_PRIO, NULL, tskNO_AFFINITY);

    // Install and start TWAI driver
    ESP_ERROR_CHECK(twai_driver_install(&g_config, &t_config, &f_config));
    ESP_LOGI(EXAMPLE_TAG, "Driver installed");
    ESP_ERROR_CHECK(twai_start());
    ESP_LOGI(EXAMPLE_TAG, "Driver started");

    xSemaphoreGive(rx_sem);                     // Start RX task
    vTaskDelay(pdMS_TO_TICKS(100));
    xSemaphoreTake(rx_sem, portMAX_DELAY);      // Wait for RX task to complete

    // Set flag to send SOC data (example: triggered after a certain event in your system)
    send_soc_data = true;

    // Stop and uninstall TWAI driver
    ESP_ERROR_CHECK(twai_stop());
    ESP_LOGI(EXAMPLE_TAG, "Driver stopped");
    ESP_ERROR_CHECK(twai_driver_uninstall());
    ESP_LOGI(EXAMPLE_TAG, "Driver uninstalled");

    // Cleanup
    vSemaphoreDelete(rx_sem);
}
