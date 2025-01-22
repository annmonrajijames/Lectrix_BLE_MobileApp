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

#include "sdkconfig.h"
#include <time.h>
#include <stdbool.h>

#include "driver/twai.h"

#include <inttypes.h>

#define GATTS_TAG "GATTS_DEMO"

// Declare the static function
static void gatts_profile_a_event_handler(esp_gatts_cb_event_t event, esp_gatt_if_t gatts_if, esp_ble_gatts_cb_param_t *param);

#define GATTS_SERVICE_UUID_TEST_A   0x00FF 
#define GATTS_CHAR_UUID_TEST_A      0xFF01 
#define GATTS_DESCR_UUID_TEST_A     0x3333
#define GATTS_NUM_HANDLE_TEST_A     4

#define TEST_DEVICE_NAME            "Annmon_LECTRIX" 
#define TEST_MANUFACTURER_DATA_LEN  17

#define GATTS_DEMO_CHAR_VAL_LEN_MAX 0x40

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

// Global variables
static bool notify_enabled = false;
static TaskHandle_t notify_task_handle = NULL;
static esp_gatt_if_t global_gatts_if = ESP_GATT_IF_NONE; // Default to an invalid value

static void gap_event_handler(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param)
{
    // ESP_LOGI(GATTS_TAG, "GAP event handler event: %d", event);
    switch (event) {
    case ESP_GAP_BLE_ADV_DATA_SET_COMPLETE_EVT:
        adv_config_done &= (~adv_config_flag);
        if (adv_config_done == 0){
            esp_ble_gap_start_advertising(&adv_params);
            // ESP_LOGI(GATTS_TAG, "Starting advertising.");
        }
        break;
    case ESP_GAP_BLE_SCAN_RSP_DATA_SET_COMPLETE_EVT:
        adv_config_done &= (~scan_rsp_config_flag);
        if (adv_config_done == 0){
            esp_ble_gap_start_advertising(&adv_params);
            // ESP_LOGI(GATTS_TAG, "Scan response set, starting advertising.");
        }
        break;
    case ESP_GAP_BLE_ADV_START_COMPLETE_EVT:
        if (param->adv_start_cmpl.status != ESP_BT_STATUS_SUCCESS) {
            // ESP_LOGE(GATTS_TAG, "Advertising start failed: %d", param->adv_start_cmpl.status);
        } else {
            // ESP_LOGI(GATTS_TAG, "Advertising started successfully.");
        }
        break;
    case ESP_GAP_BLE_ADV_STOP_COMPLETE_EVT:
        if (param->adv_stop_cmpl.status != ESP_BT_STATUS_SUCCESS) {
            // ESP_LOGE(GATTS_TAG, "Advertising stop failed: %d", param->adv_stop_cmpl.status);
        } else {
            // ESP_LOGI(GATTS_TAG, "Advertising stopped successfully.");
        }
        break;
    case ESP_GAP_BLE_UPDATE_CONN_PARAMS_EVT:
        // ESP_LOGI(GATTS_TAG, "Connection parameters updated: min_int=%d, max_int=%d, conn_int=%d, latency=%d, timeout=%d",
        //          param->update_conn_params.min_int, param->update_conn_params.max_int,
        //          param->update_conn_params.conn_int, param->update_conn_params.latency,
        //          param->update_conn_params.timeout);
        break;
    case ESP_GAP_BLE_SET_PKT_LENGTH_COMPLETE_EVT:
        // ESP_LOGI(GATTS_TAG, "Packet length set complete: rx=%d, tx=%d, status=%d",
        //          param->pkt_data_length_cmpl.params.rx_len, param->pkt_data_length_cmpl.params.tx_len,
        //          param->pkt_data_length_cmpl.status);
        break;
    default:
        // ESP_LOGI(GATTS_TAG, "Unhandled GAP event: %d", event);
        break;
    }
}

void example_write_event_env(esp_gatt_if_t gatts_if, prepare_type_env_t *prepare_write_env, esp_ble_gatts_cb_param_t *param){
    // ESP_LOGI(GATTS_TAG, "Handling GATT write event: need_rsp=%d, is_prep=%d, offset=%d, len=%d",
    //          param->write.need_rsp, param->write.is_prep, param->write.offset, param->write.len);

    // Log the actual data written
    // ESP_LOGI(GATTS_TAG, "Data written:");
    esp_log_buffer_hex(GATTS_TAG, param->write.value, param->write.len);  // Log data in hexadecimal format

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
        // ESP_LOGI(GATTS_TAG, "Executing write with buffer length: %d", prepare_write_env->prepare_len);
        esp_log_buffer_hex(GATTS_TAG, prepare_write_env->prepare_buf, prepare_write_env->prepare_len);
    } else {
        // ESP_LOGI(GATTS_TAG, "Prepared write cancelled.");
    }
    if (prepare_write_env->prepare_buf) {
        free(prepare_write_env->prepare_buf);
        prepare_write_env->prepare_buf = NULL;
    }
    prepare_write_env->prepare_len = 0;
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
    }

    notify_task_handle = NULL;
    vTaskDelete(NULL);
}

static void gatts_profile_a_event_handler(esp_gatts_cb_event_t event, esp_gatt_if_t gatts_if, esp_ble_gatts_cb_param_t *param) {
    // ESP_LOGI(GATTS_TAG, "Profile A Event Handler: Event = %d", event);
    switch (event) {
    case ESP_GATTS_REG_EVT:
        // ESP_LOGI(GATTS_TAG, "ESP_GATTS_REG_EVT= %d", ESP_GATTS_REG_EVT);
        // ESP_LOGI(GATTS_TAG, "REGISTER_APP_EVT, status %d, app_id %d", param->reg.status, param->reg.app_id);
        global_gatts_if = gatts_if; // Store the interface ID
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
    // Modify the ESP_GATTS_WRITE_EVT case
    case ESP_GATTS_WRITE_EVT:
        // ESP_LOGI(GATTS_TAG, "GATT_WRITE_EVT, conn_id %d, trans_id %" PRIu32 ", handle %d, is_prep %d, need_rsp %d",
        //         param->write.conn_id, param->write.trans_id, param->write.handle, param->write.is_prep, param->write.need_rsp);
        if (!param->write.is_prep){
            uint16_t descr_value = param->write.value[1] << 8 | param->write.value[0];
            if (gl_profile_tab[PROFILE_A_APP_ID].descr_handle == param->write.handle && param->write.len == 2){
                if (descr_value == 0x0001) { // Notification enabled
                    notify_enabled = true;
                    if (notify_task_handle == NULL) {
                        xTaskCreate(notification_task, "notify_task", 2048, NULL, 10, &notify_task_handle);
                    }
                    // printf("DC %x",byte_01);
                } else if (descr_value == 0x0000) { // Notification disabled
                    notify_enabled = false;
                }
            }
        }
        example_write_event_env(gatts_if, &a_prepare_write_env, param);
        break;

    case ESP_GATTS_EXEC_WRITE_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_EXEC_WRITE_EVT= %d", ESP_GATTS_EXEC_WRITE_EVT);
        ESP_LOGI(GATTS_TAG, "Execute write event.");
        esp_ble_gatts_send_response(gatts_if, param->write.conn_id, param->write.trans_id, ESP_GATT_OK, NULL);
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
        ESP_LOGE(GATTS_TAG, "Unhandled event %d", event);
        break;
    }
}

static void twai_receive_task(void *arg) {
    ESP_LOGI("TWAI Receiver", "Starting TWAI receive task");
    twai_message_t message;

    static TickType_t last_received_0x08 = 0;
    static TickType_t last_received_0x0C = 0;

    // Initialize last-received timestamps to "now"
    TickType_t now = xTaskGetTickCount();
    last_received_0x08 = now;
    last_received_0x0C = now;

    // Define your timeouts in ticks (e.g., 300 ms => 300 ms worth of ticks)
    const TickType_t TIMEOUT_0x08 = pdMS_TO_TICKS(400);
    const TickType_t TIMEOUT_0x0C = pdMS_TO_TICKS(400);

    while (1) {
        // Wait up to 50 ms for ANY message
        if (twai_receive(&message, pdMS_TO_TICKS(400)) == ESP_OK) {
            ESP_LOGI("TWAI Receiver", "CAN ID : 0x%08" PRIx32, message.identifier);
            while (twai_receive(&message, 0) == ESP_OK) {
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
                case 0x18530902: // CAN #4
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
                case 0x19A: // CAN #6
                    byte_44 = message.data[0];
                    byte_45 = message.data[1];
                    byte_46 = message.data[2];
                    byte_47 = message.data[3];
                    byte_48 = message.data[4];
                    byte_49 = message.data[5];
                    byte_50 = message.data[6];
                    byte_51 = message.data[7];
                    break;
                case 0x18F20309: // CAN #7
                    byte_52 = message.data[0];
                    byte_53 = message.data[1];
                    byte_54 = message.data[2];
                    byte_55 = message.data[3];
                    byte_56 = message.data[4];
                    byte_57 = message.data[5];
                    byte_58 = message.data[6];
                    byte_59 = message.data[7];
                    break;
                case 0x18F20311: // CAN #8
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
                case 0x18F20312: // CAN #9
                    byte_69 = message.data[0];
                    byte_70 = message.data[1];
                    byte_71 = message.data[2];
                    byte_72 = message.data[3];
                    byte_73 = message.data[4];
                    byte_74 = message.data[5];
                    byte_75 = message.data[6];
                    byte_76 = message.data[7];
                    break;
                case 0x18F20313: // CAN #10
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
                case 0x18F20315: // CAN #11
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
                case 0x18F60101: // CAN #13
                    byte_103 = message.data[0];
                    byte_104 = message.data[1];
                    byte_105 = message.data[2];
                    byte_106 = message.data[3];
                    byte_107 = message.data[4];
                    byte_108 = message.data[5];
                    byte_109 = message.data[6];
                    byte_110 = message.data[7];
                    break;
                case 0xD: // CAN #14
                    byte_111 = message.data[0];
                    byte_112 = message.data[1];
                    byte_113 = message.data[2];
                    byte_114 = message.data[3];
                    byte_115 = message.data[4];
                    byte_116 = message.data[5];
                    byte_117 = message.data[6];
                    byte_118 = message.data[7];
                    break;
                case 0x18F20314: // CAN #15
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
                case 0x1: // CAN #16
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
                    last_received_0x08 = xTaskGetTickCount();
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
                    last_received_0x0C = xTaskGetTickCount();
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
                case 0x712: // CAN #38
                    byte_313 = message.data[0];
                    byte_314 = message.data[1];
                    byte_315 = message.data[2];
                    byte_316 = message.data[3];
                    byte_317 = message.data[4];
                    byte_318 = message.data[5];
                    byte_319 = message.data[6];
                    byte_320 = message.data[7];
                    break;
                case 0x713: // CAN #39
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
                case 0x400: // CAN #44
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
                    ESP_LOGI("TWAI Receiver", "Unknown CAN ID: 0x%08" PRIx32, message.identifier);
                    break;
            }
            }
        } else {
            ESP_LOGE("TWAI Receiver", "Failed to receive message");
        }

        // After attempting to receive, check if we timed out on 0x08
        TickType_t current_time = xTaskGetTickCount();

        // For ID 0x08
        if ((current_time - last_received_0x08) > TIMEOUT_0x08) {
            byte_178 = 0; // SOC
            byte_179 = 0; // SOH
            byte_180 = 0; // FetTemp
            // byte_181=0x10; is to identify the packet number
            byte_182 = 0; // SOCAh
            byte_183 = 0; // SOCAh
            byte_184 = 0; // SOCAh
            byte_185 = 0; // SOCAh
            byte_186 = 0;
            ESP_LOGE("TWAI Receiver", "CAN ID 0x08 not received in last 400 ms!");
            // Optionally, do something else (set a flag, notify another task, etc.)
        }

        // For ID 0x0C
        if ((current_time - last_received_0x0C) > TIMEOUT_0x0C) {
            ESP_LOGE("TWAI Receiver", "CAN ID 0x0C not received in last 400 ms!");
        }

        // Optional: A small delay to avoid spinning the CPU too hard
        // vTaskDelay(pdMS_TO_TICKS(10));
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

void app_main(void)
{
    ESP_ERROR_CHECK(twai_driver_install(&g_config, &t_config, &f_config));
    // ESP_LOGI("TWAI", "Driver installed");
    ESP_ERROR_CHECK(twai_start());
    // ESP_LOGI("TWAI", "Driver started");

    srand(time(NULL)); // Seed the random number generator
    xTaskCreate(twai_receive_task, "twai_receive_task", 2048, NULL, 5, NULL);
    xTaskCreate(notification_task, "notification_task", 2048, NULL, 10, NULL);
    esp_err_t ret;

    // Initialize NVS.
    ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK( ret );

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
    if (ret){
        ESP_LOGE(GATTS_TAG, "gatts register error, error code = %x", ret);
        return;
    }
    ret = esp_ble_gap_register_callback(gap_event_handler);
    if (ret){
        ESP_LOGE(GATTS_TAG, "gap register error, error code = %x", ret);
        return;
    }
    ret = esp_ble_gatts_app_register(PROFILE_A_APP_ID);
    if (ret){
        ESP_LOGE(GATTS_TAG, "gatts app register error, error code = %x", ret);
        return;
    }
    esp_err_t local_mtu_ret = esp_ble_gatt_set_local_mtu(500);
    if (local_mtu_ret){
        ESP_LOGE(GATTS_TAG, "set local MTU failed, error code = %x", local_mtu_ret);
    }

    return;
}
