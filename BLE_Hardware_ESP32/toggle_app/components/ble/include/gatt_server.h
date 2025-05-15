#pragma once

// call once at startup
void gatt_server_init(void);

// one‐shot BLE work (e.g. start advertising once)
void gatt_server_run(void);

// loop in “BLE mode” until button state != 1
void run_ble_mode(int button_gpio);
