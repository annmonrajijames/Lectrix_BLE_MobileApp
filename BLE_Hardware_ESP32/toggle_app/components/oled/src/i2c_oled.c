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
    ESP_LOGI(TAG, "I2C init on port %d", OLED_I2C_PORT);
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

    // TODO: your OLED controller init (SSD1306/SH1106 sequence)
}

void i2c_oled_display(void)
{
    ESP_LOGI(TAG, "OLED: display update");
    // TODO: clear, draw, and flush your frame here
}

void run_oled_mode(int button_gpio)
{
    ESP_LOGI(TAG, "Entering OLED loop; will exit when button released");

    // stay here while button is held down (level == 0)
    while (gpio_get_level(button_gpio) == 0) {
        i2c_oled_display();

        // check button at end of each pass
        if (gpio_get_level(button_gpio) != 0) {
            ESP_LOGI(TAG, "Button released → exiting OLED loop");
            break;
        }

        // small delay to debounce + let other tasks run
        vTaskDelay(pdMS_TO_TICKS(10));
    }
}
