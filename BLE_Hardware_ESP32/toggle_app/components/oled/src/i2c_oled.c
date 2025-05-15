#include "i2c_oled.h"
#include "driver/i2c.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

static const char* TAG = "OLED";

#define OLED_I2C_PORT     0
#define OLED_I2C_SDA_GPIO 21
#define OLED_I2C_SCL_GPIO 22
#define OLED_RESET_GPIO   -1

void i2c_oled_init(void)
{
    ESP_LOGI(TAG, "Init I2C port %d", OLED_I2C_PORT);
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
        gpio_set_level(OLED_RESET_GPIO, 0);
        vTaskDelay(pdMS_TO_TICKS(100));
        gpio_set_level(OLED_RESET_GPIO, 1);
    }

    // TODO: insert your SSD1306/SH1106 init here
}

void i2c_oled_display(void)
{
    ESP_LOGI(TAG, "OLED: display update");
    // TODO: clear, draw text/graphics, then flush to screen
}

void run_oled_mode(int button_gpio)
{
    // stay in OLED mode while button is pressed (level=0)
    while (gpio_get_level(button_gpio) == 0) {
        i2c_oled_display();
        vTaskDelay(pdMS_TO_TICKS(200));  // give CPU + debounce
    }
}
