#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <inttypes.h>
#include <time.h>
#include <stdbool.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "esp_system.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "esp_bt.h"

#include "esp_gap_ble_api.h"
#include "esp_gatts_api.h"
#include "esp_bt_defs.h"
#include "esp_bt_main.h"
#include "esp_bt_device.h"
#include "esp_gatt_common_api.h"

#include "driver/twai.h"  // For CAN communication
#include "sdkconfig.h"

// Logging tags and error check tag
#define GATTS_TAG "GATTS_DEMO"
#define ERROR_CHECK "SRIJANANI"

// BLE service and characteristic definitions
#define GATTS_SERVICE_UUID_TEST_A   0x00FF 
#define GATTS_CHAR_UUID_TEST_A      0xFF01 
#define GATTS_DESCR_UUID_TEST_A     0x3333
#define GATTS_NUM_HANDLE_TEST_A     4

// Device name and manufacturer data length
#define TEST_DEVICE_NAME            "Srijananiiiiiiiiiiii(New)" 
#define TEST_MANUFACTURER_DATA_LEN  17

// Maximum characteristic value length
#define GATTS_DEMO_CHAR_VAL_LEN_MAX 0x40

// Special commands for CAN transmit
#define RESET_COMMAND "RESET"     // Command to reset
#define CAN_COMMAND   "SEND_CAN"  // Command to send CAN message
#define SERVICE_RESET_CAN_ID 0x18F60001  // CAN ID for service reset

// Prepare write buffer size
#define PREPARE_BUF_MAX_SIZE 1024

// --- Forward Declarations ---
static void gatts_profile_a_event_handler(esp_gatts_cb_event_t event, esp_gatt_if_t gatts_if, 
                                          esp_ble_gatts_cb_param_t *param);
static void gap_event_handler(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param);

// --- GATT Profile Definition ---
#define PROFILE_NUM 2
#define PROFILE_A_APP_ID 0
struct gatts_profile_inst {
    esp_gatts_cb_t gatts_cb;
    uint16_t gatts_if;
    uint16_t app_id;
    uint16_t conn_id;
    uint16_t service_handle;
    esp_gatt_srvc_id_t service_id;
    uint16_t char_handle;
    esp_bt_uuid_t char_uuid;
    esp_gatt_perm_t perm;
    esp_gatt_char_prop_t property;
    uint16_t descr_handle;
    esp_bt_uuid_t descr_uuid;
};
static struct gatts_profile_inst gl_profile_tab[PROFILE_NUM] = {
    [PROFILE_A_APP_ID] = {
        .gatts_cb = gatts_profile_a_event_handler,
        .gatts_if = ESP_GATT_IF_NONE,  // initially invalid
    },
};

// --- Global Variables for Notifications and CAN Data ---
static bool notify_enabled = false;
static TaskHandle_t notify_task_handle = NULL;
// Global variable for the GATT interface; initially set to invalid value (255)
static esp_gatt_if_t global_gatts_if = ESP_GATT_IF_NONE;

uint8_t byte_01 = 0x1;
uint8_t byte_02 = 0x0;
uint8_t byte_03 = 0x0;
uint8_t byte_04 = 0x0;
uint8_t byte_05 = 0x0;
uint8_t byte_06 = 0x0;
uint8_t byte_07 = 0x0;
uint8_t byte_08 = 0x0;
uint8_t byte_09 = 0x0;
uint8_t byte_10 = 0x0;
uint8_t byte_11 = 0x0;
uint8_t byte_12 = 0x0;
uint8_t byte_13 = 0x0;
uint8_t byte_14 = 0x0;
uint8_t byte_15 = 0x0;
uint8_t byte_16 = 0x0;
uint8_t byte_17 = 0x0;
uint8_t byte_18 = 0x0;
uint8_t byte_19 = 0x0;
uint8_t byte_20 = 0x0;

// A simple characteristic initial value
static uint8_t char1_str[] = {0x11, 0x22, 0x33};
static esp_gatt_char_prop_t a_property = 0;
static esp_attr_value_t gatts_demo_char1_val = {
    .attr_max_len = GATTS_DEMO_CHAR_VAL_LEN_MAX,
    .attr_len     = sizeof(char1_str),
    .attr_value   = char1_str,
};

// Advertisement configuration flags and data
static uint8_t adv_config_done = 0;
#define adv_config_flag      (1 << 0)
#define scan_rsp_config_flag (1 << 1)

static uint8_t adv_service_uuid128[32] = {
    /* LSB <--------------------------------------------------------------------------------> MSB */
    0xfb, 0x34, 0x9b, 0x5f, 0x80, 0x00, 0x00, 0x80,
    0x00, 0x10, 0x00, 0x00, 0xEE, 0x00, 0x00, 0x00,
    0xfb, 0x34, 0x9b, 0x5f, 0x80, 0x00, 0x00, 0x80,
    0x00, 0x10, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00,
};

static esp_ble_adv_data_t adv_data = {
    .set_scan_rsp = false,
    .include_name = true,
    .include_txpower = false,
    .min_interval = 0x0006,
    .max_interval = 0x0010,
    .appearance = 0x00,
    .manufacturer_len = 0,
    .p_manufacturer_data = NULL,
    .service_data_len = 0,
    .p_service_data = NULL,
    .service_uuid_len = sizeof(adv_service_uuid128),
    .p_service_uuid = adv_service_uuid128,
    .flag = (ESP_BLE_ADV_FLAG_GEN_DISC | ESP_BLE_ADV_FLAG_BREDR_NOT_SPT),
};

static esp_ble_adv_data_t scan_rsp_data = {
    .set_scan_rsp = true,
    .include_name = true,
    .include_txpower = true,
    .min_interval = 0,
    .max_interval = 0,
    .appearance = 0,
    .manufacturer_len = 0,
    .p_manufacturer_data = NULL,
    .service_data_len = 0,
    .p_service_data = NULL,
    .service_uuid_len = sizeof(adv_service_uuid128),
    .p_service_uuid = adv_service_uuid128,
    .flag = (ESP_BLE_ADV_FLAG_GEN_DISC | ESP_BLE_ADV_FLAG_BREDR_NOT_SPT),
};

static esp_ble_adv_params_t adv_params = {
    .adv_int_min        = 0x20,
    .adv_int_max        = 0x40,
    .adv_type           = ADV_TYPE_IND,
    .own_addr_type      = BLE_ADDR_TYPE_PUBLIC,
    .channel_map        = ADV_CHNL_ALL,
    .adv_filter_policy  = ADV_FILTER_ALLOW_SCAN_ANY_CON_ANY,
};

// --- Prepare Write Environment ---
typedef struct {
    uint8_t *prepare_buf;
    int prepare_len;
} prepare_type_env_t;
static prepare_type_env_t a_prepare_write_env;

// --- GAP Event Handler ---
static void gap_event_handler(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param)
{
    ESP_LOGI(GATTS_TAG, "GAP event handler event: %d", event);
    switch (event) {
    case ESP_GAP_BLE_ADV_DATA_SET_COMPLETE_EVT:
        adv_config_done &= (~adv_config_flag);
        if (adv_config_done == 0) {
            esp_ble_gap_start_advertising(&adv_params);
            ESP_LOGI(GATTS_TAG, "Starting advertising.");
        }
        break;
    case ESP_GAP_BLE_SCAN_RSP_DATA_SET_COMPLETE_EVT:
        adv_config_done &= (~scan_rsp_config_flag);
        if (adv_config_done == 0) {
            esp_ble_gap_start_advertising(&adv_params);
            ESP_LOGI(GATTS_TAG, "Scan response set, starting advertising.");
        }
        break;
    case ESP_GAP_BLE_ADV_START_COMPLETE_EVT:
        if (param->adv_start_cmpl.status != ESP_BT_STATUS_SUCCESS) {
            ESP_LOGE(GATTS_TAG, "Advertising start failed: %d", param->adv_start_cmpl.status);
        } else {
            ESP_LOGI(GATTS_TAG, "Advertising started successfully.");
        }
        break;
    case ESP_GAP_BLE_ADV_STOP_COMPLETE_EVT:
        if (param->adv_stop_cmpl.status != ESP_BT_STATUS_SUCCESS) {
            ESP_LOGE(GATTS_TAG, "Advertising stop failed: %d", param->adv_stop_cmpl.status);
        } else {
            ESP_LOGI(GATTS_TAG, "Advertising stopped successfully.");
        }
        break;
    case ESP_GAP_BLE_UPDATE_CONN_PARAMS_EVT:
        ESP_LOGI(GATTS_TAG, "Connection parameters updated: min_int=%d, max_int=%d, conn_int=%d, latency=%d, timeout=%d",
                 param->update_conn_params.min_int, param->update_conn_params.max_int,
                 param->update_conn_params.conn_int, param->update_conn_params.latency,
                 param->update_conn_params.timeout);
        break;
    case ESP_GAP_BLE_SET_PKT_LENGTH_COMPLETE_EVT:
        ESP_LOGI(GATTS_TAG, "Packet length set complete: rx=%d, tx=%d, status=%d",
                 param->pkt_data_length_cmpl.params.rx_len, param->pkt_data_length_cmpl.params.tx_len,
                 param->pkt_data_length_cmpl.status);
        break;
    default:
        ESP_LOGI(GATTS_TAG, "Unhandled GAP event: %d", event);
        break;
    }
}

// --- Notification Task ---
int count = 0;
int delay_ms = 20;
void notification_task(void *param) {
    while (notify_enabled) {
        uint8_t notify_data[20] = {
            byte_01, byte_02, byte_03, byte_04, byte_05,
            byte_06, byte_07, byte_08, byte_09, byte_10,
            byte_11, byte_12, byte_13, byte_14, byte_15,
            byte_16, byte_17, byte_18, byte_19, byte_20
        };
        esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[0].conn_id,
                                    gl_profile_tab[0].char_handle,
                                    sizeof(notify_data), notify_data, false);
        vTaskDelay(pdMS_TO_TICKS(delay_ms));
        count++;
        printf("Notification count: %d\n", count);
    }
    notify_task_handle = NULL;
    vTaskDelete(NULL);
}

// --- TWAI (CAN) Receive Task ---
static void twai_receive_task(void *arg) {
    ESP_LOGI("TWAI Receiver", "Starting TWAI receive task");
    twai_message_t message;
    while (1) {
        if (twai_receive(&message, pdMS_TO_TICKS(50)) == ESP_OK) {
            ESP_LOGI("TWAI Receiver", "CAN ID: 0x%08" PRIx32, message.identifier);
            switch (message.identifier) {
                case 0x14520902: // CAN #1
                    byte_02 = message.data[0];
                    byte_03 = message.data[1];
                    byte_04 = message.data[2];
                    byte_05 = message.data[3];
                    byte_06 = message.data[4];
                    byte_07 = message.data[5];
                    byte_08 = message.data[6];
                    byte_09 = message.data[7];
                    break;
                case 0x14520903: // CAN #2
                    byte_10 = message.data[0];
                    byte_11 = message.data[1];
                    byte_12 = message.data[2];
                    byte_13 = message.data[3];
                    byte_14 = message.data[4];
                    byte_15 = message.data[5];
                    byte_16 = message.data[6];
                    byte_17 = message.data[7];
                    break;
                case 0x14520904: // CAN #3
                    byte_18 = message.data[0];
                    byte_19 = message.data[1];
                    byte_20 = message.data[2];
                    break;
                default:
                    ESP_LOGI("TWAI Receiver", "Unknown CAN ID: 0x%08" PRIx32, message.identifier);
                    break;
            }
        } else {
            ESP_LOGE("TWAI Receiver", "Failed to receive message");
        }
    }
}

// --- CAN Transmit Functions ---
void transmit_task(uint8_t tenth_byte) {
    uint8_t Reset_bit_1, Reset_bit_2;
    if(tenth_byte == 0x01) {
        Reset_bit_1 = 8;
        printf("Reset ON------------------------------------------------->\n");
        Reset_bit_2 = 0;
    } else {
        Reset_bit_1 = 0;
        printf("Reset OFF------------------------------------------------->\n");
        Reset_bit_2 = 0;
    }
    twai_message_t transmit_message_reset_high = {
        .identifier = 0x18f60001,
        .data_length_code = 8,
        .extd = 1,
        .data = {Reset_bit_1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00}
    };
    if (twai_transmit(&transmit_message_reset_high, 1000) == ESP_OK) {
        printf("Message sent----------->\n");
        ESP_LOGI(GATTS_TAG, "Message queued for transmission");
        vTaskDelay(pdMS_TO_TICKS(1000));
    } else {
        ESP_LOGI(GATTS_TAG, "Failed to queue message for transmission");
    }
    vTaskDelay(pdMS_TO_TICKS(100));

    twai_message_t transmit_message_reset_low = {
        .identifier = 0x18f60001,
        .data_length_code = 8,
        .extd = 1,
        .data = {Reset_bit_2, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00}
    };
    if (twai_transmit(&transmit_message_reset_low, 1000) == ESP_OK) {
        printf("Message sent----------->\n");
        ESP_LOGI(GATTS_TAG, "Message queued for transmission");
        vTaskDelay(pdMS_TO_TICKS(100));
    } else {
        ESP_LOGI(GATTS_TAG, "Failed to queue message for transmission");
    }
    vTaskDelay(pdMS_TO_TICKS(100));
}

void can_init() {
    twai_general_config_t g_config = TWAI_GENERAL_CONFIG_DEFAULT(GPIO_NUM_21, GPIO_NUM_22, TWAI_MODE_NORMAL);
    g_config.tx_io = GPIO_NUM_21;
    g_config.rx_io = GPIO_NUM_22;

    twai_timing_config_t t_config = {
        .brp = 8,
        .sjw = 1,
        .tseg_1 = 15,
        .tseg_2 = 4
    };

    twai_filter_config_t f_config = TWAI_FILTER_CONFIG_ACCEPT_ALL();
    ESP_ERROR_CHECK(twai_driver_install(&g_config, &t_config, &f_config));
    ESP_ERROR_CHECK(twai_start());
    ESP_LOGI(GATTS_TAG, "CAN bus initialized");
}

static void send_service_reset_can_message() {
    twai_message_t tx_message = {
        .identifier = SERVICE_RESET_CAN_ID,
        .data_length_code = 1,
        .data = {0x01}
    };

    esp_err_t ret = twai_transmit(&tx_message, pdMS_TO_TICKS(1000));
    if (ret == ESP_OK) {
        ESP_LOGI(GATTS_TAG, "Service reset CAN message sent successfully.");
    } else {
        ESP_LOGE(GATTS_TAG, "Failed to send service reset CAN message, error code = %x", ret);
    }
}

static void send_can_message() {
    twai_message_t tx_message = {
        .identifier = 0x100,
        .data_length_code = 8,
        .data = {0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08}
    };

    esp_err_t ret = twai_transmit(&tx_message, pdMS_TO_TICKS(1000));
    if (ret == ESP_OK) {
        ESP_LOGI(GATTS_TAG, "CAN message sent successfully.");
    } else {
        ESP_LOGE(GATTS_TAG, "Failed to send CAN message, error code = %x", ret);
    }
}

// --- GATT Write Helpers ---
void example_write_event_env(esp_gatt_if_t gatts_if, prepare_type_env_t *prepare_write_env, 
                             esp_ble_gatts_cb_param_t *param) {
    ESP_LOGI(GATTS_TAG, "Handling GATT write event: need_rsp=%d, is_prep=%d, offset=%d, len=%d",
             param->write.need_rsp, param->write.is_prep, param->write.offset, param->write.len);

    esp_gatt_status_t status = ESP_GATT_OK;
    if (param->write.need_rsp) {
        if (param->write.is_prep) {
            if (param->write.offset > PREPARE_BUF_MAX_SIZE) {
                status = ESP_GATT_INVALID_OFFSET;
                ESP_LOGE(GATTS_TAG, "Invalid offset: %d", param->write.offset);
            } else if ((param->write.offset + param->write.len) > PREPARE_BUF_MAX_SIZE) {
                status = ESP_GATT_INVALID_ATTR_LEN;
                ESP_LOGE(GATTS_TAG, "Invalid attribute length: offset=%d, len=%d", param->write.offset, param->write.len);
            }
            if (status == ESP_GATT_OK && prepare_write_env->prepare_buf == NULL) {
                prepare_write_env->prepare_buf = (uint8_t *)malloc(PREPARE_BUF_MAX_SIZE * sizeof(uint8_t));
                prepare_write_env->prepare_len = 0;
                if (prepare_write_env->prepare_buf == NULL) {
                    ESP_LOGE(GATTS_TAG, "No memory for prepare write buffer");
                    status = ESP_GATT_NO_RESOURCES;
                }
            }

            esp_gatt_rsp_t *gatt_rsp = (esp_gatt_rsp_t *)malloc(sizeof(esp_gatt_rsp_t));
            if (gatt_rsp) {
                gatt_rsp->attr_value.len = param->write.len;
                gatt_rsp->attr_value.handle = param->write.handle;
                gatt_rsp->attr_value.offset = param->write.offset;
                gatt_rsp->attr_value.auth_req = ESP_GATT_AUTH_REQ_NONE;
                memcpy(gatt_rsp->attr_value.value, param->write.value, param->write.len);
                esp_err_t response_err = esp_ble_gatts_send_response(gatts_if, param->write.conn_id, param->write.trans_id, status, gatt_rsp);
                if (response_err != ESP_OK){
                    ESP_LOGE(GATTS_TAG, "Send response error: %d", response_err);
                }
                free(gatt_rsp);
            } else {
                ESP_LOGE(GATTS_TAG, "Failed to allocate memory for GATT response");
                status = ESP_GATT_NO_RESOURCES;
            }
            if (status != ESP_GATT_OK){
                return;
            }
            memcpy(prepare_write_env->prepare_buf + param->write.offset,
                   param->write.value,
                   param->write.len);
            prepare_write_env->prepare_len += param->write.len;
        } else {
            esp_ble_gatts_send_response(gatts_if, param->write.conn_id, param->write.trans_id, status, NULL);
        }
    }
}

void example_exec_write_event_env(prepare_type_env_t *prepare_write_env, 
                                  esp_ble_gatts_cb_param_t *param) {
    if (param->exec_write.exec_write_flag == ESP_GATT_PREP_WRITE_EXEC) {
        ESP_LOGI(GATTS_TAG, "Executing write with buffer length: %d", prepare_write_env->prepare_len);
        ESP_LOG_BUFFER_HEX(GATTS_TAG, prepare_write_env->prepare_buf, prepare_write_env->prepare_len);
    } else {
        ESP_LOGI(GATTS_TAG, "Prepared write cancelled.");
    }
    if (prepare_write_env->prepare_buf) {
        free(prepare_write_env->prepare_buf);
        prepare_write_env->prepare_buf = NULL;
    }
    prepare_write_env->prepare_len = 0;
}

// --- GATTS Profile A Event Handler ---
static void gatts_profile_a_event_handler(esp_gatts_cb_event_t event, esp_gatt_if_t gatts_if, 
                                          esp_ble_gatts_cb_param_t *param) {
    ESP_LOGI(GATTS_TAG, "Profile A Event Handler: Event = %d", event);
    ESP_LOGI(ERROR_CHECK, "EVENT CALLED");
    switch (event) {
        case ESP_GATTS_REG_EVT:
            ESP_LOGI(GATTS_TAG, "ESP_GATTS_REG_EVT: status %d, app_id %d", param->reg.status, param->reg.app_id);
            gl_profile_tab[PROFILE_A_APP_ID].service_id.is_primary = true;
            gl_profile_tab[PROFILE_A_APP_ID].service_id.id.inst_id = 0x00;
            gl_profile_tab[PROFILE_A_APP_ID].service_id.id.uuid.len = ESP_UUID_LEN_16;
            gl_profile_tab[PROFILE_A_APP_ID].service_id.id.uuid.uuid.uuid16 = GATTS_SERVICE_UUID_TEST_A;

            {
                esp_err_t set_dev_name_ret = esp_ble_gap_set_device_name(TEST_DEVICE_NAME);
                if (set_dev_name_ret) {
                    ESP_LOGE(GATTS_TAG, "Set device name failed, error code = %x", set_dev_name_ret);
                }
                esp_err_t ret = esp_ble_gap_config_adv_data(&adv_data);
                if (ret) {
                    ESP_LOGE(GATTS_TAG, "Config adv data failed, error code = %x", ret);
                }
                adv_config_done |= adv_config_flag;
                ret = esp_ble_gap_config_adv_data(&scan_rsp_data);
                if (ret) {
                    ESP_LOGE(GATTS_TAG, "Config scan response data failed, error code = %x", ret);
                }
                adv_config_done |= scan_rsp_config_flag;
            }
            esp_ble_gatts_create_service(gatts_if, &gl_profile_tab[PROFILE_A_APP_ID].service_id, GATTS_NUM_HANDLE_TEST_A);
            break;
        case ESP_GATTS_READ_EVT: {
            ESP_LOGI(GATTS_TAG, "ESP_GATTS_READ_EVT: conn_id %d, trans_id %" PRIu32 ", handle %d",
                     param->read.conn_id, param->read.trans_id, param->read.handle);
            esp_gatt_rsp_t rsp;
            memset(&rsp, 0, sizeof(esp_gatt_rsp_t));
            rsp.attr_value.handle = param->read.handle;
            rsp.attr_value.len = 4;
            rsp.attr_value.value[0] = 0xde;
            rsp.attr_value.value[1] = 0xed;
            rsp.attr_value.value[2] = 0xbe;
            rsp.attr_value.value[3] = 0xef;
            esp_ble_gatts_send_response(gatts_if, param->read.conn_id, param->read.trans_id, ESP_GATT_OK, &rsp);
            break;
        }
        case ESP_GATTS_WRITE_EVT:
            // Check if this write is to the CCCD (Client Characteristic Configuration Descriptor)
            if (param->write.len == 2 &&
                param->write.handle == gl_profile_tab[PROFILE_A_APP_ID].descr_handle) {
                uint16_t descr_value = param->write.value[0] | (param->write.value[1] << 8);
                if (descr_value == 0x0001) {
                    notify_enabled = true;
                    if (notify_task_handle == NULL) {
                        xTaskCreate(notification_task, "notification_task", 2048, NULL, 10, &notify_task_handle);
                    }
                    ESP_LOGI(GATTS_TAG, "Notifications enabled");
                } else if (descr_value == 0x0000) {
                    notify_enabled = false;
                    ESP_LOGI(GATTS_TAG, "Notifications disabled");
                }
            }

            ESP_LOGI(GATTS_TAG, "GATT_WRITE_EVT received, conn_id: %d, handle: %d", param->write.conn_id, param->write.handle);
            if (!param->write.is_prep && param->write.len > 0) {
                ESP_LOGI(GATTS_TAG, "Received data:");
                ESP_LOG_BUFFER_HEX(GATTS_TAG, param->write.value, param->write.len);

                if (param->write.len > 9) {
                    uint8_t tenth_byte = param->write.value[9];
                    ESP_LOGI(GATTS_TAG, "10th byte value: 0x%02X", tenth_byte);
                    transmit_task(tenth_byte);
                }
                if (param->write.len == (sizeof(RESET_COMMAND) - 1) &&
                    strncmp((char *)param->write.value, RESET_COMMAND, sizeof(RESET_COMMAND) - 1) == 0) {
                    ESP_LOGI(GATTS_TAG, "Reset command received");
                    send_service_reset_can_message();
                }
                if (param->write.len == (sizeof(CAN_COMMAND) - 1) &&
                    strncmp((char *)param->write.value, CAN_COMMAND, sizeof(CAN_COMMAND) - 1) == 0) {
                    ESP_LOGI(GATTS_TAG, "CAN command received");
                    send_can_message();
                }
                esp_gatt_rsp_t rsp;
                memset(&rsp, 0, sizeof(esp_gatt_rsp_t));
                rsp.attr_value.handle = param->write.handle;
                rsp.attr_value.len = 0;
                esp_ble_gatts_send_response(gatts_if, param->write.conn_id, param->write.trans_id, ESP_GATT_OK, &rsp);
                ESP_LOGI(GATTS_TAG, "Write acknowledged.");
            } else {
                ESP_LOGW(GATTS_TAG, "Empty or prepared write received.");
                example_write_event_env(gatts_if, &a_prepare_write_env, param);
            }
            break;
        case ESP_GATTS_EXEC_WRITE_EVT:
            ESP_LOGI(GATTS_TAG, "ESP_GATTS_EXEC_WRITE_EVT");
            esp_ble_gatts_send_response(gatts_if, param->write.conn_id, param->write.trans_id, ESP_GATT_OK, NULL);
            example_exec_write_event_env(&a_prepare_write_env, param);
            break;
        case ESP_GATTS_MTU_EVT:
            ESP_LOGI(GATTS_TAG, "ESP_GATTS_MTU_EVT: MTU updated to %d", param->mtu.mtu);
            break;
        case ESP_GATTS_UNREG_EVT:
            ESP_LOGI(GATTS_TAG, "ESP_GATTS_UNREG_EVT: Unregister event received.");
            break;
        case ESP_GATTS_CREATE_EVT:
            ESP_LOGI(GATTS_TAG, "ESP_GATTS_CREATE_EVT: Service created, status=%d, service_handle=%d", 
                     param->create.status, param->create.service_handle);
            gl_profile_tab[PROFILE_A_APP_ID].service_handle = param->create.service_handle;
            gl_profile_tab[PROFILE_A_APP_ID].char_uuid.len = ESP_UUID_LEN_16;
            gl_profile_tab[PROFILE_A_APP_ID].char_uuid.uuid.uuid16 = GATTS_CHAR_UUID_TEST_A;
            esp_ble_gatts_start_service(gl_profile_tab[PROFILE_A_APP_ID].service_handle);
            a_property = ESP_GATT_CHAR_PROP_BIT_READ | ESP_GATT_CHAR_PROP_BIT_WRITE | ESP_GATT_CHAR_PROP_BIT_NOTIFY;
            {
                esp_err_t add_char_ret = esp_ble_gatts_add_char(gl_profile_tab[PROFILE_A_APP_ID].service_handle, 
                                                                &gl_profile_tab[PROFILE_A_APP_ID].char_uuid,
                                                                ESP_GATT_PERM_READ | ESP_GATT_PERM_WRITE,
                                                                a_property,
                                                                &gatts_demo_char1_val, NULL);
                if (add_char_ret) {
                    ESP_LOGE(GATTS_TAG, "Add characteristic failed: error=%x", add_char_ret);
                }
            }
            break;
        case ESP_GATTS_ADD_INCL_SRVC_EVT:
            ESP_LOGI(GATTS_TAG, "ESP_GATTS_ADD_INCL_SRVC_EVT: Included service added.");
            break;
        case ESP_GATTS_ADD_CHAR_EVT:
            ESP_LOGI(GATTS_TAG, "ESP_GATTS_ADD_CHAR_EVT: Character added, status=%d, attr_handle=%d, service_handle=%d",
                     param->add_char.status, param->add_char.attr_handle, param->add_char.service_handle);
            gl_profile_tab[PROFILE_A_APP_ID].char_handle = param->add_char.attr_handle;
            gl_profile_tab[PROFILE_A_APP_ID].descr_uuid.len = ESP_UUID_LEN_16;
            gl_profile_tab[PROFILE_A_APP_ID].descr_uuid.uuid.uuid16 = ESP_GATT_UUID_CHAR_CLIENT_CONFIG;
            {
                esp_err_t add_descr_ret = esp_ble_gatts_add_char_descr(gl_profile_tab[PROFILE_A_APP_ID].service_handle, 
                                                                       &gl_profile_tab[PROFILE_A_APP_ID].descr_uuid,
                                                                       ESP_GATT_PERM_READ | ESP_GATT_PERM_WRITE, 
                                                                       NULL, NULL);
                if (add_descr_ret) {
                    ESP_LOGE(GATTS_TAG, "Add char descriptor failed: error=%x", add_descr_ret);
                }
            }
            break;
        case ESP_GATTS_ADD_CHAR_DESCR_EVT:
            ESP_LOGI(GATTS_TAG, "ESP_GATTS_ADD_CHAR_DESCR_EVT: Descriptor added, status=%d, attr_handle=%d, service_handle=%d",
                     param->add_char_descr.status, param->add_char_descr.attr_handle, param->add_char_descr.service_handle);
            gl_profile_tab[PROFILE_A_APP_ID].descr_handle = param->add_char_descr.attr_handle;
            break;
        case ESP_GATTS_DELETE_EVT:
            ESP_LOGI(GATTS_TAG, "ESP_GATTS_DELETE_EVT: Service deleted.");
            break;
        case ESP_GATTS_START_EVT:
            ESP_LOGI(GATTS_TAG, "ESP_GATTS_START_EVT: Service started, status=%d, service_handle=%d",
                     param->start.status, param->start.service_handle);
            break;
        case ESP_GATTS_STOP_EVT:
            ESP_LOGI(GATTS_TAG, "ESP_GATTS_STOP_EVT: Service stopped.");
            break;
        case ESP_GATTS_CONNECT_EVT:
            ESP_LOGI(GATTS_TAG, "ESP_GATTS_CONNECT_EVT: Device connected, conn_id=%d, remote="
                     "%02x:%02x:%02x:%02x:%02x:%02x",
                     param->connect.conn_id,
                     param->connect.remote_bda[0], param->connect.remote_bda[1], param->connect.remote_bda[2],
                     param->connect.remote_bda[3], param->connect.remote_bda[4], param->connect.remote_bda[5]);
            gl_profile_tab[PROFILE_A_APP_ID].conn_id = param->connect.conn_id;
            // NEW: Set the global GATT interface to the one used in this connection
            global_gatts_if = gatts_if;
            {
                esp_ble_conn_update_params_t conn_params = {0};
                memcpy(conn_params.bda, param->connect.remote_bda, sizeof(esp_bd_addr_t));
                conn_params.latency = 0;
                conn_params.max_int = 0x20;
                conn_params.min_int = 0x10;
                conn_params.timeout = 400;
                esp_ble_gap_update_conn_params(&conn_params);
            }
            break;
        case ESP_GATTS_DISCONNECT_EVT:
            ESP_LOGI(GATTS_TAG, "ESP_GATTS_DISCONNECT_EVT: Device disconnected, reason: 0x%x", param->disconnect.reason);
            esp_ble_gap_start_advertising(&adv_params);
            break;
        case ESP_GATTS_CONF_EVT:
            ESP_LOGI(GATTS_TAG, "ESP_GATTS_CONF_EVT: Confirmation event, status=%d, attr_handle=%d",
                     param->conf.status, param->conf.handle);
            break;
        case ESP_GATTS_OPEN_EVT:
        case ESP_GATTS_CANCEL_OPEN_EVT:
        case ESP_GATTS_CLOSE_EVT:
        case ESP_GATTS_LISTEN_EVT:
        case ESP_GATTS_CONGEST_EVT:
            ESP_LOGI(GATTS_TAG, "Other event: %d", event);
            break;
        default:
            break;
    }
}

// --- Global GATT Event Handler ---
static void gatts_event_handler(esp_gatts_cb_event_t event, esp_gatt_if_t gatts_if, 
                                esp_ble_gatts_cb_param_t *param) {
    ESP_LOGD(GATTS_TAG, "Global GATT event handler: event=%d, gatts_if=%d", event, gatts_if);
    if (event == ESP_GATTS_REG_EVT) {
        if (param->reg.status == ESP_GATT_OK) {
            gl_profile_tab[param->reg.app_id].gatts_if = gatts_if;
        } else {
            ESP_LOGI(GATTS_TAG, "Reg app failed, app_id %04x, status %d", param->reg.app_id, param->reg.status);
            return;
        }
    }
    for (int idx = 0; idx < PROFILE_NUM; idx++) {
        if (gatts_if == ESP_GATT_IF_NONE || gatts_if == gl_profile_tab[idx].gatts_if) {
            if (gl_profile_tab[idx].gatts_cb) {
                gl_profile_tab[idx].gatts_cb(event, gatts_if, param);
            }
        }
    }
}

// --- Main Application ---
void app_main(void) {
    esp_err_t ret;

    ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    ESP_ERROR_CHECK(esp_bt_controller_mem_release(ESP_BT_MODE_CLASSIC_BT));

    esp_bt_controller_config_t bt_cfg = BT_CONTROLLER_INIT_CONFIG_DEFAULT();
    ret = esp_bt_controller_init(&bt_cfg);
    if (ret) {
        ESP_LOGE(GATTS_TAG, "%s initialize controller failed: %s", __func__, esp_err_to_name(ret));
        return;
    }
    ret = esp_bt_controller_enable(ESP_BT_MODE_BLE);
    if (ret) {
        ESP_LOGE(GATTS_TAG, "%s enable controller failed: %s", __func__, esp_err_to_name(ret));
        return;
    }

    ret = esp_bluedroid_init();
    if (ret) {
        ESP_LOGE(GATTS_TAG, "%s init bluetooth failed: %s", __func__, esp_err_to_name(ret));
        return;
    }
    ret = esp_bluedroid_enable();
    if (ret) {
        ESP_LOGE(GATTS_TAG, "%s enable bluetooth failed: %s", __func__, esp_err_to_name(ret));
        return;
    }

    ret = esp_ble_gatts_register_callback(gatts_event_handler);
    if (ret) {
        ESP_LOGE(GATTS_TAG, "gatts register error, error code = %x", ret);
        return;
    }
    ret = esp_ble_gap_register_callback(gap_event_handler);
    if (ret) {
        ESP_LOGE(GATTS_TAG, "gap register error, error code = %x", ret);
        return;
    }
    ret = esp_ble_gatts_app_register(PROFILE_A_APP_ID);
    if (ret) {
        ESP_LOGE(GATTS_TAG, "gatts app register error, error code = %x", ret);
        return;
    }

    ret = esp_ble_gatt_set_local_mtu(500);
    if (ret) {
        ESP_LOGE(GATTS_TAG, "set local MTU failed, error code = %x", ret);
    }

    can_init();

    xTaskCreate(twai_receive_task, "twai_receive_task", 2048, NULL, 5, NULL);
    xTaskCreate(notification_task, "notification_task", 2048, NULL, 10, &notify_task_handle);
}
