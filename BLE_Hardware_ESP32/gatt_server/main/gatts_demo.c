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
#define TEST_DEVICE_NAME            "Annmon_Lectrix"
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

// Define variables for each byte to be sent
uint8_t byte_01=0x1;    // Packet Address
uint8_t byte_02=0x0;
uint8_t byte_03=0x0;
uint8_t byte_04=0x0;
uint8_t byte_05=0x0;
uint8_t byte_06=0x0;
uint8_t byte_07=0x0;
uint8_t byte_08=0x0;
uint8_t byte_09=0x0;
uint8_t byte_10=0x0;
uint8_t byte_11=0x0;
uint8_t byte_12=0x0;
uint8_t byte_13=0x0;
uint8_t byte_14=0x0;
uint8_t byte_15=0x0;
uint8_t byte_16=0x0;
uint8_t byte_17=0x0;
uint8_t byte_18=0x0;
uint8_t byte_19=0x0;
uint8_t byte_20=0x0;
uint8_t byte_21=0x2;    // Packet Address
uint8_t byte_22=0x0;
uint8_t byte_23=0x0;
uint8_t byte_24=0x0;
uint8_t byte_25=0x0;
uint8_t byte_26=0x0;
uint8_t byte_27=0x0;
uint8_t byte_28=0x0;
uint8_t byte_29=0x0;
uint8_t byte_30=0x0;
uint8_t byte_31=0x0;
uint8_t byte_32=0x0;
uint8_t byte_33=0x0;
uint8_t byte_34=0x0;
uint8_t byte_35=0x0;
uint8_t byte_36=0x0;
uint8_t byte_37=0x0;
uint8_t byte_38=0x0;
uint8_t byte_39=0x0;
uint8_t byte_40=0x0;
uint8_t byte_41=0x3;    // Packet Address
uint8_t byte_42=0x0;
uint8_t byte_43=0x0;
uint8_t byte_44=0x0;
uint8_t byte_45=0x0;
uint8_t byte_46=0x0;
uint8_t byte_47=0x0;
uint8_t byte_48=0x0;
uint8_t byte_49=0x0;
uint8_t byte_50=0x0;
uint8_t byte_51=0x0;
uint8_t byte_52=0x0;
uint8_t byte_53=0x0;
uint8_t byte_54=0x0;
uint8_t byte_55=0x0;
uint8_t byte_56=0x0;
uint8_t byte_57=0x0;
uint8_t byte_58=0x0;
uint8_t byte_59=0x0;
uint8_t byte_60=0x0;
uint8_t byte_61=0x4;    // Packet Address
uint8_t byte_62=0x0;
uint8_t byte_63=0x0;
uint8_t byte_64=0x0;
uint8_t byte_65=0x0;
uint8_t byte_66=0x0;
uint8_t byte_67=0x0;
uint8_t byte_68=0x0;
uint8_t byte_69=0x0;
uint8_t byte_70=0x0;
uint8_t byte_71=0x0;
uint8_t byte_72=0x0;
uint8_t byte_73=0x0;
uint8_t byte_74=0x0;
uint8_t byte_75=0x0;
uint8_t byte_76=0x0;
uint8_t byte_77=0x0;
uint8_t byte_78=0x0;
uint8_t byte_79=0x0;
uint8_t byte_80=0x0;
uint8_t byte_81=0x5;    // Packet Address
uint8_t byte_82=0x0;
uint8_t byte_83=0x0;
uint8_t byte_84=0x0;
uint8_t byte_85=0x0;
uint8_t byte_86=0x0;
uint8_t byte_87=0x0;
uint8_t byte_88=0x0;
uint8_t byte_89=0x0;
uint8_t byte_90=0x0;
uint8_t byte_91=0x0;
uint8_t byte_92=0x0;
uint8_t byte_93=0x0;
uint8_t byte_94=0x0;
uint8_t byte_95=0x0;
uint8_t byte_96=0x0;
uint8_t byte_97=0x0;
uint8_t byte_98=0x0;
uint8_t byte_99=0x0;
uint8_t byte_100=0x0;
uint8_t byte_101=0x6;    // Packet Address
uint8_t byte_102=0x0;
uint8_t byte_103=0x0;
uint8_t byte_104=0x0;
uint8_t byte_105=0x0;
uint8_t byte_106=0x0;
uint8_t byte_107=0x0;
uint8_t byte_108=0x0;
uint8_t byte_109=0x0;
uint8_t byte_110=0x0;
uint8_t byte_111=0x0;
uint8_t byte_112=0x0;
uint8_t byte_113=0x0;
uint8_t byte_114=0x0;
uint8_t byte_115=0x0;
uint8_t byte_116=0x0;
uint8_t byte_117=0x0;
uint8_t byte_118=0x0;
uint8_t byte_119=0x0;
uint8_t byte_120=0x0;
uint8_t byte_121=0x7;    // Packet Address
uint8_t byte_122=0x0;
uint8_t byte_123=0x0;
uint8_t byte_124=0x0;
uint8_t byte_125=0x0;
uint8_t byte_126=0x0;
uint8_t byte_127=0x0;
uint8_t byte_128=0x0;
uint8_t byte_129=0x0;
uint8_t byte_130=0x0;
uint8_t byte_131=0x0;
uint8_t byte_132=0x0;
uint8_t byte_133=0x0;
uint8_t byte_134=0x0;
uint8_t byte_135=0x0;
uint8_t byte_136=0x0;
uint8_t byte_137=0x0;
uint8_t byte_138=0x0;
uint8_t byte_139=0x0;
uint8_t byte_140=0x0;
uint8_t byte_141=0x8;    // Packet Address
uint8_t byte_142=0x0;
uint8_t byte_143=0x0;
uint8_t byte_144=0x0;
uint8_t byte_145=0x0;
uint8_t byte_146=0x0;
uint8_t byte_147=0x0;
uint8_t byte_148=0x0;
uint8_t byte_149=0x0;
uint8_t byte_150=0x0;
uint8_t byte_151=0x0;
uint8_t byte_152=0x0;
uint8_t byte_153=0x0;
uint8_t byte_154=0x0;
uint8_t byte_155=0x0;
uint8_t byte_156=0x0;
uint8_t byte_157=0x0;
uint8_t byte_158=0x0;
uint8_t byte_159=0x0;
uint8_t byte_160=0x0;
uint8_t byte_161=0x9;    // Packet Address
uint8_t byte_162=0x0;
uint8_t byte_163=0x0;
uint8_t byte_164=0x0;
uint8_t byte_165=0x0;
uint8_t byte_166=0x0;
uint8_t byte_167=0x0;
uint8_t byte_168=0x0;
uint8_t byte_169=0x0;
uint8_t byte_170=0x0;
uint8_t byte_171=0x0;
uint8_t byte_172=0x0;
uint8_t byte_173=0x0;
uint8_t byte_174=0x0;
uint8_t byte_175=0x0;
uint8_t byte_176=0x0;
uint8_t byte_177=0x0;
uint8_t byte_178=0x0;
uint8_t byte_179=0x0;
uint8_t byte_180=0x0;
uint8_t byte_181=0x10;   // Packet Address
uint8_t byte_182=0x0;
uint8_t byte_183=0x0;
uint8_t byte_184=0x0;
uint8_t byte_185=0x0;
uint8_t byte_186=0x0;
uint8_t byte_187=0x0;
uint8_t byte_188=0x0;
uint8_t byte_189=0x0;
uint8_t byte_190=0x0;
uint8_t byte_191=0x0;
uint8_t byte_192=0x0;
uint8_t byte_193=0x0;
uint8_t byte_194=0x0;
uint8_t byte_195=0x0;
uint8_t byte_196=0x0;
uint8_t byte_197=0x0;
uint8_t byte_198=0x0;
uint8_t byte_199=0x0;
uint8_t byte_200=0x0;
uint8_t byte_201=0x11;   // Packet Address
uint8_t byte_202=0x0;
uint8_t byte_203=0x0;
uint8_t byte_204=0x0;
uint8_t byte_205=0x0;
uint8_t byte_206=0x0;
uint8_t byte_207=0x0;
uint8_t byte_208=0x0;
uint8_t byte_209=0x0;
uint8_t byte_210=0x0;
uint8_t byte_211=0x0;
uint8_t byte_212=0x0;
uint8_t byte_213=0x0;
uint8_t byte_214=0x0;
uint8_t byte_215=0x0;
uint8_t byte_216=0x0;
uint8_t byte_217=0x0;
uint8_t byte_218=0x0;
uint8_t byte_219=0x0;
uint8_t byte_220=0x0;
uint8_t byte_221=0x12;   // Packet Address
uint8_t byte_222=0x0;
uint8_t byte_223=0x0;
uint8_t byte_224=0x0;
uint8_t byte_225=0x0;
uint8_t byte_226=0x0;
uint8_t byte_227=0x0;
uint8_t byte_228=0x0;
uint8_t byte_229=0x0;
uint8_t byte_230=0x0;
uint8_t byte_231=0x0;
uint8_t byte_232=0x0;
uint8_t byte_233=0x0;
uint8_t byte_234=0x0;
uint8_t byte_235=0x0;
uint8_t byte_236=0x0;
uint8_t byte_237=0x0;
uint8_t byte_238=0x0;
uint8_t byte_239=0x0;
uint8_t byte_240=0x0;
uint8_t byte_241=0x13;   // Packet Address
uint8_t byte_242=0x0;
uint8_t byte_243=0x0;
uint8_t byte_244=0x0;
uint8_t byte_245=0x0;
uint8_t byte_246=0x0;
uint8_t byte_247=0x0;
uint8_t byte_248=0x0;
uint8_t byte_249=0x0;
uint8_t byte_250=0x0;
uint8_t byte_251=0x0;
uint8_t byte_252=0x0;
uint8_t byte_253=0x0;
uint8_t byte_254=0x0;
uint8_t byte_255=0x0;
uint8_t byte_256=0x0;
uint8_t byte_257=0x0;
uint8_t byte_258=0x0;
uint8_t byte_259=0x0;
uint8_t byte_260=0x0;
uint8_t byte_261=0x14;   // Packet Address
uint8_t byte_262=0x0;
uint8_t byte_263=0x0;
uint8_t byte_264=0x0;
uint8_t byte_265=0x0;
uint8_t byte_266=0x0;
uint8_t byte_267=0x0;
uint8_t byte_268=0x0;
uint8_t byte_269=0x0;
uint8_t byte_270=0x0;
uint8_t byte_271=0x0;
uint8_t byte_272=0x0;
uint8_t byte_273=0x0;
uint8_t byte_274=0x0;
uint8_t byte_275=0x0;
uint8_t byte_276=0x0;
uint8_t byte_277=0x0;
uint8_t byte_278=0x0;
uint8_t byte_279=0x0;
uint8_t byte_280=0x0;
uint8_t byte_281=0x15;   // Packet Address
uint8_t byte_282=0x0;
uint8_t byte_283=0x0;
uint8_t byte_284=0x0;
uint8_t byte_285=0x0;
uint8_t byte_286=0x0;
uint8_t byte_287=0x0;
uint8_t byte_288=0x0;
uint8_t byte_289=0x0;
uint8_t byte_290=0x0;
uint8_t byte_291=0x0;
uint8_t byte_292=0x0;
uint8_t byte_293=0x0;
uint8_t byte_294=0x0;
uint8_t byte_295=0x0;
uint8_t byte_296=0x0;
uint8_t byte_297=0x0;
uint8_t byte_298=0x0;
uint8_t byte_299=0x0;
uint8_t byte_300=0x0;
uint8_t byte_301=0x16;   // Packet Address
uint8_t byte_302=0x0;
uint8_t byte_303=0x0;
uint8_t byte_304=0x0;
uint8_t byte_305=0x0;
uint8_t byte_306=0x0;
uint8_t byte_307=0x0;
uint8_t byte_308=0x0;
uint8_t byte_309=0x0;
uint8_t byte_310=0x0;
uint8_t byte_311=0x0;
uint8_t byte_312=0x0;
uint8_t byte_313=0x0;
uint8_t byte_314=0x0;
uint8_t byte_315=0x0;
uint8_t byte_316=0x0;
uint8_t byte_317=0x0;
uint8_t byte_318=0x0;
uint8_t byte_319=0x0;
uint8_t byte_320=0x0;
uint8_t byte_321=0x17;   // Packet Address
uint8_t byte_322=0x0;
uint8_t byte_323=0x0;
uint8_t byte_324=0x0;
uint8_t byte_325=0x0;
uint8_t byte_326=0x0;
uint8_t byte_327=0x0;
uint8_t byte_328=0x0;
uint8_t byte_329=0x0;
uint8_t byte_330=0x0;
uint8_t byte_331=0x0;
uint8_t byte_332=0x0;
uint8_t byte_333=0x0;
uint8_t byte_334=0x0;
uint8_t byte_335=0x0;
uint8_t byte_336=0x0;
uint8_t byte_337=0x0;
uint8_t byte_338=0x0;
uint8_t byte_339=0x0;
uint8_t byte_340=0x0;
uint8_t byte_341=0x18;   // Packet Address
uint8_t byte_342=0x0;
uint8_t byte_343=0x0;
uint8_t byte_344=0x0;
uint8_t byte_345=0x0;
uint8_t byte_346=0x0;
uint8_t byte_347=0x0;
uint8_t byte_348=0x0;
uint8_t byte_349=0x0;
uint8_t byte_350=0x0;
uint8_t byte_351=0x0;
uint8_t byte_352=0x0;
uint8_t byte_353=0x0;
uint8_t byte_354=0x0;
uint8_t byte_355=0x0;
uint8_t byte_356=0x0;
uint8_t byte_357=0x0;
uint8_t byte_358=0x0;
uint8_t byte_359=0x0;
uint8_t byte_360=0x0;
uint8_t byte_361=0x19;   // Packet Address
uint8_t byte_362=0x0;
uint8_t byte_363=0x0;
uint8_t byte_364=0x0;
uint8_t byte_365=0x0;
uint8_t byte_366=0x0;
uint8_t byte_367=0x0;
uint8_t byte_368=0x0;
uint8_t byte_369=0x0;
uint8_t byte_370=0x0;
uint8_t byte_371=0x0;
uint8_t byte_372=0x0;
uint8_t byte_373=0x0;
uint8_t byte_374=0x0;
uint8_t byte_375=0x0;
uint8_t byte_376=0x0;
uint8_t byte_377=0x0;
uint8_t byte_378=0x0;
uint8_t byte_379=0x0;
uint8_t byte_380=0x0;
uint8_t byte_381=0x20;   // Packet Address
uint8_t byte_382=0x0;
uint8_t byte_383=0x0;
uint8_t byte_384=0x0;
uint8_t byte_385=0x0;
uint8_t byte_386=0x0;
uint8_t byte_387=0x0;
uint8_t byte_388=0x0;
uint8_t byte_389=0x0;
uint8_t byte_390=0x0;
uint8_t byte_391=0x0;
uint8_t byte_392=0x0;
uint8_t byte_393=0x0;
uint8_t byte_394=0x0;
uint8_t byte_395=0x0;
uint8_t byte_396=0x0;
uint8_t byte_397=0x0;
uint8_t byte_398=0x0;
uint8_t byte_399=0x0;
uint8_t byte_400=0x0;

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

int count=0;
int delay=20;
// Notification task
void notification_task(void *param) {
    while (notify_enabled) {
        uint8_t notify_data1[20] = {
            byte_01, byte_02, byte_03, byte_04, byte_05,
            byte_06, byte_07, byte_08, byte_09, byte_10,
            byte_11, byte_12, byte_13, byte_14, byte_15,
            byte_16, byte_17, byte_18, byte_19, byte_20
        };

        // Check if the interface is valid before sending data

            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data1), notify_data1, false);
        vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
        count=count+1;
        uint8_t notify_data2[20] = {
            byte_21, byte_22, byte_23, byte_24, byte_25,
            byte_26, byte_27, byte_28, byte_29, byte_30,
            byte_31, byte_32, byte_33, byte_34, byte_35,
            byte_36, byte_37, byte_38, byte_39, byte_40
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data2), notify_data2, false);
        vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
        count=count+1;
        uint8_t notify_data3[20] = {
            byte_41, byte_42, byte_43, byte_44, byte_45,
            byte_46, byte_47, byte_48, byte_49, byte_50,
            byte_51, byte_52, byte_53, byte_54, byte_55,
            byte_56, byte_57, byte_58, byte_59, byte_60
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data3), notify_data3, false);
        vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
        count=count+1;
        uint8_t notify_data4[20] = {
            byte_61, byte_62, byte_63, byte_64, byte_65,
            byte_66, byte_67, byte_68, byte_69, byte_70,
            byte_71, byte_72, byte_73, byte_74, byte_75,
            byte_76, byte_77, byte_78, byte_79, byte_80
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data4), notify_data4, false);
        vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
        count=count+1;
        uint8_t notify_data5[20] = {
            byte_81, byte_82, byte_83, byte_84, byte_85,
            byte_86, byte_87, byte_88, byte_89, byte_90,
            byte_91, byte_92, byte_93, byte_94, byte_95,
            byte_96, byte_97, byte_98, byte_99, byte_100
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data5), notify_data5, false);
        vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
        count=count+1;
        uint8_t notify_data6[20] = {
            byte_101, byte_102, byte_103, byte_104, byte_105,
            byte_106, byte_107, byte_108, byte_109, byte_110,
            byte_111, byte_112, byte_113, byte_114, byte_115,
            byte_116, byte_117, byte_118, byte_119, byte_120
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data6), notify_data6, false);
        vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
        count=count+1;

        uint8_t notify_data7[20] = {
            byte_121, byte_122, byte_123, byte_124, byte_125,
            byte_126, byte_127, byte_128, byte_129, byte_130,
            byte_131, byte_132, byte_133, byte_134, byte_135,
            byte_136, byte_137, byte_138, byte_139, byte_140
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data7), notify_data7, false);
            vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
            count=count+1;
        uint8_t notify_data8[20] = {
            byte_141, byte_142, byte_143, byte_144, byte_145,
            byte_146, byte_147, byte_148, byte_149, byte_150,
            byte_151, byte_152, byte_153, byte_154, byte_155,
            byte_156, byte_157, byte_158, byte_159, byte_160
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data8), notify_data8, false);
            vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
            count=count+1;
        uint8_t notify_data9[20] = {
            byte_161, byte_162, byte_163, byte_164, byte_165,
            byte_166, byte_167, byte_168, byte_169, byte_170,
            byte_171, byte_172, byte_173, byte_174, byte_175,
            byte_176, byte_177, byte_178, byte_179, byte_180
        };

            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data9), notify_data9, false);

            vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
            count=count+1;
        uint8_t notify_data10[20] = {
            byte_181, byte_182, byte_183, byte_184, byte_185,
            byte_186, byte_187, byte_188, byte_189, byte_190,
            byte_191, byte_192, byte_193, byte_194, byte_195,
            byte_196, byte_197, byte_198, byte_199, byte_200
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data10), notify_data10, false);

            vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
            count=count+1;
        uint8_t notify_data11[20] = {
            byte_201, byte_202, byte_203, byte_204, byte_205,
            byte_206, byte_207, byte_208, byte_209, byte_210,
            byte_211, byte_212, byte_213, byte_214, byte_215,
            byte_216, byte_217, byte_218, byte_219, byte_220
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data11), notify_data11, false);

            vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
            count=count+1;
        uint8_t notify_data12[20] = {
            byte_221, byte_222, byte_223, byte_224, byte_225,
            byte_226, byte_227, byte_228, byte_229, byte_230,
            byte_231, byte_232, byte_233, byte_234, byte_235,
            byte_236, byte_237, byte_238, byte_239, byte_240
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data12), notify_data12, false);

            vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
            count=count+1;
        uint8_t notify_data13[20] = {
            byte_241, byte_242, byte_243, byte_244, byte_245,
            byte_246, byte_247, byte_248, byte_249, byte_250,
            byte_251, byte_252, byte_253, byte_254, byte_255,
            byte_256, byte_257, byte_258, byte_259, byte_260
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data13), notify_data13, false);

            vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
            count=count+1;
        uint8_t notify_data14[20] = {
            byte_261, byte_262, byte_263, byte_264, byte_265,
            byte_266, byte_267, byte_268, byte_269, byte_270,
            byte_271, byte_272, byte_273, byte_274, byte_275,
            byte_276, byte_277, byte_278, byte_279, byte_280
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data14), notify_data14, false);

            vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
            count=count+1;
        uint8_t notify_data15[20] = {
            byte_281, byte_282, byte_283, byte_284, byte_285,
            byte_286, byte_287, byte_288, byte_289, byte_290,
            byte_291, byte_292, byte_293, byte_294, byte_295,
            byte_296, byte_297, byte_298, byte_299, byte_300
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data15), notify_data15, false);

            vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
            count=count+1;
        uint8_t notify_data16[20] = {
            byte_301, byte_302, byte_303, byte_304, byte_305,
            byte_306, byte_307, byte_308, byte_309, byte_310,
            byte_311, byte_312, byte_313, byte_314, byte_315,
            byte_316, byte_317, byte_318, byte_319, byte_320
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data16), notify_data16, false);

            vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
            count=count+1;
        uint8_t notify_data17[20] = {
            byte_321, byte_322, byte_323, byte_324, byte_325,
            byte_326, byte_327, byte_328, byte_329, byte_330,
            byte_331, byte_332, byte_333, byte_334, byte_335,
            byte_336, byte_337, byte_338, byte_339, byte_340
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data17), notify_data17, false);

            vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
            count=count+1;
        uint8_t notify_data18[20] = {
            byte_341, byte_342, byte_343, byte_344, byte_345,
            byte_346, byte_347, byte_348, byte_349, byte_350,
            byte_351, byte_352, byte_353, byte_354, byte_355,
            byte_356, byte_357, byte_358, byte_359, byte_360
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data18), notify_data18, false);

            vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
            count=count+1;
        uint8_t notify_data19[20] = {
            byte_361, byte_362, byte_363, byte_364, byte_365,
            byte_366, byte_367, byte_368, byte_369, byte_370,
            byte_371, byte_372, byte_373, byte_374, byte_375,
            byte_376, byte_377, byte_378, byte_379, byte_380
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data19), notify_data19, false);

            vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
            count=count+1;

        uint8_t notify_data20[20] = {
            byte_381, byte_382, byte_383, byte_384, byte_385,
            byte_386, byte_387, byte_388, byte_389, byte_390,
            byte_391, byte_392, byte_393, byte_394, byte_395,
            byte_396, byte_397, byte_398, byte_399, byte_400
        };


            esp_ble_gatts_send_indicate(global_gatts_if, gl_profile_tab[PROFILE_A_APP_ID].conn_id,
                                        gl_profile_tab[PROFILE_A_APP_ID].char_handle,
                                        sizeof(notify_data20), notify_data20, false);

            vTaskDelay(pdMS_TO_TICKS(delay)); // check delay value
            count=count+1;

        printf("Count %d", count);
        printf("bytes DEBUG %d %d", byte_35, byte_36); // I noticed sometimes Motor_Temperature value goes to zero
    }

    notify_task_handle = NULL;
    vTaskDelete(NULL);
}

static void twai_receive_task(void *arg) {
    ESP_LOGI("TWAI Receiver", "Starting TWAI receive task");
    twai_message_t message;

    static TickType_t last_received_0x01 = 0;
    static TickType_t last_received_0x18530902 = 0;
    static TickType_t last_received_0x400 = 0;
    static TickType_t last_received_0x18F20315 = 0;

    // Initialize last-received timestamps to "now"
    TickType_t now = xTaskGetTickCount();
    last_received_0x01 = now;
    last_received_0x18530902 = now;
    last_received_0x400 = now;
    last_received_0x18F20315 = now;

    // Define your timeouts in ticks (e.g., 400 ms => 400 ms worth of ticks)
    const TickType_t TIMEOUT_0x01 = pdMS_TO_TICKS(1000);
    const TickType_t TIMEOUT_0x18530902 = pdMS_TO_TICKS(1000);
    const TickType_t TIMEOUT_0x400 = pdMS_TO_TICKS(1000);
    const TickType_t TIMEOUT_0x18F20315 = pdMS_TO_TICKS(1000);

    while (1) {
        if (twai_receive(&message, pdMS_TO_TICKS(50)) == ESP_OK) {
            // ESP_LOGI("TWAI Receiver", "CAN ID : 0x%08" PRIx32, message.identifier);
            switch (message.identifier) {
                case 0x14520902: // CAN #1
                 // byte_01=0x1; is to identify the packet number
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
                    byte_15 = message.data[5]; // AC_Current
                    byte_16 = message.data[6]; // AC_Current
                    byte_17 = message.data[7];
                    break;
                case 0x14520904: // CAN #3
                    byte_18 = message.data[0];
                    byte_19 = message.data[1];
                    byte_20 = message.data[2];
                 // byte_21=0x2; is to identify the packet number
                    byte_22 = message.data[3];
                    byte_23 = message.data[4];
                    byte_24 = message.data[5];
                    byte_25 = message.data[6];
                    byte_26 = message.data[7];
                    break;
                    case 0x18530902: // CAN #4 // Take this for MCU CAN LOSS
                    last_received_0x18530902 = xTaskGetTickCount();
                    byte_27 = message.data[0];
                    byte_28 = message.data[1];
                    byte_29 = message.data[2];
                    byte_30 = message.data[3];
                    byte_31 = message.data[4];
                    byte_32 = message.data[5];
                    byte_33 = message.data[6];
                    byte_34 = message.data[7];
                    break;
                case 0x18530903: // CAN #5
                    byte_35 = message.data[0]; // MCU_Temperature
                    byte_36 = message.data[1]; // MCU_Temperature
                    byte_37 = message.data[2]; // Motor_Temperature
                    byte_38 = message.data[3]; // MCU_Fault_Code
                    byte_39 = message.data[4]; // MCU_ID
                    byte_40 = message.data[5]; // MCU_ID
                 // byte_41=0x3; is to identify the packet number
                    byte_42 = message.data[6]; 
                    byte_43 = message.data[7]; 
                    break;
                case 0x19A: // CAN #6 // MISSED // Broadcasting
                    byte_44 = message.data[0];
                    byte_45 = message.data[1];
                    byte_46 = message.data[2];
                    byte_47 = message.data[3];
                    byte_48 = message.data[4];
                    byte_49 = message.data[5];
                    byte_50 = message.data[6];
                    byte_51 = message.data[7];
                    break;
                case 0x18F20309: // CAN #7 // MISSED // VCU
                    byte_52 = message.data[0];
                    byte_53 = message.data[1];
                    byte_54 = message.data[2];
                    byte_55 = message.data[3];
                    byte_56 = message.data[4];
                    byte_57 = message.data[5];
                    byte_58 = message.data[6];
                    byte_59 = message.data[7];
                    break;
                case 0x18F20311: // CAN #8 // MISSED //VCU
                    byte_60 = message.data[4]; // Initial Torque
                 // byte_61=0x4; is to identify the packet number
                    byte_62 = message.data[5]; // Final Torque
                    byte_63 = message.data[0]; // Buffer Speed
                    byte_64 = message.data[1]; // Buffer Speed
                    byte_65 = message.data[2]; // Base Speed
                    byte_66 = message.data[3]; // Base Speed
                    byte_67 = message.data[6];
                    byte_68 = message.data[7];
                    break;
                case 0x18FF3002: // CAN #9 // MCU_Firmware_Id
                    byte_69 = message.data[0];
                    byte_70 = message.data[1];
                    byte_71 = message.data[2];
                    byte_72 = message.data[3];
                    byte_73 = message.data[4];
                    byte_74 = message.data[5];
                    byte_75 = message.data[6];
                    byte_76 = message.data[7];
                    break;
                case 0x18F20313: // CAN #10 // MISSED // WRONG
                    byte_77 = message.data[0];
                    byte_78 = message.data[1];
                    byte_79 = message.data[2];
                    byte_80 = message.data[3];
                 // byte_81=0x5; is to identify the packet number
                    byte_82 = message.data[4];                  
                    byte_83 = message.data[5];
                    byte_84 = message.data[6];
                    byte_85 = message.data[7];
                    break;
                    case 0x18F20315: // CAN #11 // Take this ID for CAN loss for Cluster // Cluster version number
                    last_received_0x18F20315 = xTaskGetTickCount();
                    byte_86 = message.data[0];
                    byte_87 = message.data[1];
                    byte_88 = message.data[2];
                    byte_89 = message.data[3];
                    byte_90 = message.data[4];
                    byte_91 = message.data[5];
                    byte_92 = message.data[6];
                    byte_93 = message.data[7];
                    break;
                case 0x18F20316: // CAN #12
                    byte_94 = message.data[0];
                    byte_95 = message.data[1];
                    byte_96 = message.data[2];
                    byte_97 = message.data[3];
                    byte_98 = message.data[4];
                    byte_99 = message.data[5];
                    byte_100 = message.data[6];
                 // byte_101=0x6; is to identify the packet number
                    byte_102 = message.data[7];
                    break;
                case 0x18F60001: // CAN #13
                    byte_103 = message.data[0];
                    byte_104 = message.data[1];
                    byte_105 = message.data[2];
                    byte_106 = message.data[3];
                    byte_107 = message.data[4];
                    byte_108 = message.data[5];
                    byte_109 = message.data[6];
                    byte_110 = message.data[7];
                    break;
                case 0xD: // CAN #14 // Battery version number
                    byte_111 = message.data[0];
                    byte_112 = message.data[1];
                    byte_113 = message.data[2];
                    byte_114 = message.data[3];
                    byte_115 = message.data[4];
                    byte_116 = message.data[5];
                    byte_117 = message.data[6];
                    byte_118 = message.data[7];
                    break;
                case 0x18F20314: // CAN #15 // MISSED // VCU
                    byte_119 = message.data[0];
                    byte_120 = message.data[1];
                 // byte_121=0x7; is to identify the packet number
                    byte_122 = message.data[2];
                    byte_123 = message.data[3];
                    byte_124 = message.data[4];
                    byte_125 = message.data[5];
                    byte_126 = message.data[6];
                    byte_127 = message.data[7];
                    break;
                case 0x1: // CAN #16 // Take this ID for CAN loss for Battery
                    last_received_0x01 = xTaskGetTickCount();
                    byte_128 = message.data[0];
                    byte_129 = message.data[1];
                    byte_130 = message.data[2];
                    byte_131 = message.data[3];
                    byte_132 = message.data[4];
                    byte_133 = message.data[5];
                    byte_134 = message.data[6];
                    byte_135 = message.data[7];
                    break;
                case 0x7: // CAN #17
                    byte_136 = message.data[0];
                    byte_137 = message.data[1];
                    byte_138 = message.data[2];
                    byte_139 = message.data[3];
                    byte_140 = message.data[4];
                 // byte_141=0x8; is to identify the packet number
                    byte_142 = message.data[5];
                    byte_143 = message.data[6];
                    byte_144 = message.data[7];
                    break;
                case 0x3: // CAN #18
                    byte_145 = message.data[0];
                    byte_146 = message.data[1];
                    byte_147 = message.data[2];
                    byte_148 = message.data[3];
                    byte_149 = message.data[4];
                    byte_150 = message.data[5];
                    byte_151 = message.data[6];
                    byte_152 = message.data[7];
                    break;
                case 0x4: // CAN #19
                    byte_153 = message.data[0];
                    byte_154 = message.data[1];
                    byte_155 = message.data[2];
                    byte_156 = message.data[3];
                    byte_157 = message.data[4];
                    byte_158 = message.data[5];
                    byte_159 = message.data[6];
                    byte_160 = message.data[7];
                    break;
                case 0x5: // CAN #20
                 // byte_161=0x9; is to identify the packet number
                    byte_162 = message.data[0];
                    byte_163 = message.data[1];
                    byte_164 = message.data[2];
                    byte_165 = message.data[3];
                    byte_166 = message.data[4];
                    byte_167 = message.data[5];
                    byte_168 = message.data[6];
                    byte_169 = message.data[7];
                    break;
                case 0x6: // CAN #21
                    byte_170 = message.data[0];
                    byte_171 = message.data[1];
                    byte_172 = message.data[2];
                    byte_173 = message.data[3];
                    byte_174 = message.data[4];
                    byte_175 = message.data[5];
                    byte_176 = message.data[6];
                    byte_177 = message.data[7];
                    break;
                case 0x8: // CAN #22            
                    byte_178 = message.data[0]; // SOC
                    byte_179 = message.data[5]; // SOH
                    byte_180 = message.data[6]; // FetTemp
                 // byte_181=0x10; is to identify the packet number
                    byte_182 = message.data[1]; // SOCAh
                    byte_183 = message.data[2]; // SOCAh
                    byte_184 = message.data[3]; // SOCAh
                    byte_185 = message.data[4]; // SOCAh
                    byte_186 = message.data[7];
                    break;

                case 0x2: // CAN #23
                    byte_187 = message.data[0];
                    byte_188 = message.data[1];
                    byte_189 = message.data[2];
                    byte_190 = message.data[3];
                    byte_191 = message.data[4];
                    byte_192 = message.data[5];
                    byte_193 = message.data[6];
                    byte_194 = message.data[7];
                    break;
                case 0x9: // CAN #24
                    byte_195 = message.data[0];
                    byte_196 = message.data[1];
                    byte_197 = message.data[2];
                    byte_198 = message.data[4];
                    byte_199 = message.data[5];
                    byte_200 = message.data[6];
                 // byte_201=0x11; is to identify the packet number
                    byte_202 = message.data[3];
                    byte_203 = message.data[7];
                    break;
                case 0xA: // CAN #25
                    byte_204 = message.data[0];
                    byte_205 = message.data[1];
                    byte_206 = message.data[2];
                    byte_207 = message.data[3];
                    byte_208 = message.data[4];
                    byte_209 = message.data[5];
                    byte_210 = message.data[6];
                    byte_211 = message.data[7];
                    break;

                case 0xC: // CAN #26
                    byte_212 = message.data[0];
                    byte_213 = message.data[1];
                    byte_214 = message.data[2];
                    byte_215 = message.data[3];
                    byte_216 = message.data[4];
                    byte_217 = message.data[5];
                    byte_218 = message.data[6];
                    byte_219 = message.data[7];
                    break;
                
                case 0x18F20310: // CAN #27
                    byte_220 = message.data[0];
                 // byte_221=0x12; is to identify the packet number
                    byte_222 = message.data[1];
                    byte_223 = message.data[2];
                    byte_224 = message.data[3];
                    byte_225 = message.data[4];
                    byte_226 = message.data[5];
                    byte_227 = message.data[6];
                    byte_228 = message.data[7];
                    break;
                case 0xE: // CAN #28
                    byte_229 = message.data[0];
                    byte_230 = message.data[1];
                    byte_231 = message.data[2];
                    byte_232 = message.data[3];
                    byte_233 = message.data[4];
                    byte_234 = message.data[5];
                    byte_235 = message.data[6];
                    byte_236 = message.data[7];
                    break;
                case 0xF: // CAN #29
                    byte_237 = message.data[0];
                    byte_238 = message.data[1];
                    byte_239 = message.data[2];
                    byte_240 = message.data[3];
                 // byte_241=0x13; is to identify the packet number
                    byte_242 = message.data[4];
                    byte_243 = message.data[5];
                    byte_244 = message.data[6];
                    byte_245 = message.data[7];
                    break;
                case 0x10: // CAN #30
                    byte_246 = message.data[0];
                    byte_247 = message.data[1];
                    byte_248 = message.data[2];
                    byte_249 = message.data[3];
                    byte_250 = message.data[4];
                    byte_251 = message.data[5];
                    byte_252 = message.data[6];
                    byte_253 = message.data[7];
                    break;

                case 0xBB: // CAN #31
                    byte_254 = message.data[0];
                    byte_255 = message.data[1];
                    byte_256 = message.data[2];
                    byte_257 = message.data[3];
                    byte_258 = message.data[4];
                    byte_259 = message.data[5];
                    byte_260 = message.data[6];
                 // byte_261=0x14; is to identify the packet number
                    byte_262 = message.data[7];
                    break;
                case 0x15: // CAN #32
                    byte_263 = message.data[0];
                    byte_264 = message.data[1];
                    byte_265 = message.data[2];
                    byte_266 = message.data[3];
                    byte_267 = message.data[4];
                    byte_268 = message.data[5];
                    byte_269 = message.data[6];
                    byte_270 = message.data[7];
                    break;
                case 0x12: // CAN #33
                    byte_271 = message.data[0];
                    byte_272 = message.data[1];
                    byte_273 = message.data[2];
                    byte_274 = message.data[3];
                    byte_275 = message.data[4];
                    byte_276 = message.data[5];
                    byte_277 = message.data[6];
                    byte_278 = message.data[7];
                    break;
                case 0xBE: // CAN #34
                    byte_279 = message.data[0];
                    byte_280 = message.data[1];
                 // byte_281=0x15; is to identify the packet number
                    byte_282 = message.data[2];
                    byte_283 = message.data[3];
                    byte_284 = message.data[4];
                    byte_285 = message.data[5];
                    byte_286 = message.data[6];
                    byte_287 = message.data[7];
                    break;
                case 0xC3: // CAN #35
                    byte_288 = message.data[0];
                    byte_289 = message.data[1];
                    byte_290 = message.data[2];
                    byte_291 = message.data[3];
                    byte_292 = message.data[4];
                    byte_293 = message.data[5];
                    byte_294 = message.data[6];
                    byte_295 = message.data[7];
                    break;
                case 0x601: // CAN #36
                    byte_296 = message.data[0];
                    byte_297 = message.data[1];
                    byte_298 = message.data[2];
                    byte_299 = message.data[3];
                    byte_300 = message.data[4];
                 // byte_301=0x16; is to identify the packet number
                    byte_302 = message.data[5];
                    byte_303 = message.data[6];
                    byte_304 = message.data[7];
                    break;
                case 0xB: // CAN #37
                    byte_305 = message.data[0];
                    byte_306 = message.data[1];
                    byte_307 = message.data[2];
                    byte_308 = message.data[3];
                    byte_309 = message.data[4];
                    byte_310 = message.data[5];
                    byte_311 = message.data[6];
                    byte_312 = message.data[7];
                    break;
                case 0x712: // CAN #38 // MISSED // Broadcasting
                    byte_313 = message.data[0];
                    byte_314 = message.data[1];
                    byte_315 = message.data[2];
                    byte_316 = message.data[3];
                    byte_317 = message.data[4];
                    byte_318 = message.data[5];
                    byte_319 = message.data[6];
                    byte_320 = message.data[7];
                    break;
                case 0x713: // CAN #39 MISSED // Broadcasting
                 // byte_321=0x17; is to identify the packet number
                    byte_322 = message.data[0];
                    byte_323 = message.data[1];
                    byte_324 = message.data[2];
                    byte_325 = message.data[3];
                    byte_326 = message.data[4];
                    byte_327 = message.data[5];
                    byte_328 = message.data[6];
                    byte_329 = message.data[7];
                    break;
                case 0x401: // CAN #40
                    byte_330 = message.data[0];
                    byte_331 = message.data[1];
                    byte_332 = message.data[2];
                    byte_333 = message.data[3];
                    byte_334 = message.data[4];
                    byte_335 = message.data[5];
                    byte_336 = message.data[6];
                    byte_337 = message.data[7];
                    break;
                case 0x405: // CAN #41
                    byte_338 = message.data[0];
                    byte_339 = message.data[1];
                    byte_340 = message.data[2];
                 // byte_341=0x18; is to identify the packet number
                    byte_342 = message.data[3];
                    byte_343 = message.data[4];
                    byte_344 = message.data[5];
                    byte_345 = message.data[6];
                    byte_346 = message.data[7];
                    break;
                case 0x403: // CAN #42
                    byte_347 = message.data[0];
                    byte_348 = message.data[1];
                    byte_349 = message.data[2];
                    byte_350 = message.data[3];
                    byte_351 = message.data[4];
                    byte_352 = message.data[5];
                    byte_353 = message.data[6];
                    byte_354 = message.data[7];
                    break;
                case 0x402: // CAN #43
                    byte_355 = message.data[0];
                    byte_356 = message.data[1];
                    byte_357 = message.data[2];
                    byte_358 = message.data[3];
                    byte_359 = message.data[4];
                    byte_360 = message.data[5];
                 // byte_361=0x19; is to identify the packet number
                    byte_362 = message.data[6];
                    byte_363 = message.data[7];
                    break;
                    case 0x400: // CAN #44 // Take this ID for CAN loss for Charger
                    last_received_0x400 = xTaskGetTickCount();
                    byte_364 = message.data[0];
                    byte_365 = message.data[1];
                    byte_366 = message.data[2];
                    byte_367 = message.data[3];
                    byte_368 = message.data[4];
                    byte_369 = message.data[5];
                    byte_370 = message.data[6];
                    byte_371 = message.data[7];
                    break;
                case 0x411: // CAN #45
                    byte_372 = message.data[0];
                    byte_373 = message.data[1];
                    byte_374 = message.data[2];
                    byte_375 = message.data[3];
                    byte_376 = message.data[4];
                    byte_377 = message.data[5];
                    byte_378 = message.data[6];
                    byte_379 = message.data[7];
                    break;
                case 0x412: // CAN #46
                    byte_380 = message.data[0];
                 // byte_381=0x20 is to identify the packet number
                    byte_382 = message.data[1];
                    byte_383 = message.data[2];
                    byte_384 = message.data[3];
                    byte_385 = message.data[4];
                    byte_386 = message.data[5];
                    byte_387 = message.data[6];
                    byte_388 = message.data[7];
                    break;
                case 0x410: // CAN #47
                    byte_389 = message.data[0];
                    byte_390 = message.data[1];
                    byte_391 = message.data[2];
                    byte_392 = message.data[3];
                    byte_393 = message.data[4];
                    byte_394 = message.data[5];
                    byte_395 = message.data[6];
                    byte_396 = message.data[7];
                    break;
      
                default:
                    // ESP_LOGI("TWAI Receiver", "Unknown CAN ID: 0x%08" PRIx32, message.identifier);
                    break;
            }
        } else {
            // ESP_LOGE("TWAI Receiver", "Failed to receive message");
        }
        // After attempting to receive, check if we timed out on 0x01
        TickType_t current_time = xTaskGetTickCount();

        // For ID 0x01 // battery CAN loss
        if ((current_time - last_received_0x01) > TIMEOUT_0x01) {
            // CAN 0x1
            byte_128 = 0;
            byte_129 = 0;
            byte_130 = 0;
            byte_131 = 0;
            byte_132 = 0;
            byte_133 = 0;
            byte_134 = 0;
            byte_135 = 0;

            // CAN 0x2
            byte_187 = 0;
            byte_188 = 0;
            byte_189 = 0;
            byte_190 = 0;
            byte_191 = 0;
            byte_192 = 0;
            byte_193 = 0;
            byte_194 = 0;

            // CAN 0x3
            byte_145 = 0;
            byte_146 = 0;
            byte_147 = 0;
            byte_148 = 0;
            byte_149 = 0;
            byte_150 = 0;
            byte_151 = 0;
            byte_152 = 0;

            // CAN 0x4
            byte_153 = 0;
            byte_154 = 0;
            byte_155 = 0;
            byte_156 = 0;
            byte_157 = 0;
            byte_158 = 0;
            byte_159 = 0;
            byte_160 = 0;

            // CAN 0x5
            // byte_161=0x9; is to identify the packet number
            byte_162 = 0;
            byte_163 = 0;
            byte_164 = 0;
            byte_165 = 0;
            byte_166 = 0;
            byte_167 = 0;
            byte_168 = 0;
            byte_169 = 0;

            // CAN 0x6
            byte_170 = 0;
            byte_171 = 0;
            byte_172 = 0;
            byte_173 = 0;
            byte_174 = 0;
            byte_175 = 0;
            byte_176 = 0;
            byte_177 = 0;

            // CAN 0x8
            byte_178 = 0; // SOC
            byte_179 = 0; // SOH
            byte_180 = 0; // FetTemp
            // byte_181=0x10; is to identify the packet number
            byte_182 = 0; // SOCAh
            byte_183 = 0; // SOCAh
            byte_184 = 0; // SOCAh
            byte_185 = 0; // SOCAh
            byte_186 = 0;

            // CAN 0x7
            byte_136 = 0;
            byte_137 = 0;
            byte_138 = 0;
            byte_139 = 0;
            byte_140 = 0;
            // byte_141=0x8; is to identify the packet number
            byte_142 = 0;
            byte_143 = 0;
            byte_144 = 0;

            // CAN 0x9
            byte_195 = 0;
            byte_196 = 0;
            byte_197 = 0;
            byte_198 = 0;
            byte_199 = 0;
            byte_200 = 0;
            // byte_201=0x11; is to identify the packet number
            byte_202 = 0;
            byte_203 = 0;

            // CAN 0xA
            byte_204 = 0;
            byte_205 = 0;
            byte_206 = 0;
            byte_207 = 0;
            byte_208 = 0;
            byte_209 = 0;
            byte_210 = 0;
            byte_211 = 0;

            // CAN 0xC
            byte_212 = 0;
            byte_213 = 0;
            byte_214 = 0;
            byte_215 = 0;
            byte_216 = 0;
            byte_217 = 0;
            byte_218 = 0;
            byte_219 = 0;

            // CAN 0xD
            byte_111 = 0;
            byte_112 = 0;
            byte_113 = 0;
            byte_114 = 0;
            byte_115 = 0;
            byte_116 = 0;
            byte_117 = 0;
            byte_118 = 0;

            // CAN 0xE
            byte_229 = 0;
            byte_230 = 0;
            byte_231 = 0;
            byte_232 = 0;
            byte_233 = 0;
            byte_234 = 0;
            byte_235 = 0;
            byte_236 = 0;

            // CAN 0xF
            byte_237 = 0;
            byte_238 = 0;
            byte_239 = 0;
            byte_240 = 0;
            // byte_241=0x13; is to identify the packet number
            byte_242 = 0;
            byte_243 = 0;
            byte_244 = 0;
            byte_245 = 0;

            // CAN 0x10 
            byte_246 = 0;
            byte_247 = 0;
            byte_248 = 0;
            byte_249 = 0;
            byte_250 = 0;
            byte_251 = 0;
            byte_252 = 0;
            byte_253 = 0;

            // CAN 0x12
            byte_271 = 0;
            byte_272 = 0;
            byte_273 = 0;
            byte_274 = 0;
            byte_275 = 0;
            byte_276 = 0;
            byte_277 = 0;
            byte_278 = 0;

            // CAN 0x15
            byte_263 = 0;
            byte_264 = 0;
            byte_265 = 0;
            byte_266 = 0;
            byte_267 = 0;
            byte_268 = 0;
            byte_269 = 0;
            byte_270 = 0;

            // CAN 0xBB
            byte_254 = 0;
            byte_255 = 0;
            byte_256 = 0;
            byte_257 = 0;
            byte_258 = 0;
            byte_259 = 0;
            byte_260 = 0;
            // byte_261=0x14; is to identify the packet number
            byte_262 = 0;

            // CAN 0xBE
            byte_279 = 0;
            byte_280 = 0;
            // byte_281=0x15; is to identify the packet number
            byte_282 = 0;
            byte_283 = 0;
            byte_284 = 0;
            byte_285 = 0;
            byte_286 = 0;
            byte_287 = 0;

            // CAN 0xC3
            byte_288 = 0;
            byte_289 = 0;
            byte_290 = 0;
            byte_291 = 0;
            byte_292 = 0;
            byte_293 = 0;
            byte_294 = 0;
            byte_295 = 0;

            // CAN 0x601
            byte_296 = 0;
            byte_297 = 0;
            byte_298 = 0;
            byte_299 = 0;
            byte_300 = 0;
            // byte_301=0x16; is to identify the packet number
            byte_302 = 0;
            byte_303 = 0;
            byte_304 = 0;

            // CAN 0xB
            byte_305 = 0;
            byte_306 = 0;
            byte_307 = 0;
            byte_308 = 0;
            byte_309 = 0;
            byte_310 = 0;
            byte_311 = 0;
            byte_312 = 0;

            // CAN 0x18F20310
            byte_220 = 0;
         // byte_221=0x12; is to identify the packet number
            byte_222 = 0;
            byte_223 = 0;
            byte_224 = 0;
            byte_225 = 0;
            byte_226 = 0;
            byte_227 = 0;
            byte_228 = 0;

            // CAN 0x18F60001
            byte_103 = 0;
            byte_104 = 0;
            byte_105 = 0;
            byte_106 = 0;
            byte_107 = 0;
            byte_108 = 0;
            byte_109 = 0;
            byte_110 = 0;

            // ESP_LOGE("TWAI Receiver", "CAN ID 0x01 not received in last 400 ms!");
            // Optionally, do something else (set a flag, notify another task, etc.)
        }

        // For ID 0x18530902 // MCU CAN loss
        if ((current_time - last_received_0x18530902) > TIMEOUT_0x18530902) {
            // CAN 0x18530902
            byte_27 = 0;
            byte_28 = 0;
            byte_29 = 0;
            byte_30 = 0;
            byte_31 = 0;
            byte_32 = 0;
            byte_33 = 0;
            byte_34 = 0;

            // CAN 0x14520902
            // byte_01=0x1; is to identify the packet number
            byte_02 = 0;
            byte_03 = 0;
            byte_04 = 0;
            byte_05 = 0;
            byte_06 = 0;
            byte_07 = 0;
            byte_08 = 0;
            byte_09 = 0;

            // CAN 0x14520903
            byte_10 = 0;
            byte_11 = 0;
            byte_12 = 0;
            byte_13 = 0;
            byte_14 = 0;
            byte_15 = 0;
            byte_16 = 0;
            byte_17 = 0;

            // CAN 0x14520904
            byte_18 = 0;
            byte_19 = 0;
            byte_20 = 0;
         // byte_21=0x2; is to identify the packet number
            byte_22 = 0;
            byte_23 = 0;
            byte_24 = 0;
            byte_25 = 0;
            byte_26 = 0;

            // CAN 0x18530903
            byte_35 = 0; // MCU_Temperature
            byte_36 = 0; // MCU_Temperature
            byte_37 = 0; // Motor_Temperature
            byte_38 = 0; // MCU_Fault_Code
            byte_39 = 0; // MCU_ID
            byte_40 = 0; // MCU_ID
            // byte_41=0x3; is to identify the packet number
            byte_42 = 0;
            byte_43 = 0;

            // ESP_LOGE("TWAI Receiver", "CAN ID 0x18530902 not received in last 400 ms!");
        }

        // For ID 0x400 // Charger CAN loss
        if ((current_time - last_received_0x400) > TIMEOUT_0x400) {
            // CAN 0x400
            byte_364 = 0;
            byte_365 = 0;
            byte_366 = 0;
            byte_367 = 0;
            byte_368 = 0;
            byte_369 = 0;
            byte_370 = 0;
            byte_371 = 0;

            // CAN 0x401
            byte_330 = 0;
            byte_331 = 0;
            byte_332 = 0;
            byte_333 = 0;
            byte_334 = 0;
            byte_335 = 0;
            byte_336 = 0;
            byte_337 = 0;

            // CAN 0x401
            byte_330 = 0;
            byte_331 = 0;
            byte_332 = 0;
            byte_333 = 0;
            byte_334 = 0;
            byte_335 = 0;
            byte_336 = 0;
            byte_337 = 0;

            // CAN 0x402
            byte_355 = 0;
            byte_356 = 0;
            byte_357 = 0;
            byte_358 = 0;
            byte_359 = 0;
            byte_360 = 0;
            byte_362 = 0;
            byte_363 = 0;

            // CAN 0x403
            byte_347 = 0;
            byte_348 = 0;
            byte_349 = 0;
            byte_350 = 0;
            byte_351 = 0;
            byte_352 = 0;
            byte_353 = 0;
            byte_354 = 0;

            // CAN 0x405
            byte_338 = 0;
            byte_339 = 0;
            byte_340 = 0;
         // byte_341=0x18; is to identify the packet number
            byte_342 = 0;
            byte_343 = 0;
            byte_344 = 0;
            byte_345 = 0;
            byte_346 = 0;

            // CAN 0x411
            byte_372 = 0;
            byte_373 = 0;
            byte_374 = 0;
            byte_375 = 0;
            byte_376 = 0;
            byte_377 = 0;
            byte_378 = 0;
            byte_379 = 0;

            // CAN 0x412
            byte_380 = 0;
         // byte_381=0x20 is to identify the packet number
            byte_382 = 0;
            byte_383 = 0;
            byte_384 = 0;
            byte_385 = 0;
            byte_386 = 0;
            byte_387 = 0;
            byte_388 = 0;

            // CAN 0x410
            byte_389 = 0;
            byte_390 = 0;
            byte_391 = 0;
            byte_392 = 0;
            byte_393 = 0;
            byte_394 = 0;
            byte_395 = 0;
            byte_396 = 0;

            // ESP_LOGE("TWAI Receiver", "CAN ID 0x400 not received in last 400 ms!");
            // Optionally, do something else (set a flag, notify another task, etc.)
        }

        // For ID 0x18F20315 // Cluster CAN loss
        if ((current_time - last_received_0x18F20315) > TIMEOUT_0x18F20315) {
            // CAN 0x18F20315
            byte_86 = 0;
            byte_87 = 0;
            byte_88 = 0;
            byte_89 = 0;
            byte_90 = 0;
            byte_91 = 0;
            byte_92 = 0;
            byte_93 = 0;

            // CAN 0x18F20316
            byte_94 = 0;
            byte_95 = 0;
            byte_96 = 0;
            byte_97 = 0;
            byte_98 = 0;
            byte_99 = 0;
            byte_100 = 0;
         // byte_101=0x6; is to identify the packet number
            byte_102 = 0;
            // ESP_LOGE("TWAI Receiver", "CAN ID 0x18F20315 not received in last 400 ms!");
            // Optionally, do something else (set a flag, notify another task, etc.)
        }

        // Optional: A small delay to avoid spinning the CPU too hard
        // vTaskDelay(pdMS_TO_TICKS(10));
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
    twai_general_config_t g_config = TWAI_GENERAL_CONFIG_DEFAULT(GPIO_NUM_4, GPIO_NUM_5, TWAI_MODE_NORMAL);
    g_config.tx_io = GPIO_NUM_4;
    g_config.rx_io = GPIO_NUM_5;

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