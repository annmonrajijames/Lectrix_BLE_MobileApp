#pragma once

void i2c_oled_init(void);
void i2c_oled_display(void);

// enters an internal loop updating the display until
// the button GPIO reads high (released), then returns.
void run_oled_mode(int button_gpio);
