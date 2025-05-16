// components/ble/include/gatt_server.h

#pragma once

void gatt_server_init(void);
void gatt_server_run(void);
// loops in BLE mode until button is pressed
void run_ble_mode(int button_gpio);
