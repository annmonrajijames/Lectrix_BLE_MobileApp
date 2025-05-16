#pragma once

void gatt_server_init(void);

// Now takes the button GPIO pin number
// and will return as soon as that pin reads low (pressed).
void gatt_server_run(int button_gpio);
