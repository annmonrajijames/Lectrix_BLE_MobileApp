#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <inttypes.h>
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

#define GATTS_TAG "GATTS_DEMO"
#define ERROR_CHECK "SRIJANANI"

// Declare the static function
static void gatts_profile_a_event_handler(esp_gatts_cb_event_t event, esp_gatt_if_t gatts_if, esp_ble_gatts_cb_param_t *param);

#define GATTS_SERVICE_UUID_TEST_A   0x00FF 
#define GATTS_CHAR_UUID_TEST_A      0xFF01 
#define GATTS_DESCR_UUID_TEST_A     0x3333
#define GATTS_NUM_HANDLE_TEST_A     4

#define TEST_DEVICE_NAME            "Srijananiiiiiiiiiiii(New)" 
#define TEST_MANUFACTURER_DATA_LEN  17

#define GATTS_DEMO_CHAR_VAL_LEN_MAX 0x40
#define RESET_COMMAND "RESET"  // Command to reset
#define CAN_COMMAND "SEND_CAN"  // Command to send CAN message
#define SERVICE_RESET_CAN_ID 0x18F60001  // CAN ID for service reset
#define RPM_LIMIT_CAN_ID 0x18F20209
#define PREPARE_BUF_MAX_SIZE 1024

static uint8_t char1_str[] = {0x11,0x22,0x33};
static esp_gatt_char_prop_t a_property = 0;

static esp_attr_value_t gatts_demo_char1_val =
{
    .attr_max_len = GATTS_DEMO_CHAR_VAL_LEN_MAX,
    .attr_len     = sizeof(char1_str),
    .attr_value   = char1_str,
};

static uint8_t adv_config_done = 0;
#define adv_config_flag      (1 << 0)
#define scan_rsp_config_flag (1 << 1)

static uint8_t adv_service_uuid128[32] = {
    /* LSB <--------------------------------------------------------------------------------> MSB */
    // UUIDs
    0xfb, 0x34, 0x9b, 0x5f, 0x80, 0x00, 0x00, 0x80, 0x00, 0x10, 0x00, 0x00, 0xEE, 0x00, 0x00, 0x00,
    0xfb, 0x34, 0x9b, 0x5f, 0x80, 0x00, 0x00, 0x80, 0x00, 0x10, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00,
};

twai_timing_config_t t_config = {
    .brp = 8,  // Bit rate prescaler
    .sjw = 1,  // Synchronization jump width
    .tseg_1 = 15,  // Time segment 1
    .tseg_2 = 4,   // Time segment 2
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
    .adv_filter_policy = ADV_FILTER_ALLOW_SCAN_ANY_CON_ANY,
};

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
        .gatts_if = ESP_GATT_IF_NONE,       /* Not get the gatt_if, so initial is ESP_GATT_IF_NONE */
    },
};

typedef struct {
    uint8_t                 *prepare_buf;
    int                     prepare_len;
} prepare_type_env_t;

static prepare_type_env_t a_prepare_write_env;

void example_write_event_env(esp_gatt_if_t gatts_if, prepare_type_env_t *prepare_write_env, esp_ble_gatts_cb_param_t *param);
void example_exec_write_event_env(prepare_type_env_t *prepare_write_env, esp_ble_gatts_cb_param_t *param);

static void gap_event_handler(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param)
{
    ESP_LOGI(GATTS_TAG, "GAP event handler event: %d", event);
    switch (event) {
    case ESP_GAP_BLE_ADV_DATA_SET_COMPLETE_EVT:
        adv_config_done &= (~adv_config_flag);
        if (adv_config_done == 0){
            esp_ble_gap_start_advertising(&adv_params);
            ESP_LOGI(GATTS_TAG, "Starting advertising.");
        }
        break;
    case ESP_GAP_BLE_SCAN_RSP_DATA_SET_COMPLETE_EVT:
        adv_config_done &= (~scan_rsp_config_flag);
        if (adv_config_done == 0){
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

void transmit_task1(uint8_t sixth_byte)
{
    uint8_t RPM_Limit = sixth_byte;
    ESP_LOGI(GATTS_TAG, "Sixth byte value: 0x%02X", sixth_byte);
    ESP_LOGI(GATTS_TAG, "CAN ID: 0x%08X", RPM_LIMIT_CAN_ID);

    twai_message_t transmit_message_reset_high = {.identifier = RPM_LIMIT_CAN_ID, .data_length_code = 8, .extd = 1, .data = {0x00, 0x00, 0x00, 0x00, 0x00, RPM_Limit, 0x00, 0x00}};
    if (twai_transmit(&transmit_message_reset_high, 1000) == ESP_OK)
    {
        printf("Message sent----------->");
        ESP_LOGI(GATTS_TAG, "Message queued for transmission\n");
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
    else
    {
        ESP_LOGI(GATTS_TAG, "Failed to queue message for transmission\n");
    }
    vTaskDelay(pdMS_TO_TICKS(100));

    twai_message_t transmit_message_reset_low = {.identifier = RPM_LIMIT_CAN_ID, .data_length_code = 8, .extd = 1, .data = {0x00, 0x00, 0x00, 0x00, 0x00, RPM_Limit, 0x00, 0x00}};
    if (twai_transmit(&transmit_message_reset_low, 1000) == ESP_OK)
    {
        printf("Message sent----------->");
        ESP_LOGI(GATTS_TAG, "Message queued for transmission\n");
        vTaskDelay(pdMS_TO_TICKS(100));
    }
    else
    {
        ESP_LOGI(GATTS_TAG, "Failed to queue message for transmission\n");
    }
    vTaskDelay(pdMS_TO_TICKS(100));
}

void transmit_task2(uint8_t tenth_byte)
{
    uint8_t Reset_bit_1;
    uint8_t Reset_bit_2;
    
    if(tenth_byte == 0x01)
    {
        Reset_bit_1= 8 ;
        printf("Reset ON------------------------------------------------->");
        Reset_bit_2=0;
    }
    else
    {
        Reset_bit_1= 0;
        printf("Reset OFF------------------------------------------------->");
        Reset_bit_2=0;
    }
    twai_message_t transmit_message_reset_high = {.identifier = (0x18f60001), .data_length_code = 8, .extd = 1, .data = {Reset_bit_1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00}};
        if (twai_transmit(&transmit_message_reset_high, 1000) == ESP_OK)
        {
        printf("Message sent----------->");
        ESP_LOGI(GATTS_TAG, "Message queued for transmission\n");
        vTaskDelay(pdMS_TO_TICKS(1000));
        }
        else
        {
        ESP_LOGI(GATTS_TAG, "Failed to queue message for transmission\n");
        }
        vTaskDelay(pdMS_TO_TICKS(100));

    twai_message_t transmit_message_reset_low = {.identifier = (0x18f60001), .data_length_code = 8, .extd = 1, .data = {Reset_bit_2, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00}};
        if (twai_transmit(&transmit_message_reset_low, 1000) == ESP_OK)
        {
        printf("Message sent----------->");
        ESP_LOGI(GATTS_TAG, "Message queued for transmission\n");
        vTaskDelay(pdMS_TO_TICKS(100));
        }
        else
        {
        ESP_LOGI(GATTS_TAG, "Failed to queue message for transmission\n");
        }
        vTaskDelay(pdMS_TO_TICKS(100));
 
}

void can_init() {
    // Initialize CAN bus with TWAI configuration
    twai_general_config_t g_config = TWAI_GENERAL_CONFIG_DEFAULT(GPIO_NUM_21, GPIO_NUM_22, TWAI_MODE_NORMAL); // Updated configuration
    g_config.tx_io = GPIO_NUM_21;     // Example TX pin (change to your pin)
    g_config.rx_io = GPIO_NUM_22;     // Example RX pin (change to your pin)

    twai_timing_config_t t_config = {
        .brp = 8,   // Bit rate prescaler
        .sjw = 1,   // Synchronization jump width
        .tseg_1 = 15, // Time segment 1
        .tseg_2 = 4   // Time segment 2
    };  // 500kbps CAN speed (adjust timing values as needed)

    twai_filter_config_t f_config = TWAI_FILTER_CONFIG_ACCEPT_ALL(); // Accept all messages

    // Install and start the TWAI driver
    ESP_ERROR_CHECK(twai_driver_install(&g_config, &t_config, &f_config));
    ESP_ERROR_CHECK(twai_start());
    ESP_LOGI(GATTS_TAG, "CAN bus initialized");
}

// Function to send a service reset CAN message
static void send_service_reset_can_message() {
    // Initialize a message to send for service reset
    twai_message_t tx_message = {
        .identifier = SERVICE_RESET_CAN_ID,  // Service reset CAN ID
        .data_length_code = 1,  // Data length
        .data = {0x01}  // Data representing reset (could be a flag or status)
    };

    esp_err_t ret = twai_transmit(&tx_message, pdMS_TO_TICKS(1000));
    if (ret == ESP_OK) {
        ESP_LOGI(GATTS_TAG, "Service reset CAN message sent successfully.");
    } else {
        ESP_LOGE(GATTS_TAG, "Failed to send service reset CAN message, error code = %x", ret);
    }
}

// Function to send a regular CAN message
static void send_can_message() {
    // Example of sending a regular CAN message
    twai_message_t tx_message = {
        .identifier = 0x100,  // Example CAN ID
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




void example_write_event_env(esp_gatt_if_t gatts_if, prepare_type_env_t *prepare_write_env, esp_ble_gatts_cb_param_t *param){
    ESP_LOGI(GATTS_TAG, "Handling GATT write event: need_rsp=%d, is_prep=%d, offset=%d, len=%d",
             param->write.need_rsp, param->write.is_prep, param->write.offset, param->write.len);

    esp_gatt_status_t status = ESP_GATT_OK;
    if (param->write.need_rsp){
        if (param->write.is_prep) {
            if (param->write.offset > PREPARE_BUF_MAX_SIZE) {
                status = ESP_GATT_INVALID_OFFSET;
                ESP_LOGE(GATTS_TAG, "Invalid offset: %d", param->write.offset);
            } else if ((param->write.offset + param->write.len) > PREPARE_BUF_MAX_SIZE) {
                status = ESP_GATT_INVALID_ATTR_LEN;
                ESP_LOGE(GATTS_TAG, "Invalid attribute length: offset=%d, len=%d", param->write.offset, param->write.len);
            }
            if (status == ESP_GATT_OK && prepare_write_env->prepare_buf == NULL) {
                prepare_write_env->prepare_buf = (uint8_t *)malloc(PREPARE_BUF_MAX_SIZE*sizeof(uint8_t));
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

void example_exec_write_event_env(prepare_type_env_t *prepare_write_env, esp_ble_gatts_cb_param_t *param){
    if (param->exec_write.exec_write_flag == ESP_GATT_PREP_WRITE_EXEC){
        ESP_LOGI(GATTS_TAG, "Executing write with buffer length: %d", prepare_write_env->prepare_len);
        esp_log_buffer_hex(GATTS_TAG, prepare_write_env->prepare_buf, prepare_write_env->prepare_len);
    } else {
        ESP_LOGI(GATTS_TAG, "Prepared write cancelled.");
    }
    if (prepare_write_env->prepare_buf) {
        free(prepare_write_env->prepare_buf);
        prepare_write_env->prepare_buf = NULL;
    }
    prepare_write_env->prepare_len = 0;
}

static void gatts_profile_a_event_handler(esp_gatts_cb_event_t event, esp_gatt_if_t gatts_if, esp_ble_gatts_cb_param_t *param) {
    ESP_LOGI(GATTS_TAG, "Profile A Event Handler: Event = %d", event);
    switch (event) {
        ESP_LOGI(ERROR_CHECK,"EVENT CALLED");
    case ESP_GATTS_REG_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_REG_EVT= %d", ESP_GATTS_REG_EVT);
        ESP_LOGI(GATTS_TAG, "REGISTER_APP_EVT, status %d, app_id %d", param->reg.status, param->reg.app_id);
        gl_profile_tab[PROFILE_A_APP_ID].service_id.is_primary = true;
        gl_profile_tab[PROFILE_A_APP_ID].service_id.id.inst_id = 0x00;
        gl_profile_tab[PROFILE_A_APP_ID].service_id.id.uuid.len = ESP_UUID_LEN_16;
        gl_profile_tab[PROFILE_A_APP_ID].service_id.id.uuid.uuid.uuid16 = GATTS_SERVICE_UUID_TEST_A;

        esp_err_t set_dev_name_ret = esp_ble_gap_set_device_name(TEST_DEVICE_NAME);
        if (set_dev_name_ret){
            ESP_LOGE(GATTS_TAG, "Set device name failed, error code = %x", set_dev_name_ret);
        }
        esp_err_t ret = esp_ble_gap_config_adv_data(&adv_data);
        if (ret){
            ESP_LOGE(GATTS_TAG, "Config adv data failed, error code = %x", ret);
        }
        adv_config_done |= adv_config_flag;
        ret = esp_ble_gap_config_adv_data(&scan_rsp_data);
        if (ret){
            ESP_LOGE(GATTS_TAG, "Config scan response data failed, error code = %x", ret);
        }
        adv_config_done |= scan_rsp_config_flag;

        esp_ble_gatts_create_service(gatts_if, &gl_profile_tab[PROFILE_A_APP_ID].service_id, GATTS_NUM_HANDLE_TEST_A);
        break;
    case ESP_GATTS_READ_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_READ_EVT= %d", ESP_GATTS_READ_EVT);
        ESP_LOGI(GATTS_TAG, "GATT_READ_EVT, conn_id %d, trans_id %" PRIu32 ", handle %d",
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
    case ESP_GATTS_WRITE_EVT:
        ESP_LOGI(GATTS_TAG, "GATT_WRITE_EVT received, conn_id: %d, handle: %d", param->write.conn_id, param->write.handle);

        // Ensure valid data length
        if (param->write.len > 0) {
            ESP_LOGI(GATTS_TAG, "Received data:");
            esp_log_buffer_hex(GATTS_TAG, param->write.value, param->write.len);

            // uint8_t tenth_byte = param->write.value[9];  // Extract the 10th byte (index 9)
            // ESP_LOGI(GATTS_TAG, "10th byte value: 0x%02X", tenth_byte);

            // // Call the transmit_task function with the 10th byte
            // transmit_task2(tenth_byte);

            uint8_t sixth_byte = param->write.value[5];  // Extract the 6th byte (index 5)
            ESP_LOGI(GATTS_TAG, "6th byte value: 0x%02X", sixth_byte);

            // Call the transmit_task function with the 10th byte
            transmit_task1(sixth_byte);

            // Example: Handle specific commands (RESET_COMMAND, CAN_COMMAND)
            if (param->write.len == sizeof(RESET_COMMAND) - 1 &&
                strncmp((char *)param->write.value, RESET_COMMAND, sizeof(RESET_COMMAND) - 1) == 0) {
                ESP_LOGI(GATTS_TAG, "Reset command received");
                send_service_reset_can_message();
            }

            if (param->write.len == sizeof(CAN_COMMAND) - 1 &&
                strncmp((char *)param->write.value, CAN_COMMAND, sizeof(CAN_COMMAND) - 1) == 0) {
                ESP_LOGI(GATTS_TAG, "CAN command received");
                send_can_message();
            }

            // Acknowledge the write
            esp_gatt_rsp_t rsp;
            memset(&rsp, 0, sizeof(esp_gatt_rsp_t));
            rsp.attr_value.handle = param->write.handle;
            rsp.attr_value.len = 0; // No data sent back
            esp_ble_gatts_send_response(gatts_if, param->write.conn_id, param->write.trans_id, ESP_GATT_OK, &rsp);
            ESP_LOGI(GATTS_TAG, "Write acknowledged.");
        } else {
            ESP_LOGW(GATTS_TAG, "Empty write received.");
        }
        break;


    case ESP_GATTS_EXEC_WRITE_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_EXEC_WRITE_EVT= %d", ESP_GATTS_EXEC_WRITE_EVT);
        ESP_LOGI(GATTS_TAG, "Execute write event.");

        // Acknowledge the execute write operation
        esp_ble_gatts_send_response(gatts_if, param->write.conn_id, param->write.trans_id, ESP_GATT_OK, NULL);

        // Handle prepared writes (if needed)
        example_exec_write_event_env(&a_prepare_write_env, param);
        break;

    case ESP_GATTS_MTU_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_MTU_EVT= %d", ESP_GATTS_MTU_EVT);
        ESP_LOGI(GATTS_TAG, "MTU updated to %d", param->mtu.mtu);
        break;
    case ESP_GATTS_UNREG_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_UNREG_EVT= %d", ESP_GATTS_UNREG_EVT);
        ESP_LOGI(GATTS_TAG, "Unregister event received.");
        break;
    case ESP_GATTS_CREATE_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_CREATE_EVT= %d", ESP_GATTS_CREATE_EVT);
        ESP_LOGI(GATTS_TAG, "Service created: status=%d, service_handle=%d", param->create.status, param->create.service_handle);
        gl_profile_tab[PROFILE_A_APP_ID].service_handle = param->create.service_handle;
        gl_profile_tab[PROFILE_A_APP_ID].char_uuid.len = ESP_UUID_LEN_16;
        gl_profile_tab[PROFILE_A_APP_ID].char_uuid.uuid.uuid16 = GATTS_CHAR_UUID_TEST_A;

        esp_ble_gatts_start_service(gl_profile_tab[PROFILE_A_APP_ID].service_handle);
        a_property = ESP_GATT_CHAR_PROP_BIT_READ | ESP_GATT_CHAR_PROP_BIT_WRITE | ESP_GATT_CHAR_PROP_BIT_NOTIFY;
        esp_err_t add_char_ret = esp_ble_gatts_add_char(gl_profile_tab[PROFILE_A_APP_ID].service_handle, &gl_profile_tab[PROFILE_A_APP_ID].char_uuid,
                                                        ESP_GATT_PERM_READ | ESP_GATT_PERM_WRITE,
                                                        a_property,
                                                        &gatts_demo_char1_val, NULL);
        if (add_char_ret){
            ESP_LOGE(GATTS_TAG, "Add character failed: error=%x", add_char_ret);
        }
        break;
    case ESP_GATTS_ADD_INCL_SRVC_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_ADD_INCL_SRVC_EVT= %d", ESP_GATTS_ADD_INCL_SRVC_EVT);
        ESP_LOGI(GATTS_TAG, "Included service added.");
        break;
    case ESP_GATTS_ADD_CHAR_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_ADD_CHAR_EVT= %d", ESP_GATTS_ADD_CHAR_EVT);
        ESP_LOGI(GATTS_TAG, "Character added: status=%d, attr_handle=%d, service_handle=%d",
                 param->add_char.status, param->add_char.attr_handle, param->add_char.service_handle);
        gl_profile_tab[PROFILE_A_APP_ID].char_handle = param->add_char.attr_handle;
        gl_profile_tab[PROFILE_A_APP_ID].descr_uuid.len = ESP_UUID_LEN_16;
        gl_profile_tab[PROFILE_A_APP_ID].descr_uuid.uuid.uuid16 = ESP_GATT_UUID_CHAR_CLIENT_CONFIG;
        esp_err_t add_descr_ret = esp_ble_gatts_add_char_descr(gl_profile_tab[PROFILE_A_APP_ID].service_handle, &gl_profile_tab[PROFILE_A_APP_ID].descr_uuid,
                                                                ESP_GATT_PERM_READ | ESP_GATT_PERM_WRITE, NULL, NULL);
        if (add_descr_ret){
            ESP_LOGE(GATTS_TAG, "Add char descriptor failed: error=%x", add_descr_ret);
        }
        break;
    case ESP_GATTS_ADD_CHAR_DESCR_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_ADD_CHAR_DESCR_EVT= %d", ESP_GATTS_ADD_CHAR_DESCR_EVT);
        gl_profile_tab[PROFILE_A_APP_ID].descr_handle = param->add_char_descr.attr_handle;
        ESP_LOGI(GATTS_TAG, "Descriptor added: status=%d, attr_handle=%d, service_handle=%d",
                 param->add_char_descr.status, param->add_char_descr.attr_handle, param->add_char_descr.service_handle);
        break;
    case ESP_GATTS_DELETE_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_DELETE_EVT= %d", ESP_GATTS_DELETE_EVT);
        ESP_LOGI(GATTS_TAG, "Service deleted.");
        break;
    case ESP_GATTS_START_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_START_EVT= %d", ESP_GATTS_START_EVT);
        ESP_LOGI(GATTS_TAG, "Service started: status=%d, service_handle=%d", param->start.status, param->start.service_handle);
        break;
    case ESP_GATTS_STOP_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_STOP_EVT= %d", ESP_GATTS_STOP_EVT);
        ESP_LOGI(GATTS_TAG, "Service stopped.");
        break;
    case ESP_GATTS_CONNECT_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_CONNECT_EVT= %d", ESP_GATTS_CONNECT_EVT);
        ESP_LOGI(GATTS_TAG, "Device connected: conn_id=%d, remote=%02x:%02x:%02x:%02x:%02x:%02x",
                 param->connect.conn_id,
                 param->connect.remote_bda[0], param->connect.remote_bda[1], param->connect.remote_bda[2],
                 param->connect.remote_bda[3], param->connect.remote_bda[4], param->connect.remote_bda[5]);
        gl_profile_tab[PROFILE_A_APP_ID].conn_id = param->connect.conn_id;
        // Start updating the connection parameters
        esp_ble_conn_update_params_t conn_params = {0};
        memcpy(conn_params.bda, param->connect.remote_bda, sizeof(esp_bd_addr_t));
        conn_params.latency = 0;
        conn_params.max_int = 0x20;    // max_int = 0x20*1.25ms = 40ms
        conn_params.min_int = 0x10;    // min_int = 0x10*1.25ms = 20ms
        conn_params.timeout = 400;    // timeout = 400*10ms = 4000ms
        esp_ble_gap_update_conn_params(&conn_params);
        break;
    case ESP_GATTS_DISCONNECT_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_DISCONNECT_EVT= %d", ESP_GATTS_DISCONNECT_EVT);
        ESP_LOGI(GATTS_TAG, "Device disconnected, reason: 0x%x", param->disconnect.reason);
        // Restart advertising after a disconnect
        esp_ble_gap_start_advertising(&adv_params);
        break;
    case ESP_GATTS_CONF_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_CONF_EVT= %d", ESP_GATTS_CONF_EVT);
        ESP_LOGI(GATTS_TAG, "Confirmation event: status=%d, attr_handle=%d", param->conf.status, param->conf.handle);
        break;
    case ESP_GATTS_OPEN_EVT:
    case ESP_GATTS_CANCEL_OPEN_EVT:
    case ESP_GATTS_CLOSE_EVT:
    case ESP_GATTS_LISTEN_EVT:
    case ESP_GATTS_CONGEST_EVT:
        ESP_LOGI(GATTS_TAG, "Other event: %d", event);
        break;
    default:
        // ESP_LOGE(GATTS_TAG, "Unhandled event -------->JANANI %d", event);
        break;
    }
}

static void gatts_event_handler(esp_gatts_cb_event_t event, esp_gatt_if_t gatts_if, esp_ble_gatts_cb_param_t *param)
{
    ESP_LOGD(GATTS_TAG, "Global GATT event handler: event=%d, gatts_if=%d", event, gatts_if);
    /* If event is register event, store the gatts_if for each profile */
    if (event == ESP_GATTS_REG_EVT) {
        if (param->reg.status == ESP_GATT_OK) {
            gl_profile_tab[param->reg.app_id].gatts_if = gatts_if;
        } else {
            ESP_LOGI(GATTS_TAG, "Reg app failed, app_id %04x, status %d",
                    param->reg.app_id,
                    param->reg.status);
            return;
        }
    }

    /* If the gatts_if equal to profile A, call profile A cb handler,
     * so here call each profile's callback */
    do {
        int idx;
        for (idx = 0; idx < PROFILE_NUM; idx++) {
            if (gatts_if == ESP_GATT_IF_NONE || /* ESP_GATT_IF_NONE, not specify a certain gatt_if, need to call every profile cb function */
                    gatts_if == gl_profile_tab[idx].gatts_if) {
                if (gl_profile_tab[idx].gatts_cb) {
                    gl_profile_tab[idx].gatts_cb(event, gatts_if, param);
                }
            }
        }
    } while (0);
}

// Main application initialization
void app_main(void) {
    esp_err_t ret;

    // Initialize NVS
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

    ret = esp_ble_gatts_app_register(0);  // Register app with app id 0
    if (ret) {
        ESP_LOGE(GATTS_TAG, "gatts app register error, error code = %x", ret);
        return;
    }

    esp_err_t local_mtu_ret = esp_ble_gatt_set_local_mtu(500);
    if (local_mtu_ret) {
        ESP_LOGE(GATTS_TAG, "set local MTU failed, error code = %x", local_mtu_ret);
    }

    // Initialize the CAN bus
    can_init();
    // transmit_task();
}