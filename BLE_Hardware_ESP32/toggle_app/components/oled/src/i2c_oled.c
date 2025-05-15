#include "i2c_oled.h"
#include "driver/i2c.h"
#include "esp_log.h"

// Tag for logging
static const char* TAG = "OLED";

// hard-coded I2C pins & port
#define OLED_I2C_PORT      0
#define OLED_I2C_SDA_GPIO  21
#define OLED_I2C_SCL_GPIO  22
#define OLED_RESET_GPIO    -1

void i2c_oled_init(void)
{
    ESP_LOGI(TAG, "Initializing I2C for OLED (port %d)", OLED_I2C_PORT);

    i2c_config_t cfg = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = OLED_I2C_SDA_GPIO,
        .scl_io_num = OLED_I2C_SCL_GPIO,
        .sda_pullup_en = GPIO_PULLUP_ENABLE,
        .scl_pullup_en = GPIO_PULLUP_ENABLE,
        .master.clk_speed = 400000
    };
    ESP_ERROR_CHECK(i2c_param_config(OLED_I2C_PORT, &cfg));
    ESP_ERROR_CHECK(i2c_driver_install(OLED_I2C_PORT, cfg.mode, 0, 0, 0));

    if (OLED_RESET_GPIO >= 0) {
        gpio_reset_pin(OLED_RESET_GPIO);
        gpio_set_direction(OLED_RESET_GPIO, GPIO_MODE_OUTPUT);
        // toggle reset line if your OLED needs it
        gpio_set_level(OLED_RESET_GPIO, 0);
        vTaskDelay(pdMS_TO_TICKS(100));
        gpio_set_level(OLED_RESET_GPIO, 1);
    }

    // TODO: call your SSD1306/SH1106 init sequence here
    ESP_LOGI(TAG, "OLED I2C driver installed");
}

void i2c_oled_display(void)
{
    ESP_LOGI(TAG, "Updating OLED display");
    // TODO: insert your draw/flush calls here, for example:
    // ssd1306_clear_screen();
    // ssd1306_draw_string(0, 0, "Hello, ESP32!");
    // ssd1306_refresh();
}
