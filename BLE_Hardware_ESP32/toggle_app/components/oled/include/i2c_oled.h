// components/oled/include/i2c_oled.h

#pragma once

void i2c_oled_init(void);
void i2c_oled_display(void);
// loops in OLED mode until button is released
void run_oled_mode(int button_gpio);
