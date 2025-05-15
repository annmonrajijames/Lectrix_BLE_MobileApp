#pragma once

// call once at startup
void i2c_oled_init(void);

// one‐shot draw & flush
void i2c_oled_display(void);

// loop in “OLED mode” until button state != 0
void run_oled_mode(int button_gpio);
