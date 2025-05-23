/*
 * SPDX-FileCopyrightText: 2021-2024 Espressif Systems (Shanghai) CO LTD
 *
 * SPDX-License-Identifier: CC0-1.0
 */

#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_lcd_panel_io.h"
#include "esp_lcd_panel_ops.h"
#include "esp_err.h"
#include "esp_log.h"
#include "driver/i2c_master.h"
#include "esp_lvgl_port.h"
#include "lvgl.h"
#include "driver/twai.h"
#include "driver/gpio.h"

#if CONFIG_EXAMPLE_LCD_CONTROLLER_SH1107
#include "esp_lcd_sh1107.h"
#else
#include "esp_lcd_panel_vendor.h"
#endif

static const char *TAG = "example";

#define I2C_BUS_PORT  0

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////// Please update the following configuration according to your LCD spec //////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
#define EXAMPLE_LCD_PIXEL_CLOCK_HZ    (400 * 1000)
#define EXAMPLE_PIN_NUM_SDA           21
#define EXAMPLE_PIN_NUM_SCL           22
#define EXAMPLE_PIN_NUM_RST           -1
#define EXAMPLE_I2C_HW_ADDR           0x3C
#define BUTTON_GPIO                  12

// The pixel number in horizontal and vertical
#if CONFIG_EXAMPLE_LCD_CONTROLLER_SSD1306
#define EXAMPLE_LCD_H_RES              128
#define EXAMPLE_LCD_V_RES              64
#elif CONFIG_EXAMPLE_LCD_CONTROLLER_SH1107
#define EXAMPLE_LCD_H_RES              64
#define EXAMPLE_LCD_V_RES              128
#endif
// Bit number used to represent command and parameter
#define EXAMPLE_LCD_CMD_BITS           8
#define EXAMPLE_LCD_PARAM_BITS         8

#define RX_TASK_PRIO                 9
#define TX_GPIO_NUM                 4
#define RX_GPIO_NUM                 5
#define TWAI_TAG                    "TWAI"

#define ID_BATTERY_SOC              0x8
#define ID_BATTERY_TEMP             0x07
#define ID_MCU_MOTOR_TEMP           0x18530903
#define ID_CLUSTER_FW               0x18F20315
#define ID_BATTERY_FW               0x0D
#define ID_BATTERY_FW2              0x15
#define ID_CHARGER_INFO             0x412
#define ID_BATTERY_ERRORS           0x09

volatile int screen_index = 0;
volatile int total_screens;
int error_count = 0;

static SemaphoreHandle_t rx_sem;
 
// CAN values
static int SOC_3 = 0;
static int SOH_3 = 0;
static char mcu_fw_version[9] = {0};
static int battery_temp_max = 0;
static int battery_temp_min = 0;
static int mcu_temp = 0;
static int motor_temp = 0;
// Cluster Firmware Version Info
static int cluster_sw_maj = 0;       // byte 4 - decimal
static uint8_t cluster_sw_min = 0;   // byte 5 - hex
static int cluster_hw_maj = 0;       // byte 6 - decimal
static uint8_t cluster_hw_min = 0;   // byte 7 - hex
static uint8_t battery_HwVer[3] = {0};             // 3 bytes
static char battery_HwVer_ascii[4] = {0};          // 3 chars + null terminator

static uint8_t battery_FwVer[3] = {0};             // 3 bytes
static char battery_FwVer_ascii[4] = {0};          // 3 chars + null terminator

static uint8_t battery_FW_SubVer[2] = {0};         // 2 bytes
static char battery_FW_SubVer_ascii[3] = {0};      // 2 chars + null terminator

static uint8_t battery_ConfigVer[3] = {0};             // 3 bytes
static char battery_ConfigVer_ascii[4] = {0};          // 3 chars + null terminator

static uint8_t battery_InternalFWVer[3] = {0};             // 3 bytes
static char battery_InternalFWVer_ascii[4] = {0};          // 3 chars + null terminator

static uint8_t battery_InternalFWSubVer_SubVer[2] = {0};         // 2 bytes
static char battery_InternalFWSubVer_SubVer_ascii[3] = {0};      // 2 chars + null terminator

static char charger_hw_ver_maj = 0;       // Byte 1 - ASCII
static int charger_hw_ver_min = 0;        // Byte 2 - Decimal
static char charger_sw_ver_maj = 0;       // Byte 3 - ASCII
static int charger_sw_ver_min = 0;        // Byte 4 - Decimal

static bool drive_error_flags[11] = {false}; // 0-10 for the listed faults
// static lv_obj_t *battery_container = NULL;
// static lv_obj_t *battery_bar = NULL;
// static lv_obj_t *battery_label = NULL;

uint8_t cell_under_voltage_protection;
uint8_t cell_over_voltage_protection;
uint8_t pack_under_voltage_protection;
uint8_t pack_over_voltage_protection;
uint8_t charge_under_temp_protection;
uint8_t charge_over_temp_protection;
uint8_t discharge_under_temp_protection;
uint8_t discharge_over_temp_protection;

uint8_t cell_over_deviation_protection;
uint8_t low_soc_warning;
uint8_t charge_over_current_protection;
uint8_t discharge_over_current_protection;
uint8_t cell_under_voltage_warning;
uint8_t cell_over_voltage_warning;
uint8_t fet_temp_protection;
uint8_t reserved_soc_protection;

uint8_t fet_failure;
uint8_t temp_sensor_fault;
uint8_t pack_under_voltage_warning;
uint8_t pack_over_voltage_warning;
uint8_t charge_under_temp_warning;
uint8_t charge_over_temp_warning;
uint8_t discharge_under_temp_warning;

uint8_t pre_charge_fet_status;
uint8_t charge_fet_status;
uint8_t discharge_fet_status;
uint8_t reserved_status;
uint8_t discharge_peak_protection;
uint8_t short_circuit_protection;

static const twai_filter_config_t f_config = TWAI_FILTER_CONFIG_ACCEPT_ALL();
static const twai_timing_config_t t_config = TWAI_TIMING_CONFIG_500KBITS();
static const twai_general_config_t g_config = {
    .mode = TWAI_MODE_LISTEN_ONLY,
    .tx_io = TX_GPIO_NUM,
    .rx_io = RX_GPIO_NUM,
    .clkout_io = TWAI_IO_UNUSED,
    .bus_off_io = TWAI_IO_UNUSED,
    .tx_queue_len = 0,
    .rx_queue_len = 5,
    .alerts_enabled = TWAI_ALERT_NONE,
    .clkout_divider = 0
};
 
void IRAM_ATTR button_isr_handler(void* arg) {
    screen_index = (screen_index + 1) % (7+error_count); // 6 fixed screens + dynamic error pages
}

static void twai_receive_task(void *arg) {
    xSemaphoreTake(rx_sem, portMAX_DELAY);
    ESP_LOGI(TWAI_TAG, "TWAI Receiving...");

    while (1) {
        twai_message_t message;
        if (twai_receive(&message, pdMS_TO_TICKS(250)) == ESP_OK && !(message.rtr)) {
            switch (message.identifier) {
                case ID_BATTERY_SOC: {
                    uint32_t soc_raw = (message.data[1] << 8) | message.data[0];
                    SOC_3 = *((int*)&soc_raw);
                    SOH_3 = message.data[5];
                    break;
                }
                case 0x18FF3002: {
                    for (int i = 0; i < 8; i++) {
                        mcu_fw_version[i] = (char)message.data[i];
                    }
                    mcu_fw_version[8] = '\0';
                    break;
                }
                case ID_BATTERY_TEMP: {
                    battery_temp_max = message.data[2];
                    battery_temp_min = message.data[3];
                    break;
                }
                case ID_MCU_MOTOR_TEMP: {
                    mcu_temp = (message.data[1] << 8) | message.data[0];
                    motor_temp = message.data[2];
                    break;
                }
                case ID_CLUSTER_FW: {
                cluster_sw_maj = message.data[4];
                cluster_sw_min = message.data[5];
                cluster_hw_maj = message.data[6];
                cluster_hw_min = message.data[7];
                break;
                }
                case ID_BATTERY_FW: {
                // HW Ver
                battery_HwVer[0] = message.data[0];
                battery_HwVer[1] = message.data[1];
                battery_HwVer[2] = message.data[2];
                battery_HwVer_ascii[0] = (char)battery_HwVer[0];
                battery_HwVer_ascii[1] = (char)battery_HwVer[1];
                battery_HwVer_ascii[2] = (char)battery_HwVer[2];
                battery_HwVer_ascii[3] = '\0';
            
                // FW Ver
                battery_FwVer[0] = message.data[3];
                battery_FwVer[1] = message.data[4];
                battery_FwVer[2] = message.data[5];
                battery_FwVer_ascii[0] = (char)battery_FwVer[0];
                battery_FwVer_ascii[1] = (char)battery_FwVer[1];
                battery_FwVer_ascii[2] = (char)battery_FwVer[2];
                battery_FwVer_ascii[3] = '\0';
            
                // FW SubVer
                battery_FW_SubVer[0] = message.data[6];
                battery_FW_SubVer[1] = message.data[7];
                battery_FW_SubVer_ascii[0] = (char)battery_FW_SubVer[0];
                battery_FW_SubVer_ascii[1] = (char)battery_FW_SubVer[1];
                battery_FW_SubVer_ascii[2] = '\0';
            
                break;
            }
            case ID_BATTERY_FW2: {
                // Config Ver
                battery_ConfigVer[0] = message.data[0];
                battery_ConfigVer[1] = message.data[1];
                battery_ConfigVer[2] = message.data[2];
                battery_ConfigVer_ascii[0] = (char)battery_ConfigVer[0];
                battery_ConfigVer_ascii[1] = (char)battery_ConfigVer[1];
                battery_ConfigVer_ascii[2] = (char)battery_ConfigVer[2];
                battery_ConfigVer_ascii[3] = '\0';
            
                // Internal FW Ver
                battery_InternalFWVer[0] = message.data[3];
                battery_InternalFWVer[1] = message.data[4];
                battery_InternalFWVer[2] = message.data[5];
                battery_InternalFWVer_ascii[0] = (char)battery_InternalFWVer[0];
                battery_InternalFWVer_ascii[1] = (char)battery_InternalFWVer[1];
                battery_InternalFWVer_ascii[2] = (char)battery_InternalFWVer[2];
                battery_InternalFWVer_ascii[3] = '\0';
            
                // Internal FW Sub Ver
                battery_InternalFWSubVer_SubVer[0] = message.data[6];
                battery_InternalFWSubVer_SubVer[1] = message.data[7];
                battery_InternalFWSubVer_SubVer_ascii[0] = (char)battery_InternalFWSubVer_SubVer[0];
                battery_InternalFWSubVer_SubVer_ascii[1] = (char)battery_InternalFWSubVer_SubVer[1];
                battery_InternalFWSubVer_SubVer_ascii[2] = '\0';
            
                break;
            }

            case ID_CHARGER_INFO: {
                charger_hw_ver_maj = (char)message.data[0];    // Byte 1
                charger_hw_ver_min = message.data[1];          // Byte 2
                charger_sw_ver_maj = (char)message.data[2];    // Byte 3
                charger_sw_ver_min = message.data[3];          // Byte 4
                break;
            }
            case 0x18530902: {
                uint8_t byte2 = message.data[2];
                uint8_t byte4 = message.data[4];
                uint8_t byte5 = message.data[5];
            
                drive_error_flags[0] = byte2 & (1 << 0);
                drive_error_flags[1] = byte2 & (1 << 1);
                drive_error_flags[2] = byte2 & (1 << 2);
                drive_error_flags[3] = byte2 & (1 << 3);
                drive_error_flags[4] = byte2 & (1 << 4);
                drive_error_flags[5] = byte2 & (1 << 5);
                drive_error_flags[6] = byte2 & (1 << 6);
                drive_error_flags[7] = byte4 & (1 << 0);
                drive_error_flags[8] = byte4 & (1 << 1);
                drive_error_flags[9] = byte4 & (1 << 2);
                drive_error_flags[10] = byte5 > 0; // if any value
            
                break;
            } 
            case ID_BATTERY_ERRORS: {
                uint8_t b0 = message.data[0];
                uint8_t b1 = message.data[1];
                uint8_t b2 = message.data[2];
                uint8_t b7 = message.data[7];

                // Byte 0
                cell_under_voltage_protection  = (b0 >> 0) & 0x01;
                cell_over_voltage_protection   = (b0 >> 1) & 0x01;
                pack_under_voltage_protection  = (b0 >> 2) & 0x01;
                pack_over_voltage_protection   = (b0 >> 3) & 0x01;
                charge_under_temp_protection   = (b0 >> 4) & 0x01;
                charge_over_temp_protection    = (b0 >> 5) & 0x01;
                discharge_under_temp_protection= (b0 >> 6) & 0x01;
                discharge_over_temp_protection = (b0 >> 7) & 0x01;

                // Byte 1
                cell_over_deviation_protection = (b1 >> 0) & 0x01;
                low_soc_warning                = (b1 >> 1) & 0x01;
                charge_over_current_protection = (b1 >> 2) & 0x01;
                discharge_over_current_protection = (b1 >> 3) & 0x01;
                cell_under_voltage_warning     = (b1 >> 4) & 0x01;
                cell_over_voltage_warning      = (b1 >> 5) & 0x01;
                fet_temp_protection            = (b1 >> 6) & 0x01;
                reserved_soc_protection        = (b1 >> 7) & 0x01;

                // Byte 2
                fet_failure                    = (b2 >> 0) & 0x01;
                temp_sensor_fault              = (b2 >> 1) & 0x01;
                pack_under_voltage_warning     = (b2 >> 2) & 0x01;
                pack_over_voltage_warning      = (b2 >> 3) & 0x01;
                charge_under_temp_warning      = (b2 >> 4) & 0x01;
                charge_over_temp_warning       = (b2 >> 5) & 0x01;
                discharge_under_temp_warning   = (b2 >> 6) & 0x01;
                // Bit 7 of b2 is possibly reserved or duplicate

                // Byte 7
                pre_charge_fet_status          = (b7 >> 0) & 0x01;
                charge_fet_status              = (b7 >> 1) & 0x01;
                discharge_fet_status           = (b7 >> 2) & 0x01;
                reserved_status                = (b7 >> 3) & 0x01;
                discharge_peak_protection      = (b7 >> 6) & 0x01;
                short_circuit_protection       = (b7 >> 7) & 0x01;
                break;
            }
            default: break;
            }
        }
    }

    xSemaphoreGive(rx_sem);
    vTaskDelete(NULL);
}

void draw_battery_status(lv_obj_t *parent) {
    // Create a compact container for the battery symbol
    lv_obj_t *battery_cont = lv_obj_create(parent);
    lv_obj_set_size(battery_cont, 40, 16);
    lv_obj_align(battery_cont, LV_ALIGN_TOP_RIGHT, -5, 5);
    lv_obj_clear_flag(battery_cont, LV_OBJ_FLAG_CLICKABLE);  // Prevent blocking touches
    lv_obj_set_style_radius(battery_cont, 2, 0);
    lv_obj_set_style_border_width(battery_cont, 2, 0);
    lv_obj_set_style_border_color(battery_cont, lv_color_white(), 0);
    lv_obj_set_style_bg_color(battery_cont, lv_color_black(), 0);

    // Create a small SOC bar inside
    lv_obj_t *soc_fill = lv_bar_create(battery_cont);
    lv_obj_set_size(soc_fill, 28, 6);
    lv_obj_align(soc_fill, LV_ALIGN_CENTER, 0, -2);
    lv_bar_set_range(soc_fill, 0, 100);
    lv_bar_set_value(soc_fill, SOC_3, LV_ANIM_OFF);
    lv_obj_clear_flag(soc_fill, LV_OBJ_FLAG_CLICKABLE);

    // Add compact SOC text below
    char soc_txt[8];
    sprintf(soc_txt, "%d%%", SOC_3);
    lv_obj_t *label = lv_label_create(battery_cont);
    lv_label_set_text(label, soc_txt);
    // lv_obj_set_style_text_font(label, &lv_font_montserrat_10, 0);  // Smaller font
    lv_obj_align(label, LV_ALIGN_BOTTOM_MID, 0, -1);
    lv_obj_clear_flag(label, LV_OBJ_FLAG_CLICKABLE);
}

 
void show_soc_page(lv_disp_t *disp) {
    char text[64];
    lv_obj_clean(lv_scr_act());
    lv_obj_t *label = lv_label_create(lv_scr_act());
    sprintf(text, "SOC: %d%%\nSOH: %d%%", SOC_3, SOH_3);
    lv_label_set_text(label, text);
    lv_obj_align(label, LV_ALIGN_CENTER, 0, 0);
    // draw_battery_status(lv_scr_act());
}
 
void show_mcu_fw_page(lv_disp_t *disp) {
    lv_obj_clean(lv_scr_act());
    lv_obj_t *label = lv_label_create(lv_scr_act());
    lv_label_set_text_fmt(label, "McuFwID: %s\nBatHW: %s\nBatFW: %s\nBatFWSubVer: %s",
    mcu_fw_version,
    battery_HwVer_ascii,
    battery_FwVer_ascii,
    battery_FW_SubVer_ascii);
    // lv_obj_set_style_text_font(label, &lv_font_montserrat_12, 0);
    lv_obj_align(label, LV_ALIGN_CENTER, 0, 0);
    // draw_battery_status(lv_scr_act());
}
 
void show_battery_temp_page(lv_disp_t *disp) {
    char text[128];
    lv_obj_clean(lv_scr_act());
    lv_obj_t *label = lv_label_create(lv_scr_act());
    snprintf(text, sizeof(text),
        "BattTempMax: %d°C\nBattTempMin: %d°C\nMCU Temp: %d°C\nMotor Temp: %d°C",
        battery_temp_max, battery_temp_min, mcu_temp, motor_temp);
    lv_label_set_text(label, text);
    lv_obj_align(label, LV_ALIGN_CENTER, 0, 0);
    // draw_battery_status(lv_scr_act());
}
void show_cluster_fw_page(lv_disp_t *disp) {
    char text[128];
    lv_obj_clean(lv_scr_act());
    lv_obj_t *label = lv_label_create(lv_scr_act());
    snprintf(text, sizeof(text),
                "VCU_SW_Maj: %d\n"
                "VCU_SW_Min: 0x%02X\n"
                "VCU_HW_Maj: %d\n"
                "VCU_HW_Min: 0x%02X",
                cluster_sw_maj, cluster_sw_min,
                cluster_hw_maj, cluster_hw_min);
    lv_label_set_text(label, text);
    lv_obj_align(label, LV_ALIGN_CENTER, 0, 0);
    // draw_battery_status(lv_scr_act());
}

void show_battery_fw_page(lv_disp_t *disp) {
    char text[128];
    lv_obj_clean(lv_scr_act());
    lv_obj_t *label = lv_label_create(lv_scr_act());
    snprintf(text, sizeof(text),
             "BatConfigVer: %s\n"
             "BatInFWVer: %s\n"
             "BatInFWSubVer: %s",
             battery_ConfigVer_ascii,
             battery_InternalFWVer_ascii,
             battery_InternalFWSubVer_SubVer_ascii);
    lv_label_set_text(label, text);
    lv_obj_align(label, LV_ALIGN_CENTER, 0, 0);
    // draw_battery_status(lv_scr_act());
}
void show_charger_page(lv_disp_t *disp) {
    char text[128];
    lv_obj_clean(lv_scr_act());
    lv_obj_t *label = lv_label_create(lv_scr_act());
    snprintf(text, sizeof(text),
            "ChrHWVerMAJ: %d\n"
            "ChrHW Ver MIN: %d\n"
            "ChrSW Ver MAJ: %d\n"
            "ChrSW Ver MIN: %d",
            charger_hw_ver_maj,
            charger_hw_ver_min,
            charger_sw_ver_maj,
            charger_sw_ver_min);
    lv_label_set_text(label, text);
    lv_obj_align(label, LV_ALIGN_CENTER, 0, 0);
    // draw_battery_status(lv_scr_act());
}
void show_drive_errors() {
    int error_count = 0;
    int y = 0;

    // Step 1: Count drive errors
    for (int i = 0; i < 11; i++) {
        if (drive_error_flags[i]) error_count++;
    }

    // Step 2: Count BMS errors
    struct {
        const char *label;
        uint8_t flag;
    } bms_errors[] = {
        {"Cell Under Voltage Protection", cell_under_voltage_protection},
        {"Cell Over Voltage Protection", cell_over_voltage_protection},
        {"Pack Under Voltage Protection", pack_under_voltage_protection},
        {"Pack Over Voltage Protection", pack_over_voltage_protection},
        {"Charge Under Temp Protection", charge_under_temp_protection},
        {"Charge Over Temp Protection", charge_over_temp_protection},
        {"Discharge Under Temp Protection", discharge_under_temp_protection},
        {"Discharge Over Temp Protection", discharge_over_temp_protection},
        {"Cell Over Deviation Protection", cell_over_deviation_protection},
        {"Low SOC Warning", low_soc_warning},
        {"Charge Over Current Protection", charge_over_current_protection},
        {"Discharge Over Current Protection", discharge_over_current_protection},
        {"Cell Under Voltage Warning", cell_under_voltage_warning},
        {"Cell Over Voltage Warning", cell_over_voltage_warning},
        {"FET Temp Protection", fet_temp_protection},
        {"Reserved SOC Protection", reserved_soc_protection},
        {"FET Failure", fet_failure},
        {"Temp Sensor Fault", temp_sensor_fault},
        {"Pack Under Voltage Warning", pack_under_voltage_warning},
        {"Pack Over Voltage Warning", pack_over_voltage_warning},
        {"Charge Under Temp Warning", charge_under_temp_warning},
        {"Charge Over Temp Warning", charge_over_temp_warning},
        {"Discharge Under Temp Warning", discharge_under_temp_warning},
        {"Pre-charge FET Status", pre_charge_fet_status},
        // {"Charge FET Status", charge_fet_status},
        // {"Discharge FET Status", discharge_fet_status},
        {"Reserved Status", reserved_status},
        {"Discharge Peak Protection", discharge_peak_protection},
        {"Short Circuit Protection", short_circuit_protection}
    };

    for (int i = 0; i < sizeof(bms_errors) / sizeof(bms_errors[0]); i++) {
        if (bms_errors[i].flag) error_count++;
    }

    // Step 3: Create screen and scrollable container
    lv_obj_t *screen;
    lv_obj_t *container;

    if (error_count > 4) {
        screen = lv_obj_create(NULL);  // new blank screen
        lv_scr_load(screen);           // load the new screen

        // Use the screen directly as the container without scrollable functionality
        container = screen;
        error_count++; // increment error count for the scrollable container
    } else {
        screen = lv_scr_act();        // current screen
        lv_obj_clean(screen);         // clear old labels
        container = screen;           // use screen directly
    }

    // Step 4: Add header
    lv_obj_t *heading = lv_label_create(container);
    lv_label_set_text(heading, "Errors Detected:");
    lv_obj_set_pos(heading, 0, y);
    y += 20;

    // Step 5: Show drive errors
    const char *drive_labels[] = {
        "Motor Hall Error",
        "Motor Stalling",
        "Phase Loss",
        "Ctrl OverTemp",
        "Motor OverTemp",
        "Throttle Error",
        "MOSFET Protection",
        "Over Voltage",
        "Under Voltage",
        "Overcurrent Fault",
        "Drive Error Flag"
    };

    for (int i = 0; i < 11; i++) {
        if (drive_error_flags[i]) {
            lv_obj_t *label = lv_label_create(container);
            lv_label_set_text(label, drive_labels[i]);
            lv_obj_set_pos(label, 0, y);
            y += 16;
        }
    }

    for (int i = 0; i < sizeof(bms_errors) / sizeof(bms_errors[0]); i++) {
        if (bms_errors[i].flag) {
            lv_obj_t *label = lv_label_create(container);
            lv_label_set_text(label, bms_errors[i].label);
            lv_obj_set_pos(label, 0, y);
            y += 16;
        }
    }
    // draw_battery_status(lv_scr_act());
}

static void display(void *arg)
{
    ESP_LOGI(TAG, "Initialize I2C bus");
    i2c_master_bus_handle_t i2c_bus = NULL;
    i2c_master_bus_config_t bus_config = {
        .clk_source = I2C_CLK_SRC_DEFAULT,
        .glitch_ignore_cnt = 7,
        .i2c_port = I2C_BUS_PORT,
        .sda_io_num = EXAMPLE_PIN_NUM_SDA,
        .scl_io_num = EXAMPLE_PIN_NUM_SCL,
        .flags.enable_internal_pullup = true,
    };
    ESP_ERROR_CHECK(i2c_new_master_bus(&bus_config, &i2c_bus));

    ESP_LOGI(TAG, "Install panel IO");
    esp_lcd_panel_io_handle_t io_handle = NULL;
    esp_lcd_panel_io_i2c_config_t io_config = {
        .dev_addr = EXAMPLE_I2C_HW_ADDR,
        .scl_speed_hz = EXAMPLE_LCD_PIXEL_CLOCK_HZ,
        .control_phase_bytes = 1,
        .lcd_cmd_bits = EXAMPLE_LCD_CMD_BITS,
        .lcd_param_bits = EXAMPLE_LCD_CMD_BITS,
#if CONFIG_EXAMPLE_LCD_CONTROLLER_SSD1306
        .dc_bit_offset = 6,
#elif CONFIG_EXAMPLE_LCD_CONTROLLER_SH1107
        .dc_bit_offset = 0,
        .flags = {
            .disable_control_phase = 1,
        },
#endif
    };
    ESP_ERROR_CHECK(esp_lcd_new_panel_io_i2c(i2c_bus, &io_config, &io_handle));

    ESP_LOGI(TAG, "Install OLED panel driver");
    esp_lcd_panel_handle_t panel_handle = NULL;
    esp_lcd_panel_dev_config_t panel_config = {
        .bits_per_pixel = 1,
        .reset_gpio_num = EXAMPLE_PIN_NUM_RST,
    };
#if CONFIG_EXAMPLE_LCD_CONTROLLER_SSD1306
    ESP_ERROR_CHECK(esp_lcd_new_panel_ssd1306(io_handle, &panel_config, &panel_handle));
#elif CONFIG_EXAMPLE_LCD_CONTROLLER_SH1107
    ESP_ERROR_CHECK(esp_lcd_new_panel_sh1107(io_handle, &panel_config, &panel_handle));
#endif

    ESP_ERROR_CHECK(esp_lcd_panel_reset(panel_handle));
    ESP_ERROR_CHECK(esp_lcd_panel_init(panel_handle));
    ESP_ERROR_CHECK(esp_lcd_panel_disp_on_off(panel_handle, true));

#if CONFIG_EXAMPLE_LCD_CONTROLLER_SH1107
    ESP_ERROR_CHECK(esp_lcd_panel_invert_color(panel_handle, true));
#endif

    ESP_LOGI(TAG, "Initialize LVGL");
    const lvgl_port_cfg_t lvgl_cfg = ESP_LVGL_PORT_INIT_CONFIG();
    lvgl_port_init(&lvgl_cfg);

    const lvgl_port_display_cfg_t disp_cfg = {
        .io_handle = io_handle,
        .panel_handle = panel_handle,
        .buffer_size = EXAMPLE_LCD_H_RES * EXAMPLE_LCD_V_RES,
        .double_buffer = true,
        .hres = EXAMPLE_LCD_H_RES,
        .vres = EXAMPLE_LCD_V_RES,
        .monochrome = true,
        .rotation = {
            .swap_xy = false,
            .mirror_x = false,
            .mirror_y = false,
        }
    };
    lv_disp_t *disp = lvgl_port_add_disp(&disp_cfg);

    lv_disp_set_rotation(disp, LV_DISP_ROT_NONE);

    // Configure button
    gpio_config_t btn_config = {
        .pin_bit_mask = 1ULL << BUTTON_GPIO,
        .mode = GPIO_MODE_INPUT,
        .pull_up_en = GPIO_PULLUP_ENABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .intr_type = GPIO_INTR_NEGEDGE
    };
    gpio_config(&btn_config);
    gpio_install_isr_service(0);
    gpio_isr_handler_add(BUTTON_GPIO, button_isr_handler, NULL);

    int last_screen_index = -1;

    while (1) {
        if (lvgl_port_lock(0)) {
            if (screen_index != last_screen_index) {
                last_screen_index = screen_index;
                switch (screen_index) {
                    case 0: show_soc_page(disp); break;
                    case 1: show_mcu_fw_page(disp); break;
                    case 2: show_battery_temp_page(disp); break;
                    case 3: show_cluster_fw_page(disp); break;
                    case 4: show_battery_fw_page(disp); break;
                    case 5: show_charger_page(disp); break;
                    case 6: show_drive_errors(); break;
                    default: break;
                }
            }
            lvgl_port_unlock();
        }
        vTaskDelay(pdMS_TO_TICKS(100));
    }

    vTaskDelete(NULL); // Not reached, but good practice
}

void run_oled_mode(void)
{
    // Create binary semaphore for TWAI reception
    rx_sem = xSemaphoreCreateBinary();

    // Create CAN receive task
    xTaskCreatePinnedToCore(twai_receive_task, "TWAI_rx", 4096, NULL, RX_TASK_PRIO, NULL, tskNO_AFFINITY);

    // Create display task
    xTaskCreatePinnedToCore(display, "DISP", 4096, NULL, 8, NULL, tskNO_AFFINITY);

    // Install and start TWAI driver
    ESP_ERROR_CHECK(twai_driver_install(&g_config, &t_config, &f_config));
    ESP_LOGI(TWAI_TAG, "TWAI driver installed");

    ESP_ERROR_CHECK(twai_start());
    ESP_LOGI(TWAI_TAG, "TWAI driver started");

    // Signal TWAI receive task to run
    xSemaphoreGive(rx_sem);
}
